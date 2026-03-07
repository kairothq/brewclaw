# Phase 15: Payment Integration - Research

**Researched:** 2026-03-08
**Domain:** Razorpay payment integration for SaaS subscriptions
**Confidence:** HIGH

## Summary

Phase 15 implements Razorpay subscription payment integration following the proven 2openclaw pattern. The implementation uses server-side API routes for subscription creation and verification, with timing-safe signature comparison for security and webhook handlers for subscription lifecycle management.

The 2openclaw reference implementation provides a complete, battle-tested pattern that has been validated in production. The core architecture separates concerns: Razorpay credentials live only on Vercel (never GCP), payment verification happens before container provisioning (fraud prevention), and webhooks update subscription status asynchronously.

**Primary recommendation:** Follow the 2openclaw pattern exactly - use lib/razorpay.ts for service layer, implement timing-safe signature verification with crypto.timingSafeEqual, extend Prisma User model with subscription relationship, and handle webhooks idempotently using x-razorpay-event-id.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAY-01 | User can create Razorpay subscription for chosen plan (Starter/Pro/Business) | Razorpay SDK subscription.create API with plan_id mapping, customer.create for new users |
| PAY-02 | Payment signature verified with timing-safe comparison (security requirement met) | crypto.timingSafeEqual for HMAC SHA256 verification prevents timing attacks |
| PAY-03 | Container provisioning triggered only after payment verification succeeds | POST /api/subscriptions/verify returns verified: true/false, provision route called only on true |
| PAY-04 | Razorpay webhooks update subscription status in database (active, past_due, cancelled) | Webhook events: subscription.activated, subscription.halted, subscription.cancelled with status mapping |
| PAY-05 | User subscription data persisted in Prisma linked to NextAuth user ID | Prisma Subscription model with userId foreign key, created in subscription.create route |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| razorpay | ^2.9.x | Razorpay Node.js SDK | Official SDK for subscription management, customer creation, signature verification |
| @prisma/client | 7.4.1 | Database ORM | Already installed, used for NextAuth, will extend for subscriptions |
| Next.js | 16.1.6 | App Router API routes | Already installed, provides route handlers for payment endpoints |
| crypto | built-in | HMAC signature verification | Node.js built-in, used for timing-safe signature comparison |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vercel/kv | latest | Rate limiting storage | Optional - for subscription creation rate limiting (5 req/hr from 2openclaw) |
| @upstash/ratelimit | latest | Rate limiting logic | Optional - sliding window algorithm for API protection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Razorpay | Stripe | Razorpay is already used in 2openclaw, supports INR natively, no migration needed |
| Vercel KV | In-memory Map | In-memory doesn't scale across serverless instances, KV persists |
| Prisma | Raw SQL | Prisma provides type safety, migrations, already in use for NextAuth |

**Installation:**
```bash
npm install razorpay@^2.9.4
# Optional for rate limiting:
npm install @vercel/kv @upstash/ratelimit
```

## Architecture Patterns

### Recommended Project Structure
```
app/api/
├── subscriptions/
│   ├── create/route.ts      # POST: Create Razorpay subscription
│   ├── verify/route.ts      # POST: Verify payment signature
│   └── update-status/route.ts # POST: Update subscription status (called by GCP)
├── webhooks/
│   └── razorpay/route.ts    # POST: Handle Razorpay webhook events
└── provision/route.ts       # POST: Provision container (called after payment verified)

lib/
├── razorpay.ts              # Razorpay service layer
└── prisma.ts                # Prisma client (existing)

prisma/
└── schema.prisma            # Extended with Subscription model
```

