import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * POST /api/subscriptions/verify
 *
 * Verifies Razorpay payment signature and provisions container.
 *
 * Request body:
 * - razorpay_payment_id: string
 * - razorpay_subscription_id: string
 * - razorpay_signature: string
 * - provisionData: {
 *     telegramToken: string
 *     telegramUserId: string
 *     aiProvider: string
 *     apiKey: string
 *     email: string
 *     plan: string
 *   }
 *
 * Returns:
 * - verified: boolean
 * - provisioned: boolean
 * - userId?: string (actual user ID after provisioning)
 * - subdomain?: string
 * - url?: string
 * - error?: string
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      provisionData,
    } = body

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, provisioned: false, error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      console.error('[Subscriptions] Invalid signature')
      return NextResponse.json({
        verified: false,
        provisioned: false,
        error: 'Invalid payment signature',
      })
    }

    console.log('[Subscriptions] Payment verified:', {
      razorpay_payment_id,
      razorpay_subscription_id,
    })

    // Provision container via GCP API
    if (!provisionData) {
      return NextResponse.json({
        verified: true,
        provisioned: false,
        error: 'Missing provision data',
      })
    }

    const gcpApiUrl = process.env.GCP_API_URL
    const gcpApiSecret = process.env.GCP_API_SECRET

    if (!gcpApiUrl || !gcpApiSecret) {
      console.error('[Subscriptions] GCP API not configured')
      return NextResponse.json({
        verified: true,
        provisioned: false,
        error: 'Container provisioning not configured',
      })
    }

    // Call GCP API to provision container
    const provisionResponse = await fetch(`${gcpApiUrl}/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gcpApiSecret}`,
      },
      body: JSON.stringify({
        telegramToken: provisionData.telegramToken,
        telegramUserId: provisionData.telegramUserId,
        aiProvider: provisionData.aiProvider,
        apiKey: provisionData.apiKey,
        email: provisionData.email,
        plan: provisionData.plan,
        subscriptionId: razorpay_subscription_id,
        paymentId: razorpay_payment_id,
      }),
    })

    if (!provisionResponse.ok) {
      const errorText = await provisionResponse.text()
      console.error('[Subscriptions] GCP provision failed:', errorText)
      return NextResponse.json({
        verified: true,
        provisioned: false,
        error: 'Container provisioning failed',
      })
    }

    const provisionResult = await provisionResponse.json()

    console.log('[Subscriptions] Container provisioned:', provisionResult)

    return NextResponse.json({
      verified: true,
      provisioned: true,
      userId: provisionResult.userId || provisionResult.user_id,
      subdomain: provisionResult.subdomain,
      url: provisionResult.url,
    })
  } catch (error) {
    console.error('[Subscriptions] Verify error:', error)
    return NextResponse.json(
      {
        verified: false,
        provisioned: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
