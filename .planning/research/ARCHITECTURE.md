# Architecture: Merging 2openclaw into brewclaw

**Project:** brewclaw + 2openclaw unified product
**Researched:** 2026-02-26
**Overall Confidence:** HIGH

## Executive Summary

The merge strategy consolidates two Next.js applications (brewclaw landing + 2openclaw product) into a single unified codebase at brewclaw.com. The architecture uses **route groups** for organization, **rewrites** for GCP proxying, migrates from NextAuth v4 to v5, replaces JSON file storage with Prisma/PostgreSQL, and preserves the proven Razorpay payment integration. The merged structure separates marketing (landing), product (onboarding/dashboard), and API concerns while maintaining the existing Vercel → GCP VM proxy pattern for container management.

**Critical finding:** brewclaw is already on Next.js 16.1.6 with NextAuth v5 and Prisma, while 2openclaw uses Next.js 14 with NextAuth v4 and JSON file storage. The merge requires **upgrading 2openclaw patterns** to brewclaw's modern stack, not the reverse.

## Recommended Architecture

### High-Level Structure

```
brewclaw/ (unified repo)
├── app/
│   ├── (marketing)/          # Route group: Landing pages (SSG)
│   │   ├── page.tsx          # Home/landing page from 2openclaw/web
│   │   ├── pricing/
│   │   ├── about/
│   │   └── blog/
│   │
│   ├── (product)/            # Route group: Authenticated product pages
│   │   ├── onboarding/       # From 2openclaw onboarding flow
│   │   ├── dashboard/        # From 2openclaw dashboard + brewclaw base
│   │   └── settings/
│   │
│   ├── (auth)/               # Route group: Auth pages (already exists in brewclaw)
│   │   ├── signin/
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth v5 (already configured)
│   │   │
│   │   ├── subscriptions/    # From 2openclaw - Razorpay integration
│   │   │   ├── create/route.ts
│   │   │   └── verify/route.ts
│   │   │
│   │   ├── webhooks/         # From 2openclaw
│   │   │   └── razorpay/route.ts
│   │   │
│   │   └── containers/       # NEW - Proxies to GCP VM
│   │       ├── [userId]/
│   │       │   ├── start/route.ts
│   │       │   ├── stop/route.ts
│   │       │   ├── restart/route.ts
│   │       │   ├── logs/route.ts
│   │       │   └── stats/route.ts
│   │       └── provision/route.ts
│   │
│   ├── layout.tsx            # Root layout (already exists)
│   └── globals.css           # Merge styles from both
│
├── components/
│   ├── marketing/            # Landing page components from 2openclaw
│   ├── dashboard/            # Dashboard-specific components from 2openclaw
│   ├── onboarding/           # Onboarding flow components from 2openclaw
│   ├── auth/                 # Auth components (already exists in brewclaw)
│   └── ui/                   # Shared UI components (merge shadcn/ui from 2openclaw)
│
├── lib/
│   ├── auth.ts               # NextAuth v5 config (already exists)
│   ├── prisma.ts             # Prisma client (already exists)
│   ├── razorpay.ts           # From 2openclaw - Razorpay service
│   ├── rateLimit.ts          # From 2openclaw - Rate limiting
│   ├── logger.ts             # From 2openclaw - Secure logging
│   ├── gcp-api.ts            # NEW - GCP VM API client
│   └── utils.ts              # Merge from both
│
├── prisma/
│   └── schema.prisma         # Extend with 2openclaw user data models
│
├── middleware.ts             # Extend for new protected routes
├── next.config.ts            # Add rewrites for GCP proxy
└── package.json              # Merge dependencies
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    brewclaw.com (Vercel)                     │
│  Next.js 16.1.6 App Router + NextAuth v5 + Prisma           │
│                                                              │
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   (marketing)  │  │   (product)     │  │    (auth)    │ │
│  │   Landing      │  │   Dashboard     │  │   Sign-in    │ │
│  │   pages        │  │   Onboarding    │  │   /signin    │ │
│  │   SSG          │  │   Settings      │  │              │ │
│  └────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              API Routes (/app/api/)                    │  │
│  │  • auth/[...nextauth] - NextAuth v5 handlers          │  │
│  │  • subscriptions/* - Razorpay payment processing      │  │
│  │  • webhooks/razorpay - Payment webhooks               │  │
│  │  • containers/* - Proxy to GCP (via rewrites)         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Security Layer:                                             │
│  • Razorpay keys stored on Vercel only                      │
│  • Rate limiting (5 req/hr for subscriptions)               │
│  • PII sanitization in logs                                 │
│  • HMAC SHA256 webhook verification                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (X-API-Key header)
                              │ Rewrites: /api/containers/* → GCP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              GCP VM (34.131.95.162:3000)                    │
│  Express.js API + Docker orchestration                      │
│                                                              │
│  • Container lifecycle (start/stop/restart)                 │
│  • Logs & stats streaming                                   │
│  • Docker management                                        │
│  • NO payment keys (security requirement)                   │
│                                                              │
│  Migration: JSON files → PostgreSQL (via Prisma)            │
│  /opt/2openclaw/data/users/*.json → brewclaw DB             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          PostgreSQL Database (Vercel Postgres)              │
│                                                              │
│  NextAuth v5 tables:                                         │
│  • User, Account, Session, VerificationToken                │
│                                                              │
│  Product tables (NEW):                                       │
│  • Container (userId, botToken, aiProvider, status...)      │
│  • Subscription (razorpayId, status, plan, trialEnd...)     │
└─────────────────────────────────────────────────────────────┘
```