### Pattern 1: Razorpay Service Layer (lib/razorpay.ts)
**What:** Centralized service for all Razorpay operations - customer creation, subscription management, signature verification
**When to use:** All payment-related logic, imported by API routes
**Example:**
```typescript
// Source: /tmp/2openclaw-ref/web/lib/razorpay.ts (lines 1-309)
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy initialization to avoid build-time errors
let razorpayInstance: Razorpay | null = null

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured')
    }
    razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return razorpayInstance
}

// Plan configuration
export const PLANS = {
  starter: { name: 'BrewClaw Starter', amount: 19900, description: '1.5GB RAM, Priority Support' },
  pro: { name: 'BrewClaw Pro', amount: 49900, description: '3GB RAM, Priority Support' },
  business: { name: 'BrewClaw Business', amount: 149900, description: '4GB RAM, Custom Domain, Priority Support' }
} as const

export type PlanId = keyof typeof PLANS

// Timing-safe payment signature verification
export function verifyPaymentSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    console.error('[razorpay] Key secret not found for signature verification')
    return false
  }

  // Razorpay signature format: payment_id|subscription_id
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest('hex')

  // CRITICAL: Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false // Lengths don't match
  }
}

// Webhook signature verification
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[razorpay] Webhook secret not configured')
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}
```

### Pattern 2: Subscription Creation Flow (API Route)
**What:** POST /api/subscriptions/create - Creates Razorpay customer and subscription, stores in Prisma
**When to use:** Called from onboarding wizard after plan selection
**Example:**
```typescript
// Source: /tmp/2openclaw-ref/web/app/api/subscriptions/create/route.ts (adapted for Prisma)
import { NextRequest, NextResponse } from 'next/server'
import { createCustomer, createSubscription, PlanId } from '@/lib/razorpay'
import { auth } from '@/lib/auth' // NextAuth
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated user from NextAuth session
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, trial } = body
    const userId = session.user.id
    const email = session.user.email
    const name = session.user.name

    // 2. Create Razorpay customer
    const customer = await createCustomer(email, name)

    // 3. Create subscription with optional trial
    const trialDays = trial ? 7 : undefined
    const subscription = await createSubscription(
      customer.id,
      planId as PlanId,
      { userId, trialDays }
    )

    // 4. Save subscription to Prisma database
    await prisma.subscription.create({
      data: {
        userId,
        razorpayCustomerId: customer.id,
        razorpaySubscriptionId: subscription.id,
        plan: planId,
        status: trial ? 'TRIAL' : 'PENDING',
        trialEndsAt: trial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
      }
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      status: subscription.status,
      isTrial: !!trial
    })
  } catch (error: any) {
    console.error('Subscription create error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
```

### Pattern 3: Payment Verification Before Provisioning
**What:** POST /api/subscriptions/verify - Verifies payment signature, triggers container provisioning only if valid
**When to use:** Called by frontend after Razorpay checkout completes
**Example:**
```typescript
// Source: /tmp/2openclaw-ref/web/app/api/subscriptions/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', verified: false }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification fields', verified: false },
        { status: 400 }
      )
    }

    // CRITICAL: Verify signature with timing-safe comparison
    const isValid = verifyPaymentSignature(
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      console.error('[subscriptions] Invalid payment signature')
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      )
    }

    // Update subscription status to ACTIVE
    await prisma.subscription.update({
      where: { razorpaySubscriptionId: razorpay_subscription_id },
      data: {
        status: 'ACTIVE',
        razorpayPaymentId: razorpay_payment_id
      }
    })

    console.log(`[subscriptions] Payment verified: ${razorpay_payment_id}`)

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id
    })
  } catch (error: any) {
    console.error('Subscription verify error:', error)
    return NextResponse.json(
      { verified: false, error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
```

