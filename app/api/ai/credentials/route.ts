import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

/**
 * In-memory credential store for development
 *
 * SECURITY NOTES (for production):
 * - Use encryption at rest (AES-256) for stored credentials
 * - Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
 * - Never log actual API key values
 * - Implement audit logging for credential access
 * - Set appropriate TTLs for stored credentials
 */
const credentialStore = new Map<
  string,
  {
    provider: string
    credentialType: string
    value: string
    createdAt: number
  }
>()

/**
 * POST /api/ai/credentials
 *
 * Store AI provider credentials for the authenticated user.
 *
 * Request body:
 * - provider: string (e.g., "anthropic", "openai", "google")
 * - credentialType: "api_key" | "oauth"
 * - value: string (the credential value)
 *
 * Response:
 * - success: boolean
 * - error?: string
 */
export async function POST(request: NextRequest) {
  // Get authenticated session
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { provider, credentialType, value } = body

    // Validate required fields
    if (!provider || !credentialType || !value) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate provider
    const validProviders = ["anthropic", "openai", "google"]
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: "Invalid provider" },
        { status: 400 }
      )
    }

    // Validate credential type
    if (!["api_key", "oauth"].includes(credentialType)) {
      return NextResponse.json(
        { success: false, error: "Invalid credential type" },
        { status: 400 }
      )
    }

    // Store credential keyed by user email
    // In production: Encrypt value before storing
    const userKey = session.user.email
    credentialStore.set(userKey, {
      provider,
      credentialType,
      value, // TODO: Encrypt in production
      createdAt: Date.now(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to store credentials" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/credentials
 *
 * Retrieve credential metadata for the authenticated user.
 * Never returns the actual credential value.
 *
 * Response:
 * - provider: string | null
 * - credentialType: string | null
 * - hasCredentials: boolean
 */
export async function GET() {
  // Get authenticated session
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { provider: null, credentialType: null, hasCredentials: false },
      { status: 401 }
    )
  }

  const userKey = session.user.email
  const credential = credentialStore.get(userKey)

  if (!credential) {
    return NextResponse.json({
      provider: null,
      credentialType: null,
      hasCredentials: false,
    })
  }

  // Never return the actual value
  return NextResponse.json({
    provider: credential.provider,
    credentialType: credential.credentialType,
    hasCredentials: true,
  })
}
