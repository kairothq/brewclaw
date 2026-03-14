import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const GCP_API_URL = process.env.GCP_API_URL
const GCP_API_SECRET = process.env.GCP_API_SECRET

/**
 * GET /api/containers/logs?userId=xxx&lines=100
 * Fetch container logs from GCP VM.
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get('userId')
  const lines = req.nextUrl.searchParams.get('lines') || '100'

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  if (!GCP_API_URL || !GCP_API_SECRET) {
    return NextResponse.json({ error: 'GCP API not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(`${GCP_API_URL}/instances/${userId}/logs?lines=${lines}`, {
      headers: { 'X-API-Key': GCP_API_SECRET },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Failed to fetch logs', details: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Containers] Logs error:', error)
    return NextResponse.json({ error: 'Failed to reach GCP' }, { status: 502 })
  }
}