### Pattern 4: Webhook Handler with Idempotency
**What:** POST /api/webhooks/razorpay - Handles subscription lifecycle events (activated, halted, cancelled)
**When to use:** Razorpay sends webhooks for subscription status changes
**Example:**
```typescript
// Source: /tmp/2openclaw-ref/web/app/api/webhooks/razorpay/route.ts (adapted for Prisma)
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, mapSubscriptionStatus } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature')
    if (!signature) {
      console.error('[razorpay-webhook] Missing signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Get raw body for signature verification (must be raw, not parsed)
    const bodyText = await request.text()

    // Verify webhook signature
    const isValid = verifyWebhookSignature(bodyText, signature)
    if (!isValid) {
      console.error('[razorpay-webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(bodyText)
    const eventType = event.event
    const payload = event.payload

    // IDEMPOTENCY: Check if event already processed using x-razorpay-event-id
    const eventId = request.headers.get('x-razorpay-event-id')
    if (eventId) {
      const existingEvent = await prisma.webhookEvent.findUnique({
        where: { eventId }
      })
      if (existingEvent) {
        console.log(`[razorpay-webhook] Duplicate event ${eventId}, ignoring`)
        return NextResponse.json({ received: true, duplicate: true })
      }
    }

    console.log(`[razorpay-webhook] Received event: ${eventType}`)

    // Handle different event types
    switch (eventType) {
      case 'subscription.activated':
        await handleSubscriptionActivated(payload)
        break
      case 'subscription.charged':
        await handleSubscriptionCharged(payload)
        break
      case 'subscription.halted':
        await handleSubscriptionHalted(payload)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload)
        break
      default:
        console.log(`[razorpay-webhook] Unhandled event: ${eventType}`)
    }

    // Save event to prevent duplicate processing
    if (eventId) {
      await prisma.webhookEvent.create({
        data: { eventId, eventType, processedAt: new Date() }
      })
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[razorpay-webhook] Error:', error)
    // Return 200 to prevent Razorpay retries on our errors
    return NextResponse.json({ received: true, error: error.message })
  }
}

async function handleSubscriptionActivated(payload: any) {
  const subscription = payload.subscription?.entity
  if (!subscription) return

  const razorpaySubscriptionId = subscription.id

  await prisma.subscription.update({
    where: { razorpaySubscriptionId },
    data: {
      status: 'ACTIVE',
      currentPeriodEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : null,
      nextBillingDate: subscription.charge_at
        ? new Date(subscription.charge_at * 1000)
        : null
    }
  })

  console.log(`[razorpay-webhook] Subscription activated: ${razorpaySubscriptionId}`)
}

// Similar handlers for halted, cancelled, charged...
```

### Pattern 5: Prisma Schema Extension
**What:** Extend User model with Subscription relationship
**When to use:** Database schema for storing subscription data
**Example:**
```prisma
// Source: Prisma best practices + NextAuth adapter pattern
model User {
  id            String        @id @default(cuid())
  name          String?
  email         String        @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription? // One-to-one relationship
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Subscription {
  id                      String    @id @default(cuid())
  userId                  String    @unique
  user                    User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  razorpayCustomerId      String?   @unique
  razorpaySubscriptionId  String?   @unique
  razorpayPaymentId       String?

  plan                    String    // starter, pro, business
  status                  String    // PENDING, TRIAL, ACTIVE, PAST_DUE, SUSPENDED, CANCELLED

  currentPeriodEnd        DateTime?
  nextBillingDate         DateTime?
  trialEndsAt             DateTime?

  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}

model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique // x-razorpay-event-id
  eventType   String
  processedAt DateTime @default(now())
}
```

### Anti-Patterns to Avoid
- **Parsing webhook body before verification:** Must use raw body for signature verification, parsing changes hash
- **Using === for signature comparison:** Vulnerable to timing attacks, always use crypto.timingSafeEqual
- **Creating container before payment verified:** Fraud risk, only provision after verify route returns verified: true
- **Not handling duplicate webhooks:** Can cause double-provisioning, use x-razorpay-event-id for idempotency
- **Storing Razorpay keys in GCP:** Keys must live only on Vercel, GCP never has payment credentials
- **Returning 4xx/5xx from webhooks on success:** Razorpay retries non-2xx, return 200 even if you've seen event before

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HMAC signature verification | Custom hash comparison | crypto.timingSafeEqual | Prevents timing attacks that could leak signature bytes |
| Rate limiting | In-memory Map with setTimeout | @vercel/kv + @upstash/ratelimit | Persists across serverless instances, handles edge cases |
| Webhook idempotency | Manual duplicate tracking | x-razorpay-event-id header + DB check | Razorpay provides unique event IDs, guaranteed unique per event |
| Subscription status mapping | Custom status strings | Razorpay's status values + mapper | Razorpay has 9 statuses with specific meanings, use official mapping |
| Payment retry logic | Custom retry loop | Razorpay webhooks | Razorpay handles retries with exponential backoff for 24 hours |

