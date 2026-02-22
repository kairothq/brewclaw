"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

const statusMessages = [
  "Now accepting Batch 2 applications",
  "1,247 assistants deployed this month",
  "New: Skills Store now live",
]

export function StatusChip() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statusMessages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    const element = document.querySelector("#batch-counter")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-card/50 backdrop-blur-sm cursor-pointer transition-colors hover:border-foreground/30"
      aria-label="View batch status"
    >
      {/* Pulse-glow status dot */}
      <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow" />

      {/* Rotating message */}
      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="block font-mono text-xs text-muted-foreground whitespace-nowrap"
          >
            {statusMessages[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  )
}
