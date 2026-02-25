# BrewClaw

## What This Is

BrewClaw is a managed Telegram bot hosting platform that lets non-technical users deploy their own AI-powered personal assistant in under 60 seconds. Users sign up, connect their Telegram, choose an AI provider, and get a running bot without touching servers, SSH, or Docker.

## Core Value

**Deploy your personal AI assistant in the time it takes to brew a coffee** — Users can go from signup to a working Telegram AI bot in under 60 seconds, with zero technical knowledge required.

## Current Milestone: v2.0 Unified Product

**Goal:** Merge 2openclaw product code into brewclaw landing page to create a unified platform at brewclaw.com

**Target features:**
- Google OAuth + Email magic link authentication (from Phase 12)
- Onboarding flow: Telegram → AI Provider → API Key/Credits → Plan → Payment
- Razorpay payment integration
- Dashboard for managing OpenClaw agent instances
- Single domain deployment (brewclaw.com)

## Requirements

### Validated (v1.0 - shipped)

- ✓ Landing page with marketing sections — brewclaw.vercel.app
- ✓ 2openclaw product backend (GCP VM + Docker) — 2openclaw.vercel.app
- ✓ Onboarding flow (6 steps) — 2openclaw
- ✓ Razorpay subscriptions + webhooks — 2openclaw
- ✓ Container management API — 2openclaw
- ✓ Auth foundation (NextAuth, Prisma, Google OAuth, magic link) — Phase 12
- ✓ Dark theme signin UI (v0 template) — Quick task 1

### Active (v2.0 - building)

- [ ] Merge 2openclaw code into brewclaw repo
- [ ] Unified authentication with Google/Email
- [ ] Integrated onboarding flow after auth
- [ ] Payment flow with Razorpay
- [ ] Dashboard with instance management
- [ ] Rebrand 2openclaw → brewclaw throughout
- [ ] Single domain deployment

### Out of Scope

- WhatsApp integration — Future milestone, Telegram-first for v2
- Mobile app — Web-first approach
- Real-time chat — Not core to deployment platform
- Multi-agent support — Ultra tier feature, defer to v2.1

## Context

**Architecture:**
- Frontend: Next.js on Vercel (brewclaw.com)
- Backend: Express.js on GCP VM (container orchestration)
- Payments: Razorpay (keys on Vercel, not GCP)
- Database: User data in JSON files on GCP VM

**Source Codebases:**
- `brewclaw/Github/` — Landing page code (local, needs push)
- `/Users/divykairoth/Openclaw/2openclaw` — Product code (kairothq/2openclaw)
- Current directory — Phase 12 auth work

**Pricing Tiers:**
| Tier | Price | Resources |
|------|-------|-----------|
| Starter | ₹199/mo | 1.5GB RAM |
| Pro | ₹499/mo | 3GB RAM |
| Business | ₹1,499/mo | 4GB RAM |

## Constraints

- **Single domain**: brewclaw.com only (no subdomains)
- **Keep GCP VM**: Container orchestration stays on GCP, Vercel proxies
- **Razorpay**: Existing integration must be preserved
- **Docker containers**: One per user bot (existing architecture)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use brewclaw as base repo | More recent landing page, easier to add product code | — Pending |
| Google OAuth + Email auth | Modern auth, no Telegram dependency for login | — Pending |
| Keep GCP VM architecture | Proven, working, no reason to migrate | — Pending |
| Single domain (no subdomain) | User preference, simpler | — Pending |

---
*Last updated: 2026-02-26 after v2.0 milestone start*
