# Technology Stack — Merging 2openclaw into brewclaw

**Project:** BrewClaw v2.0 Unified Product
**Researched:** 2026-02-26
**Confidence:** HIGH

## Executive Summary

This is a **single app merge**, not a monorepo. Both codebases are Next.js with similar architectures—combining them into one unified app at brewclaw.com is straightforward. The brewclaw codebase (Next.js 16 + NextAuth v5 + Tailwind v4 + Prisma) is the **base**. The 2openclaw codebase (Next.js 14 + NextAuth v4 + Tailwind v3) will be **migrated and merged** into it.

**Key decision:** Monorepo adds unnecessary complexity for a single product with one deployment. The overhead of workspace tooling (Turborepo/pnpm workspaces) provides no benefit when there's no code sharing between independent apps.

## Architecture Decision: Single App (Not Monorepo)

### Why Single App

| Factor | Single App | Monorepo | Decision |
|--------|-----------|----------|----------|
| **Deployments** | 1 domain (brewclaw.com) | Multiple apps/packages | ✅ Single app matches requirement |
| **Code sharing** | All code in one codebase | Shared packages | ✅ No need for package boundaries |
| **Team size** | Small team | Multiple teams | ✅ Monorepo overhead not justified |
| **Build complexity** | Simple `next build` | Turborepo/Nx orchestration | ✅ Simpler is better |
| **Dependency management** | One package.json | Workspace configs | ✅ Less tooling to maintain |

**Verdict:** Use brewclaw as the base, copy 2openclaw features into `/app`, merge dependencies, consolidate environment variables. Standard Next.js app structure with no monorepo tooling.

