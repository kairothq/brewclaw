"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { AIProvider } from "@/types/ai-provider"

/**
 * Props for the ApiKeyPanel component
 */
interface ApiKeyPanelProps {
  /** The AI provider being configured */
  provider: AIProvider
  /** Callback when API key credentials are validated */
  onValidated: (credentials: { type: "api_key"; value: string }) => void
}

/**
 * Get the placeholder text for API key input based on provider
 */
function getPlaceholder(providerId: string): string {
  switch (providerId) {
    case "anthropic":
      return "sk-ant-..."
    case "openai":
      return "sk-..."
    case "google":
      return "AIza..."
    default:
      return "Enter your API key"
  }
}

/**
 * ApiKeyPanel Component
 *
 * API key entry panel with show/hide toggle, validation against provider APIs,
 * and direct links to provider API key dashboards.
 */
export function ApiKeyPanel({ provider, onValidated }: ApiKeyPanelProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const apiKeyUrl = provider.apiKeyUrl

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setValidationResult("error")
      setErrorMessage("Please enter an API key")
      return
    }

    setValidating(true)
    setValidationResult(null)
    setErrorMessage("")

    try {
      const response = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: provider.id,
          credentialType: "api_key",
          value: apiKey.trim(),
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setValidationResult("success")
        onValidated({ type: "api_key", value: apiKey.trim() })
      } else {
        setValidationResult("error")
        setErrorMessage(data.error || "Invalid API key")
      }
    } catch {
      setValidationResult("error")
      setErrorMessage("Failed to validate. Please try again.")
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Link to provider's API key dashboard */}
      {apiKeyUrl && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Get your API key from</span>
          <a
            href={apiKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#999999] hover:text-white underline underline-offset-2 transition-colors"
          >
            {provider.name}
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* API Key input field */}
      <div className="space-y-2">
        <label htmlFor="api-key-input" className="text-sm font-medium text-foreground">
          API Key
        </label>
        <div className="relative">
          <input
            id="api-key-input"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              if (validationResult) {
                setValidationResult(null)
                setErrorMessage("")
              }
            }}
            placeholder={getPlaceholder(provider.id)}
            className="w-full h-10 px-3 pr-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            autoComplete="off"
            spellCheck={false}
          />
          {/* Show/Hide toggle button */}
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Check button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleValidate}
        disabled={!apiKey.trim() || validating}
        className="w-full"
      >
        {validating ? (
          <span className="flex items-center gap-2">
            <SpinnerIcon className="w-4 h-4 animate-spin" />
            Validating...
          </span>
        ) : (
          "Check"
        )}
      </Button>

      {/* Validation feedback */}
      {validationResult === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <CheckCircleIcon className="w-4 h-4" />
          <span>Valid API key</span>
        </div>
      )}

      {validationResult === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <XCircleIcon className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}

// Icon components
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
