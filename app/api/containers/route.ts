import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const GCP_API_URL = process.env.GCP_API_URL
const GCP_API_SECRET = process.env.GCP_API_SECRET

/**
 * Proxy container management requests to GCP VM.
 *
 * GET /api/containers?userId=xxx         → Get instance status
 * POST /api/containers { action, userId } → start/stop/restart
 */

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  if (!GCP_API_URL || !GCP_API_SECRET) {
    return NextResponse.json({ error: 'GCP API not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(`${GCP_API_URL}/instances/${userId}/status`, {
      headers: { 'X-API-Key': GCP_API_SECRET },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Failed to fetch status', details: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Containers] Status error:', error)
    return NextResponse.json({ error: 'Failed to reach GCP' }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action, userId } = body

  if (!action || !userId) {
    return NextResponse.json({ error: 'Missing action or userId' }, { status: 400 })
  }

  if (!['start', 'stop', 'restart'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (!GCP_API_URL || !GCP_API_SECRET) {
    return NextResponse.json({ error: 'GCP API not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(`${GCP_API_URL}/instances/${userId}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GCP_API_SECRET,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: `Failed to ${action}`, details: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`[Containers] ${action} error:`, error)
    return NextResponse.json({ error: 'Failed to reach GCP' }, { status: 502 })
  }
}