**Source:** [The Ultimate Guide to Building a Monorepo in 2026](https://medium.com/@sanjaytomar717/the-ultimate-guide-to-building-a-monorepo-in-2025-sharing-code-like-the-pros-ee4d6d56abaa) — "For a single app with a small team and little shared code, a monorepo adds tooling and process overhead. Start simple."

## Dependency Resolution

### Version Conflicts and Migrations

| Package | brewclaw (Current) | 2openclaw (Legacy) | Resolution | Migration Complexity |
|---------|-------------------|-------------------|------------|----------------------|
| **next** | 16.1.6 | 14.1.0 | Keep 16.1.6 | **MEDIUM** — Breaking changes in async params, caching |
| **react** | 19.2.3 | ^18 | Keep 19.2.3 | **MEDIUM** — forwardRef changes, defaultProps removal |
| **react-dom** | 19.2.3 | ^18 | Keep 19.2.3 | **MEDIUM** — hydration API changes |
| **next-auth** | 5.0.0-beta.30 | 4.24.13 | Keep v5 | **HIGH** — Complete auth rewrite, session handling changes |
| **tailwindcss** | ^4 | ^3.4 | Keep v4 | **LOW** — CSS config migration, automated codemod |
| **@prisma/client** | 7.4.1 | N/A (2openclaw uses JSON) | Keep 7.4.1 | **MEDIUM** — Need to migrate GCP JSON storage to Prisma |
| **razorpay** | N/A | 2.9.4 | Add 2.9.4 | **NONE** — Direct copy |
| **framer-motion** | N/A | 12.34.0 | Add 12.34.0 | **NONE** — Direct copy |

### Critical Migrations Required

#### 1. Next.js 14 → 16 Migration

**Breaking Changes:**
- **Async Route Parameters:** `params` and `searchParams` are now async in App Router
- **Caching Behavior:** Opt-in caching with `"use cache"` directive (v14 was implicit)
- **Turbopack Default:** New bundler (can opt-out with `--webpack` flag)

**Migration Path:**
```bash
# Step 1: Update to Next.js 15 (intermediate)
npm install next@15 react@19 react-dom@19

# Step 2: Run codemods for async params
npx next typegen

# Step 3: Update to Next.js 16
npm install next@16 react@latest react-dom@latest
```

**2openclaw Code Impact:**
- All `app/` pages with `params` need `async` functions
- API routes using `params` need `await params`
- Example: `app/dashboard/[userId]/page.tsx` → `async function Page({ params }: { params: Promise<{userId: string}> })`

**Timeline:** ~2-3 days using automated codemods
**Confidence:** HIGH — Automated codemods available, well-documented
**Sources:**
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Migrating a Large-Scale Monorepo from Next.js 14 to 16](https://dev.to/abhilashlr/migrating-a-large-scale-monorepo-from-nextjs-14-to-16-a-real-world-journey-5383)

#### 2. React 18 → 19 Migration

**Breaking Changes:**
- **forwardRef no longer needed:** `ref` is now a prop for function components
- **defaultProps removed:** Use ES6 default parameters instead
- **String refs removed:** Must use callback refs or `createRef`
- **useRef() requires parameter:** `useRef()` → `useRef(null)`

**2openclaw Code Impact:**
- UI components using `forwardRef` can be simplified
- PropTypes removed (already using TypeScript, minimal impact)
- No string refs detected in 2openclaw codebase

**Migration Path:**
```bash
# Automated codemod
npx codemod react/19/migration-recipe

# TypeScript type updates
npx types-react-codemod@latest preset-19 ./app
```

**Timeline:** ~1 day
**Confidence:** HIGH — Codemods available
**Sources:**
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React 19 vs React 18: Migration Guide](https://dev.to/manojspace/react-19-vs-react-18-performance-improvements-and-migration-guide-5h85)

#### 3. NextAuth v4 → v5 Migration

**Breaking Changes:**
- **Unified `auth()` method:** Replaces `getServerSession`, `getSession`, `withAuth`, `getToken`, `useSession`
- **New configuration structure:** `auth.ts` and `auth.config.ts` instead of API route file
- **Session cookie prefix change:** `next-auth.session-token` → `authjs.session-token` (forces re-login)
- **Minimum Next.js version:** 14.0+
- **Environment variables:** `NEXTAUTH_URL` often not needed in v5

**2openclaw Code Impact:**
- **CRITICAL:** Current auth code in `app/api/auth/[...nextauth]/route.ts` needs complete rewrite
- All server components using `getServerSession` → `auth()`
- Session handling in API routes needs update

**Migration Path:**
1. Create `lib/auth.ts` and `lib/auth.config.ts` (brewclaw already has this)
2. Copy Google OAuth provider config from 2openclaw
3. Update all auth calls to use `auth()` method
4. **Note:** Users will need to re-login due to session cookie change

**Existing brewclaw auth (v5):**
```typescript
// lib/auth.ts already exists with:
// - Google OAuth provider
// - Resend email provider (magic link)
// - Prisma adapter
```

**2openclaw auth to merge:**
- Google OAuth provider (duplicate, use brewclaw's)
- No email provider (brewclaw adds this)
- No Prisma adapter (uses NextAuth's default session)

**Timeline:** ~2 days
**Confidence:** MEDIUM — Well-documented but requires careful testing
**Sources:**
- [NextAuth.js v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Migrating from NextAuth v4 to Auth.js v5](https://dev.to/acetoolz/nextauthjs-v5-guide-migrating-from-v4-with-real-examples-50ad)

#### 4. Tailwind CSS v3 → v4 Migration

**Breaking Changes:**
- **CSS-first configuration:** `@theme` directive instead of `tailwind.config.js`
- **PostCSS plugin:** Moved to separate package `@tailwindcss/postcss`
- **Import syntax:** `@import "tailwindcss"` instead of `@tailwind` directives
- **Gradient utilities:** Behavior changes with variants
- **Container utility:** Configuration options removed

**Migration Path:**
```bash
# Automated migration
npx @tailwindcss/upgrade

# Manual steps:
# 1. Update dependencies
# 2. Convert tailwind.config.js to CSS @theme
# 3. Update imports in globals.css
```

**brewclaw already on v4:**
```css
/* app/globals.css */
@import "tailwindcss";
```

**2openclaw (v3) to migrate:**
- Convert `tailwind.config.ts` theme to `@theme` CSS
- Update component styles if using deprecated utilities
- Test gradient and container usage

**Timeline:** ~1 day (automated tool handles most)
**Confidence:** HIGH — Automated upgrade tool available
**Sources:**
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4.0: Complete Migration Guide](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)

## Stack Additions (from 2openclaw)

### New Dependencies to Add

| Package | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| **razorpay** | ^2.9.4 | Payment processing | Razorpay subscription management |
| **framer-motion** | ^12.34.0 | Animations | Onboarding flow animations |
| **@radix-ui/react-dialog** | ^1.1.15 | Modal dialogs | Dashboard modals (already in brewclaw UI) |
| **class-variance-authority** | ^0.7.1 | Component variants | Button/component styling (already in brewclaw) |

**Verdict:** Only **razorpay** and **framer-motion** are net-new additions. All Radix UI components are already in brewclaw via shadcn/ui.

### Razorpay Integration (Preserve from 2openclaw)

**Existing 2openclaw Implementation:**
- `lib/razorpay.ts` — Customer/subscription management, webhook verification
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Plan IDs: `RAZORPAY_PLAN_STARTER`, `RAZORPAY_PLAN_PRO`, `RAZORPAY_PLAN_BUSINESS`

**Integration Steps:**
1. Copy `lib/razorpay.ts` → brewclaw `/lib/razorpay.ts`
2. Add Razorpay env vars to brewclaw `.env.local.example`
3. Copy webhook route `app/api/webhooks/razorpay/route.ts`
4. Update plan names: `2OpenClaw` → `BrewClaw`

**No changes needed to:** Payment flow logic, subscription status mapping, webhook signature verification (all production-tested).

## Environment Variables Consolidation

### Current State

**brewclaw (.env.local):**
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AUTH_RESEND_KEY=...
```

**2openclaw (inferred from code):**
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
RAZORPAY_PLAN_STARTER=plan_...
RAZORPAY_PLAN_PRO=plan_...
RAZORPAY_PLAN_BUSINESS=plan_...
GCP_API_URL=https://...
GCP_API_SECRET=...
```

### Merged Environment Variables

**brewclaw v2.0 (.env.local):**
```bash
# Database (brewclaw)
DATABASE_URL=postgresql://...

# NextAuth v5 (brewclaw)
NEXTAUTH_URL=http://localhost:3000        # Often not needed in v5
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AUTH_RESEND_KEY=...                       # Email magic link

# Razorpay (from 2openclaw)
NEXT_PUBLIC_RAZORPAY_KEY_ID=...          # Client-side checkout
RAZORPAY_KEY_ID=...                      # Server-side API
RAZORPAY_KEY_SECRET=...                  # Server-side API
RAZORPAY_WEBHOOK_SECRET=...              # Webhook verification
RAZORPAY_PLAN_STARTER=plan_...
RAZORPAY_PLAN_PRO=plan_...
RAZORPAY_PLAN_BUSINESS=plan_...

# GCP Container Orchestration (from 2openclaw)
GCP_API_URL=https://...                  # GCP VM API endpoint
GCP_API_SECRET=...                       # API authentication
```

**Net additions:** 9 environment variables (Razorpay + GCP)

**Source:** [Managing Prisma ORM environment variables](https://www.prisma.io/docs/orm/more/development-environment/environment-variables) — Consolidate all `.env` files into root `.env.local`

## Database Migration Strategy

### Current State

**brewclaw:**
- PostgreSQL via Prisma
- NextAuth v5 models: `User`, `Account`, `Session`, `VerificationToken`
- Database URL in `.env.local`

**2openclaw:**
- JSON files on GCP VM (`/data/users/{userId}.json`)
- User data structure: `{ userId, email, telegramToken, razorpayCustomerId, subscriptionStatus, plan, ... }`
- No database on Vercel side (relies on GCP API)

### Migration Approach: Extend Prisma Schema

**Do NOT migrate GCP JSON to Prisma immediately.** The GCP VM API (`/provision`, `/subscriptions/update-status`) manages container state and user data in JSON. Changing this requires GCP backend changes.

**Instead:** Extend Prisma schema to store Razorpay subscription metadata in PostgreSQL while keeping GCP JSON for container state.

**New Prisma Models:**

```prisma
// Add to existing schema.prisma

model Subscription {
  id                    String    @id @default(cuid())
  userId                String    @unique
  email                 String
  razorpayCustomerId    String?
  razorpaySubscriptionId String?  @unique
  plan                  String    // starter, pro, business
  status                String    // PENDING, ACTIVE, PAST_DUE, CANCELLED
  trialEndsAt           DateTime?
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Instance {
  id                String    @id @default(cuid())
  userId            String
  telegramToken     String
  aiProvider        String    // gemini, openai, anthropic
  status            String    // running, stopped, provisioning
  gcpUserId         String    // Internal GCP user ID
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Migration Timeline:**
1. **Phase 1 (v2.0):** Keep GCP JSON, add Prisma models for subscription metadata only
2. **Phase 2 (v2.1):** Migrate GCP JSON to Prisma (requires GCP backend rewrite)

**Rationale:** Don't block v2.0 launch on GCP backend changes. Prisma stores auth + subscription data, GCP manages containers.

## UI Component Strategy

### Current Component Libraries

**brewclaw:**
- shadcn/ui (Radix UI primitives + Tailwind v4)
- Components: `Button`, `Input`, `Label` (minimal set from Phase 12)
- Location: `components/ui/`

**2openclaw:**
- shadcn/ui (Radix UI primitives + Tailwind v3)
- Components: Full UI library (60+ components in `components/ui/`)
- Custom components: Landing page, dashboard, onboarding flows

### Merge Strategy: Unified Component Library

**Do NOT create a shared package.** All components in `/components`.

**Steps:**
1. **Keep brewclaw UI components** (already Tailwind v4 compatible)
2. **Migrate 2openclaw custom components:**
   - `components/landing/*` → `components/landing/*`
   - `components/dashboard/*` → `components/dashboard/*`
   - `components/sections/*` → `components/sections/*`
3. **Migrate 2openclaw UI components:**
   - Compare `components/ui/` from both codebases
   - Use brewclaw versions (Tailwind v4)
   - If 2openclaw has additional components, migrate with `npx @tailwindcss/upgrade`

**Component Ownership:**
- All components in source control (shadcn/ui pattern)
- Modify freely — no external package constraints
- Unified Tailwind v4 styling

**Source:** [shadcn/ui Best Practices](https://insight.akarinti.tech/best-practices-for-using-shadcn-ui-in-next-js-2134108553ae) — "Organize with separate directories: `/components/ui` for shadcn/ui, `/layout`, `/forms`, `/shared`"

## File Structure (Merged Codebase)

```
brewclaw/
├── app/
│   ├── (auth)/                     # brewclaw — Auth layouts
│   │   ├── signin/
│   │   └── layout.tsx
│   ├── (marketing)/                # 2openclaw — Landing page
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── onboard/                    # 2openclaw — Onboarding flow
│   │   └── page.tsx
│   ├── dashboard/                  # 2openclaw — Dashboard
│   │   ├── page.tsx
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── provision/              # 2openclaw — Container provisioning
│   │   ├── instance/[userId]/      # 2openclaw — Instance management
│   │   ├── subscriptions/          # 2openclaw — Razorpay subscriptions
│   │   └── webhooks/razorpay/      # 2openclaw — Razorpay webhooks
│   ├── globals.css                 # brewclaw (Tailwind v4)
│   └── layout.tsx                  # Merged metadata
├── components/
│   ├── ui/                         # Merged shadcn/ui (Tailwind v4)
│   ├── auth/                       # brewclaw — Auth components
│   ├── landing/                    # 2openclaw — Landing sections
│   ├── dashboard/                  # 2openclaw — Dashboard UI
│   └── sections/                   # 2openclaw — Reusable sections
├── lib/
│   ├── auth.ts                     # brewclaw (NextAuth v5)
│   ├── auth.config.ts              # brewclaw
│   ├── prisma.ts                   # brewclaw
│   ├── razorpay.ts                 # 2openclaw → Add
│   └── utils.ts                    # Merge both
├── prisma/
│   └── schema.prisma               # Extend with Subscription + Instance
├── .env.local                      # Merged env vars
└── package.json                    # Merged dependencies
```

**Route organization:**
- `(auth)` — Sign-in/sign-up flows
- `(marketing)` — Landing page (public)
- `/onboard` — Post-auth onboarding (protected)
- `/dashboard` — User dashboard (protected)

## What NOT to Add

| Package/Tool | Reason to Exclude |
|--------------|-------------------|
| **Turborepo** | No monorepo, no need for build orchestration |
| **pnpm workspaces** | Single app, standard npm is sufficient |
| **Nx** | Overkill for single deployment |
| **next-auth v4** | Deprecated, use v5 |
| **@tailwindcss/forms** | Built-in to Tailwind v4 |
| **@tailwindcss/container-queries** | Built-in to Tailwind v4 |
| **Additional UI libraries** | shadcn/ui covers all needs |

## Migration Timeline Summary

| Task | Complexity | Duration | Automation Available |
|------|-----------|----------|---------------------|
| Next.js 14 → 16 | Medium | 2-3 days | ✅ Codemods |
| React 18 → 19 | Medium | 1 day | ✅ Codemods |
| NextAuth v4 → v5 | High | 2 days | ⚠️ Partial (docs good) |
| Tailwind v3 → v4 | Low | 1 day | ✅ Automated tool |
| Merge components | Low | 1 day | ❌ Manual |
| Add Razorpay | Low | 2 hours | ❌ Direct copy |
| Extend Prisma schema | Medium | 1 day | ❌ Manual + migration |
| Merge env vars | Low | 1 hour | ❌ Manual |
| **Total** | — | **7-9 days** | — |

**Parallelizable:** Component merge + Razorpay integration can happen alongside framework migrations.

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Session cookie change forces re-login** | HIGH — All users logged out | Document in release notes, provide clear messaging |
| **Async params breaking changes** | MEDIUM — 2openclaw pages need updates | Use automated codemods, test thoroughly |
| **GCP API compatibility** | MEDIUM — Env var changes might break GCP calls | Keep GCP_API_URL/SECRET unchanged, test provisioning |
| **Razorpay webhook signature** | HIGH — Payment failures | Preserve exact webhook verification logic, test in staging |
| **Tailwind v4 styling regressions** | LOW — UI might look different | Visual regression testing after migration |

## Success Criteria

- [ ] All dependencies use latest stable versions (Next.js 16, React 19, NextAuth v5, Tailwind v4)
- [ ] Single `package.json` with no workspace configuration
- [ ] Single `.env.local` with all environment variables
- [ ] Prisma schema includes auth + subscription models
- [ ] All 2openclaw features accessible at brewclaw.com routes
- [ ] No duplicate UI components (unified shadcn/ui library)
- [ ] Zero breaking changes to GCP VM API calls
- [ ] Razorpay integration preserved exactly (payment flow unchanged)

## Sources

### Official Documentation
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [NextAuth v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Prisma Environment Variables](https://www.prisma.io/docs/orm/more/development-environment/environment-variables)
- [shadcn/ui Monorepo Guide](https://ui.shadcn.com/docs/monorepo)

### Community Resources
- [Migrating a Large-Scale Monorepo from Next.js 14 to 16](https://dev.to/abhilashlr/migrating-a-large-scale-monorepo-from-nextjs-14-to-16-a-real-world-journey-5383)
- [The Ultimate Guide to Building a Monorepo in 2026](https://medium.com/@sanjaytomar717/the-ultimate-guide-to-building-a-monorepo-in-2025-sharing-code-like-the-pros-ee4d6d56abaa)
- [Best Practices for Using shadcn/ui in Next.js](https://insight.akarinti.tech/best-practices-for-using-shadcn-ui-in-next-js-2134108553ae)
