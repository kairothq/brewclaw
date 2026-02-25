# Feature Integration Landscape

**Domain:** Managed Telegram bot hosting platform merger
**Researched:** 2026-02-26
**Context:** Merging 2openclaw product code into brewclaw landing page repo

## Executive Summary

This is a MERGER milestone, not a greenfield build. Both codebases have complete implementations but use different architectures:

**2openclaw (Product):** Telegram Login Widget → 6-step onboarding → Razorpay → Container provisioning → Dashboard with instance controls

**brewclaw (Landing + Auth):** Landing page → NextAuth (Google OAuth + Email) → Onboarding stub → Dashboard stub

**Key Integration Challenge:** Bridge the authentication gap (Telegram widget vs NextAuth) and merge the onboarding/payment flows while maintaining existing container orchestration backend.

---

## Table Stakes Features (Must Have)

Features that users expect. Missing = product feels incomplete.

| Feature | Current State | Integration Complexity | Required Changes |
|---------|---------------|------------------------|------------------|
| **Landing Page** | ✅ Exists in both | Low | Merge 2openclaw marketing content into brewclaw's structure, keep brewclaw as base |
| **User Authentication** | ⚠️ Different systems | High | Replace Telegram widget with NextAuth, bridge userId → container mapping |
| **Onboarding Flow** | ✅ 2openclaw (6 steps) | High | Replace 2openclaw's Telegram-first flow with NextAuth-first, maintain step sequence |
| **Payment Integration** | ✅ 2openclaw (Razorpay) | Medium | Port Razorpay routes from 2openclaw, maintain payment-first provisioning pattern |
| **Container Provisioning** | ✅ GCP backend (2openclaw) | Low | Keep existing GCP API, update API call patterns from Vercel |
| **Dashboard Controls** | ✅ 2openclaw UI | Medium | Port 2openclaw dashboard components, integrate with NextAuth sessions |
| **Route Protection** | ✅ brewclaw (middleware) | Low | Extend existing middleware for new routes |

---

## Integration Points by User Flow

### Flow 1: Unauthenticated User → Signup

**Current 2openclaw Flow:**
```
Landing Page → Click "Get Started" → /onboard
  → Email input
  → Create Telegram bot (BotFather)
  → Enter bot token (validates via API)
  → Enter Telegram user ID
  → Choose AI provider + enter API key
  → Select plan (Free/Starter/Pro/Business)
  → Payment (Razorpay) [ALL plans including free trial]
  → Payment verified → Container provisioned → Done (redirect to dashboard)
```

**Current brewclaw Flow:**
```
Landing Page → Click "Sign In" → /signin
  → Google OAuth OR Email magic link
  → (If new user) → /onboarding [STUB]
  → /dashboard [STUB]
```

**Target Merged Flow:**
```
Landing Page (2openclaw content + brewclaw structure)
  → Click "Get Started" → /signin (NextAuth)
  → Google OAuth OR Email magic link
  → (If new user) → /onboarding (merged flow)
      Step 1: [SKIP - already have email from auth]
      Step 2: Create Telegram bot (from 2openclaw)
      Step 3: Enter bot token
      Step 4: Enter Telegram user ID
      Step 5: Choose AI provider + API key
      Step 6: Select plan
      Step 7: Payment (Razorpay)
  → Payment verified → Container provisioned (GCP)
  → /dashboard (with instance controls)
```

**Integration Points:**
1. **Auth → Onboarding Bridge**: NextAuth session → onboarding state management
2. **Email Pre-fill**: Extract email from NextAuth session, skip email step
3. **User ID Mapping**: Map NextAuth user.id (CUID) → GCP userId (hex string)
4. **Session Persistence**: Store onboarding progress in sessionStorage (existing 2openclaw pattern)
5. **Payment Verification**: Maintain payment-first provisioning (no container before payment)

**Complexity: HIGH**
- Auth system replacement requires careful user ID mapping
- Onboarding step removal (email) requires UI adjustments
- Need to maintain sessionStorage pattern for Razorpay callback

---

### Flow 2: Returning User → Dashboard