**Key insight:** Payment systems have complex edge cases (timing attacks, replay attacks, race conditions, retry storms). Using battle-tested patterns from 2openclaw and official Razorpay SDK prevents security vulnerabilities and data consistency issues.

## Common Pitfalls

### Pitfall 1: Signature Verification Timing Attack
**What goes wrong:** Using string === comparison for signature verification leaks information about signature bytes through timing differences
**Why it happens:** String comparison exits early on first mismatch, attacker measures response time to guess bytes
**How to avoid:** Always use crypto.timingSafeEqual for any security-sensitive comparison (payment signatures, webhook signatures, auth tokens)
**Warning signs:** Security audit flags timing vulnerabilities, Payment gateway docs explicitly warn about it

### Pitfall 2: Webhook Body Parsing Before Verification
**What goes wrong:** Parsing JSON before signature verification causes signature mismatch because JSON.stringify may format differently than Razorpay
**Why it happens:** Developer parses body to access fields, then tries to verify signature on stringified body
**How to avoid:** Read raw body with request.text(), verify signature first, then JSON.parse() after verification succeeds
**Warning signs:** Webhook signature verification always fails with "Invalid signature" despite correct secret

### Pitfall 3: Missing Webhook Idempotency
**What goes wrong:** Webhook processed multiple times causes duplicate container creation, double-billing, or inconsistent state
**Why it happens:** Razorpay uses at-least-once delivery, retries if no 200 response within 5 seconds
**How to avoid:** Check x-razorpay-event-id header, store in DB before processing, skip if already exists
**Warning signs:** User reports "bot created twice", logs show same event ID processed multiple times

### Pitfall 4: Container Provisioning Before Payment
**What goes wrong:** User gets free container without paying, fraud vulnerability
**Why it happens:** Developer triggers provisioning from subscription.create instead of after verify
**How to avoid:** Call /api/provision only after /api/subscriptions/verify returns verified: true
**Warning signs:** Users reporting "got access without paying", subscription status is PENDING but container exists

### Pitfall 5: Buffer Length Mismatch in timingSafeEqual
**What goes wrong:** crypto.timingSafeEqual throws error "Input buffers must have the same byte length"
**Why it happens:** Signature from client is different length than expected signature (wrong format, encoding issue)
**How to avoid:** Wrap timingSafeEqual in try-catch, return false on exception
**Warning signs:** Route crashes with uncaught exception during signature verification

### Pitfall 6: Plan ID Environment Variable Typo
**What goes wrong:** Subscription creation fails with "Plan ID not configured for: starter"
**Why it happens:** Environment variable RAZORPAY_PLAN_STARTER doesn't match casing in code (RAZORPAY_PLAN_STARTER vs RAZORPAY_PLAN_starter)
**How to avoid:** Use toUpperCase() when reading env vars: process.env[`RAZORPAY_PLAN_${planId.toUpperCase()}`]
**Warning signs:** Works in dev (env vars set lowercase), fails in production (env vars set uppercase or vice versa)

### Pitfall 7: Webhook Route Not Excluded from Auth Middleware
**What goes wrong:** Razorpay webhooks get 401 Unauthorized, subscription status never updates
**Why it happens:** NextAuth middleware protects all /api routes by default, webhooks can't authenticate
**How to avoid:** Add matcher exclusion in middleware.ts: `matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)']`
**Warning signs:** Webhook endpoint returns 401, Razorpay dashboard shows "Failed" for all webhook deliveries

## Code Examples

Verified patterns from official sources and 2openclaw production code:

