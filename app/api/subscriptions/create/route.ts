import { NextRequest, NextResponse } from 'next/server'
import { createSubscription, getRazorpayPlanId } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

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

    // Validate plan exists
    if (!getRazorpayPlanId(planId)) {
      return NextResponse.json(
        { success: false, error: `Invalid plan ID: ${planId}` },
        { status: 400 }
      )
    }

    console.log('[Subscriptions] Creating subscription:', { userId, email, planId, trial })

    const subscription = await createSubscription({
      planId,
      customerEmail: email,
      customerName: name,
      userId,
      trial,
    })

    console.log('[Subscriptions] Created:', subscription.id)

    // Persist subscription to database if user exists
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            razorpaySubscriptionId: subscription.id,
            planId,
            status: 'pending',
          },
          update: {
            razorpaySubscriptionId: subscription.id,
            planId,
            status: 'pending',
          },
        })
      }
    } catch (dbError) {
      // Non-fatal: subscription created on Razorpay, DB save failed
      console.error('[Subscriptions] DB save failed (non-fatal):', dbError)
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    })
  } catch (error: any) {
    console.error('[Subscriptions] Create error:', error)
    const message = error?.error?.description || error?.message || 'Internal server error'
    return NextResponse.json(
      { success: false, error: message, details: error?.error || undefined },
      { status: 500 }
    )
  }
}
