"use client"

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
 * ApiKeyPanel Component (Placeholder)
 *
 * API key entry panel for AI providers.
 * Full implementation in Plan 03 - this is a placeholder showing the input structure.
 */
export function ApiKeyPanel({ provider, onValidated }: ApiKeyPanelProps) {
  // Get API key dashboard URL for the provider
  const apiKeyUrl = provider.apiKeyUrl

  return (
    <div className="space-y-4">
      {/* Link to provider's API key dashboard */}
      {apiKeyUrl && (
        <div className="text-sm text-muted-foreground">
          <p>
            Get your API key from{" "}
            <a
              href={apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 underline underline-offset-2"
            >
              {provider.name} dashboard
            </a>
          </p>
        </div>
      )}

      {/* Placeholder message */}
      <div className="p-4 rounded-lg border border-dashed border-border bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          API key entry will be implemented in the next step.
        </p>
        <p className="text-xs text-muted-foreground/70 text-center mt-2">
          For now, use the Sign In tab for OAuth authentication.
        </p>
      </div>
    </div>
  )
}