**Current 2openclaw Flow:**
```
User visits /dashboard
  → Reads userId from localStorage['startclaw_instance']
  → Fetches instance data from GCP API
  → Displays metrics, controls (start/stop/restart), live activity
  → Subscription status from GCP
```

**Current brewclaw Flow:**
```
User visits /dashboard
  → Middleware checks NextAuth session
  → If not authed → redirect /signin
  → If authed → show stub dashboard with email
```

**Target Merged Flow:**
```
User visits /dashboard
  → Middleware checks NextAuth session
  → If not authed → redirect /signin
  → If authed but no instance → redirect /onboarding
  → If authed + instance → show full dashboard
      - Fetch instance data from GCP (userId from session)
      - Display 2openclaw dashboard components
      - Controls: start/stop/restart container
      - Subscription status
      - Usage metrics
```

**Integration Points:**
1. **Auth Check**: Use existing middleware (brewclaw)
2. **Instance Check**: Query GCP API with NextAuth user.id → find associated container
3. **Data Fetching**: Port 2openclaw's dashboard data hooks
4. **Component Integration**: Move 2openclaw dashboard components into brewclaw
5. **Subscription UI**: Port 2openclaw's subscription management (upgrade/cancel)

**Complexity: MEDIUM**
- Dashboard components are self-contained (easy to port)
- Need to replace localStorage check with session + GCP query
- Maintain GCP API client from 2openclaw

---

### Flow 3: Payment Lifecycle

**Current 2openclaw Flow:**
```
User selects plan → /api/subscriptions/create (Vercel)
  → Creates Razorpay customer + subscription
  → Stores temp provision data in sessionStorage
  → Opens Razorpay checkout modal
  → User completes payment → Razorpay callback
  → /api/subscriptions/verify (Vercel)
      → Verifies signature (timing-safe)
      → Retrieves provision data from sessionStorage
      → Calls GCP /provision endpoint
      → Returns userId, subdomain, url
  → Stores instance data in localStorage
  → Redirects to /dashboard

Webhooks: /api/webhooks/razorpay handles:
  - subscription.charged (payment success)
  - subscription.cancelled
  - payment.failed → PAST_DUE grace period
```

**Target Merged Flow:**
```
[IDENTICAL - no changes needed]

User selects plan → /api/subscriptions/create
  → Same flow, but provision data includes NextAuth user.id
  → ...rest is unchanged

Key: Razorpay integration is already payment-first and secure
```

**Integration Points:**
1. **User ID Source**: Pass NextAuth user.id instead of generating temp UUID
2. **Email Source**: Extract from NextAuth session instead of form input
3. **API Routes**: Copy 2openclaw's `/api/subscriptions/` and `/api/webhooks/` routes
4. **Environment Variables**: Merge Razorpay env vars into brewclaw
5. **Rate Limiting**: Port 2openclaw's rate limiter (5 requests/hour/IP)

**Complexity: LOW**
- Payment flow is already payment-first and secure
- Just need to update user ID source
- Copy existing working code

---

### Flow 4: Subscription Management

**Current 2openclaw Flow:**
```
Cron job (GCP VM, daily 00:30):
  - Checks all user subscriptions
  - Trial expired → SUSPENDED
  - Payment failed + 3 days → SUSPENDED
  - Suspended + 30 days → CANCELLED (data deleted)

Dashboard subscription UI:
  - [IN PROGRESS] Upgrade/downgrade plans
  - [IN PROGRESS] Cancel subscription
  - [STUBBED] Email notifications (using Razorpay built-in)
```

**Target Merged Flow:**
```
[KEEP GCP CRON - no changes]
  - Subscription state machine stays on GCP
  - Email notifications defer to Razorpay

Dashboard subscription UI:
  - Port in-progress subscription management UI
  - Display current plan, next billing date
  - Upgrade/downgrade/cancel buttons
  - Billing history from Razorpay
```

**Integration Points:**
1. **Backend Cron**: No changes (runs on GCP independently)
2. **Frontend UI**: Port 2openclaw's subscription components
3. **API Routes**: Create proxy routes in brewclaw to GCP subscription endpoints
4. **User Mapping**: Query subscription by NextAuth user.id

**Complexity: LOW**
- Backend logic unchanged
- Frontend is component porting

