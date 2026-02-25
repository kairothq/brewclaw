# Project State

## Current Position

**Milestone:** v2.0 Unified Product
**Phase:** 13 - Foundation Merge
**Plan:** —
**Status:** Not started
**Last activity:** 2026-02-26 — Roadmap created for v2.0

**Progress:**
```
[                    ] 0% (Phase 13/19)
```

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
1. Run `/gsd:plan-phase 13` to break down Foundation Merge phase
2. Address email provider decision (Resend vs Razorpay built-in)
3. Inventory environment variables from both codebases
4. Plan route group structure ((marketing)/, (product)/, (auth)/)

**Handoff notes:**
- Research complete with HIGH confidence (7-phase structure validated)
- All 36 v2.0 requirements mapped to phases (100% coverage)
- Phase dependencies follow critical path: Auth → Payment → Onboarding → Dashboard
- Plan-phase should flag Phase 17 (GCP Proxy) and Phase 19 (Data Migration) for validation during planning

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
