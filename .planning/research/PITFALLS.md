# Domain Pitfalls: Merging 2openclaw into brewclaw

**Domain:** Next.js codebase merge — Adding product features to landing page
**Researched:** 2026-02-26
**Confidence:** HIGH

This document identifies critical mistakes when merging two Next.js applications, specifically merging the 2openclaw product code into the brewclaw landing page to create a unified platform.

---

## Critical Pitfalls

### Pitfall 1: Dual Authentication Systems Collision

**What goes wrong:**
Brewclaw uses NextAuth with Google OAuth + email magic link (JWT sessions), while 2openclaw uses Telegram Login Widget (no traditional auth). Merging these creates authentication chaos:
- Middleware collision: NextAuth middleware conflicts with Telegram validation logic
- Session confusion: JWT sessions vs. localStorage user data
- Route protection conflicts: Different auth boundaries for different features
- User identity mismatch: Same user might have separate identities in each system

**Why it happens:**
Telegram Login Widget is NOT OAuth-compliant — it uses a rigid widget that generates hash signatures, completely different from NextAuth's provider model. Developers assume they can "just add another provider" but Telegram's non-standard approach breaks NextAuth's architecture.

**Consequences:**
- Users authenticated via Google can't access 2openclaw features (container management, payments)
- Razorpay webhooks fail because they expect Telegram user IDs in localStorage, not NextAuth sessions
- Middleware runs in wrong order: NextAuth checks run before Telegram validation, or vice versa
- Session storage conflicts: NextAuth uses HttpOnly cookies, 2openclaw uses localStorage JSON
- **Payment provisioning breaks**: Razorpay verify endpoint expects Telegram user data structure

**Prevention:**
1. **Choose one auth system as source of truth**: Make NextAuth primary, migrate Telegram to identifier-only
2. **Create auth adapter layer**: Map Telegram user data to NextAuth user records on first 2openclaw migration
3. **Database-backed sessions**: Switch from JWT to database sessions for user-container associations
4. **Unified user model**: Prisma schema with `telegramId` field, not separate JSON files
5. **Migrate existing users**: Script to import `/opt/2openclaw/data/users/*.json` → Prisma database

**Detection:**
- Auth routes return 401 for valid users
- Middleware logs show duplicate auth checks
- Payment webhooks fail with "user not found"
- Container provisioning creates orphaned containers (no user association)

**Phase assignment:** Phase 2 (Auth + Session Migration) — Address before touching payment routes

---

### Pitfall 2: API Route Path Collisions

**What goes wrong:**
Both codebases have `/app/api/auth/[...nextauth]/route.ts`. When merged:
- Next.js can't have identical route paths in same app
- One route silently overrides the other (App Router takes precedence)
- Imports break: `@/lib/razorpay` expects specific API structure
- Middleware matchers conflict: Different exclusion patterns for same paths

**Why it happens:**
Both projects followed Next.js conventions independently, creating identical structure. The App Router's file-system routing doesn't allow route duplication even across different "contexts."

**Consequences:**
- Razorpay integration breaks: `/api/subscriptions/create` expects Telegram user data format
- Existing 2openclaw webhooks fail: `/api/webhooks/razorpay` route gets replaced
- Container management APIs disappear: `/api/instance/{userId}/*` routes not accessible
- NextAuth config differences: brewclaw's NextAuth setup overwrites 2openclaw's (if it had one)

**Prevention:**
1. **Audit all API routes first**: List both projects' `/app/api/` structure side-by-side
2. **Namespace 2openclaw routes**: Move to `/app/api/v1/` or `/app/api/product/`
3. **Proxy pattern**: Single `/api/container/*` route proxies to GCP, consolidating instance management
4. **Environment-aware routing**: Use Next.js rewrites to conditionally route based on feature flags during migration
5. **Rename before merge**: In 2openclaw branch, restructure API routes BEFORE merging into brewclaw

**Detection:**
- Build errors: "Conflicting app and pages routes"
- Runtime 404s for previously working endpoints
- Razorpay webhooks never trigger success
- Container start/stop buttons don't respond

**Phase assignment:** Phase 1 (Pre-Merge Route Audit) — Block all other work until resolved

---

### Pitfall 3: Environment Variable Namespace Collision

**What goes wrong:**
Both projects use overlapping environment variable names but for different purposes:

| Variable | brewclaw | 2openclaw | Conflict |
|----------|----------|-----------|----------|
| `NEXTAUTH_URL` | Auth callback | Not used | brewclaw overrides |
| `NEXTAUTH_SECRET` | JWT signing | Not used | brewclaw requirement breaks 2openclaw |
| `API_URL` / `GCP_API_URL` | Not used | GCP VM address | Naming confusion |
| `DATABASE_URL` | Prisma (new) | Not used (JSON files) | Migration dependency |
| `NEXT_PUBLIC_API_URL` | Not used | Client-side proxy target | Could conflict if brewclaw adds it |

