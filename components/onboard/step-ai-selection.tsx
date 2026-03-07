"use client"

import { useState } from "react"
import { CredentialTabs } from "@/components/onboard/credential-tabs"
import { LiquidMetalButton } from "@/components/liquid-metal-button"
import { OAuthPanel } from "@/components/onboard/oauth-panel"
import { ApiKeyPanel } from "@/components/onboard/api-key-panel"
import { getProviderById } from "@/lib/ai-providers"
import { useOnboardingStore } from "@/lib/onboarding-store"
import type { ProviderType, ProviderCredentials } from "@/types/ai-provider"

/**
 * Props for the StepAISelection component
 */
interface StepAISelectionProps {
  /** Called when user continues with selected provider */
  onContinue: (provider: ProviderType, credentials?: ProviderCredentials) => void
  /** Called when user skips this step */
  onSkip?: () => void
  /** Called when user navigates back (optional - hides back button if not provided) */
  onBack?: () => void
}

/**
 * All 4 providers for the 2x2 grid
 */
const ALL_PROVIDERS = [
  {
    id: "brewclaw" as const,
    name: "BrewClaw",
    tagline: "Credits included",
    description: "Start immediately with $2 free credits",
    hasOAuth: false,
    recommended: true,
  },
  {
    id: "anthropic" as const,
    name: "Claude",
    tagline: "Anthropic",
    description: "Complex reasoning & analysis",
    hasOAuth: true,
    popular: true,
  },
  {
    id: "google" as const,
    name: "Gemini",
    tagline: "Google",
    description: "Multimodal & large context",
    hasOAuth: false,
  },
  {
    id: "openai" as const,
    name: "GPT",
    tagline: "OpenAI",
    description: "General-purpose assistant",
    hasOAuth: true,
  },
]

/**
 * StepAISelection Component
 *
 * Refined AI provider selection with 2x2 grid layout.
 * Uses BrewClaw design system with espresso accents.
 */
export function StepAISelection({ onContinue, onSkip, onBack }: StepAISelectionProps) {
  // Get store for preserving data on back navigation
  const store = useOnboardingStore()

  // Initialize from store (restore previous selection if navigating back)
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>(
    (store.aiProvider as ProviderType) || "brewclaw"
  )
  const [activeTab, setActiveTab] = useState<"signin" | "apikey">("signin")
  const [credentials, setCredentials] = useState<ProviderCredentials | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const selectedProviderConfig = getProviderById(selectedProvider)
  const selectedProviderData = ALL_PROVIDERS.find(p => p.id === selectedProvider)

  const handleProviderSelect = (providerId: ProviderType) => {
    if (providerId !== selectedProvider) {
      setCredentials(null)
      setActiveTab("signin")
    }
    setSelectedProvider(providerId)
  }

  const handleCredentialValidated = (cred: { type: "oauth" | "api_key"; value: string }) => {
    setCredentials({
      providerId: selectedProvider,
      credentialType: cred.type,
      value: cred.value,
      validated: true,
    })
  }

  const storeCredentials = async (creds: ProviderCredentials): Promise<boolean> => {
    try {
      const response = await fetch("/api/ai/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: creds.providerId,
          credentialType: creds.credentialType,
          value: creds.value,
        }),
      })
      const data = await response.json()
      return data.success === true
    } catch {
      console.error("Failed to store credentials")
      return false
    }
  }

  const handleContinue = async () => {
    // Save selection to store first (for back navigation preservation)
    store.setStepData(2, {
      aiProvider: selectedProvider,
      hasValidatedCredentials: credentials?.validated || false,
    })

    if (selectedProvider === "brewclaw") {
      onContinue(selectedProvider)
      return
    }

    if (credentials?.validated) {
      setIsSaving(true)
      await storeCredentials(credentials)
      setIsSaving(false)
      onContinue(selectedProvider, credentials)
      return
    }

    // If no credentials validated for external provider, still continue
    onContinue(selectedProvider, credentials || undefined)
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      // Default: continue with brewclaw
      onContinue("brewclaw")
    }
  }

  return (
    <div className="w-full">
      {/* Header - Space Grotesk for heading */}
      <div className="text-center mb-10">
        <h2 className="font-heading text-[28px] font-semibold tracking-tight text-white">
          Select AI Provider
        </h2>
        <p className="mt-3 text-[15px] text-[#999999] leading-relaxed">
          Choose how you want to power your assistant
        </p>
      </div>

      {/* 2x2 Provider Grid - Fixed position, doesn't move */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        {ALL_PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            selected={selectedProvider === provider.id}
            onClick={() => handleProviderSelect(provider.id)}
          />
        ))}
      </div>

      {/* Action Buttons - Same size, side by side */}
      <div className="mt-8 flex items-center gap-3">
        {/* Skip Button - Ghost style */}
        <button
          type="button"
          onClick={handleSkip}
          className="flex-1 h-11 rounded-xl border border-[#333333] bg-transparent text-[#666666] text-[14px] font-medium transition-all duration-200 hover:border-[#444444] hover:text-[#999999] hover:bg-[#111111]"
        >
          Skip for now
        </button>

        {/* Continue Button - Same size as Skip */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSaving}
          className="flex-1 h-11 rounded-xl bg-white text-[#0A0A0A] text-[14px] font-medium transition-all duration-200 hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Continue"}
        </button>
      </div>

      {/* Credential Section - Slides in from below, outside main card flow */}
      {selectedProvider !== "brewclaw" && selectedProviderConfig && selectedProviderData?.hasOAuth !== false && (
        <div className="mt-6 p-5 rounded-xl border border-[#222222] bg-[#111111] animate-in slide-in-from-bottom-4 duration-300">
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

          {credentials?.validated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Connected successfully</span>
            </div>
          )}
        </div>
      )}

      {/* API Key only section for Google */}
      {selectedProvider === "google" && selectedProviderConfig && (
        <div className="mt-6 p-5 rounded-xl border border-[#222222] bg-[#111111] animate-in slide-in-from-bottom-4 duration-300">
          <ApiKeyPanel
            provider={selectedProviderConfig}
            onValidated={handleCredentialValidated}
          />
          {credentials?.validated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircleIcon className="w-4 h-4" />
              <span>API key verified</span>
            </div>
          )}
        </div>
      )}

      {/* Back Link - only show if onBack is provided */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 text-[13px] text-[#666666] hover:text-[#999999] transition-colors py-2"
        >
          Go back
        </button>
      )}
    </div>
  )
}

