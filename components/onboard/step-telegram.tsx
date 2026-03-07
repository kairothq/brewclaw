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
 * 60/40 split layout on desktop (video right, form left).
 * Stacks vertically on mobile with form first.
 */
export function StepTelegram({ onContinue, onBack }: StepTelegramProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Main container: flex-col on mobile, flex-row on desktop */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Form section (left on desktop, top on mobile) */}
        {/* Order 1 on mobile = appears first */}
        <div className="w-full md:w-2/5 order-1">
          <TelegramForm onContinue={onContinue} onBack={onBack} />
        </div>

        {/* Video section (right on desktop, bottom on mobile) */}
        {/* Order 2 on mobile = appears second */}
        <div className="w-full md:w-3/5 order-2">
          <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
            <VideoPlayer
              src="/videos/demo-telegram.mp4"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