---

## Feature Dependencies

```
Landing Page (brewclaw base)
  ↓
NextAuth Setup (already built)
  ↓
Merged Onboarding Flow (HIGH complexity)
  ├─ Telegram bot creation (from 2openclaw)
  ├─ AI provider selection (from 2openclaw)
  └─ Plan selection (from 2openclaw)
      ↓
Payment Integration (LOW complexity - copy from 2openclaw)
  ↓
Container Provisioning (NO changes - existing GCP API)
  ↓
Dashboard (MEDIUM complexity - port components + integrate auth)
  ├─ Instance controls (from 2openclaw)
  ├─ Subscription management (from 2openclaw)
  └─ Usage metrics (from 2openclaw)
```

**Critical Path:**
1. Merge landing pages → Set up auth bridge → Port onboarding → Port payment → Port dashboard

**Blocker:** Auth bridge is prerequisite for everything else (onboarding/payment/dashboard all need user ID)

---

## Differentiators (Keep from 2openclaw)

Features that set the product apart from competitors.

| Feature | Why Valuable | Source | Integration Notes |
|---------|--------------|--------|------------------|
| **60-second deploy** | Core value prop | 2openclaw | Maintain by keeping onboarding streamlined |
| **BYOK model** | User controls AI costs | 2openclaw | No changes needed (already secure) |
| **Payment-first provisioning** | Prevents fraud/abuse | 2openclaw | Critical security pattern - must preserve |
| **Timing-safe signature verification** | Security hardening | 2openclaw | Already implemented in razorpay.ts |
| **PII sanitization in logs** | GDPR/privacy compliance | 2openclaw | Port logger.ts to brewclaw |
| **Rate limiting** | Abuse prevention | 2openclaw | Port rateLimit.ts to brewclaw |
| **Free trial with payment verification** | Conversion optimization | 2openclaw | Razorpay subscription with trial_period_days |

**Complexity:** MEDIUM (mostly copying existing secure implementations)

---

## Anti-Features (Explicitly Avoid)

Features to NOT build or carry over.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Telegram Login Widget** | Outdated, poor UX | Use NextAuth (modern, better UX) |
| **localStorage for auth** | XSS risk if site compromised | Use NextAuth sessions (httpOnly cookies) |
| **Email notifications (custom)** | Requires domain, SMTP complexity | Use Razorpay built-in notifications |
| **Multi-agent support** | Ultra tier feature, defer to v2.1 | Single bot per user for v2.0 |
| **WhatsApp integration** | Future milestone | Telegram-first for v2.0 |
| **Real-time chat UI** | Not core to deployment platform | Users chat in Telegram app |
| **Mobile app** | Web-first approach sufficient | Responsive web dashboard |

---

## Data Model Integration

**2openclaw User Data (GCP VM - JSON files):**
```json
{
  "odinseid": "e580c03e93c6e12e",
  "odinseTelegramId": "123456789",
  "email": "user@example.com",
  "botToken": "123456:ABC-xxx",
  "aiProvider": "gemini",
  "aiApiKey": "encrypted-key",
  "plan": "starter",
  "subscriptionStatus": "ACTIVE",
  "razorpayCustomerId": "cust_xxx",
  "razorpaySubscriptionId": "sub_xxx",
  "containerStatus": "running",
  "createdAt": "2024-02-11T10:00:00Z"
}
```

**brewclaw User Data (Prisma - PostgreSQL):**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Integration Strategy:**

1. **Two-Database Architecture** (recommended):
   - Prisma (Vercel): User auth records (email, OAuth accounts, sessions)
   - GCP JSON: Bot instance records (Telegram token, AI keys, container status)
   - **Bridge:** Prisma user.id → GCP userId (store mapping in both systems)

2. **Field Mapping:**
   ```
   brewclaw Prisma User.id (cuid) → 2openclaw odinseid (hex)
   brewclaw User.email → 2openclaw email
   [NEW] Add gcpUserId to Prisma schema (nullable, post-onboarding)
   ```

3. **Workflow:**
   ```
   User signs up (NextAuth) → Prisma User created (has CUID)
   User completes onboarding → GCP user created (has hex ID)
   Store mapping: Prisma User.gcpUserId = GCP odinseid
   Dashboard: Query Prisma → get gcpUserId → query GCP for instance data
   ```

