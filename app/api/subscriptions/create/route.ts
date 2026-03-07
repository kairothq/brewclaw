import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

/**
 * POST /api/subscriptions/create
 *
 * Creates a Razorpay subscription for the user.
 *
 * Request body:
 * - userId: string (temporary ID for notes)
 * - email: string
 * - planId: string ('free' | 'starter' | 'pro' | 'business')
 * - name: string
 * - trial: boolean (if true, creates deferred billing subscription)
 *
 * Returns:
 * - success: boolean
 * - subscriptionId: string (Razorpay subscription ID)
 * - error?: string
 */

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Map plan IDs to Razorpay plan IDs
const RAZORPAY_PLANS: Record<string, string> = {
  starter: process.env.RAZORPAY_PLAN_STARTER!,
  pro: process.env.RAZORPAY_PLAN_PRO!,
  business: process.env.RAZORPAY_PLAN_BUSINESS!,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, email, planId, name, trial } = body

    if (!userId || !email || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get Razorpay plan ID
    const razorpayPlanId = RAZORPAY_PLANS[planId]
    if (!razorpayPlanId) {
      return NextResponse.json(
        { success: false, error: `Invalid plan ID: ${planId}` },
        { status: 400 }
      )
    }

    console.log('[Subscriptions] Creating subscription:', {
      userId,
      email,
      planId,
      razorpayPlanId,
      trial,
    })

    // Create subscription on Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12, // 12 months
      quantity: 1,
      start_at: trial
        ? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // Start after 7 days for trial
        : undefined,
      notes: {
        userId,
        email,
        name,
        planId,
        isTrial: trial ? 'true' : 'false',
      },
    })

    console.log('[Subscriptions] Created:', subscription.id)

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    })
  } catch (error) {
    console.error('[Subscriptions] Create error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
