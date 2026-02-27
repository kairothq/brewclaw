import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { encrypt, decrypt } from "@/lib/crypto"

/**
 * In-memory credential store with encryption at rest
 *
 * SECURITY IMPLEMENTATION:
 * - Credentials encrypted with AES-256-GCM before storage
 * - Random IV per encryption prevents pattern analysis
 * - Auth tag prevents tampering with stored values
 *
 * PRODUCTION NOTES:
 * - Set CREDENTIAL_ENCRYPTION_KEY env var (32+ chars recommended)
 * - Consider using secrets manager for the encryption key itself
 * - Add persistence layer (database) in Phase 16
 */
const credentialStore = new Map<
  string,
  {
    provider: string
    credentialType: string
    value: string // Encrypted value
    createdAt: number
  }
>()

/**
 * Get decrypted credential for internal use (e.g., validation)
 * Never expose this in GET response
 *
 * @param userKey - User identifier (email)
 * @returns Decrypted credential data or null
 */
function getDecryptedCredential(userKey: string): {
  provider: string
  credentialType: string
  value: string
} | null {
  const stored = credentialStore.get(userKey)
  if (!stored) return null

  try {
    return {
      provider: stored.provider,
      credentialType: stored.credentialType,
      value: decrypt(stored.value), // Decrypt on retrieval
    }
  } catch (error) {
    console.error(
      "Failed to decrypt stored credential:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return null
  }
}

// Export for internal use by other API routes
export { getDecryptedCredential }

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

    // Encrypt credential value before storing
    let encryptedValue: string
    try {
      encryptedValue = encrypt(value)
    } catch (error) {
      console.error(
        "Failed to encrypt credential:",
        error instanceof Error ? error.message : "Unknown error"
      )
      return NextResponse.json(
        { success: false, error: "Failed to secure credentials" },
        { status: 500 }
      )
    }

    // Store credential keyed by user email
    const userKey = session.user.email
    credentialStore.set(userKey, {
      provider,
      credentialType,
      value: encryptedValue, // Now encrypted at rest
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

  // Never return the actual value (encrypted or decrypted)
  return NextResponse.json({
    provider: credential.provider,
    credentialType: credential.credentialType,
    hasCredentials: true,
  })
}
