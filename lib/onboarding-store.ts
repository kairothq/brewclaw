import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Step labels constant
export const STEP_LABELS = {
  1: 'Sign In',
  2: 'AI Provider',
  3: 'Telegram',
  4: 'Choose Plan'
} as const

// Helper function to get step label
export function getStepLabel(step: 1 | 2 | 3 | 4): string {
  return STEP_LABELS[step]
}

export interface OnboardingState {
  currentStep: 1 | 2 | 3

  // Step 1 data (auth handled by NextAuth, but store email for reference)
  email: string | null

  // Step 2 data (AI selection)
  aiProvider: string | null  // 'brewclaw' | 'anthropic' | 'google' | 'openai'
  hasValidatedCredentials: boolean

  // Step 3 data (Telegram)
  botToken: string | null
  botUsername: string | null
  telegramUserId: string | null

  // Entry tracking - if user came from pricing section
  fromPricing: boolean
  selectedPlan: string | null  // Plan selected from landing page pricing

  // Actions
  setStep: (step: 1 | 2 | 3) => void
  setStepData: (step: number, data: Partial<OnboardingState>) => void
  setFromPricing: (fromPricing: boolean, plan?: string) => void
  goBack: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      email: null,
      aiProvider: null,
      hasValidatedCredentials: false,
      botToken: null,
      botUsername: null,
      telegramUserId: null,
      fromPricing: false,
      selectedPlan: null,

      // Actions
      setStep: (step) => set({ currentStep: step }),

      setStepData: (step, data) => {
        // Filter out action functions from data
        const { setStep, setStepData, setFromPricing, goBack, reset, ...stateData } = data as OnboardingState
        set(stateData)
      },

      setFromPricing: (fromPricing, plan) => set({
        fromPricing,
        selectedPlan: plan || null
      }),

      goBack: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as 1 | 2 | 3 })
        }
      },

      reset: () => set({
        currentStep: 1,
        email: null,
        aiProvider: null,
        hasValidatedCredentials: false,
        botToken: null,
        botUsername: null,
        telegramUserId: null,
        fromPricing: false,
        selectedPlan: null,
      }),
    }),
    {
      name: 'brewclaw-onboarding',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// Selector for canGoBack - derived state
export const selectCanGoBack = (state: OnboardingState): boolean => state.currentStep > 1