### Creating Subscription with Trial Support
```typescript
// Source: /tmp/2openclaw-ref/web/lib/razorpay.ts (lines 126-175)
export async function createSubscription(
  customerId: string,
  planId: PlanId,
  options: { userId?: string; trialDays?: number } = {}
): Promise<RazorpaySubscription> {
  const planRazorpayId = process.env[`RAZORPAY_PLAN_${planId.toUpperCase()}`]

  if (!planRazorpayId) {
    throw new Error(`Plan ID not configured for: ${planId}`)
  }

  const params: Record<string, any> = {
    plan_id: planRazorpayId,
    customer_id: customerId,
    total_count: 120, // Max 10 years
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId: options.userId || '',
      plan: planId,
      isTrial: options.trialDays ? 'true' : 'false'
    }
  }

  // For free trial: defer first charge by X days
  // Razorpay start_at must be at least 15 minutes in the future
  if (options.trialDays && options.trialDays > 0) {
    const startAt = Math.floor(Date.now() / 1000) + (options.trialDays * 24 * 60 * 60)
    params.start_at = startAt
    console.log(`[razorpay] Creating trial subscription, first charge at: ${new Date(startAt * 1000).toISOString()}`)
  }

  const subscription = await getRazorpay().subscriptions.create(params)
  return subscription
}
```

### Timing-Safe Signature Verification
```typescript
// Source: /tmp/2openclaw-ref/web/lib/razorpay.ts (lines 250-275)
// Verified against: https://razorpay.com/docs/payments/subscriptions/integration-guide/
export function verifyPaymentSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keySecret) {
    console.error('[razorpay] Key secret not found for signature verification')
    return false
  }

  // Razorpay subscription signature format: payment_id|subscription_id
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest('hex')

  console.log(`[razorpay] Verifying signature - paymentId: ${paymentId}, subscriptionId: ${subscriptionId}`)

  // CRITICAL: Use timing-safe comparison to prevent timing attacks
  // Regular === comparison leaks information through timing
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    // Lengths don't match (wrong signature format)
    return false
  }
}
```

### Webhook Idempotency Check
```typescript
// Source: Razorpay best practices + 2openclaw pattern
// Verified against: https://razorpay.com/docs/webhooks/best-practices/
export async function POST(request: NextRequest) {
  // ... signature verification ...

  // IDEMPOTENCY: Check if event already processed
  const eventId = request.headers.get('x-razorpay-event-id')
  if (eventId) {
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId }
    })
    if (existingEvent) {
      console.log(`[razorpay-webhook] Duplicate event ${eventId}, ignoring`)
      // Return 200 to acknowledge (don't trigger retry)
      return NextResponse.json({ received: true, duplicate: true })
    }
  }

  // Process event...
  switch (eventType) {
    case 'subscription.activated':
      await handleSubscriptionActivated(payload)
      break
    // ... other handlers ...
  }

  // Save event to prevent future duplicates
  if (eventId) {
    await prisma.webhookEvent.create({
      data: {
        eventId,
        eventType,
        processedAt: new Date()
      }
    })
  }

  return NextResponse.json({ received: true })
}
```

