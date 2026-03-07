"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

interface StepSuccessTransitionProps {
  onComplete: () => void
  delay?: number // ms before calling onComplete, default 1500
}

/**
 * StepSuccessTransition Component
 *
 * Shows a success message with animated checkmark after completing
 * the 3-step onboarding flow. Auto-redirects to payment/plan selection
 * after a brief delay.
 *
 * Features:
 * - Animated checkmark with scale-in spring animation
 * - "You're all set!" heading with fade-in
 * - Loading spinner for redirect indication
 * - Dark theme consistent with onboarding design
 */
export function StepSuccessTransition({
  onComplete,
  delay = 1500,
}: StepSuccessTransitionProps) {
  // Auto-redirect after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, delay)
    return () => clearTimeout(timer)
  }, [onComplete, delay])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-8 shadow-lg shadow-green-500/30"
      >
        {/* Checkmark SVG */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-12 h-12 text-white"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-3xl font-bold text-white mb-3 font-['Space_Grotesk',sans-serif]"
      >
        You&apos;re all set!
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="text-zinc-400 text-lg mb-8"
      >
        Redirecting to plan selection...
      </motion.p>

      {/* Loading spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="flex items-center gap-2 text-zinc-500"
      >
        <svg
          className="animate-spin h-5 w-5 text-orange-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
    </div>
  )
}
