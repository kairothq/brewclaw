"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AIProvider } from "@/types/ai-provider"

/**
 * Props for the OAuthPanel component
 */
interface OAuthPanelProps {
  /** The AI provider being configured */
  provider: AIProvider
  /** Callback when OAuth credentials are validated */
  onValidated: (credentials: { type: "oauth"; value: string }) => void
}

/**
 * OAuthPanel Component
 *
 * Handles OAuth sign-in flow for AI providers.
 * - Claude (Anthropic): Generate link -> paste authorization code
 * - OpenAI: Generate link -> paste callback URL
 * - Gemini (Google): Shows "not available" message
 */
export function OAuthPanel({ provider, onValidated }: OAuthPanelProps) {
  const [oauthUrl, setOauthUrl] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<
    "success" | "error" | null
  >(null)
  const [errorMessage, setErrorMessage] = useState("")

  // If provider doesn't support OAuth
  if (!provider.hasOAuth) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <InfoIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          OAuth sign-in is not available for {provider.name}. Please use an API
          key instead.
        </p>
      </div>
    )
  }

  // Generate OAuth URL based on provider
  const handleGenerateLink = () => {
    let url: string

    if (provider.id === "anthropic") {
      // Claude OAuth
      const clientId =
        process.env.NEXT_PUBLIC_CLAUDE_CLIENT_ID || "YOUR_CLAUDE_CLIENT_ID"
      const redirectUri =
        process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ||
        "http://localhost:3000/oauth/callback"
      const scopes = provider.oauthScopes || "org:create_api_key user:profile user:inference"

      url = `${provider.oauthUrl}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
    } else if (provider.id === "openai") {
      // OpenAI OAuth
      const clientId =
        process.env.NEXT_PUBLIC_OPENAI_CLIENT_ID || "YOUR_OPENAI_CLIENT_ID"
      const redirectUri = "http://localhost:3000/oauth/callback"
      const scopes = "openid profile email"

      url = `${provider.oauthUrl}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
    } else {
      // Fallback for other OAuth providers
      url = provider.oauthUrl || ""
    }

    setOauthUrl(url)
    setValidationResult(null)
    setErrorMessage("")

    // Open in new tab
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Validate the pasted code/URL
  const handleValidate = async () => {
    if (!inputValue.trim()) return

    setValidating(true)
    setValidationResult(null)
    setErrorMessage("")

    try {
      // Extract code from input
      let code = inputValue.trim()

      // For OpenAI, extract code from callback URL
      if (provider.id === "openai" && inputValue.includes("code=")) {
        const urlParams = new URLSearchParams(new URL(inputValue).search)
        code = urlParams.get("code") || code
      }

      // Mock validation - actual API validation in Plan 03
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any non-empty code
      if (code.length > 0) {
        setValidationResult("success")
        onValidated({ type: "oauth", value: code })
      } else {
        setValidationResult("error")
        setErrorMessage("Invalid authorization code. Please try again.")
      }
    } catch (error) {
      setValidationResult("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Validation failed. Please try again."
      )
    } finally {
      setValidating(false)
    }
  }

  // Provider-specific input configuration
  const getInputConfig = () => {
    if (provider.id === "anthropic") {
      return {
        label: "Authorization Code",
        placeholder: "Paste your authorization code here",
        instruction:
          "After signing in, copy the authorization code shown and paste it below.",
      }
    } else if (provider.id === "openai") {
      return {
        label: "Callback URL",
        placeholder: "http://localhost:3000/oauth/callback?code=...",
        instruction:
          "After signing in, you'll be redirected to localhost. Copy the full URL from your browser and paste it below.",
      }
    }
    return {
      label: "Authorization Code",
      placeholder: "Paste your code here",
      instruction: "After signing in, paste the returned code below.",
    }
  }

  const inputConfig = getInputConfig()

  return (
    <div className="space-y-4">
      {/* Generate link button */}
      <Button
        onClick={handleGenerateLink}
        className="w-full"
        variant="default"
      >
        <ExternalLinkIcon className="w-4 h-4 mr-2" />
        Generate sign-in link
      </Button>

      {/* Instructions shown after link generated */}
      {oauthUrl && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {inputConfig.instruction}
          </p>

          {/* Code/URL input */}
          <div className="space-y-2">
            <label
              htmlFor="oauth-input"
              className="text-sm font-medium text-foreground"
            >
              {inputConfig.label}
            </label>
            <Input
              id="oauth-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputConfig.placeholder}
              className="font-mono text-sm"
              disabled={validating || validationResult === "success"}
            />
          </div>

          {/* Validate button */}
          <Button
            onClick={handleValidate}
            disabled={!inputValue.trim() || validating || validationResult === "success"}
            variant="outline"
            className="w-full"
          >
            {validating ? (
              <>
                <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : validationResult === "success" ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                Connected
              </>
            ) : (
              "Check"
            )}
          </Button>

          {/* Error message */}
          {validationResult === "error" && errorMessage && (
            <div className="flex items-start gap-2 text-sm text-red-500">
              <ErrorIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success message */}
          {validationResult === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckIcon className="w-4 h-4" />
              <span>Successfully connected to {provider.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Icon components
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
