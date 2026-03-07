# Project State

## Current Position

**Milestone:** v2.0 Unified Product
**Phase:** Pre-13 (Design-First UI Complete)
**Plan:** Design Review → Foundation Merge
**Status:** UI copied from 2openclaw, awaiting review
**Last activity:** 2026-02-27 — Copied 2openclaw code, applied brewclaw styling

**Progress:**
```
[====                ] 20% (Design UI done, Phase 13-19 pending)
```

## What Just Happened (2026-02-27)

**Design-First Approach:** Instead of GSD phases, user opted to:
1. Copy working 2openclaw UI to brewclaw
2. Apply brewclaw branding (zinc colors, orange accent)
3. Review designs before backend integration

**Files Created:**
```
app/(product)/
├── onboard/page.tsx           # 8-step wizard (from 2openclaw)
└── dashboard/
    ├── layout.tsx             # Sidebar + TopBar
    ├── page.tsx               # Main dashboard
    ├── settings/page.tsx      # Profile & API keys
    └── billing/page.tsx       # Subscription plans

components/dashboard/
├── Sidebar.tsx, TopBar.tsx, WelcomeSection.tsx
├── MetricsGrid.tsx, ModelSelector.tsx, LiveActivity.tsx
└── EmptyDashboard.tsx
```

**Two Onboarding Files Exist:**
| Route | File | Auth Method |
|-------|------|-------------|
| `/onboarding` | `app/(auth)/onboarding/page.tsx` | NextAuth session |
| `/onboard` | `app/(product)/onboard/page.tsx` | localStorage |

**Next Step:** Merge these - wire the 2openclaw wizard to NextAuth

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-26)

**Core value:** Deploy your personal AI assistant in the time it takes to brew a coffee
**Current focus:** v2.0 Unified Product — Merge 2openclaw into brewclaw

## Roadmap Summary

**v2.0 Phases (13-19):**
- Phase 13: Foundation Merge — Route groups, dependencies, framework upgrades
- Phase 14: Database & Auth Bridge — Prisma schema extension, NextAuth-GCP mapping
- Phase 15: Payment Integration — Razorpay routes, webhooks, server-side flow
- Phase 16: Onboarding Integration — 6-step wizard with plan → platform → AI → payment
- Phase 17: Dashboard & Container Management — Instance controls, GCP proxy routes
- Phase 18: Styling & Branding — Dark theme unification, 2openclaw→brewclaw rebrand
- Phase 19: Production Cutover — Environment setup, data migration, deployment

**Dependencies:**
- Phase 14 depends on Phase 13 (auth bridge needs consolidated codebase)
- Phase 15 depends on Phase 14 (payment needs auth sessions)
- Phase 16 depends on Phase 15 (onboarding completes with payment)
- Phase 17 depends on Phase 16 (dashboard assumes user has container)
- Phase 18 depends on Phase 17 (styling polish after features work)
- Phase 19 depends on Phase 18 (deployment after rebrand complete)

## Accumulated Context

### From v1.0 (Phase 12)

**Decisions:**
- Used JWT session strategy for serverless compatibility
- Used Prisma v7 with pg adapter for direct PostgreSQL connection
- Configured newUser page redirect to /onboarding for first-time users
- Set custom signin page to /signin for branded auth experience
- Used server actions for form handling over API routes for simpler code
- Implemented client-side rate limiting (60s) for magic link spam prevention
- Created custom UI components instead of shadcn/ui for minimal dependencies
- Used oklch color space for dark theme with semantic tokens

**Completed Work:**
- Phase 12: Auth foundation (NextAuth + Prisma + Google OAuth + Resend)
- Quick Task 1: Dark theme signin UI from v0 template

### From 2openclaw (to be merged)

**Decisions:**
- BYOK model — users provide own API keys
- Razorpay for payments (keys on Vercel only)
- GCP VM for container orchestration
- User data in JSON files at /opt/2openclaw/data/users/
- Timing-safe signature verification for payments
- Payment-first provisioning (fraud prevention)

**Security Patterns to Preserve:**
- Payment signature verification with timing-safe comparison (crypto.timingSafeEqual)
- PII sanitization in logs (GDPR compliance)
- Rate limiting for subscription creation (5 req/hr) — migrate to Vercel KV
- No container creation before Razorpay payment verified

### v2.0 Research Insights

**Critical Integration Points:**
- Auth bridge: NextAuth user.id → GCP userId mapping (store in Prisma User.gcpUserId)
- Payment → Provisioning: Razorpay verify route triggers GCP /provision with NextAuth user ID
- Dashboard data fetch: Query Prisma → get gcpUserId → query GCP API for container status
- Middleware stratification: /api/webhooks skip auth, /api/subscriptions rate limit + auth, default NextAuth

**Framework Migrations:**
- Next.js 14→16: Automated codemods for async params (2-3 days)
- React 18→19: Codemods for forwardRef, defaultProps (1 day)
- NextAuth v4→v5: Manual auth() migration, session rewrite (2 days)
- Tailwind v3→v4: Automated @tailwindcss/upgrade tool (1 day)
- JSON→Prisma: Schema + migration script (1 day, lazy migration post-launch)

**Known Gaps to Address:**
- User ID format validation (hex odinseid vs CUID) — test in Phase 14
- Rate limiting migration (in-memory → Vercel KV) — implement in Phase 15
- GCP API Prisma migration (RAM/CPU constraints) — test in Phase 14
- Email provider decision (Resend vs Razorpay built-in) — decide in Phase 13
- Existing 2openclaw users migration plan — audit in Phase 19

## Session Continuity

**Next steps:**
1. **Review designs** at http://localhost:3000/onboard and /dashboard
2. **Approve or request changes** to the UI
3. **Proceed with Foundation Merge (Phase 13):**
   - Wire 2openclaw wizard to NextAuth (replace localStorage)
   - Set up route groups: (marketing), (product), (auth)
   - Merge environment variables
   - Update middleware for product routes

**Test URLs:**
- `/onboard` — Full 8-step wizard (UI only, API calls 404)
- `/onboarding` — Auth-connected placeholder (redirects to /signin)
- `/signin` — Auth page with Google OAuth + magic link
- `/dashboard` — Dashboard with empty state

**Handoff notes:**
- Design-first approach bypassed GSD for UI work
- 2openclaw code copied and rebranded (storage key: `brewclaw_instance`)
- UI is functional but NOT wired to NextAuth or backend APIs
- Phase 13 will merge auth: NextAuth session → wizard state
- Research complete with HIGH confidence (7-phase structure validated)

## Blockers

- (none)

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 12-signup-step | 01 | 15min | 3 | 9 |
| 12-signup-step | 02 | 1min | 2 | 7 |
| 12-signup-step | 03 | 5min | 3 | 8 |
| Quick-01 | — | 5min | 3 | 8 |

**Totals:**
- Phases completed: 1 (Phase 12)
- Plans executed: 4 (3 phase plans + 1 quick task)
- Total execution time: 26 minutes
- Files modified: 32
