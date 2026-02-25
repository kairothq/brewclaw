# Project Research Summary

**Project:** brewclaw (Merging 2openclaw product into brewclaw landing)
**Domain:** Next.js codebase merge - Unified Telegram bot hosting platform
**Researched:** 2026-02-26
**Confidence:** HIGH

## Executive Summary

This is a **codebase merger**, not a greenfield build. The goal is to merge 2openclaw's production-ready product features (onboarding, payment, dashboard, container orchestration) into brewclaw's modern landing page repository. The recommended approach is to use brewclaw's Next.js 16.1.6 + NextAuth v5 + Prisma stack as the foundation, then migrate 2openclaw's features by upgrading from Next.js 14 + NextAuth v4 + JSON file storage to match brewclaw's architecture.

**Critical decision: Single app, not monorepo.** Both codebases are Next.js with similar architectures. A unified app at brewclaw.com is simpler than monorepo tooling (Turborepo/pnpm workspaces), which adds overhead without benefit for a single deployment. The merge involves framework upgrades (Next.js 14→16, React 18→19, NextAuth v4→v5, Tailwind v3→v4) and architectural migration (JSON files→Prisma, Telegram auth→NextAuth). Most upgrades have automated codemods (7-9 day migration timeline).

**Key risk: Authentication bridge complexity.** 2openclaw uses Telegram Login Widget with localStorage user data, while brewclaw uses NextAuth v5 with database sessions. The payment flow (Razorpay) and container provisioning are tightly coupled to Telegram user IDs. Mitigation: Make NextAuth primary, create user ID mapping layer between Prisma (NextAuth users) and GCP VM (container instances), migrate payment flow to server-side session handling.

## Key Findings

### Recommended Stack

brewclaw's existing stack (Next.js 16, NextAuth v5, Prisma, Tailwind v4) is production-ready and modern. 2openclaw's features will be migrated to this stack rather than downgrading. The only net-new dependencies are razorpay (payment) and framer-motion (animations) — all UI components already exist via shadcn/ui in brewclaw.

**Core technologies:**
- **Next.js 16.1.6** (App Router): Unified routing for marketing + product — 2openclaw migrates from v14 (async params, caching changes)
- **NextAuth v5**: Primary auth replacing Telegram widget — Complete rewrite from v4, requires auth code migration
- **Prisma 7.4.1 + PostgreSQL**: Replaces JSON file storage — Extends existing brewclaw schema with Container + Subscription models
- **Razorpay 2.9.4**: Payment processing (from 2openclaw) — Preserve exact integration, update data layer from localStorage to Prisma
- **Tailwind CSS v4**: Design system (brewclaw base) — 2openclaw UI components migrate from v3 using automated upgrade tool
- **GCP VM Express API**: Container orchestration (unchanged) — Keep existing Docker management, migrate from JSON to Prisma backend

**Critical migrations:**
- Next.js 14→16: 2-3 days (automated codemods for async params)
- React 18→19: 1 day (codemods for forwardRef, defaultProps)
- NextAuth v4→v5: 2 days (manual auth() migration, session rewrite)
- Tailwind v3→v4: 1 day (automated @tailwindcss/upgrade tool)
- JSON→Prisma: 1 day schema + migration script (lazy migration post-launch)

### Expected Features

All 2openclaw features are table stakes — the product already exists and works. This is feature preservation, not feature discovery.

**Must have (table stakes):**
- **Landing page** — Merge 2openclaw marketing content into brewclaw structure (LOW complexity: static content)
- **Authentication** — Replace Telegram widget with NextAuth Google OAuth + email magic link (HIGH complexity: user ID mapping)
- **6-step onboarding** — Bot creation, token validation, AI provider, plan selection, payment (HIGH complexity: session integration)
- **Razorpay payment** — Payment-first provisioning with webhook verification (LOW complexity: copy working code)
- **Container provisioning** — GCP API calls after payment verified (NONE: existing backend unchanged)
- **Dashboard** — Instance controls (start/stop/restart), metrics, billing (MEDIUM complexity: port components + integrate sessions)
- **Route protection** — Middleware protecting /onboarding, /dashboard (LOW complexity: extend existing)

**Security patterns (preserve from 2openclaw):**
- Payment signature verification (timing-safe comparison) — CRITICAL security pattern, do not modify
- PII sanitization in logs (GDPR compliance) — Port logger.ts with redaction logic
- Rate limiting (5 req/hr for subscriptions) — Migrate to Vercel KV (2openclaw uses in-memory, incompatible with serverless)
- Payment-first provisioning (fraud prevention) — No container creation before Razorpay payment verified

