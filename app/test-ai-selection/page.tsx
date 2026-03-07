"use client"

import { StepAISelection } from "@/components/onboard/step-ai-selection"
import { StarParticles } from "@/components/star-particles"
import type { ProviderType, ProviderCredentials } from "@/types/ai-provider"

export default function TestAISelection() {
  const handleContinue = (provider: ProviderType, credentials?: ProviderCredentials) => {
    console.log("Continue clicked:", { provider, credentials })
    alert(`Selected: ${provider}\nCredentials validated: ${credentials?.validated ?? "N/A"}`)
  }

  const handleSkip = () => {
    console.log("Skip clicked")
    alert("Skipped - using BrewClaw credits")
  }

  const handleBack = () => {
    console.log("Back clicked")
    alert("Back button clicked")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Star particles background */}
      <StarParticles />

      {/* Subtle ambient glow - espresso tones */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#78350F]/[0.03] rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#451A03]/[0.04] rounded-full filter blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px]">
          {/* Card container - minimal glass effect */}
          <div className="rounded-2xl border border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-sm shadow-2xl p-8">
            <StepAISelection
              onContinue={handleContinue}
              onSkip={handleSkip}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