### Rate Limiting Subscription Creation (Optional)
```typescript
// Source: Vercel KV + Upstash ratelimit best practices
// Verified against: https://vercel.com/kb/guide/add-rate-limiting-vercel
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

// Declare outside handler for caching while function is "hot"
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit by user ID
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `subscription_create_${session.user.id}`
  )

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.', reset },
      { status: 429 }
    )
  }

  // Proceed with subscription creation...
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| String === for signature comparison | crypto.timingSafeEqual | Always recommended | Prevents timing attack vulnerabilities |
| In-memory rate limiting | Vercel KV + Upstash | Serverless era (2020+) | Works across edge instances |
| Manual JSON data storage | Prisma with Accelerate | Prisma v5+ (2023) | Type-safe, edge-compatible, works with NextAuth |
| Pages Router API routes | App Router route handlers | Next.js 13+ (2023) | Async params, better DX with NextRequest/NextResponse |
| Webhook manual duplicate handling | x-razorpay-event-id header | Razorpay added (2021) | Built-in unique event IDs for idempotency |

**Deprecated/outdated:**
- NextAuth v4: Use v5 (beta.30) with auth() instead of getServerSession()
- Stripe only: Razorpay now mature for Indian market with better INR support
- Pages Router: App Router is stable in Next.js 16, use route.ts not pages/api

## Open Questions

1. **Should we implement rate limiting for subscription creation?**
   - What we know: 2openclaw has 5 req/hr limit, but uses in-memory Map
   - What's unclear: Is abuse a real concern for brewclaw? Cost vs benefit of Vercel KV?
   - Recommendation: Start without rate limiting, add Vercel KV if we see abuse (can add later without breaking changes)

2. **Do we need separate GCP notification endpoint?**
   - What we know: 2openclaw calls GCP /subscriptions/update-status from webhooks to trigger container start/stop
   - What's unclear: Can we do this directly from Prisma instead of GCP API?
   - Recommendation: Keep GCP notification pattern for now (proven in production), optimize later if latency is issue

3. **Should we migrate existing 2openclaw users during Phase 15 or Phase 19?**
   - What we know: 2openclaw has existing paying users with active subscriptions
   - What's unclear: Can we read their Razorpay subscriptions and import to Prisma safely?
   - Recommendation: Defer to Phase 19 (Production Cutover), focus Phase 15 on new subscription flow working

## Sources

### Primary (HIGH confidence)
- 2openclaw reference implementation: /tmp/2openclaw-ref/web/lib/razorpay.ts (production code)
- 2openclaw API routes: /tmp/2openclaw-ref/web/app/api/subscriptions/* (production code)
- Razorpay Node.js SDK: https://www.npmjs.com/package/razorpay (official package, v2.9.4)
- Prisma documentation: https://www.prisma.io/docs/guides/authjs-nextjs (official guide for NextAuth integration)
- Node.js crypto.timingSafeEqual: https://docs.deno.com/api/node/crypto/~/timingSafeEqual (official API)

### Secondary (MEDIUM confidence)
- [Razorpay Subscription Signature Verification](https://github.com/razorpay/razorpay-node/issues/124) - Community discussions on HMAC SHA256 verification
- [Razorpay Webhook Validation](https://razorpay.com/docs/webhooks/validate-test/) - Official webhook docs (404 on direct fetch, but exists per navigation)
- [Next.js 16 Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) - Official App Router documentation
- [Vercel KV Rate Limiting Guide](https://vercel.com/kb/guide/add-rate-limiting-vercel) - Official Vercel documentation
- [Timing-Safe Comparison Security](https://developers.cloudflare.com/workers/examples/protect-against-timing-attacks/) - Cloudflare security best practices

### Tertiary (LOW confidence - WebSearch only)
- [Medium: Razorpay Subscription Integration](https://abhishek-gupta.medium.com/integrate-razorpay-subscription-in-react-js-and-node-js-9109e33bae1a) - Community tutorial (not official)
- [Svix Blog: Razorpay Webhook Review](https://www.svix.com/blog/reviewing-razorpay-webhook-docs/) - Third-party analysis of webhook patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 2openclaw production code + official SDK docs verify all libraries
- Architecture: HIGH - Reference implementation is battle-tested, same pattern used in production
- Pitfalls: HIGH - All pitfalls directly from 2openclaw issues encountered or prevented in code
- Security patterns: HIGH - crypto.timingSafeEqual verified from Node.js docs, timing attacks are well-documented vulnerability

**Research date:** 2026-03-08
**Valid until:** 60 days (Razorpay API stable, Next.js 16 stable, no breaking changes expected)

**Reference implementation validity:**
- 2openclaw code is production-tested (has paying users)
- Razorpay integration patterns match official documentation
- All security practices (timing-safe comparison, webhook verification) follow industry standards
- Pattern can be adopted verbatim with brewclaw branding changes only