**Defer to v2.1+:**
- Multi-agent support (Ultra tier feature)
- WhatsApp integration (Telegram-first for v2.0)
- Real-time chat UI (users chat in Telegram app)
- Custom email notifications (use Razorpay built-in)

### Architecture Approach

The merged architecture uses **route groups** for organization ((marketing)/, (product)/, (auth)/), **Prisma schema extension** for product data (Container, Subscription models), and **API route proxying** from Vercel to GCP VM for container management. The data flow separates concerns: Vercel handles auth + payments + UI, GCP handles Docker orchestration.

**Major components:**
1. **NextAuth v5 integration** — Unified auth layer replacing Telegram widget, database sessions instead of JWT, Google OAuth + email magic link providers
2. **Razorpay payment service** — Server-side subscription creation/verification (lib/razorpay.ts), webhook handling (/api/webhooks/razorpay), signature verification with timing-safe comparison
3. **Onboarding flow** — 6-step wizard (bot creation → AI provider → payment), NextAuth session pre-fill (skip email step), sessionStorage for payment callback state
4. **Dashboard + container API** — GCP proxy routes (/api/containers/[userId]/start|stop|restart), session validation before forwarding, real-time status polling (no WebSocket, serverless limitation)
5. **Prisma data layer** — Two-database architecture: Prisma (Vercel Postgres) for auth + subscription metadata, GCP JSON files (short-term) migrating to Prisma (long-term)

**Critical integration points:**
- **Auth bridge**: NextAuth user.id → GCP userId mapping (store in Prisma User.gcpUserId field)
- **Payment → Provisioning**: Razorpay verify route triggers GCP /provision with NextAuth user ID
- **Dashboard data fetch**: Query Prisma for user → get gcpUserId → query GCP API for container status
- **Middleware stratification**: Path-based branching (/api/webhooks skip auth, /api/subscriptions rate limit + auth, default NextAuth check)

**File structure (merged):**
```
app/
├── (marketing)/        # Landing pages (SSG)
├── (product)/          # Dashboard, onboarding (protected)
├── (auth)/             # Sign-in (existing brewclaw)
└── api/
    ├── auth/           # NextAuth v5
    ├── subscriptions/  # Razorpay (from 2openclaw)
    ├── webhooks/       # Razorpay webhooks
    └── containers/     # GCP proxy routes
```

### Critical Pitfalls

These are show-stoppers that will derail the merge if not addressed early.

1. **Dual Authentication Collision** — 2openclaw uses Telegram widget (non-OAuth, localStorage), brewclaw uses NextAuth v5 (JWT sessions, database). **Mitigation:** Choose NextAuth as primary, create Prisma schema extension with telegramId field (optional), migrate 2openclaw's user data with import script mapping odinseid → NextAuth user.id. **Phase impact:** Phase 2 blocker, must resolve before payment integration.

2. **Razorpay + Session Integration** — Payment flow expects localStorage user data (`userData.odinseid`), but NextAuth sessions use HttpOnly cookies (not accessible to client JS). **Mitigation:** Move subscription creation to server-side API route, pass session internally, update GCP provisioning to accept NextAuth user.id format. **Phase impact:** Phase 3 blocker, prevents payment from working.

3. **Middleware Execution Order Chaos** — Single middleware.ts must handle NextAuth redirects, rate limiting, and webhook bypass. Wrong order = Razorpay webhooks blocked (401) or rate limiting bypassed. **Mitigation:** Stratified middleware with early path branching: webhooks skip auth, subscriptions get rate limit + auth, default NextAuth. Explicitly exclude /api/webhooks from middleware matcher. **Phase impact:** Phase 2 parallel work, needed before any protected routes work.

4. **Database Schema Mismatch (Prisma vs JSON)** — 2openclaw stores user data in `/opt/2openclaw/data/users/{userId}.json` on GCP VM, brewclaw uses Prisma PostgreSQL. No referential integrity between systems. **Mitigation:** Hybrid storage during transition (NextAuth in Prisma, containers stay in JSON initially), add gcpUserId field to Prisma User model, lazy migration script to import JSON → Prisma post-launch. **Phase impact:** Phase 4, can defer initial JSON→Prisma migration to v2.1 if needed.

