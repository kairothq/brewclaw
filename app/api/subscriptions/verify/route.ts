import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

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

    // Timing-safe signature verification
    const isValid = verifyPaymentSignature({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    })

    if (!isValid) {
      console.error('[Verify] Invalid signature')
      return NextResponse.json({
        verified: false,
        provisioned: false,
        error: 'Invalid payment signature',
      })
    }

    console.log('[Verify] Payment verified:', { razorpay_payment_id, razorpay_subscription_id })

    // Update subscription in database
    try {
      await prisma.subscription.update({
        where: { razorpaySubscriptionId: razorpay_subscription_id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: 'active',
          currentPeriodStart: new Date(),
        },
      })
    } catch (dbError) {
      console.error('[Verify] DB update failed (non-fatal):', dbError)
    }

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
      console.error('[Verify] GCP API not configured')
      return NextResponse.json({
        verified: true,
        provisioned: false,
        error: 'Container provisioning not configured',
      })
    }

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
      console.error('[Verify] GCP provision failed:', errorText)
      return NextResponse.json({
        verified: true,
        provisioned: false,
        error: 'Container provisioning failed',
      })
    }

    const provisionResult = await provisionResponse.json()
    console.log('[Verify] Container provisioned:', provisionResult)

    return NextResponse.json({
      verified: true,
      provisioned: true,
      userId: provisionResult.userId || provisionResult.user_id,
      subdomain: provisionResult.subdomain,
      url: provisionResult.url,
    })
  } catch (error) {
    console.error('[Verify] Error:', error)
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
