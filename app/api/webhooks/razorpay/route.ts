import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, mapSubscriptionStatus } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Verify webhook signature (timing-safe)
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('[Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventId = event.event_id || event.id
    const eventType = event.event

    console.log('[Webhook] Received:', eventType, eventId)

    // Idempotency check — skip if already processed
    if (eventId) {
      const existing = await prisma.webhookEvent.findUnique({
        where: { eventId },
      })
      if (existing?.processed) {
        console.log('[Webhook] Already processed:', eventId)
        return NextResponse.json({ status: 'already_processed' })
      }

      // Record the event
      await prisma.webhookEvent.upsert({
        where: { eventId },
        create: {
          eventId,
          eventType,
          payload: rawBody,
          processed: false,
        },
        update: {},
      })
    }

    // Handle subscription events
    const subscriptionEntity = event.payload?.subscription?.entity
    if (subscriptionEntity) {
      const razorpaySubId = subscriptionEntity.id
      const newStatus = mapSubscriptionStatus(subscriptionEntity.status)

      try {
        await prisma.subscription.update({
          where: { razorpaySubscriptionId: razorpaySubId },
          data: {
            status: newStatus,
            currentPeriodStart: subscriptionEntity.current_start
              ? new Date(subscriptionEntity.current_start * 1000)
              : undefined,
            currentPeriodEnd: subscriptionEntity.current_end
              ? new Date(subscriptionEntity.current_end * 1000)
              : undefined,
            cancelledAt: eventType === 'subscription.cancelled' ? new Date() : undefined,
          },
        })
        console.log('[Webhook] Updated subscription:', razorpaySubId, '→', newStatus)
      } catch (dbError) {
        console.error('[Webhook] Subscription not found in DB:', razorpaySubId)
      }
    }

    // Mark event as processed
    if (eventId) {
      await prisma.webhookEvent.update({
        where: { eventId },
        data: { processed: true },
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