5. **Webhook Signature Verification Regression** — 2openclaw uses timing-safe comparison (`crypto.timingSafeEqual()`), critical for security. Risk: Developers simplify to `signature === expected` during refactor, introducing timing attack vulnerability. **Mitigation:** Copy lib/razorpay.ts exactly as-is, add code review checklist for signature verification, never re-serialize JSON before hashing (use raw request body). **Phase impact:** Phase 3 security-critical, code review required.

**Additional pitfalls:**
- **Environment variable namespace collision** (NEXTAUTH_URL, GCP_API_URL naming) — Audit before deploy, use prefixes
- **GCP VM proxy timeout** (Vercel 10s/60s timeout) — Container operations return immediately, poll status separately
- **localStorage security migration** — XSS risk, migrate sensitive data (botToken, aiApiKey) to Prisma with encryption
- **Rebranding incompleteness** (2openclaw→brewclaw) — Update Google OAuth consent screen, Razorpay webhook URL, Docker image names, 301 redirects

## Implications for Roadmap

Based on research, the merge has a **critical path dependency chain**: Auth bridge → Payment integration → Onboarding → Dashboard. Each phase builds on the previous. The architecture research identified 7 build phases with 7-9 day total timeline.

### Suggested Phase Structure

**Phase 1: Foundation Merge (1-2 days)**
**Rationale:** Set up unified repo structure without breaking existing brewclaw functionality. No backend changes yet.
**Delivers:** Merged landing page (2openclaw content + brewclaw structure), consolidated package.json (unified dependencies), route groups created ((marketing)/, (product)/, (auth)/).
**Addresses:** Landing page merge (table stakes), dependency consolidation (pitfall mitigation).
**Avoids:** Duplicate dependency conflicts (Pitfall 11).
**Research flag:** Standard Next.js patterns, no deep research needed.

