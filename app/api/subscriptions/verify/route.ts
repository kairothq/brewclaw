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

    // Step 1: Timing-safe signature verification
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

    // Step 2: Update subscription status in database
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

    // Step 3: Provision container via GCP API
    let provisioned = false
    let provisionResult: any = null

    if (provisionData) {
      const gcpApiUrl = process.env.GCP_API_URL
      const gcpApiSecret = process.env.GCP_API_SECRET

      if (gcpApiUrl && gcpApiSecret) {
        try {
          // Map AI provider names to what GCP expects
          const aiProviderMap: Record<string, string> = {
            brewclaw: 'anthropic', // BrewClaw credits use Anthropic under the hood
            anthropic: 'anthropic',
            google: 'gemini',
            openai: 'openai',
          }

          const mappedProvider = aiProviderMap[provisionData.aiProvider] || provisionData.aiProvider || 'anthropic'
          const userId = provisionData.email?.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20) || 'user' + Date.now()

          const provisionResponse = await fetch(`${gcpApiUrl}/provision`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': gcpApiSecret,
            },
            body: JSON.stringify({
              userId,
              botToken: provisionData.telegramToken || '',
              ownerIds: provisionData.telegramUserId ? [provisionData.telegramUserId] : [],
              aiProvider: mappedProvider,
              apiKey: provisionData.apiKey || '',
              email: provisionData.email || '',
              plan: provisionData.plan || 'pro',
              subscriptionId: razorpay_subscription_id,
              paymentId: razorpay_payment_id,
            }),
          })

          if (provisionResponse.ok) {
            provisionResult = await provisionResponse.json()
            provisioned = true
            console.log('[Verify] Container provisioned:', provisionResult)
          } else {
            const errorText = await provisionResponse.text()
            console.error('[Verify] GCP provision failed:', errorText)
          }
        } catch (provisionError) {
          console.error('[Verify] GCP provision error:', provisionError)
        }
      } else {
        console.error('[Verify] GCP API not configured')
      }
    }

    // Return success — payment is verified regardless of provisioning
    return NextResponse.json({
      verified: true,
      provisioned,
      userId: provisionResult?.userId || provisionResult?.user_id,
      subdomain: provisionResult?.subdomain,
      url: provisionResult?.url,
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
