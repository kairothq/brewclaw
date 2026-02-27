import { NextRequest, NextResponse } from "next/server"
import {
  validateAnthropicKey,
  validateOpenAIKey,
  validateGoogleKey,
  validateOAuthCredential,
  isValidatableProvider,
} from "@/lib/ai-validation"

/**
 * In-memory rate limiting store
 * In production, use Redis or similar for distributed rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Check rate limit for an IP address
 * Allows max 5 validation attempts per minute per IP
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
  }

  if (!limit || limit.resetAt < now) {
    // Reset or create new limit
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 }) // 1 minute window
    return { allowed: true }
  }

  if (limit.count >= 5) {
    return {
      allowed: false,
      retryAfter: Math.ceil((limit.resetAt - now) / 1000),
    }
  }

  limit.count++
  return { allowed: true }
}

/**
 * POST /api/ai/validate
 *
 * Validates AI provider credentials (API keys or OAuth credentials).
 *
 * Request body:
 * - provider: "anthropic" | "openai" | "google"
 * - credentialType: "api_key" | "oauth"
 * - value: string (API key or OAuth code/URL)
 *
 * Response:
 * - valid: boolean
 * - error?: string (if invalid)
 */
export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  // Check rate limit
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { valid: false, error: `Too many attempts. Try again in ${rateLimit.retryAfter}s` },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { provider, credentialType, value } = body

    // Validate required fields
    if (!provider || !credentialType || !value) {
      return NextResponse.json(
        { valid: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate provider
    if (!isValidatableProvider(provider)) {
      return NextResponse.json(
        { valid: false, error: "Unknown provider" },
        { status: 400 }
      )
    }

    // Route to appropriate validation function
    if (credentialType === "api_key") {
      let result
      switch (provider) {
        case "anthropic":
          result = await validateAnthropicKey(value)
          break
        case "openai":
          result = await validateOpenAIKey(value)
          break
        case "google":
          result = await validateGoogleKey(value)
          break
        default:
          return NextResponse.json(
            { valid: false, error: "Unknown provider" },
            { status: 400 }
          )
      }

      return NextResponse.json({
        valid: result.valid,
        ...(result.error && { error: result.error }),
      })
    }

    if (credentialType === "oauth") {
      // OAuth validation for anthropic and openai
      if (provider === "google") {
        return NextResponse.json(
          { valid: false, error: "Google does not support OAuth authentication" },
          { status: 400 }
        )
      }

      // Determine OAuth credential type based on value format
      const oauthType = value.startsWith("http") ? "callback_url" : "code"

      const result = await validateOAuthCredential(
        provider as "anthropic" | "openai",
        oauthType,
        value
      )

      return NextResponse.json({
        valid: result.valid,
        ...(result.error && { error: result.error }),
      })
    }

    return NextResponse.json(
      { valid: false, error: "Invalid credential type" },
      { status: 400 }
    )
  } catch {
    // Never expose internal errors
    return NextResponse.json(
      { valid: false, error: "Validation failed. Please try again." },
      { status: 500 }
    )
  }
}
