import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/subscriptions/create
 *
 * Creates a Razorpay subscription for the user.
 *
 * Request body:
 * - userId: string (temporary ID for notes)
 * - email: string
 * - planId: string ('starter' | 'pro' | 'team')
 * - name: string
 * - trial: boolean (if true, creates deferred billing subscription)
 *
 * Returns:
 * - success: boolean
 * - subscriptionId: string (Razorpay subscription ID)
 * - error?: string
 */
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

    // TODO: Integrate with actual Razorpay API
    // For now, return mock subscription ID for development
    const mockSubscriptionId = `sub_mock_${Date.now()}`

    console.log('[Subscriptions] Create request:', { userId, email, planId, trial })

    return NextResponse.json({
      success: true,
      subscriptionId: mockSubscriptionId,
    })
  } catch (error) {
    console.error('[Subscriptions] Create error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
