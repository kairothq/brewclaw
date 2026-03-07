"use client"

import { useRef, useState, useEffect } from "react"

/**
 * Props for the VideoPlayer component
 */
interface VideoPlayerProps {
  /** Video URL (e.g., "/videos/demo-telegram.mp4") */
  src: string
  /** Optional container styling */
  className?: string
  /** Enable autoplay (default: true) */
  autoPlay?: boolean
}

/**
 * VideoPlayer Component
 *
 * Minimal video player with autoplay muted functionality, play/pause controls,
 * progress bar, and replay overlay when video ends.
 */
export function VideoPlayer({
  src,
  className = "",
  autoPlay = true,
}: VideoPlayerProps) {
  // Component state
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Autoplay on mount
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser, user will need to click play
        setIsPlaying(false)
      })
    }
  }, [autoPlay])

  /**
   * Handle play event
   */
  const handlePlay = () => {
    setIsPlaying(true)
    setIsEnded(false)
  }

  /**
   * Handle pause event
   */
  const handlePause = () => {
    setIsPlaying(false)
  }

  /**
   * Handle video ended event
   */
  const handleEnded = () => {
    setIsEnded(true)
    setIsPlaying(false)
  }

  /**
   * Handle time update - update progress bar
   */
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current
      if (duration > 0) {
        setProgress((currentTime / duration) * 100)
      }
    }
  }

  /**
   * Toggle play/pause
   */
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  /**
   * Handle replay button click
   */
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  /**
   * Handle progress bar click - seek to position
   */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-border bg-card ${className}`}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full object-cover"
        muted
        playsInline
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Control overlay (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity">
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Play/Pause button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Replay overlay (when ended) */}
      {isEnded && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleReplay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors mb-3"
            aria-label="Replay video"
          >
            <ReplayIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-white text-sm font-medium">Replay</span>
        </div>
      )}
    </div>
  )
}

// Icon components
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  )
}

function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v5h5"
      />
    </svg>
  )
}
