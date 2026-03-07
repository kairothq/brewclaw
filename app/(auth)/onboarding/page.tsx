"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { StepProgress } from "@/components/onboard/step-progress"
import { StepAISelection } from "@/components/onboard/step-ai-selection"
import { StepTelegram } from "@/components/onboard/step-telegram"
import { StepSuccessTransition } from "@/components/onboard/step-success-transition"
import type { ProviderType, ProviderCredentials } from "@/types/ai-provider"

/**
 * OnboardingPage Component
 *
 * Main orchestration page for the 3-step onboarding flow.
 * Step 1: Auth (handled by NextAuth, user redirects here after signin)
 * Step 2: AI Provider Selection
 * Step 3: Telegram Bot Connection
 *
 * Features:
 * - Zustand store for state persistence
 * - Framer Motion slide animations
 * - Back navigation support
 */
export default function OnboardingPage() {
  const router = useRouter()
  const store = useOnboardingStore()
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [showSuccess, setShowSuccess] = useState(false)

  // Slide animation variants
  const slideVariants = {
    enter: (direction: "forward" | "back") => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "back") => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
    }),
  }

  // Navigation handlers
  const handleNext = () => {
    setDirection("forward")
    if (store.currentStep < 3) {
      store.setStep((store.currentStep + 1) as 1 | 2 | 3)
    }
  }

  const handleBack = () => {
    setDirection("back")
    store.goBack()
  }

  // Step 2 completion handler
  const handleAISelectionContinue = (
    provider: ProviderType,
    credentials?: ProviderCredentials
  ) => {
    // Save to store
    store.setStepData(2, {
      aiProvider: provider,
      hasValidatedCredentials: credentials?.validated || false,
    })
    // Move to next step
    handleNext()
  }

  // Step 3 completion handler
  const handleTelegramContinue = (data: { botToken: string; userId: string }) => {
    // Save to store
    store.setStepData(3, {
      botToken: data.botToken,
      telegramUserId: data.userId,
    })
    // Show success transition
    setShowSuccess(true)
  }

  // Success transition complete handler
  const handleSuccessComplete = () => {
    // Store data is already in sessionStorage
    // Redirect to payment page
    router.push("/onboard")
  }

  // Render current step content
  const renderStep = () => {
    switch (store.currentStep) {
      case 1:
        // Step 1 is auth - user arrives here after signing in
        // Automatically advance to step 2
        store.setStep(2)
        return null

      case 2:
        return (
          <StepAISelection
            onContinue={handleAISelectionContinue}
            onBack={handleBack}
          />
        )

      case 3:
        return (
          <StepTelegram
            onContinue={handleTelegramContinue}
            onBack={handleBack}
          />
        )

      default:
        return null
    }
  }

  // Show success transition full-page
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <StepSuccessTransition onComplete={handleSuccessComplete} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Progress indicator at top center */}
      <div className="pt-8 flex justify-center">
        <StepProgress />
      </div>

      {/* Step content with slide animation */}
      <div className="relative w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={store.currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full max-w-2xl mx-auto px-4 py-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