**Why it happens:**
Environment variables lack namespacing. When `.env.local` files merge, later definitions override earlier ones. Vercel deployment uses single environment variable set, causing production-only failures.

**Consequences:**
- **Production-only failures**: Works locally (separate .env files) but fails on Vercel (merged env vars)
- NextAuth sessions break: Missing `NEXTAUTH_SECRET` causes sessions to disappear on refresh
- GCP proxy fails: Wrong `GCP_API_URL` points to development server instead of production VM
- Razorpay webhooks fail signature verification: Wrong `RAZORPAY_WEBHOOK_SECRET` used
- Client-side 404s: `NEXT_PUBLIC_*` variables baked into build point to wrong endpoints

**Prevention:**
1. **Prefix all variables**: `BREWCLAW_*` vs `OPENCLAW_*` for clear ownership
2. **Document all variables**: Create `.env.example` with both projects' variables and comments
3. **Validate at startup**: Add runtime checks in `lib/env.ts` that fail fast if critical vars missing
4. **Separate Vercel env groups**: Use Vercel's preview/production environment separation during migration
5. **Audit before deploy**: Script that diffs local vs Vercel environment variables

**Detection:**
- "Invalid signature" errors in Razorpay webhook logs
- NextAuth redirects to signin in infinite loop
- Container API returns 401 Unauthorized (wrong `GCP_API_SECRET`)
- Build succeeds but runtime crashes with "Missing environment variable"

**Phase assignment:** Phase 0 (Environment Audit) — Complete before any code merge

---

### Pitfall 4: Razorpay + NextAuth Session Integration

**What goes wrong:**
2openclaw's payment flow assumes localStorage user data (Telegram-based):
```typescript
// 2openclaw: User data in localStorage
const userData = JSON.parse(localStorage.getItem('userData'))
await createSubscription({ userId: userData.odinseid, ... })
```

Brewclaw uses NextAuth JWT sessions (HttpOnly cookies, not accessible to client-side JS). The payment flow breaks because:
- Client-side code can't access session data for subscription creation
- Webhook verification expects user ID in specific format (odinseid vs NextAuth user.id)
- User-container mapping stored in JSON files, not Prisma database
- Race condition: Payment verified before user record created in database

**Why it happens:**
2openclaw was built without traditional auth, using Telegram ID as sole identifier stored in localStorage. Razorpay integration tightly coupled to this data structure. NextAuth's security model (HttpOnly cookies) prevents client-side access to session data.

**Consequences:**
- **Payment succeeds but container not provisioned**: Webhook can't find user in database
- **Double-billing risk**: Subscription created but not linked to user, retry creates second subscription
- **Orphaned Razorpay customers**: Customer record created but no user association
- **Container management fails**: User ID format mismatch between NextAuth and GCP API
- **XSS vulnerability if fixed wrong**: Developers disable HttpOnly to access session from JS

**Prevention:**
1. **Server-side subscription creation**: Move Razorpay logic to API route, pass session internally
2. **Unified user ID**: Use NextAuth `user.id` as primary key, add `telegramId` as optional field
3. **Database-backed provisioning**: Store user-container associations in Prisma, not JSON files
4. **Atomic payment flow**: Database transaction: Create user → Create subscription → Provision container
5. **Migration script**: Import 2openclaw JSON users into Prisma with backward-compatible ID mapping

**Detection:**
- Razorpay shows successful payment but container not created
- Console errors: "Cannot read session from localStorage"
- GCP API returns "User not found" for valid NextAuth users
- Multiple Razorpay customers for same email address

**Phase assignment:** Phase 3 (Payment Integration) — Critical path, block Phase 4 (Dashboard)

---

### Pitfall 5: Middleware Execution Order Chaos

**What goes wrong:**
Next.js supports only ONE `middleware.ts` file per project. When merging:

**Brewclaw middleware:**
- Runs NextAuth check
- Redirects unauthenticated users from `/dashboard`, `/onboarding`
- Redirects authenticated users from `/signin`

**2openclaw implied middleware needs:**
- Rate limiting for subscription creation (in-memory, per-IP)
- Webhook signature validation (before handler runs)
- GCP API authentication header injection

Combining these creates ordering problems:
- NextAuth redirect happens before rate limiting → bypassed
- Webhook routes get auth-checked → Razorpay webhooks blocked (no session cookie)
- Matcher conflicts: brewclaw excludes `/api/auth/*`, 2openclaw needs to exclude `/api/webhooks/*`

