# Brewclaw Checkpoint - March 8, 2026

## Session Summary
Fixed Vercel deployment issues, standardized CTA links, set up staging environment, and integrated fancy pricing section into onboarding flow.

---

## What Was Done

### 1. Prisma 7 Compatibility (PR #2, #3 - Merged)
- Removed deprecated `url` property from `prisma/schema.prisma`
- Updated `prisma.config.ts` to use `DATABASE_URL` env var
- Made Prisma client lazy-loading using Proxy pattern in `lib/prisma.ts`

### 2. CTA Links Standardization (PR #5 - In staging)
All CTAs now point to `/onboarding` instead of mixed `/signup` and `/onboard`:
- `components/pricing-section.tsx` - `/onboarding` and `/onboarding?plan=pro`
- `components/liquid-metal-button.tsx` - Default href changed to `/onboarding`
- `components/hero-section.tsx` - Already had `/onboarding`
- `components/final-cta.tsx` - Already had `/onboarding`
- `components/navbar.tsx` - "Get Started" buttons link to `/onboarding`
- `components/dashboard/TopBar.tsx` - Deploy button → `/onboarding`
- `components/dashboard/EmptyDashboard.tsx` - CTA → `/onboarding`
- `app/(product)/dashboard/layout.tsx` - Redirects → `/onboarding`

### 3. Conditional Navbar (PR #5 - In staging)
Created `components/conditional-navbar.tsx` that hides navbar on:
- `/onboarding`
- `/dashboard`
- `/settings`
- `/signin`
- `/signup`

Updated `app/layout.tsx` to use `ConditionalNavbar` instead of `Navbar`.

### 4. NextAuth Fixes (In staging)
File: `lib/auth.ts`
- Added `trustHost: true` for Vercel preview deployments
- Made providers conditional (only add if env vars exist)
- **Resend (magic link) now requires both `AUTH_RESEND_KEY` AND `DATABASE_URL`**
  - Magic link needs database adapter for verification tokens
  - Without DATABASE_URL, only Google OAuth is available
- Added env var validation logging

### 5. Staging Environment Setup
- Created `staging` branch
- Configured Vercel domain: `staging.brewclaw.com` → staging branch
- Added DNS CNAME record in GoDaddy: `staging` → `ba941fafe71b0179.vercel-dns-017.com`
- Added `AUTH_URL=https://staging.brewclaw.com` env var for Preview environment

### 6. Fancy Pricing Integration (Phase 15-04 - In staging)
Integrated landing page pricing design directly into onboarding flow:
- **Step 4: Choose Plan** - Fancy pricing cards with border beam animation
  - Monthly/Yearly toggle with -20% discount badge
  - 3 tiers: Free, Pro, Team
  - "Most Popular" badge on Pro card
  - Hover animations (scale + lift)
  - Mobile responsive (stacks vertically)
- **Razorpay Integration**
  - Direct checkout modal in onboarding (no redirect to /onboard)
  - Free plan: Skips payment, goes to success screen
  - Paid plans: Razorpay modal → payment → container provisioning
  - Payment cancellation handled gracefully
- **New Components**
  - `components/onboard/step-pricing.tsx` - Pricing step component
  - `app/api/subscriptions/create/route.ts` - Subscription creation API
  - `app/api/subscriptions/verify/route.ts` - Payment verification API
- **Updated Flow**
  - Progress indicator now shows 4 steps (was 3)
  - Removed StepSuccessTransition → /onboard redirect
  - Added inline success screen (Step 5)
  - Steps: Sign In → AI Provider → Telegram → **Pricing** → Success

---

## Current State

### Branches
- `master` - Production (brewclaw.com) - Has older code without CTA fixes
- `staging` - Staging (staging.brewclaw.com) - Has all fixes, ready for testing
- `fix/cta-links-and-navbar` - PR #5, contains all CTA and auth fixes

