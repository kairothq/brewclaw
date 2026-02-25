# Roadmap: BrewClaw

## Milestones

- ✅ **v1.0 Auth Foundation** - Phase 12 (shipped 2026-02-26)
- 🚧 **v2.0 Unified Product** - Phases 13-19 (in progress)

## Overview

v2.0 merges the 2openclaw product code into the brewclaw landing page repository to create a unified platform at brewclaw.com. The journey starts with foundation work (route structure, dependencies, framework upgrades), builds the authentication bridge between NextAuth and GCP containers, integrates payment and onboarding flows, adds dashboard controls, and completes with styling unification and production cutover. The merge preserves all production-tested 2openclaw features while leveraging brewclaw's modern Next.js 16 + NextAuth v5 + Prisma stack.

## Phases

**Phase Numbering:**
- Integer phases (13, 14, 15): Planned milestone work
- Decimal phases (14.1, 14.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>✅ v1.0 Auth Foundation (Phase 12) - SHIPPED 2026-02-26</summary>

### Phase 12: Auth Foundation
**Goal**: User authentication with Google OAuth and email magic link
**Plans**: 3 plans

Plans:
- [x] 12-01: NextAuth v5 setup with Prisma adapter
- [x] 12-02: Google OAuth and magic link sign-in page
- [x] 12-03: Route protection middleware

</details>

### 🚧 v2.0 Unified Product (In Progress)

**Milestone Goal:** Merge 2openclaw product into brewclaw to create unified platform at brewclaw.com with authentication, onboarding, payment, and dashboard features.

- [ ] **Phase 13: Foundation Merge** - Consolidate codebases, route groups, dependencies, framework upgrades
- [ ] **Phase 14: Database & Auth Bridge** - Extend Prisma schema, NextAuth-GCP user mapping, middleware stratification
- [ ] **Phase 15: Payment Integration** - Razorpay routes, webhooks, server-side subscription flow
- [ ] **Phase 16: Onboarding Integration** - 6-step wizard with plan → platform → AI → payment flow
- [ ] **Phase 17: Dashboard & Container Management** - Instance controls, GCP proxy routes, subscription UI
- [ ] **Phase 18: Styling & Branding** - Dark theme unification, 2openclaw→brewclaw rebrand, redirects
- [ ] **Phase 19: Production Cutover** - Environment setup, data migration, single domain deployment

## Phase Details

### Phase 13: Foundation Merge
**Goal**: Unified codebase structure with route groups, consolidated dependencies, and framework upgrades completed
**Depends on**: Phase 12 (Auth Foundation)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Codebase uses route groups ((marketing)/, (product)/, (auth)/) for logical separation
  2. Single package.json with resolved dependency conflicts (no duplicate versions)
  3. All environment variables consolidated in .env.local (15 vars documented)
  4. Framework upgrades complete (Next.js 16, React 19, Tailwind v4, NextAuth v5) with no breaking changes
**Plans**: TBD

Plans:
- [ ] 13-01: TBD
- [ ] 13-02: TBD

### Phase 14: Database & Auth Bridge
**Goal**: Prisma schema extended for product data with NextAuth-to-GCP user ID mapping layer
**Depends on**: Phase 13
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, INFRA-03
**Success Criteria** (what must be TRUE):
  1. User can sign up with Google OAuth and receives authenticated session
  2. User can sign up with email magic link and receives authenticated session
  3. User session persists across browser refresh and tab close/reopen
  4. NextAuth user ID maps to GCP container system via Prisma User.gcpUserId field
  5. Middleware routes authenticated users correctly (public pages accessible, dashboard requires login)
  6. Razorpay webhook routes bypass authentication (no 401 errors on payment callbacks)
**Plans**: TBD

Plans:
- [ ] 14-01: TBD
- [ ] 14-02: TBD

### Phase 15: Payment Integration
**Goal**: Razorpay subscription creation and verification with server-side session handling
**Depends on**: Phase 14
**Requirements**: PAY-01, PAY-02, PAY-03, PAY-04, PAY-05
**Success Criteria** (what must be TRUE):
  1. User can create Razorpay subscription for chosen plan (Starter/Pro/Business)
  2. Payment signature verified with timing-safe comparison (security requirement met)
  3. Container provisioning triggered only after payment verification succeeds
  4. Razorpay webhooks update subscription status in database (active, past_due, cancelled)
  5. User subscription data persisted in Prisma linked to NextAuth user ID
**Plans**: TBD

Plans:
- [ ] 15-01: TBD
- [ ] 15-02: TBD

### Phase 16: Onboarding Integration
**Goal**: Complete 6-step onboarding flow from plan selection through container provisioning
**Depends on**: Phase 15
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05, ONBD-06, ONBD-07, ONBD-08
**Success Criteria** (what must be TRUE):
  1. User lands on pricing/plan selection as first step from landing page CTA
  2. User can choose messaging platform (Telegram) with video tutorial popup
  3. User can choose AI provider (Gemini/OpenAI/Anthropic) and provide own API key
  4. User can select "Get AI by us" option to skip API key step and use brewclaw credits
  5. User can complete payment via Razorpay integration from Phase 15
  6. User's Telegram bot is provisioned automatically after successful payment
**Plans**: TBD

Plans:
- [ ] 16-01: TBD
- [ ] 16-02: TBD

### Phase 17: Dashboard & Container Management
**Goal**: User dashboard with instance controls, status monitoring, and subscription management
**Depends on**: Phase 16
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, INFRA-01, INFRA-02
**Success Criteria** (what must be TRUE):
  1. User can view their OpenClaw instance status (running/stopped/error) in dashboard
  2. User can start, stop, and restart their container instance from dashboard
  3. User can view container logs to debug bot issues
  4. User can view subscription details (plan, next billing date, status)
  5. User can access settings to update API key or change AI provider
  6. Dashboard follows dark theme design consistent with auth pages
**Plans**: TBD

Plans:
- [ ] 17-01: TBD
- [ ] 17-02: TBD

### Phase 18: Styling & Branding
**Goal**: Unified dark theme design and complete 2openclaw→brewclaw rebrand
**Depends on**: Phase 17
**Requirements**: BRAND-01, BRAND-02, BRAND-03
**Success Criteria** (what must be TRUE):
  1. All references to "2openclaw" renamed to "brewclaw" across codebase, OAuth consent, and Razorpay plans
  2. 301 redirects configured from 2openclaw.vercel.app to brewclaw.com
  3. Consistent dark theme styling across landing, auth, onboarding, and dashboard pages
**Plans**: TBD

Plans:
- [ ] 18-01: TBD

### Phase 19: Production Cutover
**Goal**: Single domain deployment at brewclaw.com with production data migrated
**Depends on**: Phase 18
**Requirements**: INFRA-04
**Success Criteria** (what must be TRUE):
  1. Environment variables configured on Vercel production (Razorpay keys, GCP secrets, DATABASE_URL)
  2. Prisma migrations applied to production database successfully
  3. JSON user data migrated from GCP VM to Prisma database
  4. brewclaw.com serves unified application (landing + product)
  5. Monitoring dashboard set up to track errors and performance
**Plans**: TBD

Plans:
- [ ] 19-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 13 → 14 → 15 → 16 → 17 → 18 → 19

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 12. Auth Foundation | v1.0 | 3/3 | Complete | 2026-02-26 |
| 13. Foundation Merge | v2.0 | 0/2 | Not started | - |
| 14. Database & Auth Bridge | v2.0 | 0/2 | Not started | - |
| 15. Payment Integration | v2.0 | 0/2 | Not started | - |
| 16. Onboarding Integration | v2.0 | 0/2 | Not started | - |
| 17. Dashboard & Container Management | v2.0 | 0/2 | Not started | - |
| 18. Styling & Branding | v2.0 | 0/1 | Not started | - |
| 19. Production Cutover | v2.0 | 0/1 | Not started | - |