**Why it happens:**
Next.js enforces single middleware for performance (edge runtime). Developers try to combine logic linearly but forget that order matters differently for different route patterns.

**Consequences:**
- **Razorpay webhooks return 401**: NextAuth middleware redirects to signin
- **Rate limiting ineffective**: Runs after auth redirect, never reaches subscription creation
- **Performance degradation**: Single middleware runs on ALL routes, even static assets
- **Matcher explosion**: Trying to exclude every special case makes config unmaintainable
- **Timing bugs**: Conditional logic (`if pathname.startsWith('/api/webhooks')`) has subtle ordering issues

**Prevention:**
1. **Stratified middleware**: Use path conditionals to branch early:
   ```typescript
   export default async function middleware(req) {
     if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
       // Webhook-specific logic (skip auth)
       return handleWebhook(req)
     }
     if (req.nextUrl.pathname.startsWith('/api/subscriptions')) {
       // Rate limit + auth
       return handleSubscription(req)
     }
     // Default: NextAuth
     return auth(req)
   }
   ```
2. **Modular middleware functions**: Import handlers, compose in main middleware
3. **Matcher optimization**: Explicitly include protected routes instead of excluding static assets
4. **Runtime checks in routes**: Don't rely solely on middleware, validate in API routes too
5. **Webhook bypass**: Add `/api/webhooks` to middleware matcher exclusions

**Detection:**
- Razorpay webhook logs show 302 redirects instead of 200 OK
- Rate limiting doesn't trigger even with obvious abuse
- Middleware runs on `/favicon.ico` (performance issue)
- Auth state inconsistent between pages and API routes

**Phase assignment:** Phase 2 (Middleware Consolidation) — Parallel with auth migration

---

### Pitfall 6: Webhook Signature Verification Timing Attacks

**What goes wrong:**
2openclaw's current implementation (as of CONTEXT.md) uses `crypto.timingSafeEqual()` for webhook signature verification — this is CORRECT. However, during merge, developers might:
- Simplify verification to `signature === expectedSignature` (timing attack vulnerable)
- Re-serialize JSON body with `JSON.stringify()` before hashing (signature mismatch due to float precision)
- Use cached request body from middleware instead of raw body (signature fails)
- Forget to update webhook secret after domain change (old secret = failed verification)

**Why it happens:**
Webhook signature verification is subtle. The raw request body MUST be used exactly as received. Any transformation (pretty-printing, number parsing, re-serialization) changes the hash. Developers debugging failed verifications often "simplify" the check, introducing vulnerabilities.

**Consequences:**
- **Security vulnerability**: Attacker can forge webhook events without timing-safe comparison
- **Intermittent failures**: Webhooks with floating-point amounts fail randomly (e.g., ₹499.00 vs ₹499.0)
- **Payment events missed**: Failed verification = no container provisioning, no subscription updates
- **Webhook disabled after 24h**: Razorpay auto-disables webhooks after 24h of continuous failures
- **Production-only issue**: Local testing uses Razorpay's webhook forwarding, which might retry differently

**Prevention:**
1. **Preserve 2openclaw's timing-safe verification**: Copy `lib/razorpay.ts` verification code exactly
2. **Raw body requirement**: Use Next.js 15+ native `await request.text()` before any JSON parsing
3. **Never re-serialize**: Pass the raw text string to verification, not `JSON.stringify(parsed)`
4. **Float-to-string coercion**: If metadata contains amounts, use strings: `amount: "499.00"`, not `499.0`
5. **Secret rotation checklist**: Document that webhook secret change requires updating both Razorpay dashboard + Vercel env
6. **5-second response requirement**: Razorpay marks webhooks as timeout if no response in 5s; containerize provisioning calls

**Detection:**
- "INVALID_WEBHOOK_SIGNATURE" errors in logs
- Razorpay webhooks disabled in dashboard (24h failure)
- Payment succeeds in dashboard but no container provisioned
- Signature verification works in test mode but fails in production (different secrets)

**Phase assignment:** Phase 3 (Payment Integration) — Security-critical, code review required

---

### Pitfall 7: Database Schema Mismatch (Prisma vs JSON Files)

**What goes wrong:**
Brewclaw uses Prisma with database (for NextAuth), 2openclaw uses JSON files (`/opt/2openclaw/data/users/{userId}.json`). During merge:
- NextAuth expects `User`, `Account`, `Session` tables
- Container provisioning expects JSON files on GCP VM
- User lookup logic differs: Database query vs. file I/O
- No referential integrity between NextAuth users and 2openclaw containers
- Migration path unclear: Keep JSON files? Migrate to Prisma? Dual storage?

