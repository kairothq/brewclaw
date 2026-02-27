/**
 * AI Provider Validation Functions
 *
 * Server-side validation functions for each AI provider's credentials.
 * Validates API keys against actual provider APIs and OAuth credentials.
 */

/**
 * Validation result returned by all validation functions
 */
export interface ValidationResult {
  /** Whether the credential is valid */
  valid: boolean
  /** Error message if validation failed */
  error?: string
  /** Access token (for OAuth validation) */
  accessToken?: string
}

/**
 * Validate an Anthropic (Claude) API key
 *
 * Calls the Anthropic Messages API with a minimal request to verify the key.
 * Rate limiting (429) is treated as valid since the key itself works.
 */
export async function validateAnthropicKey(
  apiKey: string
): Promise<ValidationResult> {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, error: "API key required" }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "hi" }],
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return { valid: true }
    }

    if (response.status === 401) {
      return { valid: false, error: "Invalid API key" }
    }

    if (response.status === 429) {
      // Rate limited but key is valid
      return { valid: true }
    }

    if (response.status === 400) {
      // Bad request but key authenticated - might be model unavailable
      const data = await response.json().catch(() => ({}))
      if (data.error?.type === "invalid_request_error") {
        // Key is valid, just request issue
        return { valid: true }
      }
      return { valid: false, error: "Invalid API key format" }
    }

    return { valid: false, error: `Validation failed (${response.status})` }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, error: "Validation timed out" }
    }
    return { valid: false, error: "Failed to validate. Please try again." }
  }
}

/**
 * Validate an OpenAI API key
 *
 * Calls the OpenAI Models API (lightweight endpoint) to verify the key.
 * Rate limiting (429) is treated as valid since the key itself works.
 */
export async function validateOpenAIKey(
  apiKey: string
): Promise<ValidationResult> {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, error: "API key required" }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return { valid: true }
    }

    if (response.status === 401) {
      return { valid: false, error: "Invalid API key" }
    }

    if (response.status === 429) {
      // Rate limited but key is valid
      return { valid: true }
    }

    return { valid: false, error: `Validation failed (${response.status})` }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, error: "Validation timed out" }
    }
    return { valid: false, error: "Failed to validate. Please try again." }
  }
}

/**
 * Validate a Google (Gemini) API key
 *
 * Calls the Google AI Models API to verify the key.
 */
export async function validateGoogleKey(
  apiKey: string
): Promise<ValidationResult> {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, error: "API key required" }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(
        apiKey.trim()
      )}`,
      {
        method: "GET",
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (response.ok) {
      return { valid: true }
    }

    if (response.status === 400 || response.status === 403) {
      return { valid: false, error: "Invalid API key" }
    }

    if (response.status === 429) {
      // Rate limited but key is valid
      return { valid: true }
    }

    return { valid: false, error: `Validation failed (${response.status})` }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { valid: false, error: "Validation timed out" }
    }
    return { valid: false, error: "Failed to validate. Please try again." }
  }
}

/**
 * Validate OAuth credentials
 *
 * For MVP: Validates that OAuth code/callback URL has expected format.
 * Full OAuth token exchange would require server-side secrets.
 */
export async function validateOAuthCredential(
  provider: "anthropic" | "openai",
  credentialType: "code" | "callback_url",
  value: string
): Promise<ValidationResult> {
  if (!value || !value.trim()) {
    return { valid: false, error: "Credential required" }
  }

  const trimmedValue = value.trim()

  if (provider === "anthropic") {
    // Claude authorization code - typically alphanumeric, at least 20 chars
    if (credentialType === "code") {
      if (trimmedValue.length >= 10) {
        return { valid: true, accessToken: trimmedValue }
      }
      return { valid: false, error: "Invalid authorization code format" }
    }
    return { valid: false, error: "Unsupported credential type" }
  }

  if (provider === "openai") {
    // OpenAI callback URL should contain ?code= parameter
    if (credentialType === "callback_url") {
      try {
        const url = new URL(trimmedValue)
        const code = url.searchParams.get("code")
        if (code && code.length > 0) {
          return { valid: true, accessToken: code }
        }
        return { valid: false, error: "No authorization code found in URL" }
      } catch {
        return { valid: false, error: "Invalid callback URL format" }
      }
    }
    return { valid: false, error: "Unsupported credential type" }
  }

  return { valid: false, error: "Unknown provider" }
}

/**
 * Provider type union for validation
 */
export type ValidatableProvider = "anthropic" | "openai" | "google"

/**
 * Check if a provider ID is validatable
 */
export function isValidatableProvider(
  provider: string
): provider is ValidatableProvider {
  return ["anthropic", "openai", "google"].includes(provider)
}
