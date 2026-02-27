"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "@/components/onboard/provider-card"
import { CredentialTabs } from "@/components/onboard/credential-tabs"
import { OAuthPanel } from "@/components/onboard/oauth-panel"
import { ApiKeyPanel } from "@/components/onboard/api-key-panel"
import {
  providers,
  getDefaultProvider,
  getOptionalProviders,
  getProviderById,
} from "@/lib/ai-providers"
import type { ProviderType, ProviderCredentials } from "@/types/ai-provider"

/**
 * Props for the StepAISelection component
 */
interface StepAISelectionProps {
  /** Called when user continues with selected provider */
  onContinue: (provider: ProviderType, credentials?: ProviderCredentials) => void
  /** Called when user navigates back */
  onBack: () => void
}

/**
 * StepAISelection Component
 *
 * Step 2 of onboarding: AI provider selection.
 * Shows BrewClaw credits as default, with optional providers below.
 * Single-selection behavior (only one provider selected at a time).
 * When a non-BrewClaw provider is selected, shows credential tabs (Sign In / API Key).
 */
export function StepAISelection({ onContinue, onBack }: StepAISelectionProps) {
  // Default to BrewClaw credits
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderType>("brewclaw")

  // Credential tab state
  const [activeTab, setActiveTab] = useState<"signin" | "apikey">("signin")

  // Validated credentials storage
  const [credentials, setCredentials] = useState<ProviderCredentials | null>(
    null
  )

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const defaultProvider = getDefaultProvider()
  const optionalProviders = getOptionalProviders()

  // Get the currently selected provider config
  const selectedProviderConfig = getProviderById(selectedProvider)

  const handleProviderSelect = (providerId: ProviderType) => {
    // Reset credentials and tab when switching providers
    if (providerId !== selectedProvider) {
      setCredentials(null)
      setActiveTab("signin")
    }
    setSelectedProvider(providerId)
  }

  const handleCredentialValidated = (cred: {
    type: "oauth" | "api_key"
    value: string
  }) => {
    setCredentials({
      providerId: selectedProvider,
      credentialType: cred.type,
      value: cred.value,
      validated: true,
    })
  }

  const handleContinue = () => {
    // BrewClaw doesn't need credentials
    if (selectedProvider === "brewclaw") {
      onContinue(selectedProvider)
      return
    }

    // If credentials are validated, proceed
    if (credentials?.validated) {
      onContinue(selectedProvider, credentials)
      return
    }

    // Show confirmation if proceeding without validation
    setShowConfirmDialog(true)
  }

  const handleConfirmContinue = () => {
    setShowConfirmDialog(false)
    onContinue(selectedProvider, credentials || undefined)
  }

  const handleCancelContinue = () => {
    setShowConfirmDialog(false)
  }

  const handleSkip = () => {
    // Skip defaults to BrewClaw credits
    onContinue("brewclaw")
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Choose your AI Provider
        </h2>
        <p className="mt-2 text-muted-foreground">
          BrewClaw credits are included by default. Connect your own provider
          for more control.
        </p>
      </div>

      {/* Default option section */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Default (No setup required)
        </p>
        <ProviderCard
          provider={defaultProvider}
          selected={selectedProvider === "brewclaw"}
          onClick={() => handleProviderSelect("brewclaw")}
        />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or connect your own provider
          </span>
        </div>
      </div>

      {/* Optional providers section */}
      <div className="space-y-3">
        {optionalProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            selected={selectedProvider === provider.id}
            recommended={provider.recommended}
            onClick={() => handleProviderSelect(provider.id)}
          />
        ))}
      </div>

      {/* Credential tabs - shown when a non-BrewClaw provider is selected */}
      {selectedProvider !== "brewclaw" && selectedProviderConfig && (
        <CredentialTabs
          provider={selectedProviderConfig}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {activeTab === "signin" ? (
            <OAuthPanel
              provider={selectedProviderConfig}
              onValidated={handleCredentialValidated}
            />
          ) : (
            <ApiKeyPanel
              provider={selectedProviderConfig}
              onValidated={handleCredentialValidated}
            />
          )}
        </CredentialTabs>
      )}

      {/* Validation status indicator */}
      {selectedProvider !== "brewclaw" && credentials?.validated && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
          <CheckIcon className="w-4 h-4" />
          <span>Credentials verified</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-8 space-y-4">
        <Button onClick={handleContinue} size="lg" className="w-full">
          Continue
        </Button>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Info note */}
      <p className="mt-6 text-xs text-muted-foreground text-center">
        You can change your AI provider anytime in Settings
      </p>

      {/* Confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelContinue}
          />

          {/* Dialog */}
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Credentials not verified
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven&apos;t verified your {selectedProviderConfig?.name}{" "}
              credentials. You can continue, but you&apos;ll need to set up
              credentials in Settings before using AI features.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancelContinue}>
                Go back
              </Button>
              <Button onClick={handleConfirmContinue}>Continue anyway</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// CheckIcon component
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
