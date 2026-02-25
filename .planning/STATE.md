# Project State

## Current Position

**Phase:** Not started (defining requirements)
**Plan:** —
**Status:** Defining requirements
**Last activity:** 2026-02-26 — Milestone v2.0 started

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-26)

**Core value:** Deploy your personal AI assistant in the time it takes to brew a coffee
**Current focus:** v2.0 Unified Product — Merge 2openclaw into brewclaw

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

## Blockers

- (none)

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 12-signup-step | 01 | 15min | 3 | 9 |
| 12-signup-step | 02 | 1min | 2 | 7 |
| Quick-01 | — | 5min | 3 | 8 |