### Environment Variables in Vercel (All Environments)
```
AUTH_SECRET          ✅ Set
GOOGLE_CLIENT_ID     ✅ Set
GOOGLE_CLIENT_SECRET ✅ Set
AUTH_RESEND_KEY      ✅ Set (but disabled without DATABASE_URL)
AUTH_URL             ✅ Set for Preview (https://staging.brewclaw.com)
DATABASE_URL         ❌ NOT SET - Magic link disabled until this is added
```

### Google OAuth Redirect URIs (in Google Cloud Console)
```
http://localhost:3000/api/auth/callback/google
https://brewclaw.com/api/auth/callback/google
https://staging.brewclaw.com/api/auth/callback/google
https://brewclaw-pwz6e6hf7-divys-projects-a4af20de.vercel.app/api/auth/callback/google
```

---

## What Works
- ✅ Landing page at `/`
- ✅ All CTAs redirect to `/onboarding`
- ✅ Navbar hidden on onboarding/dashboard pages
- ✅ Staging environment at `staging.brewclaw.com`
- ✅ Google OAuth (should work after latest fix)
- ✅ 4-step onboarding flow with fancy pricing (Steps 1-5)
- ✅ Razorpay integration in onboarding flow

## What Doesn't Work Yet
- ❌ Magic link (email) sign-in - Needs `DATABASE_URL` configured
- ⏳ Google OAuth - Just pushed fix, needs testing

---

## Workflow Going Forward

### For Testing
1. Push changes to `staging` branch
2. Vercel auto-deploys to `staging.brewclaw.com`
3. Test at staging URL

### For Production
1. Get user approval first
2. Merge staging → master OR merge PR to master
3. Vercel auto-deploys to `brewclaw.com`

---

## Next Steps

1. **Test full onboarding flow** at `staging.brewclaw.com/onboarding`:
   - Google OAuth sign-in
   - AI provider selection
   - Telegram bot connection
   - **NEW: Pricing selection with Razorpay checkout**
2. **Configure Razorpay** environment variables:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay public key
   - `RAZORPAY_KEY_SECRET` - Razorpay secret key
3. **Connect backend** - Update subscription APIs to call GCP container provisioning
4. **If all working**, merge staging → master for production
5. **Set up database** (Prisma Accelerate) to enable magic link
6. **Add `DATABASE_URL`** to Vercel env vars once database is ready

---

## Key Files Modified

```
lib/auth.ts                          - Auth configuration
lib/prisma.ts                        - Lazy Prisma client
components/conditional-navbar.tsx    - NEW - Hides navbar conditionally
components/pricing-section.tsx       - CTA links
components/liquid-metal-button.tsx   - Default href
components/navbar.tsx                - Get Started links
components/dashboard/TopBar.tsx      - Deploy button link
components/dashboard/EmptyDashboard.tsx - CTA link
app/(product)/dashboard/layout.tsx   - Redirect logic
app/layout.tsx                       - Uses ConditionalNavbar
middleware.ts                        - Removed /onboarding from protected routes
.env.local.example                   - Updated with correct NextAuth v5 vars

# Phase 15-04 (Pricing Integration)
app/onboarding/page.tsx              - Added Steps 4-5, Razorpay integration
components/onboard/step-pricing.tsx  - NEW - Fancy pricing component
components/onboard/step-progress.tsx - Updated to 4 steps
lib/onboarding-store.ts              - Updated step labels
app/api/subscriptions/create/route.ts - NEW - Subscription creation
app/api/subscriptions/verify/route.ts - NEW - Payment verification
```

---

## Open PRs
- **PR #5**: `fix/cta-links-and-navbar` - All CTA fixes and conditional navbar
  - Status: Ready to merge to master after staging verification

---

## Commands Reference

```bash
# Work on staging
cd /tmp/brewclaw-cta
git checkout staging
# make changes
git add . && git commit -m "message" && git push

# Merge to production (after approval)
git checkout master
git merge staging
git push
```
