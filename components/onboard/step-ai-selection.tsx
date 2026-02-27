"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "@/components/onboard/provider-card"
import {
  providers,
  getDefaultProvider,
  getOptionalProviders,
} from "@/lib/ai-providers"
import type { ProviderType } from "@/types/ai-provider"

/**
 * Props for the StepAISelection component
 */
interface StepAISelectionProps {
  /** Called when user continues with selected provider */
  onContinue: (provider: ProviderType) => void
  /** Called when user navigates back */
  onBack: () => void
}

/**
 * StepAISelection Component
 *
 * Step 2 of onboarding: AI provider selection.
 * Shows BrewClaw credits as default, with optional providers below.
 * Single-selection behavior (only one provider selected at a time).
 */
export function StepAISelection({ onContinue, onBack }: StepAISelectionProps) {
  // Default to BrewClaw credits
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderType>("brewclaw")

  const defaultProvider = getDefaultProvider()
  const optionalProviders = getOptionalProviders()

  const handleProviderSelect = (providerId: ProviderType) => {
    setSelectedProvider(providerId)
  }

  const handleContinue = () => {
    onContinue(selectedProvider)
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

      {/* Action buttons */}
      <div className="mt-8 space-y-4">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full"
        >
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
    </div>
  )
}
