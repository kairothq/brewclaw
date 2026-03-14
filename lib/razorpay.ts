import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy-initialized Razorpay client
let razorpayInstance: Razorpay | null = null

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured')
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpayInstance
}

// Plan configuration
export const PLANS: Record<string, { name: string; razorpayEnvKey: string }> = {
  starter: { name: 'Starter', razorpayEnvKey: 'RAZORPAY_PLAN_STARTER' },
  pro: { name: 'Pro', razorpayEnvKey: 'RAZORPAY_PLAN_PRO' },
  team: { name: 'Team', razorpayEnvKey: 'RAZORPAY_PLAN_BUSINESS' },
}

export function getRazorpayPlanId(planId: string): string | null {
  const plan = PLANS[planId]
  if (!plan) return null
  return process.env[plan.razorpayEnvKey] || null
}

export async function createCustomer(email: string, name?: string) {
  const razorpay = getRazorpay()
  return razorpay.customers.create({
    email,
    name: name || email.split('@')[0],
    fail_existing: 0, // Return existing customer if found
  })
}

export async function createSubscription(params: {
  planId: string
  customerEmail: string
  customerName?: string
  userId: string
  trial?: boolean
}) {
  const razorpay = getRazorpay()
  const razorpayPlanId = getRazorpayPlanId(params.planId)

  if (!razorpayPlanId) {
    throw new Error(`Invalid plan ID: ${params.planId}`)
  }

  return razorpay.subscriptions.create({
    plan_id: razorpayPlanId,
    customer_notify: 1,
    total_count: 12,
    quantity: 1,
    start_at: params.trial
      ? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      : undefined,
    notes: {
      userId: params.userId,
      email: params.customerEmail,
      name: params.customerName || '',
      planId: params.planId,
      isTrial: params.trial ? 'true' : 'false',
    },
  })
}

/**
 * Verify Razorpay payment signature using timing-safe comparison.
 * Prevents timing attacks on signature verification.
 */
export function verifyPaymentSignature(params: {
  razorpay_payment_id: string
  razorpay_subscription_id: string
  razorpay_signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not configured')

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${params.razorpay_payment_id}|${params.razorpay_subscription_id}`)
    .digest('hex')

  const expected = Buffer.from(expectedSignature, 'hex')
  const received = Buffer.from(params.razorpay_signature, 'hex')

  if (expected.length !== received.length) return false
  return crypto.timingSafeEqual(expected, received)
}

/**
 * Verify Razorpay webhook signature using timing-safe comparison.
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET not configured')

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  const expected = Buffer.from(expectedSignature, 'hex')
  const received = Buffer.from(signature, 'hex')

  if (expected.length !== received.length) return false
  return crypto.timingSafeEqual(expected, received)
}

/**
 * Map Razorpay subscription status to our internal status.
 */
export function mapSubscriptionStatus(razorpayStatus: string): string {
  const statusMap: Record<string, string> = {
    created: 'pending',
    authenticated: 'pending',
    active: 'active',
    pending: 'pending',
    halted: 'halted',
    cancelled: 'cancelled',
    completed: 'completed',
    expired: 'expired',
    paused: 'paused',
  }
  return statusMap[razorpayStatus] || 'unknown'
}