**Phase 2: Database & Auth Bridge (2-3 days)**
**Rationale:** Must resolve authentication incompatibility before touching payment or onboarding. Extends Prisma schema for product data.
**Delivers:** Prisma schema extended (Container, Subscription models), migration script created (JSON→Prisma import), middleware consolidated (NextAuth + webhook bypass + rate limiting), GCP API updated to read Prisma (with JSON fallback).
**Addresses:** Auth system bridge (critical pitfall #1), middleware chaos (critical pitfall #3), session migration from localStorage.
**Avoids:** Dual authentication collision, middleware execution order issues.
**Research flag:** NextAuth v5 migration well-documented, Prisma patterns standard. Skip phase-specific research.

**Phase 3: Payment Integration (2-3 days)**
**Rationale:** Razorpay is blocking dependency for onboarding (step 6 is payment). Security-critical code (signature verification).
**Delivers:** Razorpay service copied (lib/razorpay.ts), subscription API routes migrated (/api/subscriptions/create, verify), webhook handler ported (/api/webhooks/razorpay), server-side subscription creation (NextAuth session-based), payment-first provisioning tested.
**Addresses:** Payment integration (table stakes), security pattern preservation (timing-safe verification).
**Avoids:** Razorpay + session integration mismatch (critical pitfall #2), webhook signature regression (critical pitfall #5).
**Research flag:** 2openclaw implementation is production-tested. Copy exactly, minimal research.

**Phase 4: Onboarding Integration (1-2 days)**
**Rationale:** Onboarding depends on auth (Phase 2) and payment (Phase 3). Connects signup flow to container provisioning.
**Delivers:** Onboarding UI ported (6-step wizard from 2openclaw), email step removed (NextAuth pre-fill), bot token/AI provider stored in Prisma, payment flow integrated (step 6 → Razorpay from Phase 3), container provisioning triggered on payment success.
**Addresses:** 6-step onboarding (table stakes), user ID mapping (auth bridge implementation).
**Avoids:** Onboarding flow duplication (Pitfall 12).
**Research flag:** UI component porting, standard patterns. No deep research.

**Phase 5: Dashboard & Container Management (2-3 days)**
**Rationale:** Final user-facing feature. Depends on auth (session validation) and data layer (Prisma Container records).
**Delivers:** Dashboard components ported (from 2openclaw), GCP proxy routes created (/api/containers/[userId]/start|stop|restart|logs|stats), session validation in API routes (prevent cross-user access), instance data fetching (Prisma → GCP status), subscription management UI (upgrade/cancel/billing history).
**Addresses:** Dashboard controls (table stakes), route protection (extend middleware).
**Avoids:** Dashboard layout conflicts (Pitfall 13), GCP proxy timeout issues (Pitfall 9).
**Research flag:** Vercel proxy patterns well-documented. Possible research if timeout issues arise.

**Phase 6: Styling & Rebranding (1-2 days)**
**Rationale:** After features work, unify design and complete rebrand. Non-blocking for functionality.
**Delivers:** Global styles merged (Tailwind v4 unified), UI components consolidated (shadcn/ui from both repos), 2openclaw→brewclaw find-replace (OAuth consent screen, Razorpay plan names, Docker images), 301 redirects configured (2openclaw.vercel.app → brewclaw.com), responsive design tested.
**Addresses:** Design system unification, SEO migration.
**Avoids:** Rebranding incompleteness (Pitfall 8), favicon/asset conflicts (Pitfall 16).
**Research flag:** Standard frontend patterns. No research needed.

**Phase 7: Production Cutover (1 day)**
**Rationale:** Deploy unified app, migrate production data, monitor for issues.
**Delivers:** Environment variables configured on Vercel (Razorpay keys, GCP secrets, DATABASE_URL), Prisma migrations applied to production DB, JSON→Prisma migration script executed on GCP VM, Vercel deployment to brewclaw.com, DNS updated, 2openclaw.vercel.app redirects configured, monitoring dashboard set up.
**Addresses:** Data migration (Prisma vs JSON resolution), environment consolidation.
**Avoids:** Environment variable collision (Pitfall 3), production-only failures.
**Research flag:** Standard deployment. Checklist-driven, no research.

### Phase Ordering Rationale

- **Auth before payment:** Payment flow requires session-based user identification. NextAuth must work first.
- **Payment before onboarding:** Onboarding's final step is payment. Can't complete onboarding without payment integration.
- **Onboarding before dashboard:** Dashboard assumes user has completed onboarding (container provisioned). Flow is signup → onboard → dashboard.
- **Features before styling:** Styling is non-blocking. Get core features working, then polish UI.
- **Production cutover last:** All features tested in preview deployments before touching production data.

**Parallelization opportunities:**
- Phase 2 (Prisma schema) + Phase 1 (landing page merge) can partially overlap (different files).
- Phase 6 (styling) can start while Phase 5 (dashboard) is in testing.

**Critical path:** Phase 2 → Phase 3 → Phase 4 → Phase 5 (sequential dependencies).

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 5 (GCP Proxy):** If Vercel timeout issues occur (container operations >10s), may need research on async patterns, Cloud Run migration, or alternative architectures. Medium likelihood.
- **Phase 7 (Data Migration):** If JSON→Prisma migration script fails on production data (encoding issues, schema mismatches), may need research on data repair strategies. Low likelihood (can test with backup data first).

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Next.js route groups, package.json merging — well-documented.
- **Phase 2 (Auth):** NextAuth v5 migration guide is comprehensive, Prisma patterns established.
- **Phase 3 (Payment):** Copying working 2openclaw code, Razorpay docs are detailed.
- **Phase 4 (Onboarding):** UI component porting, session integration already researched.
- **Phase 6 (Styling):** Tailwind migration automated, design system patterns standard.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Both codebases reviewed, migration paths verified with official docs (Next.js, React, NextAuth, Tailwind upgrade guides). Automated codemods available for all framework upgrades. |
| **Features** | HIGH | 2openclaw is production app with working features. This is feature preservation, not discovery. Integration complexity mapped (auth bridge is only HIGH complexity item). |
| **Architecture** | HIGH | Clear separation of concerns (Vercel = auth/payments/UI, GCP = containers). Prisma schema extension straightforward. Proxy pattern well-documented. Two-database architecture (Prisma + JSON fallback) de-risks migration. |
| **Pitfalls** | HIGH | 10 critical pitfalls identified with specific mitigations. Auth collision (Pitfall #1) and payment session mismatch (Pitfall #2) are highest risk, both have clear mitigation paths (Prisma schema extension + server-side payment). |

**Overall confidence: HIGH**

The research covered both codebases in detail, verified framework migration paths with official sources, and identified specific integration challenges with concrete solutions. The 7-phase roadmap structure follows natural dependency order (auth → payment → onboarding → dashboard). Estimated timeline (7-9 days) is realistic given automated codemods for framework upgrades and straightforward component porting.

### Gaps to Address

**User ID mapping validation:**
- **Gap:** 2openclaw uses hex-based `odinseid` (e.g., `e580c03e93c6e12e`), NextAuth uses CUID (e.g., `clx1y2z3`). Need to verify GCP API accepts arbitrary user ID format or requires specific structure.
- **Resolution:** During Phase 2, test GCP /provision endpoint with NextAuth CUID. If GCP validates ID format, add ID transformation layer. If GCP stores opaquely, use CUID directly.

**Rate limiting migration:**
- **Gap:** 2openclaw uses in-memory rate limiting (5 req/hr), incompatible with Vercel serverless (no shared state). Research identified Vercel KV (Redis) as solution but didn't verify implementation.
- **Resolution:** During Phase 3 planning, add task to implement @vercel/edge-rate-limit with Vercel KV. Fallback: Skip rate limiting for v2.0, add in v2.1 (low abuse risk with payment-first provisioning).

**GCP API Prisma migration:**
- **Gap:** Research assumed GCP Express API can be updated to use Prisma, but didn't verify GCP VM has sufficient resources (RAM, CPU) for Prisma Client.
- **Resolution:** During Phase 2, SSH to GCP VM, install Prisma Client, test memory usage. If constrained, use hybrid approach (Vercel writes to Prisma, GCP reads from Prisma with aggressive caching).

**Email provider decision:**
- **Gap:** brewclaw has AUTH_RESEND_KEY (not yet configured), 2openclaw uses Razorpay built-in emails. Unclear if custom emails (Resend) should be set up or defer to Razorpay.
- **Resolution:** Discuss with team during Phase 1. Recommendation: Use Razorpay built-in emails for v2.0 (simpler), defer Resend setup to v2.1 for marketing emails.

**Existing 2openclaw users:**
- **Gap:** If 2openclaw has production users, need migration plan for their data + communication strategy.
- **Resolution:** Audit 2openclaw production data during Phase 7 planning. If users exist: (1) Run JSON→Prisma migration script, (2) Send email notification about rebranding, (3) Force re-login (NextAuth session cookie change). If no users, skip.

## Sources

### Primary (HIGH confidence)

**Official Documentation:**
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — Async params, caching changes
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) — forwardRef, defaultProps removal
- [NextAuth v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5) — auth() method, session handling
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — @theme directive, CSS-first config
- [Prisma with Next.js Guide](https://www.prisma.io/docs/guides/nextjs) — Connection pooling, singleton pattern
- [Razorpay Webhook Documentation](https://razorpay.com/docs/webhooks/validate-test/) — Signature verification

**Codebase Context:**
- brewclaw codebase — lib/auth.ts (NextAuth v5), middleware.ts (route protection), prisma/schema.prisma
- 2openclaw CONTEXT.md — Security measures (timing-safe verification, PII sanitization), architecture (GCP VM), known issues (localStorage security)

### Secondary (MEDIUM confidence)

**Migration Case Studies:**
- [Migrating a Large-Scale Monorepo from Next.js 14 to 16](https://dev.to/abhilashlr/migrating-a-large-scale-monorepo-from-nextjs-14-to-16-a-real-world-journey-5383) — Async params migration, codemod experience
- [Next.js Session Management: NextAuth Persistence Issues](https://clerk.com/articles/nextjs-session-management-solving-nextauth-persistence-issues) — Session vs localStorage patterns
- [Razorpay Float Precision Issue](https://medium.com/@gsharmaji93/razorpay-webhook-signature-mismatch-float-precision-issue-71003831efc2) — Webhook signature failure from JSON re-serialization

**Architecture Patterns:**
- [Next.js Multi-Zones Guide](https://nextjs.org/docs/app/guides/multi-zones) — Route group organization
- [Feature-Sliced Design for Next.js](https://feature-sliced.design/blog/nextjs-app-router-guide) — Component boundaries
- [Prisma ORM Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs) — Connection pooling, singleton client

### Tertiary (LOW confidence, needs validation)

- [Razorpay Next.js Integration](https://nesin.io/blog/integrate-razorpay-with-nextjs) — General integration pattern (2openclaw implementation is preferred source)
- [Next.js 16 Proxy Architecture](https://learnwebcraft.com/learn/nextjs/nextjs-16-proxy-ts-changes-everything) — Proxy patterns (verify with testing)

---
**Research completed:** 2026-02-26
**Ready for roadmap:** Yes

**Next steps for orchestrator:**
1. Load SUMMARY.md as context for roadmap creation
2. Use suggested 7-phase structure as starting point
3. Flag Phase 5 (GCP Proxy) and Phase 7 (Data Migration) for validation during planning
4. Address gaps (user ID format, rate limiting, email provider) with team decisions before detailed planning