**Why it happens:**
2openclaw was built for rapid deployment without database dependency. NextAuth requires database for OAuth account linking. No clear migration strategy for existing users' container data.

**Consequences:**
- **Data inconsistency**: User exists in NextAuth DB but not in JSON files, or vice versa
- **Container orphaning**: Containers running on GCP without corresponding NextAuth user
- **Migration downtime**: Switching from JSON to Prisma requires stopping all containers during data migration
- **Backup complexity**: Prisma schema changes break 2openclaw's existing JSON-based backups
- **GCP API rewrite required**: All endpoints that read/write JSON files need Prisma migration
- **Race conditions**: Payment webhook writes to JSON, NextAuth writes to DB, data out of sync

**Prevention:**
1. **Hybrid storage during transition**: NextAuth uses Prisma, containers initially stay in JSON
2. **Foreign key via identifier**: Store `nextauth_user_id` in JSON files, lookup via Prisma
3. **Lazy migration**: Keep JSON files, gradually migrate to Prisma as users login post-merge
4. **Read-through cache**: GCP API reads JSON, syncs to Prisma asynchronously
5. **Prisma schema design**: Include all 2openclaw fields (botToken, aiProvider, containerStatus) in User model
6. **Migration script**: Run BEFORE first deploy, import all JSON → Prisma with validation

**Detection:**
- User can sign in but dashboard shows "no containers"
- Container running but user doesn't exist in NextAuth
- Payment succeeds but container ID not associated with user
- GCP API crashes: "Cannot read property of undefined" (missing JSON file)

**Phase assignment:** Phase 4 (Data Layer Unification) — After payment integration works

---

### Pitfall 8: Rebranding Incompleteness (2openclaw → brewclaw)

