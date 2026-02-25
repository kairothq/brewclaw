# Requirements: BrewClaw v2.0 Unified Product

**Defined:** 2026-02-26
**Core Value:** Deploy your personal AI assistant in the time it takes to brew a coffee

## v2.0 Requirements

Requirements for merging 2openclaw into brewclaw as a unified product.

### Foundation

- [ ] **FOUND-01**: Codebase uses route groups for organization: (marketing) for landing, (product) for dashboard/onboarding, (auth) for authentication
- [ ] **FOUND-02**: All dependencies are consolidated into single package.json with resolved version conflicts
- [ ] **FOUND-03**: Environment variables are merged into single .env.local (15 vars: auth, database, Razorpay, GCP)
- [ ] **FOUND-04**: Framework upgrades complete (Next.js 16, React 19, Tailwind v4, NextAuth v5)

### Authentication

- [ ] **AUTH-01**: User can sign up with Google OAuth on brewclaw.com
- [ ] **AUTH-02**: User can sign up with email magic link on brewclaw.com
- [ ] **AUTH-03**: User session persists across browser refresh using NextAuth JWT strategy
- [ ] **AUTH-04**: User ID from NextAuth maps to GCP container system (bridge layer)
- [ ] **AUTH-05**: Middleware routes authenticated users correctly (landing → public, dashboard → protected)
- [ ] **AUTH-06**: Webhook routes bypass auth middleware for Razorpay callbacks

### Onboarding

- [ ] **ONBD-01**: User lands on pricing/plan selection as first step (from landing page CTA)
- [ ] **ONBD-02**: User can choose messaging platform (Telegram, WhatsApp placeholder) with video popup tutorial
- [ ] **ONBD-03**: User can choose AI provider (Gemini, OpenAI, Anthropic) with provider-specific options
- [ ] **ONBD-04**: User can provide own API key (BYOK) for chosen AI provider
- [ ] **ONBD-05**: User can select "Get AI by us" to skip API key step and use brewclaw credits
- [ ] **ONBD-06**: User can view API key setup instructions via redirect link (like Anthropic console)
- [ ] **ONBD-07**: User completes payment via Razorpay after plan selection
- [ ] **ONBD-08**: User's Telegram bot is provisioned after successful payment

### Payments

- [ ] **PAY-01**: User can create Razorpay subscription for chosen plan (Starter/Pro/Business)
- [ ] **PAY-02**: Payment signature is verified with timing-safe comparison (security requirement)
- [ ] **PAY-03**: Container provisioning happens only after payment verification (not before)
- [ ] **PAY-04**: Razorpay webhooks update subscription status (active, past_due, cancelled)
- [ ] **PAY-05**: User subscription data is stored in Prisma database (linked to NextAuth user)

### Dashboard

- [ ] **DASH-01**: User can view their OpenClaw instance status (running, stopped, error)
- [ ] **DASH-02**: User can start/stop/restart their container instance
- [ ] **DASH-03**: User can view container logs
- [ ] **DASH-04**: User can view subscription details (plan, next billing, status)
- [ ] **DASH-05**: User can access settings to update API key or AI provider
- [ ] **DASH-06**: Dashboard follows dark theme design from v0 template

### Infrastructure

- [ ] **INFRA-01**: Vercel frontend proxies container management requests to GCP VM
- [ ] **INFRA-02**: GCP API authentication uses X-API-Key header (existing pattern)
- [ ] **INFRA-03**: Prisma database extended with Subscription and Instance models
- [ ] **INFRA-04**: Single domain deployment at brewclaw.com

### Branding

- [ ] **BRAND-01**: All 2openclaw references renamed to brewclaw
- [ ] **BRAND-02**: 301 redirects from 2openclaw.vercel.app to brewclaw.com
- [ ] **BRAND-03**: Consistent dark theme styling across landing, auth, onboarding, dashboard

## v2.1 Requirements (Future)

Deferred to next milestone.

### Advanced Features

- **ADV-01**: WhatsApp integration (currently placeholder)
- **ADV-02**: Multi-agent support (Ultra tier)
- **ADV-03**: Full JSON→Prisma migration on GCP VM
- **ADV-04**: Usage analytics and metrics dashboard
- **ADV-05**: Plan upgrade/downgrade flow

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile app | Web-first approach, defer to v3+ |
| Real-time chat | Not core to deployment platform |
| Telegram auth (login via Telegram) | Using Google/Email auth instead |
| Multiple bots per user | Single bot per account for v2, multi-agent in Ultra tier later |
| Custom domain for bots | Infrastructure complexity, defer |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| — | — | (populated during roadmap creation) |

**Coverage:**
- v2.0 requirements: 27 total
- Mapped to phases: 0
- Unmapped: 27

---
*Requirements defined: 2026-02-26*
*Last updated: 2026-02-26 after initial definition*