## Component Boundaries

| Component | Responsibility | Communicates With | Source |
|-----------|---------------|-------------------|--------|
| **(marketing)** | Landing pages, pricing, marketing content | None (static) | 2openclaw/web/app/page.tsx |
| **(product)/onboarding** | 6-step bot setup flow (Telegram → AI Provider → Payment → Provisioning) | API routes (subscriptions, containers) | 2openclaw/web/app/onboard/ |
| **(product)/dashboard** | User dashboard, instance management, billing | API routes (containers) | 2openclaw/web/app/dashboard/ + brewclaw base |
| **(auth)** | Google OAuth + Email magic link | NextAuth v5 handlers | brewclaw (existing) |
| **api/subscriptions/** | Razorpay customer/subscription creation, payment verification | Razorpay API, GCP API (for provisioning trigger) | 2openclaw/web/app/api/subscriptions/ |
| **api/webhooks/razorpay** | Handle payment lifecycle events (active, failed, cancelled) | GCP API (update status), Database (subscription updates) | 2openclaw/web/app/api/webhooks/ |
| **api/containers/** | Proxy container management to GCP | GCP Express API | NEW (thin proxy layer) |
| **lib/razorpay.ts** | Payment processing, signature verification, subscription CRUD | Razorpay SDK | 2openclaw/web/lib/razorpay.ts |
| **lib/gcp-api.ts** | GCP VM HTTP client with X-API-Key auth | GCP Express API | NEW (abstracts fetch calls) |
| **middleware.ts** | Route protection, auth redirects | NextAuth v5 session | brewclaw (extend) |
| **GCP Express API** | Docker container orchestration | Docker daemon, JSON files (migrate to DB) | 2openclaw/api/ (no changes) |

## Integration Points

### 1. Authentication Integration

**What changes:**
- 2openclaw uses Telegram Login Widget (no traditional auth)
- brewclaw uses NextAuth v5 with Google OAuth + Email magic link
- **Integration:** Replace Telegram auth with NextAuth session checks

**New flow:**
```
User → /signin (Google/Email) → NextAuth callback → /onboarding → /dashboard
```

**Modified components:**
- `app/(product)/onboarding/page.tsx` - Remove Telegram login, use `auth()` session
- `app/(product)/dashboard/page.tsx` - Use NextAuth session instead of localStorage
- `middleware.ts` - Protect `/onboarding` and `/dashboard` routes

**Code pattern (from NextAuth v5):**
```typescript
// Server Component
import { auth } from "@/lib/auth"

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect("/signin")
  // Use session.user.email, session.user.name
}
```

**Confidence:** HIGH - NextAuth v5 integration is well-documented. brewclaw already has working NextAuth v5 setup.

### 2. Database Migration (JSON → Prisma/PostgreSQL)

**What changes:**
- 2openclaw stores user data in `/opt/2openclaw/data/users/{userId}.json`
- brewclaw uses Prisma with PostgreSQL (NextAuth tables already exist)
- **Integration:** Extend Prisma schema with product data models

**New Prisma models:**
```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  // ... NextAuth fields (already exist)

  // Product extensions
  containers    Container[]
  subscription  Subscription?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Container {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Bot configuration
  botToken        String   @unique
  telegramUserId  String
  aiProvider      String   // "gemini" | "openai" | "anthropic"
  aiApiKey        String   // Encrypted

  // Container metadata
  dockerId        String?  // Docker container ID
  status          String   // "running" | "stopped" | "error"
  vmHost          String   @default("34.131.95.162") // GCP VM IP

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
}

model Subscription {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Razorpay IDs
  razorpayCustomerId    String   @unique
  razorpaySubscriptionId String  @unique

  // Subscription details
  plan                  String   // "starter" | "pro" | "business"
  status                String   // "TRIAL" | "ACTIVE" | "PAST_DUE" | "SUSPENDED" | "CANCELLED"

  // Trial & billing
  trialEnd              DateTime?
  currentStart          DateTime?
  currentEnd            DateTime?

  // Grace period tracking
  paymentFailedAt       DateTime?
  gracePeriodEnd        DateTime?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([userId])
  @@index([razorpaySubscriptionId])
}
```

**Migration script (one-time):**
```typescript
// scripts/migrate-json-to-db.ts
import { prisma } from "@/lib/prisma"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = "/opt/2openclaw/data/users"

async function migrate() {
  const files = await fs.readdir(DATA_DIR)

  for (const file of files) {
    if (!file.endsWith(".json")) continue

    const data = JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf-8"))

    // Create user if doesn't exist (match by email)
    const user = await prisma.user.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        name: data.email.split("@")[0],
      },
      update: {},
    })

    // Create container record
    await prisma.container.upsert({
      where: { botToken: data.botToken },
      create: {
        userId: user.id,
        botToken: data.botToken,
        telegramUserId: data.odinseTelegramId,
        aiProvider: data.aiProvider,
        aiApiKey: data.aiApiKey, // Consider re-encrypting
        status: data.containerStatus,
      },
      update: {},
    })

    // Create subscription record if exists
    if (data.razorpaySubscriptionId) {
      await prisma.subscription.upsert({
        where: { razorpaySubscriptionId: data.razorpaySubscriptionId },
        create: {
          userId: user.id,
          razorpayCustomerId: data.razorpayCustomerId,
          razorpaySubscriptionId: data.razorpaySubscriptionId,
          plan: data.plan,
          status: data.subscriptionStatus,
        },
        update: {},
      })
    }
  }

  console.log("Migration complete")
}

migrate()
```

**GCP API changes:**
- Update Express API to read from PostgreSQL instead of JSON files
- Add DATABASE_URL env var to GCP VM
- Install Prisma Client on GCP VM
- Replace JSON file reads/writes with Prisma queries

**Confidence:** HIGH - Prisma migration patterns are well-established. Requires one-time data migration script.

### 3. Payment Integration (Razorpay)

**What stays the same:**
- All Razorpay logic from `2openclaw/web/lib/razorpay.ts` (timing-safe verification, subscription CRUD)
- Razorpay keys remain on Vercel only (security requirement)
- Webhook signature verification with HMAC SHA256
- Rate limiting (5 req/hr for subscription creation)

**What changes:**
- Payment success → Create Prisma records instead of JSON files
- Webhook handlers → Update Prisma instead of JSON
- Use NextAuth session for user identification (not localStorage)

**Modified files:**
```
lib/razorpay.ts                     - Copy as-is from 2openclaw
app/api/subscriptions/create/       - Update user lookup (Prisma)
app/api/subscriptions/verify/       - Update provisioning (Prisma)
app/api/webhooks/razorpay/          - Update status updates (Prisma)
```

**Code pattern:**
```typescript
// app/api/subscriptions/verify/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyPaymentSignature } from "@/lib/razorpay"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await req.json()

  // Verify signature (unchanged)
  const isValid = verifyPaymentSignature(razorpay_subscription_id, razorpay_payment_id, razorpay_signature)
  if (!isValid) return Response.json({ error: "Invalid signature" }, { status: 400 })

  // Update subscription status in Prisma (changed from JSON)
  await prisma.subscription.update({
    where: { razorpaySubscriptionId: razorpay_subscription_id },
    data: { status: "ACTIVE" },
  })

  // Trigger container provisioning (unchanged)
  await fetch(`${process.env.GCP_API_URL}/provision`, {
    method: "POST",
    headers: { "X-API-Key": process.env.GCP_API_SECRET! },
    body: JSON.stringify({ userId: session.user.id }),
  })

  return Response.json({ success: true })
}
```

**Confidence:** HIGH - Razorpay integration is security-audited and working. Only data layer changes.

### 4. GCP Proxy Pattern

**What changes:**
- Add rewrites in `next.config.ts` to proxy container management requests to GCP VM
- Create thin API route wrappers for type safety and session validation
- Keep X-API-Key authentication between Vercel and GCP

**Rewrite configuration:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/containers/:path*",
        destination: `${process.env.GCP_API_URL}/instances/:path*`,
      },
    ]
  },
}
```

**API route wrappers (for session validation):**
```typescript
// app/api/containers/[userId]/start/route.ts
import { auth } from "@/lib/auth"
import { gcpApi } from "@/lib/gcp-api"

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session?.user || session.user.id !== params.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Proxy to GCP
  const result = await gcpApi.startContainer(params.userId)
  return Response.json(result)
}
```

**GCP API client:**
```typescript
// lib/gcp-api.ts
const GCP_API_URL = process.env.GCP_API_URL!
const GCP_API_SECRET = process.env.GCP_API_SECRET!

async function gcpFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${GCP_API_URL}${path}`, {
    ...options,
    headers: {
      "X-API-Key": GCP_API_SECRET,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) throw new Error(`GCP API error: ${response.statusText}`)
  return response.json()
}

export const gcpApi = {
  startContainer: (userId: string) => gcpFetch(`/instances/${userId}/start`, { method: "POST" }),
  stopContainer: (userId: string) => gcpFetch(`/instances/${userId}/stop`, { method: "POST" }),
  restartContainer: (userId: string) => gcpFetch(`/instances/${userId}/restart`, { method: "POST" }),
  getLogs: (userId: string) => gcpFetch(`/instances/${userId}/logs`),
  getStats: (userId: string) => gcpFetch(`/instances/${userId}/stats`),
  provisionContainer: (payload: any) => gcpFetch("/provision", { method: "POST", body: JSON.stringify(payload) }),
}
```

**Confidence:** HIGH - Rewrites are standard Next.js pattern. Existing 2openclaw already uses this proxy pattern.

### 5. UI Component Migration

**What changes:**
- Merge shadcn/ui components from 2openclaw (Radix UI + CVA + clsx)
- brewclaw uses basic Tailwind, 2openclaw has rich component library
- Standardize on dark theme design system

**Component migration strategy:**
```
2openclaw/web/components/ui/*     → brewclaw/components/ui/ (merge, keep 2openclaw versions)
2openclaw/web/components/*.tsx    → brewclaw/components/marketing/ or dashboard/
```

**Dependencies to add:**
```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^12.34.0",
  "tailwind-merge": "^3.4.0",
  "tailwindcss-animate": "^1.0.7",
  "razorpay": "^2.9.4"
}
```

**Confidence:** MEDIUM - Component library merge requires manual testing. Possible style conflicts.

## Build Order for Merge

### Phase 1: Foundation (Day 1-2)
**Goal:** Set up unified repo structure without breaking existing functionality

1. **Backup both repos**
   ```bash
   git clone git@github.com:kairothq/2openclaw.git 2openclaw-backup
   git branch -a  # Verify brewclaw is clean
   ```

2. **Create merge branch in brewclaw**
   ```bash
   cd brewclaw
   git checkout -b feature/merge-2openclaw
   ```

3. **Copy 2openclaw landing page**
   ```bash
   mkdir -p app/\(marketing\)
   cp ../2openclaw/web/app/page.tsx app/\(marketing\)/page.tsx
   cp -r ../2openclaw/web/components app/components-2openclaw-temp
   ```

4. **Merge dependencies**
   - Update `package.json` with 2openclaw dependencies (Radix UI, Razorpay, etc.)
   - Run `npm install`
   - Verify build: `npm run build`

5. **Add route groups**
   - Create `app/(marketing)/` folder
   - Create `app/(product)/` folder
   - Move brewclaw's `/dashboard` to `app/(product)/dashboard`

**Success criteria:**
- brewclaw builds successfully
- Landing page renders at `/`
- Dashboard still accessible at `/dashboard`
- Auth flow unchanged

### Phase 2: Database & Data Models (Day 2-3)
**Goal:** Extend Prisma schema and prepare for data migration

1. **Extend Prisma schema**
   - Add `Container` and `Subscription` models to `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name add_product_models`
   - Verify migrations: `npx prisma studio`

2. **Create migration script**
   - Write `scripts/migrate-json-to-db.ts` (see Integration Point #2)
   - Test locally with sample JSON files
   - **DO NOT run on production yet**

3. **Update GCP API for Prisma**
   - SSH to GCP VM: `gcloud compute ssh openclaw2 --zone=asia-south2-c`
   - Install Prisma: `cd /opt/2openclaw/api && npm install @prisma/client`
   - Add `DATABASE_URL` to GCP env vars
   - Update Express API to use Prisma client (keep JSON fallback for safety)
   - Test container provisioning with Prisma

**Success criteria:**
- Prisma schema includes all product models
- Migration script tested locally
- GCP API can read/write Prisma (with JSON fallback)

### Phase 3: Payment Integration (Day 3-4)
**Goal:** Integrate Razorpay payment flows with NextAuth sessions

1. **Copy Razorpay service**
   ```bash
   cp ../2openclaw/web/lib/razorpay.ts lib/razorpay.ts
   cp ../2openclaw/web/lib/rateLimit.ts lib/rateLimit.ts
   cp ../2openclaw/web/lib/logger.ts lib/logger.ts
   ```

2. **Migrate subscription API routes**
   ```bash
   cp -r ../2openclaw/web/app/api/subscriptions app/api/
   cp -r ../2openclaw/web/app/api/webhooks app/api/
   ```

3. **Update API routes for NextAuth v5 + Prisma**
   - Replace localStorage/Telegram auth with `auth()` session
   - Replace JSON file writes with Prisma queries
   - Keep signature verification logic unchanged

4. **Test payment flow**
   - Create test Razorpay subscription
   - Verify webhook handling
   - Confirm Prisma updates

**Success criteria:**
- Razorpay subscription creation works
- Payment verification creates Prisma records
- Webhooks update subscription status in DB

### Phase 4: Onboarding Flow (Day 4-5)
**Goal:** Migrate 6-step onboarding flow with NextAuth integration

1. **Copy onboarding page**
   ```bash
   cp -r ../2openclaw/web/app/onboard app/\(product\)/onboarding
   ```

2. **Refactor for NextAuth v5**
   - Remove Telegram login widget
   - Use `auth()` for session (server component)
   - Update user data fetching (Prisma instead of localStorage)

3. **Update onboarding steps**
   - Step 1: Email → Already authenticated (skip)
   - Step 2: Create Bot → Use NextAuth session email
   - Step 3: Bot Token → Store in Prisma Container model
   - Step 4: Telegram User ID → Store in Prisma
   - Step 5: AI Provider → Store in Prisma
   - Step 6: Payment → Razorpay flow (already migrated in Phase 3)

4. **Connect provisioning**
   - After payment success → Trigger GCP provisioning
   - GCP reads user data from Prisma
   - Container created and linked to user

**Success criteria:**
- Onboarding flow accessible at `/onboarding`
- New users complete full flow (signup → bot setup → payment → running container)
- User redirected to dashboard after provisioning

### Phase 5: Dashboard & Container Management (Day 5-6)
**Goal:** Merge dashboard with container controls

1. **Copy dashboard page**
   ```bash
   cp -r ../2openclaw/web/app/dashboard app/\(product\)/dashboard
   ```

2. **Create container API routes**
   ```bash
   mkdir -p app/api/containers/\[userId\]
   # Create start/stop/restart/logs/stats route handlers
   ```

3. **Implement GCP proxy**
   - Add rewrites to `next.config.ts`
   - Create `lib/gcp-api.ts` client
   - Build API route wrappers with session validation

4. **Update dashboard UI**
   - Fetch container status from Prisma
   - Container controls call `/api/containers/[userId]/start`, etc.
   - Display subscription info (plan, billing date, status)

**Success criteria:**
- Dashboard shows container status
- Start/stop/restart controls work
- Logs and stats display correctly
- Subscription info visible

### Phase 6: Styling & Polish (Day 6-7)
**Goal:** Unify design system and fix visual inconsistencies

1. **Merge global styles**
   - Merge `2openclaw/web/app/globals.css` into `brewclaw/app/globals.css`
   - Resolve Tailwind class conflicts

2. **Merge UI components**
   - Copy shadcn/ui components from 2openclaw to `components/ui/`
   - Test all components render correctly
   - Update imports in pages

3. **Rebrand 2OpenClaw → BrewClaw**
   - Find/replace "2OpenClaw" → "BrewClaw" in all files
   - Update logo, favicon, meta tags
   - Update Razorpay plan names

4. **Test responsive design**
   - Test on mobile, tablet, desktop
   - Fix layout issues

**Success criteria:**
- Consistent design across marketing and product
- All components render correctly
- Mobile responsive
- Rebranding complete

### Phase 7: Production Cutover (Day 7-8)
**Goal:** Deploy unified app and migrate production data

1. **Pre-deployment checklist**
   - [ ] All env vars configured on Vercel (Razorpay, GCP, NextAuth, DATABASE_URL)
   - [ ] Prisma migrations applied to production DB
   - [ ] GCP API updated with Prisma client
   - [ ] Webhook URLs updated in Razorpay dashboard
   - [ ] DNS ready for brewclaw.com

2. **Data migration**
   - Run `scripts/migrate-json-to-db.ts` on production GCP VM
   - Verify all users/containers/subscriptions migrated
   - Keep JSON files as backup (don't delete)

3. **Deploy to Vercel**
   - Push to `main` branch (triggers Vercel deploy)
   - Verify deployment at brewclaw.vercel.app
   - Test full user flow (signup → onboarding → payment → dashboard)

4. **Update DNS**
   - Point brewclaw.com to Vercel
   - Verify SSL certificate

5. **Monitor**
   - Watch Vercel logs for errors
   - Monitor Razorpay webhooks
   - Check GCP container provisioning

6. **Decommission 2openclaw.vercel.app**
   - Add redirect from 2openclaw.vercel.app → brewclaw.com
   - Archive 2openclaw repo (don't delete)

**Success criteria:**
- brewclaw.com serves unified app
- All existing users can sign in
- New signups complete full flow
- Payments processing successfully
- Containers provisioning correctly

## Patterns to Follow

### Pattern 1: Route Groups for Organization
**What:** Use parenthesized folders to organize without affecting URLs
**When:** Separating marketing, product, and auth sections
**Example:**
```
app/(marketing)/page.tsx       → brewclaw.com/
app/(product)/dashboard/       → brewclaw.com/dashboard
app/(auth)/signin/             → brewclaw.com/signin
```
**Why:** Clean separation of concerns, multiple root layouts possible, clearer codebase structure

**Source:** [Next.js Multi-Zones Guide](https://nextjs.org/docs/app/guides/multi-zones), [Feature-Sliced Design](https://feature-sliced.design/blog/nextjs-app-router-guide)

### Pattern 2: Server-First Authentication
**What:** Use `auth()` in Server Components, avoid client-side session management
**When:** Protecting routes, accessing user data
**Example:**
```typescript
// Server Component (preferred)
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/signin")
  return <div>Welcome {session.user.email}</div>
}

// Client Component (only if needed)
"use client"
import { useSession } from "next-auth/react"

export function UserMenu() {
  const { data: session } = useSession()
  return <div>{session?.user?.name}</div>
}
```
**Why:** Reduces client bundle size, faster initial page load, better security (no token exposure)

**Source:** [NextAuth v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5), [Next.js Server Components](https://nextjs.org/docs/app/guides)

### Pattern 3: Prisma Singleton with Connection Pooling
**What:** Prevent connection pool exhaustion in development
**When:** Initializing Prisma Client
**Example:**
```typescript
// lib/prisma.ts (brewclaw already has this)
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```
**Why:** Next.js hot reload creates new Prisma instances, singleton prevents "too many connections" errors

**Source:** [Prisma Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs), [Prisma Next.js Guide](https://www.prisma.io/docs/guides/nextjs)

### Pattern 4: Timing-Safe Signature Verification
**What:** Use `crypto.timingSafeEqual()` for payment signature verification
**When:** Verifying Razorpay webhooks and payment callbacks
**Example:**
```typescript
// lib/razorpay.ts (already implemented in 2openclaw)
export function verifyPaymentSignature(subscriptionId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  const expectedSignature = crypto.createHmac("sha256", keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )
  } catch {
    return false
  }
}
```
**Why:** Prevents timing attacks where attackers measure comparison time to guess signatures

**Source:** [Razorpay Best Practices](https://razorpay.com/docs/webhooks/best-practices/), 2openclaw CONTEXT.md

### Pattern 5: PII Sanitization in Logs
**What:** Redact sensitive fields before logging
**When:** Logging API requests/responses with user data
**Example:**
```typescript
// lib/logger.ts (from 2openclaw)
const SENSITIVE_FIELDS = ["email", "token", "apiKey", "password", "razorpay_key_secret"]

export function sanitizeLog(data: any): any {
  if (typeof data !== "object" || data === null) return data

  const sanitized = { ...data }
  for (const field of SENSITIVE_FIELDS) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]"
    }
  }
  return sanitized
}

console.log(sanitizeLog({ email: "user@example.com", name: "John" }))
// Output: { email: "[REDACTED]", name: "John" }
```
**Why:** Prevents PII leakage in logs, GDPR compliance, security best practice

**Source:** 2openclaw CONTEXT.md, [Razorpay Security](https://razorpay.com/docs/webhooks/best-practices/)

### Pattern 6: API Route Proxying with Session Validation
**What:** Validate session before proxying to backend
**When:** Forwarding container management requests to GCP
**Example:**
```typescript
// app/api/containers/[userId]/start/route.ts
import { auth } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()

  // Validate: user can only control their own container
  if (!session?.user || session.user.id !== params.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Proxy to GCP
  const response = await fetch(`${process.env.GCP_API_URL}/instances/${params.userId}/start`, {
    method: "POST",
    headers: { "X-API-Key": process.env.GCP_API_SECRET! },
  })

  return Response.json(await response.json())
}
```
**Why:** Prevents users from controlling other users' containers, adds auth layer GCP doesn't have

**Source:** [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites), [Next.js Proxy Patterns](https://learnwebcraft.com/learn/nextjs/nextjs-16-proxy-ts-changes-everything)

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mixing Next.js Versions
**What goes wrong:** Using Next.js 14 patterns (Pages Router, NextAuth v4) in Next.js 16 codebase
**Why it happens:** Copy-pasting from 2openclaw without upgrading
**Consequences:** Build errors, runtime crashes, deprecated API warnings
**Prevention:** Audit all copied code for version compatibility, use Next.js 16 docs as reference
**Detection:** Build failures with "module not found" or "API deprecated" errors

### Anti-Pattern 2: Exposing Secrets in Client Components
**What goes wrong:** Using Razorpay secret key in client-side code
**Why it happens:** Confusing `NEXT_PUBLIC_*` (client) vs non-prefixed (server)
**Consequences:** API keys leaked in browser bundle, security breach
**Prevention:** Never use `NEXT_PUBLIC_*` for secrets, only use in API routes/Server Components
**Detection:** Search codebase for `process.env.RAZORPAY_KEY_SECRET` in "use client" files

### Anti-Pattern 3: localStorage for User State
**What goes wrong:** Storing user data in localStorage (2openclaw pattern)
**Why it happens:** Quick workaround for stateless auth in 2openclaw
**Consequences:** Data loss on logout, XSS vulnerability, state desync
**Prevention:** Use database as source of truth, only cache non-sensitive UI state
**Detection:** Grep for `localStorage.setItem` and audit each usage

### Anti-Pattern 4: JSON Files in Production
**What goes wrong:** Keeping JSON file storage after Prisma migration
**Why it happens:** "Just in case" fallback or incomplete migration
**Consequences:** Data inconsistency, race conditions, scaling issues
**Prevention:** Complete Prisma migration before production deploy, backup JSON files separately
**Detection:** Check GCP API for `fs.readFile` / `fs.writeFile` calls to data directory

### Anti-Pattern 5: Tight Coupling to Telegram Auth
**What goes wrong:** Onboarding flow assumes Telegram login is required
**Why it happens:** 2openclaw's original design was Telegram-first
**Consequences:** Confusing UX (why login with Google if bot needs Telegram?), unnecessary friction
**Prevention:** Separate concerns - Google/Email for account, Telegram ID for bot setup
**Detection:** User confusion during onboarding, high drop-off after auth

### Anti-Pattern 6: Direct Database Access from Client
**What goes wrong:** Importing Prisma client in client components
**Why it happens:** Misunderstanding Server vs Client Components
**Consequences:** Build errors, database credentials in client bundle
**Prevention:** Only use Prisma in Server Components and API routes
**Detection:** Build error: "Module not found: Can't resolve '@prisma/client'"

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Database connections** | Default pool (10 conn) sufficient | Use connection pooling (PgBouncer), optimize Prisma queries | Consider read replicas, connection proxy (PgBouncer/Prisma Accelerate) |
| **Container orchestration** | Single GCP VM (Express API) | Multiple GCP VMs with load balancer, VM selector service (already exists in 2openclaw) | Migrate to Kubernetes, autoscaling node pools |
| **Payment webhooks** | Single API route handles all webhooks | Add queue (Redis Bull) for async processing | Dedicated webhook processor service, event sourcing |
| **Static assets** | Vercel CDN sufficient | Same (Vercel scales automatically) | Same (Vercel Edge Network) |
| **Authentication** | JWT sessions work | Same (stateless JWTs scale infinitely) | Consider session caching (Redis) if database becomes bottleneck |
| **Razorpay API rate limits** | Not a concern (5 req/hr rate limit) | May need higher rate limits from Razorpay | Enterprise Razorpay plan with higher limits |

**Source:** [Prisma Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs), 2openclaw CONTEXT.md (VM selector service)

## Environment Variables

### Vercel (brewclaw.com)

```bash
# NextAuth v5 (already configured)
AUTH_SECRET=xxx                             # NextAuth session encryption key
AUTH_URL=https://brewclaw.com               # Canonical URL
GOOGLE_CLIENT_ID=xxx                        # Google OAuth
GOOGLE_CLIENT_SECRET=xxx                    # Google OAuth
# AUTH_RESEND_KEY=xxx                       # Email magic link (optional)

# Database (already configured)
DATABASE_URL=postgresql://...               # Vercel Postgres or external

# Razorpay (NEW - from 2openclaw)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx   # Client-side (public)
RAZORPAY_KEY_ID=rzp_live_xxx               # Server-side
RAZORPAY_KEY_SECRET=xxx                    # Server-side only (NEVER expose)
RAZORPAY_WEBHOOK_SECRET=xxx                # Webhook signature verification
RAZORPAY_PLAN_STARTER=plan_xxx             # Plan IDs from Razorpay dashboard
RAZORPAY_PLAN_PRO=plan_xxx
RAZORPAY_PLAN_BUSINESS=plan_xxx

# GCP Integration (NEW)
GCP_API_URL=http://34.131.95.162:3000      # GCP VM Express API
GCP_API_SECRET=xxx                         # Shared secret for X-API-Key header
```

### GCP VM (34.131.95.162)

```bash
# API (already configured)
API_SECRET=xxx                              # Must match GCP_API_SECRET on Vercel
DATA_DIR=/opt/2openclaw/data                # Legacy JSON files (keep during migration)
PORT=3000

# Database (NEW)
DATABASE_URL=postgresql://...               # Same as Vercel (Prisma Client)
```

**Migration note:** After data migration completes, DATA_DIR can be deprecated (keep JSON files as backup).

## Sources

**Architecture Patterns:**
- [Next.js Multi-Zones Guide](https://nextjs.org/docs/app/guides/multi-zones)
- [Next.js App Router Architecture](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Feature-Sliced Design for Next.js](https://feature-sliced.design/blog/nextjs-app-router-guide)
- [Next.js Project Structure Guide](https://nextjs.org/docs/app/getting-started/project-structure)

**Authentication:**
- [NextAuth v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [NextAuth v5 with Prisma](https://authjs.dev/getting-started/adapters/prisma)
- [Setting Up Next.js 15 with NextAuth v5](https://codevoweb.com/how-to-set-up-next-js-15-with-nextauth-v5/)

**Database & Prisma:**
- [Prisma ORM Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs)
- [Prisma with Next.js Guide](https://www.prisma.io/docs/guides/nextjs)
- [Using Prisma Migrate](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-node-postgresql)

**Payment Integration:**
- [Razorpay Webhooks Best Practices](https://razorpay.com/docs/webhooks/best-practices/)
- [Razorpay Next.js Integration](https://nesin.io/blog/integrate-razorpay-with-nextjs)
- [How to Integrate Razorpay in Next.js 14/15](https://dev.to/hanuchaudhary/how-to-integrate-razorpay-in-nextjs-1415-with-easy-steps-fl7)

**Proxy & Backend Integration:**
- [Next.js Rewrites Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
- [Next.js 16 Proxy Architecture](https://learnwebcraft.com/learn/nextjs/nextjs-16-proxy-ts-changes-everything)
- [Vercel Reverse Proxy Guide](https://vercel.com/kb/guide/vercel-reverse-proxy-rewrites-external)

**Docker & Deployment:**
- [Modern Full Stack Architecture with Next.js 15+](https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/)
- [Next.js Deployment Guide](https://nextjs.org/docs/app/getting-started/deploying)

**Monorepo & Code Organization:**
- [How to Build a Monorepo with Next.js](https://dev.to/rajeshnatarajan/how-to-build-a-monorepo-with-nextjs-3ljg)
- [Next.js 16 App Router Project Structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