**Complexity: MEDIUM**
- Need to extend Prisma schema with gcpUserId field
- Need to maintain ID mapping in both systems
- Clean separation of concerns (auth vs instance data)

---

## Environment Variable Merge

**From 2openclaw (Vercel):**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RAZORPAY_PLAN_STARTER
RAZORPAY_PLAN_PRO
RAZORPAY_PLAN_BUSINESS
GCP_API_URL
GCP_API_SECRET
```

**From brewclaw (Vercel):**
```env
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
AUTH_RESEND_KEY (optional, not yet configured)
```

**Merged (brewclaw Vercel):**
```env
# Auth (existing)
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
AUTH_RESEND_KEY

# Payments (from 2openclaw)
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RAZORPAY_PLAN_STARTER
RAZORPAY_PLAN_PRO
RAZORPAY_PLAN_BUSINESS

# GCP Backend (from 2openclaw)
GCP_API_URL=http://34.131.95.162:3000
GCP_API_SECRET
```

**GCP VM (no changes):**
```env
API_SECRET
DATA_DIR=/opt/2openclaw/data
PORT=3000
```

---

## Component Migration Map

| Component | Source | Destination | Modifications |
|-----------|--------|-------------|---------------|
| Landing sections | 2openclaw /web/app/page.tsx | brewclaw /app/page.tsx | Merge hero, pricing, features |
| Hero/Pricing/Features | 2openclaw /components/landing/ | brewclaw /components/landing/ | Keep 2openclaw design, update CTAs |
| Onboarding flow | 2openclaw /app/onboard/page.tsx | brewclaw /app/(auth)/onboarding/page.tsx | Remove email step, integrate NextAuth |
| Dashboard | 2openclaw /app/dashboard/page.tsx | brewclaw /app/dashboard/page.tsx | Port components, use NextAuth session |
| Dashboard components | 2openclaw /components/dashboard/ | brewclaw /components/dashboard/ | Direct copy (mostly self-contained) |
| Metrics grid | 2openclaw MetricsGrid.tsx | brewclaw /components/dashboard/ | Direct copy |
| Model selector | 2openclaw ModelSelector.tsx | brewclaw /components/dashboard/ | Direct copy |
| Live activity | 2openclaw LiveActivity.tsx | brewclaw /components/dashboard/ | Direct copy |
| Razorpay lib | 2openclaw /lib/razorpay.ts | brewclaw /lib/razorpay.ts | Direct copy (no changes) |
| Rate limiter | 2openclaw /lib/rateLimit.ts | brewclaw /lib/rateLimit.ts | Direct copy |
| Logger | 2openclaw /lib/logger.ts | brewclaw /lib/logger.ts | Direct copy |
| Subscription routes | 2openclaw /app/api/subscriptions/ | brewclaw /app/api/subscriptions/ | Update user ID source |
| Webhook routes | 2openclaw /app/api/webhooks/ | brewclaw /app/api/webhooks/ | Direct copy |

**Migration Strategy:**
1. **Phase 1:** Merge landing pages (low risk, no backend dependencies)
2. **Phase 2:** Port Razorpay utilities + API routes (payment-critical, test thoroughly)
3. **Phase 3:** Port onboarding flow (integrate with NextAuth session)
4. **Phase 4:** Port dashboard components (final integration)

---

## API Endpoints to Maintain

**Vercel (brewclaw) - Existing:**
```
/api/auth/[...nextauth]  - NextAuth handlers (keep)
```

**Vercel (brewclaw) - To Add (from 2openclaw):**
```
/api/subscriptions/create     - Create Razorpay subscription
/api/subscriptions/verify     - Verify payment + provision container
/api/webhooks/razorpay        - Razorpay webhook handler
/api/validate-telegram        - Validate bot token (port from 2openclaw)
/api/provision                - Proxy to GCP /provision (or call direct in verify)
```

**GCP VM (no changes):**
```
/provision                              - Create user + container
/instances/:userId                      - Get instance status
/instances/:userId/start                - Start container
/instances/:userId/stop                 - Stop container
/instances/:userId/restart              - Restart container
/instances/:userId/logs                 - Get container logs
/instances/:userId/stats                - Get container stats
/subscriptions/update-status            - Update subscription status
/subscriptions/payment-failed           - Track payment failure
/subscriptions/:userId                  - Get subscription status
```

---

## Complexity Assessment

| Integration Area | Complexity | Why | Dependencies |
|------------------|------------|-----|--------------|
| Landing page merge | **LOW** | Static content, no backend | None |
| Auth system bridge | **HIGH** | User ID mapping, session management | Prisma schema extension |
| Onboarding flow | **HIGH** | Step removal, session integration | Auth bridge |
| Payment integration | **LOW** | Copy existing secure code | None (self-contained) |
| Container provisioning | **NONE** | No changes (existing GCP API) | None |
| Dashboard porting | **MEDIUM** | Component copy + session integration | Auth bridge |
| Subscription management | **LOW** | Backend unchanged, UI porting | None |

**Overall Complexity: MEDIUM-HIGH**
- High complexity in auth integration (blocking)
- Low complexity in payment/dashboard (mostly porting)

---

## Security Checklist (Maintain from 2openclaw)

✅ **Payment signature verification** - Timing-safe comparison (crypto.timingSafeEqual)
✅ **PII sanitization** - Logs redact emails, tokens, secrets
✅ **Rate limiting** - 5 requests/hour/IP for subscription creation
✅ **Payment-first provisioning** - No container before payment verified
✅ **Environment variable validation** - Fail fast if secrets missing
✅ **Razorpay webhook signature** - HMAC SHA256 verification
✅ **API authentication** - X-API-Key header for GCP calls
✅ **Session security** - NextAuth httpOnly cookies (replace localStorage)

**New Security Requirements:**
- [ ] Extend Prisma schema with gcpUserId (nullable, unique)
- [ ] Validate NextAuth session before onboarding
- [ ] Secure user ID mapping (Prisma ↔ GCP)
- [ ] Audit localStorage usage (replace with session where possible)

---

## Testing Strategy

**Critical Paths to Test:**

1. **New User Signup Flow:**
   - [ ] Google OAuth → onboarding → payment → dashboard
   - [ ] Email magic link → onboarding → payment → dashboard
   - [ ] Free trial → verify payment method → container created

2. **Payment Flows:**
   - [ ] Razorpay checkout opens correctly
   - [ ] Payment verification works (signature check)
   - [ ] Container provisioned ONLY after payment
   - [ ] User redirected to dashboard with instance data

3. **Dashboard Functionality:**
   - [ ] Instance status fetched from GCP
   - [ ] Start/stop/restart controls work
   - [ ] Subscription status displays correctly
   - [ ] Billing history shows Razorpay data

4. **Edge Cases:**
   - [ ] Payment cancelled → no container created
   - [ ] Payment success + provisioning failed → error handling
   - [ ] User closes browser mid-onboarding → session recovery
   - [ ] Webhook delivery failure → retry logic

**Test Environments:**
- Vercel Preview Deployment (brewclaw)
- GCP VM Test API (separate from production)
- Razorpay Test Mode (existing)

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **User ID mapping breaks** | Users can't access containers | Medium | Thorough testing, fallback to email lookup |
| **Payment-provisioning race condition** | Double-charge or no container | Low | Already solved in 2openclaw (payment-first) |
| **Session loss during onboarding** | User abandons flow | Medium | sessionStorage for onboarding state (existing) |
| **GCP API downtime** | No deployments | Low | Error handling + retry logic |
| **Razorpay webhook missed** | Subscription not activated | Medium | Manual reconciliation job (2openclaw has cron) |
| **localStorage XSS vulnerability** | User data leaked | Low | Replace with session where possible |

---

## Success Metrics

**Feature Completeness:**
- [ ] All 2openclaw features preserved (onboarding, payment, dashboard)
- [ ] NextAuth replaces Telegram widget (better UX)
- [ ] Single domain deployment (brewclaw.com)
- [ ] No regression in container orchestration

**User Experience:**
- [ ] Signup time ≤ 60 seconds (same as 2openclaw)
- [ ] Payment flow seamless (Razorpay modal integration)
- [ ] Dashboard loads instance data within 2 seconds
- [ ] Mobile responsive (brewclaw already is)

**Security:**
- [ ] All 2openclaw security patterns preserved
- [ ] NextAuth sessions more secure than localStorage
- [ ] PII sanitization in logs
- [ ] Payment-first provisioning maintained

---

## Open Questions

1. **User ID Strategy:**
   - Option A: Store GCP userId in Prisma (recommended, clean separation)
   - Option B: Generate GCP userId from Prisma CUID (deterministic, simpler)
   - **Decision Needed:** Validate with team

2. **Email Provider:**
   - 2openclaw uses Razorpay built-in emails
   - brewclaw has AUTH_RESEND_KEY (not yet configured)
   - **Decision:** Continue with Razorpay emails or set up Resend?

3. **Dashboard Redesign:**
   - 2openclaw dashboard is functional but marked for redesign
   - **Decision:** Port as-is for v2.0, redesign in v2.1?

4. **Mobile App:**
   - Out of scope for v2.0 per PROJECT.md
   - **Confirmation:** Web-first approach sufficient?

5. **Codebase Repo:**
   - brewclaw repo is base (PROJECT.md decision)
   - 2openclaw code archived after merge?
   - **Decision:** Confirm with team

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| **Integration complexity** | HIGH | Both codebases reviewed, clear architecture |
| **Security patterns** | HIGH | 2openclaw has thorough security implementation |
| **Payment flow** | HIGH | Existing Razorpay integration is production-ready |
| **Auth bridge** | MEDIUM | User ID mapping is custom logic (needs validation) |
| **GCP compatibility** | HIGH | Backend API is stable, no changes needed |
| **Component porting** | HIGH | React components are mostly self-contained |

**Overall Confidence: HIGH**
- Clear migration path identified
- Most complexity is in auth bridge (manageable)
- Existing secure implementations can be copied

---

## Next Steps (For Roadmap Creation)

**Recommended Phase Structure:**

1. **Phase 1: Foundation Merge**
   - Merge landing pages (2openclaw → brewclaw)
   - Port Razorpay utilities (razorpay.ts, rateLimit.ts, logger.ts)
   - Extend Prisma schema with gcpUserId

2. **Phase 2: Payment Integration**
   - Port subscription API routes
   - Port webhook handlers
   - Test payment flow end-to-end

3. **Phase 3: Onboarding Integration**
   - Port onboarding UI components
   - Remove email step (use NextAuth session)
   - Integrate with payment flow
   - Test complete signup flow

4. **Phase 4: Dashboard Integration**
   - Port dashboard components
   - Implement instance data fetching
   - Test start/stop/restart controls
   - Test subscription management

5. **Phase 5: Production Deployment**
   - Update environment variables (Vercel)
   - Deploy to brewclaw.com
   - Migrate existing 2openclaw users (if any)
   - Monitor for issues

**Critical Path:** Phase 1 → 2 → 3 → 4 → 5 (sequential, each depends on previous)

**Estimated Timeline:** 2-3 weeks (assuming 1-2 days per phase + testing buffer)

---

## Files Referenced

**2openclaw Sources:**
- `/Users/divykairoth/Openclaw/2openclaw/CONTEXT.md`
- `/Users/divykairoth/Openclaw/2openclaw/web/app/onboard/page.tsx`
- `/Users/divykairoth/Openclaw/2openclaw/web/app/dashboard/page.tsx`
- `/Users/divykairoth/Openclaw/2openclaw/web/app/api/subscriptions/create/route.ts`
- `/Users/divykairoth/Openclaw/2openclaw/web/app/api/subscriptions/verify/route.ts`
- `/Users/divykairoth/Openclaw/2openclaw/web/app/page.tsx`

**brewclaw Sources:**
- `.planning/PROJECT.md`
- `.planning/phases/12-signup-step/12-01-PLAN.md`
- `lib/auth.ts`
- `app/(auth)/signin/page.tsx`
- `app/(auth)/onboarding/page.tsx`
- `app/dashboard/page.tsx`
- `middleware.ts`
- `app/page.tsx`
