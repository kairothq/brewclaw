import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: Verify Razorpay signature using crypto
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    //   .digest('hex')
    // const isValid = expectedSignature === razorpay_signature

    // Mock verification for development
    const verified = true

    if (!verified) {
      return NextResponse.json({
        verified: false,
        provisioned: false,
        error: 'Invalid payment signature',
      })
    }

    // TODO: Provision container with provisionData
    // For now, return mock provisioning success
    const mockUserId = `usr_${Date.now()}`
    const mockSubdomain = `bot-${mockUserId.slice(-6)}`
    const mockUrl = `https://${mockSubdomain}.brewclaw.app`

    console.log('[Subscriptions] Verify and provision:', {
      razorpay_payment_id,
      razorpay_subscription_id,
      provisionData,
    })

    return NextResponse.json({
      verified: true,
      provisioned: true,
      userId: mockUserId,
      subdomain: mockSubdomain,
      url: mockUrl,
    })
  } catch (error) {
    console.error('[Subscriptions] Verify error:', error)
    return NextResponse.json(
      { verified: false, provisioned: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