**What goes wrong:**
Rebranding is more than find-replace. Easy to miss:
- **Hardcoded URLs**: API calls to `2openclaw.vercel.app` instead of `brewclaw.com`
- **GCP VM paths**: `/opt/2openclaw/` directory names in scripts
- **Docker image names**: `openclaw-bot:latest` container tags
- **Environment variables**: `OPENCLAW_*` prefixes in existing users' JSON files
- **Email templates**: "Welcome to 2openclaw" in Razorpay email notifications (can't easily change)
- **Telegram bot display**: Bot profile still shows "2openclaw" branding
- **CORS origins**: GCP API whitelist still has `2openclaw.vercel.app`
- **Google OAuth consent screen**: Still shows "2openclaw" as application name

**Why it happens:**
Rebranding touches every layer: frontend, backend, infrastructure, external services. Developers focus on visible UI but forget config files, API calls, and third-party service settings.

**Consequences:**
- **CORS errors**: Frontend calls GCP API, blocked because origin not whitelisted
- **Broken API calls**: Hardcoded `2openclaw.vercel.app` in client-side code fails after domain change
- **User confusion**: Email says "2openclaw" but website is "brewclaw"
- **SEO penalty**: 2openclaw.vercel.app not 301-redirected, search engines see duplicate content
- **OAuth callback mismatch**: Google OAuth callbacks fail because redirect URI still registered as 2openclaw
- **Container provisioning fails**: Docker images not found (looking for `openclaw-bot`, should be `brewclaw-bot`)

**Prevention:**
1. **Rebrand checklist**: Document every service that knows "2openclaw" name:
   - Vercel project name
   - Domain DNS records
   - Google OAuth consent screen + redirect URIs
   - Razorpay webhook URL
   - GCP VM hostname, Docker image names
   - GitHub repository (if renaming)
   - Environment variable prefixes
2. **301 redirects**: Keep 2openclaw.vercel.app live, redirect all routes to brewclaw.com for 12 months
3. **Gradual cutover**: Use feature flag to serve 2openclaw branding to existing users, brewclaw to new users
4. **Search and replace carefully**: Use regex to find URLs, avoid breaking unrelated "claw" references
5. **Third-party service updates**: Update OAuth apps, webhook URLs, email templates BEFORE launch

**Detection:**
- Google OAuth returns "redirect_uri_mismatch"
- CORS preflight failures in browser console
- Email notifications have wrong branding
- SEO tools show duplicate content warnings
- Container deployment fails: "Image not found"

**Phase assignment:** Phase 6 (Rebranding & Launch) — Final phase, after all features work

---

### Pitfall 9: GCP VM Proxy Through Vercel (Network Issues)

**What goes wrong:**
2openclaw's architecture: Vercel frontend → GCP VM backend (Express on `34.131.95.162:3000`). Common issues when proxying through Next.js API routes:
- **Timeout errors**: Vercel serverless functions have 10s (Hobby) / 60s (Pro) timeout, container operations take longer
- **IP whitelisting**: GCP VM expects static IP, Vercel functions use dynamic IPs (must allow `0.0.0.0/0`)
- **HTTP vs HTTPS**: GCP VM uses HTTP, Vercel uses HTTPS, mixed content errors
- **Header loss**: NextRequest transformation strips custom headers (X-API-Key)
- **Body size limits**: Large container logs exceed Vercel's 4.5MB response limit
- **Connection pooling**: Serverless functions don't maintain connections, latency penalty on every request
- **No WebSocket support**: Can't proxy real-time container logs through Vercel

**Why it happens:**
Vercel's serverless architecture isn't designed for proxying to long-running backend services. Next.js rewrites/redirects are URL-only, not full HTTP proxies.

**Consequences:**
- **Container start/stop operations timeout**: 504 "Serverless Function has timed out"
- **Log fetching fails**: Container logs exceed response size limit
- **Authentication headers dropped**: GCP API returns 401 because `X-API-Key` not forwarded
- **Performance degradation**: Every dashboard load triggers new GCP connection, no connection reuse
- **No real-time updates**: Container status polls every 5s, can't use WebSocket streams
- **Development mismatch**: Local Next.js dev server has different timeout/size limits than production

**Prevention:**
1. **Timeout-aware operations**: Container start/stop returns immediately, poll status separately
2. **Paginated logs**: GCP API returns logs in chunks, frontend paginated
3. **Header forwarding**: Explicitly forward `X-API-Key` in API route: `headers: { 'X-API-Key': process.env.GCP_API_SECRET }`
4. **Response streaming**: Use Next.js 15 streaming responses for large payloads
5. **Status polling architecture**: Dashboard polls `/api/container/{id}/status` every 5s instead of long-lived connections
6. **Consider Cloud Run migration**: If issues persist, deploy Next.js on GCP Cloud Run (same network as VM)
7. **IP whitelist workaround**: GCP VM accepts connections from `0.0.0.0/0`, relies on API key auth instead

**Detection:**
- "This Serverless Function has timed out" errors
- GCP API logs show 401 errors despite correct API key in Vercel env
- Container operations succeed but frontend shows timeout error
- Logs truncated or showing "Response too large"

**Phase assignment:** Phase 5 (Infrastructure Optimization) — After core features working

---

### Pitfall 10: localStorage Security Migration

**What goes wrong:**
2openclaw stores sensitive user data in localStorage (unencrypted):
```json
{
  "odinseid": "e580c03e93c6e12e",
  "email": "user@example.com",
  "botToken": "123456:ABC-xxx",
  "aiApiKey": "encrypted-key"
}
```

2openclaw's CONTEXT.md acknowledges: "localStorage security: User data in localStorage is unencrypted (XSS risk if site compromised)."

When migrating to NextAuth:
- **Temptation to keep localStorage**: Developers leave it for "backwards compatibility"
- **XSS vulnerability persists**: One XSS bug = all user API keys stolen
- **Session/localStorage sync issues**: NextAuth session says user X, localStorage says user Y
- **Logout doesn't clear localStorage**: User logs out, localStorage data remains
- **Shared computer risk**: Public computer, user forgets to clear localStorage

**Why it happens:**
localStorage is easy and works offline. Developers inherit 2openclaw's localStorage pattern, don't realize NextAuth sessions make it redundant. Migration path not obvious: How to move existing localStorage users to NextAuth?

**Consequences:**
- **XSS = full account compromise**: Attacker's script reads botToken + aiApiKey from localStorage
- **Session fixation**: Attacker sets localStorage on victim's browser, hijacks session
- **Privacy leak**: Browser extensions can read localStorage (ad trackers, etc.)
- **GDPR violation**: Storing API keys in browser storage without encryption may violate regulations
- **No centralized revocation**: Can't remotely invalidate localStorage data, only session tokens

**Prevention:**
1. **Eliminate localStorage for sensitive data**: Move botToken, aiApiKey to Prisma database (encrypted at rest)
2. **Migration flow**: On first login post-merge, read localStorage, save to database, clear localStorage
3. **HttpOnly cookies only**: NextAuth session data stays in HttpOnly cookies, never exposed to JS
4. **API key encryption**: Use `@prisma/crypto` or similar to encrypt aiApiKey in database
5. **Client-side feature flags only**: If localStorage needed, only store non-sensitive UI preferences
6. **Content Security Policy**: Add CSP headers to mitigate XSS risk
7. **Audit localStorage usage**: Search codebase for `localStorage.setItem`, ensure no sensitive data

**Detection:**
- Browser DevTools → Application → Local Storage shows botToken, aiApiKey
- After logout, localStorage still contains user data
- Same data in localStorage and NextAuth session (duplication)
- Security audit flags unencrypted API keys in browser storage

**Phase assignment:** Phase 2 (Security Hardening) — Parallel with auth migration

---

## Moderate Pitfalls

### Pitfall 11: Duplicate Dependency Conflicts

**What goes wrong:**
Both projects have `package.json` with potentially conflicting versions:
- Next.js versions: brewclaw on v15, 2openclaw possibly on v14 or v13
- NextAuth: brewclaw uses v5, 2openclaw might not have it
- React versions: Mismatched React/React-DOM versions cause runtime errors
- Tailwind config differences: Different theme colors, spacing, merge loses customizations
- ESLint/TypeScript config conflicts: Different rules cause new linting errors

**Prevention:**
1. **Dependency audit**: List all dependencies from both projects, resolve conflicts before merge
2. **Use latest stable versions**: Upgrade both projects to same Next.js, React versions pre-merge
3. **Tailwind config merge**: Create `tailwind.config.brewclaw.ts` and `tailwind.config.openclaw.ts`, merge theme sections manually
4. **Lockfile strategy**: Use single `package-lock.json`, delete one lockfile before merge to avoid conflicts
5. **Peer dependency warnings**: Fix all peer dependency warnings before declaring merge complete

**Detection:**
- `npm install` errors with peer dependency conflicts
- React runtime errors: "Invalid hook call" (multiple React versions)
- Styles broken: Tailwind classes don't apply (config mismatch)
- Build errors: TypeScript can't resolve types

**Phase assignment:** Phase 1 (Dependency Consolidation) — Before any code merge

---

### Pitfall 12: Onboarding Flow Duplication

**What goes wrong:**
Both projects have onboarding routes:
- Brewclaw: `/onboarding` (created in Phase 12, currently empty or basic)
- 2openclaw: `/onboard` (6-step flow: Email → Create Bot → Token → User ID → AI Provider → Plan)

Merging creates:
- Conflicting routes: `/onboarding` vs `/onboard`
- Flow mismatch: brewclaw's flow doesn't include Telegram setup steps
- State management: 2openclaw uses localStorage for onboarding state, brewclaw might use different approach
- Progress tracking: 2openclaw's multi-step logic might not fit brewclaw's design

**Prevention:**
1. **Choose canonical route**: Use `/onboarding` (brewclaw convention), delete `/onboard`
2. **Consolidate flows**: Merge 2openclaw's 6 steps into brewclaw's onboarding component
3. **Server-side state**: Replace localStorage onboarding state with database `onboardingStep` field
4. **Conditional steps**: Skip Telegram steps for users who don't need containers yet (future features)
5. **URL consistency**: Update all references from `/onboard` → `/onboarding` in 2openclaw code

**Detection:**
- Both `/onboarding` and `/onboard` routes accessible (duplication)
- Clicking "Get Started" goes to wrong onboarding flow
- Onboarding state lost when switching routes
- New users can skip onboarding by directly accessing `/dashboard`

**Phase assignment:** Phase 3 (Onboarding Unification) — After auth works

---

### Pitfall 13: Dashboard Layout Conflicts

**What goes wrong:**
Both projects have `/dashboard` routes with different layouts:
- Brewclaw: Likely minimal (Phase 12 just created it)
- 2openclaw: Full-featured with container management, subscription info, bot controls

Merging creates:
- Component name collisions: Both might have `<DashboardLayout />`, `<Card />`, `<Button />`
- Style conflicts: Different design systems (brewclaw's landing page aesthetic vs 2openclaw's dark theme)
- Navigation duplication: Brewclaw's nav might not have container-related links
- Responsive breakpoints: Different mobile layouts

**Prevention:**
1. **Component library audit**: List all shared component names, namespace if needed (`BrewclawButton` vs `OpenclawButton`)
2. **Design system choice**: Pick one design (likely brewclaw's newer aesthetic), apply to 2openclaw components
3. **Storybook/component catalog**: Document all UI components, identify duplicates
4. **Gradual restyling**: Keep 2openclaw dashboard functional, gradually apply brewclaw theme
5. **Layout composition**: Extract shared layout (`<AppShell>`) used by both landing + dashboard

**Detection:**
- Import errors: "Named export 'Button' not found"
- Style inconsistencies: Dashboard looks completely different from landing page
- Layout breaks: Navbar from landing page conflicts with dashboard sidebar
- Z-index issues: Modals appear behind other components

**Phase assignment:** Phase 4 (UI Consolidation) — After features merged

---

### Pitfall 14: Rate Limiting Strategy Mismatch

**What goes wrong:**
2openclaw has in-memory rate limiting (5 requests/hour/IP for subscription creation). In Vercel serverless:
- **In-memory state lost**: Each serverless invocation is stateless, rate limiter resets
- **No shared state**: Multiple serverless function instances can't share rate limit counters
- **IP address issues**: Vercel's `req.ip` might return load balancer IP, not actual client IP

**Prevention:**
1. **External rate limiting**: Use Vercel KV (Redis) or Upstash Redis for shared rate limit state
2. **Vercel's built-in rate limiting**: Use `@vercel/edge-rate-limit` with Vercel KV
3. **Multiple signals**: Rate limit by IP + user ID + email (prevent bypass)
4. **Header-based IP detection**: Use `X-Forwarded-For` header for real client IP
5. **Graceful degradation**: If rate limiter unavailable, log + alert but don't block (avoid false positives)

**Detection:**
- Rate limiting doesn't trigger even with obvious abuse
- Production logs show different IP for same user across requests
- Rate limit counter always at 0 or 1 (resetting each invocation)

**Phase assignment:** Phase 5 (Infrastructure) — Can defer if low abuse risk

---

## Minor Pitfalls

### Pitfall 15: .gitignore Merge Conflicts

**What goes wrong:**
Both projects have `.gitignore`, merging creates duplicates and might accidentally commit sensitive files.

**Prevention:**
- Manually merge `.gitignore` files, keep union of all patterns
- Add `.env*.local` explicitly to avoid committing local environment variables
- Review git status before first commit post-merge

**Phase assignment:** Phase 0 (Merge Preparation)

---

### Pitfall 16: favicon.ico and public/ Asset Conflicts

**What goes wrong:**
Both projects have `/public/` folder with overlapping filenames (favicon, logo, og-image, etc.). Merge overwrites one set.

**Prevention:**
- Compare `/public/` folders, keep brewclaw's branding assets
- Back up 2openclaw's assets to separate folder temporarily
- Update all image imports to use correct asset paths

**Phase assignment:** Phase 6 (Branding)

---

### Pitfall 17: SEO Metadata Inconsistencies

**What goes wrong:**
Landing page has SEO-optimized metadata, product pages (dashboard, onboarding) might not. Mixed metadata causes SEO issues.

**Prevention:**
- Use Next.js 15 Metadata API consistently across all routes
- Dashboard should have `robots: 'noindex'` (authenticated, not for search engines)
- Public pages inherit landing page's base metadata

**Phase assignment:** Phase 6 (Launch Prep)

---

### Pitfall 18: TypeScript Config Strictness Differences

**What goes wrong:**
One project has stricter TypeScript config, merge causes hundreds of new type errors in previously working code.

**Prevention:**
- Compare `tsconfig.json`, adopt stricter config gradually
- Use `// @ts-expect-error` comments temporarily for merge
- Plan separate "TypeScript strictness" phase after merge

**Phase assignment:** Phase 7 (Tech Debt)

---

### Pitfall 19: Next.js App Router vs Pages Router (If Applicable)

**What goes wrong:**
If 2openclaw used Pages Router and brewclaw uses App Router (or vice versa), mixing causes routing conflicts.

**Prevention:**
- Audit both projects: Both use App Router? Pages Router?
- If mixed, follow Next.js incremental migration guide
- Use route groups to isolate Pages Router code during transition

**Detection:**
- 404.js conflicts with not-found.tsx
- Middleware works differently for different routes
- Dynamic routes not resolving correctly

**Phase assignment:** Phase 1 (Router Audit) — Blocking if mixed

---

### Pitfall 20: Docker Container Image Tagging

**What goes wrong:**
GCP VM has Docker images tagged as `openclaw-bot:latest`. After rebrand, deployment scripts fail looking for `brewclaw-bot:latest`.

**Prevention:**
- Update Docker build scripts to use new image name
- Retag existing images: `docker tag openclaw-bot:latest brewclaw-bot:latest`
- Update systemd service files referencing Docker image names
- Keep old image name temporarily for rollback

**Phase assignment:** Phase 6 (Rebranding)

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|----------------|------------|
| Phase 0 | Pre-Merge Audit | API route collisions, env var conflicts | Comprehensive audit, document all conflicts before writing code |
| Phase 1 | Dependency Merge | Version conflicts, lockfile issues | Upgrade both to latest stable before merge |
| Phase 2 | Auth Migration | Telegram vs NextAuth incompatibility | Choose NextAuth as primary, add telegramId field |
| Phase 2 | Middleware | Multiple auth systems, execution order chaos | Single middleware with early branching by path |
| Phase 3 | Payment Integration | Session format mismatch, webhook signature issues | Server-side subscription creation, preserve timing-safe verification |
| Phase 3 | Onboarding | Duplicate routes (/onboard vs /onboarding) | Canonicalize to /onboarding, merge flows |
| Phase 4 | Data Layer | JSON files vs Prisma schema | Hybrid approach: lazy migration, foreign key via ID |
| Phase 4 | UI Consolidation | Component name collisions, style conflicts | Namespace components, choose design system |
| Phase 5 | Infrastructure | Vercel timeout, GCP proxy issues | Async operations, IP whitelist workaround |
| Phase 6 | Rebranding | Incomplete find-replace, OAuth callback mismatch | Comprehensive rebrand checklist, service by service |
| Phase 6 | Domain Migration | SEO penalty, broken 301 redirects | Keep old domain live with redirects for 12 months |
| Phase 7 | Security | localStorage persistence, XSS risk | Migrate to database-backed secrets, clear localStorage |

---

## Research Confidence Assessment

| Pitfall Category | Confidence | Evidence Source |
|------------------|------------|-----------------|
| Authentication integration | HIGH | NextAuth v5 official migration guide, Telegram OAuth limitations confirmed |
| API route conflicts | HIGH | Next.js App Router documentation, observed in codebase structure |
| Environment variables | HIGH | Next.js env docs, Vercel deployment best practices |
| Razorpay integration | HIGH | 2openclaw CONTEXT.md security measures, Razorpay webhook docs |
| Middleware execution | HIGH | Next.js middleware upgrade guide, observed middleware.ts in brewclaw |
| Webhook security | HIGH | 2openclaw's timing-safe implementation, Razorpay signature verification docs |
| Database migration | MEDIUM | Prisma docs, inferred from 2openclaw JSON file storage |
| Rebranding | MEDIUM | General web development best practices, SEO migration guides |
| GCP proxy issues | MEDIUM | Vercel serverless limitations, GitHub discussions |
| localStorage security | HIGH | Acknowledged in 2openclaw CONTEXT.md, NextAuth security model |

---

## Sources

### Official Documentation
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/guides/migrating/app-router-migration)
- [NextAuth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [Razorpay Webhook Documentation](https://razorpay.com/docs/webhooks/validate-test/)
- [Next.js Middleware Guide](https://nextjs.org/docs/app/getting-started/route-handlers-and-middleware)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/guides/environment-variables)
- [Prisma with Next.js](https://www.prisma.io/docs/guides/nextjs)

### Migration Case Studies
- [WorkOS: Migrating to Next.js App Router with Zero Downtime](https://workos.com/blog/migrating-to-next-js-app-router-with-zero-downtime)
- [Large-Scale Monorepo Migration Next.js 14 to 16](https://dev.to/abhilashlr/migrating-a-large-scale-monorepo-from-nextjs-14-to-16-a-real-world-journey-5383)
- [Next.js Pages to App Router Migration Guide](https://eastondev.com/blog/en/posts/dev/20251218-nextjs-pages-to-app-router-migration/)

### Security & Performance
- [Next.js Session Management: NextAuth Persistence Issues](https://clerk.com/articles/nextjs-session-management-solving-nextauth-persistence-issues)
- [Razorpay Webhook Signature Verification](https://www.svix.com/blog/reviewing-razorpay-webhook-docs/)
- [Razorpay Float Precision Issue](https://medium.com/@gsharmaji93/razorpay-webhook-signature-mismatch-float-precision-issue-71003831efc2)
- [Vercel Proxy Limitations](https://github.com/vercel/next.js/discussions/14057)

### Domain Migration & SEO
- [SEO Migration Complete Guide 2026](https://www.veloxmedia.com/blog/seo-migration-2026-the-complete-guide)
- [Next.js SEO Optimization Guide 2026](https://www.djamware.com/post/nextjs-seo-optimization-guide-2026-edition)
- [Website Migration Checklist 2026](https://www.designrush.com/agency/search-engine-optimization/trends/website-migration)

### Codebase Context
- 2openclaw CONTEXT.md (security measures, known issues, architecture)
- brewclaw PROJECT.md (milestone goals, architecture decisions)
- brewclaw middleware.ts (NextAuth integration)
- brewclaw lib/auth.ts (JWT session strategy)

---

*End of PITFALLS.md — Confidence: HIGH for critical pitfalls, MEDIUM for infrastructure-specific issues. All findings verified against official documentation where available.*
