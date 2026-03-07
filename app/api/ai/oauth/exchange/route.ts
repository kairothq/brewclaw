import { NextRequest, NextResponse } from "next/server"

/**
 * OAuth configuration for each provider
 * Using the same client IDs as official CLIs
 */
const OAUTH_CONFIG = {
  anthropic: {
    clientId: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
    tokenUrl: "https://claude.ai/oauth/token",
    redirectUri: "https://platform.claude.com/oauth/code/callback",
  },
  openai: {
    clientId: "app_EMoamEEZ73f0CkXaXp7hrann",
    tokenUrl: "https://auth.openai.com/oauth/token",
    redirectUri: "http://localhost:1455/auth/callback",
  },
}

/**
 * POST /api/ai/oauth/exchange
 *
 * Exchange OAuth authorization code for access token
 * Uses PKCE flow with the official CLI client IDs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, code, codeVerifier, redirectUri } = body

    // Validate required fields
    if (!provider || !code) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: provider, code" },
        { status: 400 }
      )
    }

    // Get provider config
    const config = OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]
    if (!config) {
      return NextResponse.json(
        { success: false, error: `Unknown provider: ${provider}` },
        { status: 400 }
      )
    }

    // Build token request body
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      code: code,
      redirect_uri: redirectUri || config.redirectUri,
    })

    // Add code_verifier for PKCE
    if (codeVerifier) {
      tokenBody.set("code_verifier", codeVerifier)
    }

    // Exchange code for token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenBody.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(`Token exchange failed for ${provider}:`, errorText)

      // Parse error if JSON
      let errorMessage = "Failed to exchange authorization code"
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error_description || errorJson.error || errorMessage
      } catch {
        // Use default error message
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }

    const tokenData = await tokenResponse.json()

    // Return success with access token
    return NextResponse.json({
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
    })
  } catch (error) {
    console.error("OAuth exchange error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
