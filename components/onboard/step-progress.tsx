"use client"

import { useOnboardingStore } from "@/lib/onboarding-store"

interface StepProgressProps {
  currentStep?: 1 | 2 | 3
  className?: string
}

const STEP_NAMES = {
  1: "Sign Up",
  2: "AI Provider",
  3: "Telegram",
} as const

export function StepProgress({ currentStep: propStep, className = "" }: StepProgressProps) {
  const storeStep = useOnboardingStore((state) => state.currentStep)
  const currentStep = propStep ?? storeStep

  return (
    <div className={`flex flex-col items-center gap-2 opacity-80 ${className}`}>
      {/* Progress indicator: connected segments with dots and lines */}
      <div className="flex items-center">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Dot */}
            <div
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${step < currentStep
                  ? "bg-orange-500"
                  : step === currentStep
                    ? "bg-orange-500 ring-2 ring-orange-500/50 animate-pulse"
                    : "border-2 border-zinc-600 bg-transparent"
                }
              `}
            />

            {/* Connecting line (not after last dot) */}
            {index < 2 && (
              <div
                className={`
                  w-8 h-0.5 transition-all duration-300
                  ${step < currentStep
                    ? "bg-orange-500"
                    : "bg-zinc-600"
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Label */}
      <p className="text-sm text-muted-foreground">
        Step {currentStep} of 3: {STEP_NAMES[currentStep]}
      </p>
    </div>
  )
}
