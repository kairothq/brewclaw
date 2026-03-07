"use client"

import { useOnboardingStore, getStepLabel } from "@/lib/onboarding-store"

interface StepProgressProps {
  currentStep?: 1 | 2 | 3 | 4
  max?: 3 | 4
  className?: string
}

export function StepProgress({ currentStep: propStep, max = 4, className = "" }: StepProgressProps) {
  const storeStep = useOnboardingStore((state) => state.currentStep)
  const currentStep = propStep ?? storeStep

  const steps = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className={`flex flex-col items-center gap-2 opacity-80 ${className}`}>
      {/* Progress indicator: connected segments with dots and lines */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Dot */}
            <div
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${step < currentStep
                  ? "bg-white"
                  : step === currentStep
                    ? "bg-white ring-2 ring-white/50 animate-pulse"
                    : "border-2 border-zinc-600 bg-transparent"
                }
              `}
            />

            {/* Connecting line (not after last dot) */}
            {index < max - 1 && (
              <div
                className={`
                  w-8 h-0.5 transition-all duration-300
                  ${step < currentStep
                    ? "bg-white"
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
        Step {currentStep} of {max}: {getStepLabel(currentStep as 1 | 2 | 3 | 4)}
      </p>
    </div>
  )
}
