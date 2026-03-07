"use client"

import { VideoPlayer } from "./video-player"
import { TelegramForm } from "./telegram-form"

/**
 * Props for the StepTelegram component
 */
interface StepTelegramProps {
  /** Called when user continues with validated data */
  onContinue: (data: { botToken: string; userId: string }) => void
  /** Called when user navigates back */
  onBack: () => void
}

/**
 * StepTelegram Component
 *
 * Step 3 of onboarding: Telegram bot connection.
 * Form on left, portrait video (9:16) centered on right.
 * Stacks vertically on mobile with video first for visual guidance.
 */
export function StepTelegram({ onContinue, onBack }: StepTelegramProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Main container: centered layout with form and portrait video */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Video section - portrait phone video */}
        {/* On mobile: appears first (order-1) */}
        {/* On desktop: appears on right side */}
        <div className="w-full lg:w-auto order-1 lg:order-2 flex justify-center">
          <div className="w-[280px] sm:w-[320px] aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden border border-border/50">
            <VideoPlayer
              src="/videos/demo-telegram.mp4"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Form section */}
        {/* On mobile: appears second (order-2) */}
        {/* On desktop: appears on left side */}
        <div className="w-full lg:flex-1 order-2 lg:order-1 max-w-md lg:max-w-none">
          <TelegramForm onContinue={onContinue} onBack={onBack} />
        </div>
      </div>
    </div>
  )
}