/**
 * Provider Card Component
 *
 * Minimal card design with espresso brown selection state
 */
function ProviderCard({
  provider,
  selected,
  onClick,
}: {
  provider: typeof ALL_PROVIDERS[0]
  selected: boolean
  onClick: () => void
}) {
  const isBrewClaw = provider.id === "brewclaw"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative p-6 rounded-xl text-left transition-all duration-200 h-[160px]
        ${selected
          ? "bg-[#111111] border-2 border-[#78350F] shadow-[0_0_0_1px_rgba(120,53,15,0.3)]"
          : "bg-[#111111] border border-[#222222] hover:border-[#333333]"
        }
      `}
    >
      {/* Popular Badge - always visible */}
      {provider.popular && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#333333] text-[10px] font-medium text-[#999999] uppercase tracking-wider">
          Popular
        </div>
      )}

      {/* Recommended Badge for BrewClaw */}
      {provider.recommended && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#78350F]/20 border border-[#78350F]/50 text-[10px] font-medium text-[#D4A574] uppercase tracking-wider">
          Recommended
        </div>
      )}

      {/* Selected Indicator - positioned at bottom-right to avoid badge overlap */}
      {selected && (
        <div className="absolute bottom-3 right-3">
          <div className="w-5 h-5 rounded-full bg-[#78350F] flex items-center justify-center">
            <CheckIcon className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {/* Provider Icon */}
        <div className="mb-4">
          <ProviderIcon providerId={provider.id} />
        </div>

        {/* Provider Info */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-[16px] font-semibold text-white">
              {provider.name}
            </span>
            {!isBrewClaw && (
              <span className="text-[12px] text-[#666666]">
                {provider.tagline}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#666666] leading-snug">
            {provider.description}
          </p>
        </div>

      </div>
    </button>
  )
}

/**
 * Provider icon based on provider ID
 * Using monochromatic/grayscale palette
 */
function ProviderIcon({ providerId }: { providerId: string }) {
  const baseClass = "w-10 h-10 rounded-lg flex items-center justify-center"

  switch (providerId) {
    case "brewclaw":
      return (
        <div className={`${baseClass} bg-gradient-to-br from-[#78350F] to-[#451A03]`}>
          <CoffeeIcon className="w-5 h-5 text-white" />
        </div>
      )
    case "anthropic":
      return (
        <div className={`${baseClass} bg-[#1a1a1a] border border-[#333333]`}>
          <AnthropicIcon className="w-5 h-5 text-[#D97757]" />
        </div>
      )
    case "google":
      return (
        <div className={`${baseClass} bg-[#1a1a1a] border border-[#333333]`}>
          <GoogleIcon className="w-5 h-5" />
        </div>
      )
    case "openai":
      return (
        <div className={`${baseClass} bg-[#1a1a1a] border border-[#333333]`}>
          <OpenAIIcon className="w-5 h-5 text-white" />
        </div>
      )
    default:
      return (
        <div className={`${baseClass} bg-[#1a1a1a] border border-[#333333]`}>
          <span className="text-white font-semibold text-sm">?</span>
        </div>
      )
  }
}

// Icons

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}

function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 10.501L7.93 6.884l-2.772 7.136h5.543z" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
