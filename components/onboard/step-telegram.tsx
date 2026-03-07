"use client"

import { useRef, useState, useCallback } from "react"
import { TelegramForm } from "./telegram-form"
import { useOnboardingStore } from "@/lib/onboarding-store"

/**
 * Props for the StepTelegram component
 */
interface StepTelegramProps {
  /** Called when user continues with validated data */
  onContinue: (data: { botToken: string; userId: string }) => void
  /** Called when user skips this step */
  onSkip?: () => void
  /** Called when user navigates back */
  onBack: () => void
}

/**
 * StepTelegram Component
 *
 * Step 3 of onboarding: Telegram bot connection.
 * Form on left, portrait video (9:16) on right.
 * Centered on page.
 */
export function StepTelegram({ onContinue, onSkip, onBack }: StepTelegramProps) {
  const store = useOnboardingStore()

  const videoRef = useRef<HTMLVideoElement>(null)
  const userIdVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [tokenValidated, setTokenValidated] = useState(false)

  // Callback for when token validation changes
  const handleTokenValidatedChange = useCallback((validated: boolean) => {
    setTokenValidated(validated)
    // Reset user ID video when switching
    if (validated && userIdVideoRef.current) {
      userIdVideoRef.current.currentTime = 0
      userIdVideoRef.current.play()
    }
  }, [])

  const togglePlayPause = () => {
    const currentVideo = tokenValidated ? userIdVideoRef.current : videoRef.current
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause()
      } else {
        currentVideo.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current
      if (duration > 0) {
        setProgress((currentTime / duration) * 100)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentVideo = tokenValidated ? userIdVideoRef.current : videoRef.current
    if (currentVideo) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      currentVideo.currentTime = percentage * currentVideo.duration
    }
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-0">
      {/* Form section - matches video height */}
      <div className="order-2 lg:order-1 w-full lg:w-auto">
        <div
          className="rounded-2xl lg:rounded-r-none border border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm shadow-2xl flex flex-col justify-center p-8 lg:p-10"
          style={{ minHeight: "500px" }}
        >
          <div className="w-full max-w-sm">
            <TelegramForm
              onContinue={(data) => {
                store.setStepData(3, {
                  botToken: data.botToken,
                  telegramUserId: data.userId,
                })
                onContinue(data)
              }}
              onSkip={onSkip}
              onBack={onBack}
              onTokenValidatedChange={handleTokenValidatedChange}
              initialToken={store.botToken || undefined}
              initialUserId={store.telegramUserId || undefined}
            />
          </div>
        </div>
      </div>

      {/* Video section - portrait phone mockup (9:16 aspect ratio) */}
      <div className="order-1 lg:order-2 flex-shrink-0 mb-6 lg:mb-0">
        <div
          className="rounded-2xl lg:rounded-l-none shadow-2xl border border-zinc-800/60 overflow-hidden relative group"
          style={{
            width: "280px",
            height: "500px",
          }}
        >
          {/* Bot Token Video - shows when token not validated */}
          <video
            ref={videoRef}
            src="/videos/demo-telegram.mp4"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              tokenValidated ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            autoPlay
            muted
            playsInline
            loop
            onTimeUpdate={!tokenValidated ? handleTimeUpdate : undefined}
            onPlay={() => !tokenValidated && setIsPlaying(true)}
            onPause={() => !tokenValidated && setIsPlaying(false)}
          />

          {/* User ID Video - shows when token is validated */}
          <video
            ref={userIdVideoRef}
            src="/videos/demo-userid.mp4"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              tokenValidated ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            muted
            playsInline
            loop
            onTimeUpdate={tokenValidated ? handleTimeUpdate : undefined}
            onPlay={() => tokenValidated && setIsPlaying(true)}
            onPause={() => tokenValidated && setIsPlaying(false)}
          />

          {/* Video label */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 rounded-full">
            <span className="text-white text-xs font-medium">
              {tokenValidated ? "Step 2: Get User ID" : "Step 1: Create Bot"}
            </span>
          </div>

          {/* Video controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Play/Pause button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={togglePlayPause}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
