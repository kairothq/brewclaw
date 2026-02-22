"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { motion } from "motion/react"

// ASCII art for BREWCLAW using block characters
const LETTERS: Record<string, string[]> = {
  B: [
    "██████╗ ",
    "██╔══██╗",
    "██████╔╝",
    "██╔══██╗",
    "██████╔╝",
    "╚═════╝ ",
  ],
  R: [
    "██████╗ ",
    "██╔══██╗",
    "██████╔╝",
    "██╔══██╗",
    "██║  ██║",
    "╚═╝  ╚═╝",
  ],
  E: [
    "███████╗",
    "██╔════╝",
    "█████╗  ",
    "██╔══╝  ",
    "███████╗",
    "╚══════╝",
  ],
  W: [
    "██╗    ██╗",
    "██║    ██║",
    "██║ █╗ ██║",
    "██║███╗██║",
    "╚███╔███╔╝",
    " ╚══╝╚══╝ ",
  ],
  C: [
    " ██████╗",
    "██╔════╝",
    "██║     ",
    "██║     ",
    "╚██████╗",
    " ╚═════╝",
  ],
  L: [
    "██╗     ",
    "██║     ",
    "██║     ",
    "██║     ",
    "███████╗",
    "╚══════╝",
  ],
  A: [
    " █████╗ ",
    "██╔══██╗",
    "███████║",
    "██╔══██║",
    "██║  ██║",
    "╚═╝  ╚═╝",
  ],
}

const BRAND_NAME = "BREWCLAW"

export function AsciiBrand() {
  const [shimmerPosition, setShimmerPosition] = useState(-20)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Calculate total columns for shimmer animation
  const totalColumns = useMemo(() => {
    return BRAND_NAME.split("").reduce((acc, char) => {
      const letter = LETTERS[char]
      return acc + (letter ? letter[0].length : 0)
    }, 0)
  }, [])

  // Shimmer animation on load
  useEffect(() => {
    if (hasAnimated) return

    const startDelay = setTimeout(() => {
      let pos = -20
      const interval = setInterval(() => {
        setShimmerPosition(pos)
        pos += 2
        if (pos > totalColumns + 20) {
          clearInterval(interval)
          setShimmerPosition(-20)
          setHasAnimated(true)
        }
      }, 30)

      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(startDelay)
  }, [totalColumns, hasAnimated])

  // Re-trigger shimmer on hover
  const handleHover = useCallback(() => {
    if (!hasAnimated) return
    let pos = -20
    const interval = setInterval(() => {
      setShimmerPosition(pos)
      pos += 2
      if (pos > totalColumns + 20) {
        clearInterval(interval)
        setShimmerPosition(-20)
      }
    }, 25)
  }, [hasAnimated, totalColumns])

  // Render ASCII art with smooth shimmer effect
  const renderAscii = () => {
    let currentCol = 0

    return BRAND_NAME.split("").map((char, letterIndex) => {
      const letter = LETTERS[char]
      if (!letter) return null

      const letterStartCol = currentCol
      currentCol += letter[0].length

      return (
        <div key={letterIndex} className="inline-block align-top">
          {letter.map((line, lineIndex) => (
            <div key={lineIndex} className="leading-none">
              {line.split("").map((c, charIndex) => {
                const absoluteCol = letterStartCol + charIndex

                // Calculate smooth shimmer intensity based on distance
                const distance = absoluteCol - shimmerPosition
                // Gaussian-like falloff for smooth edges
                const intensity = Math.max(0, Math.exp(-(distance * distance) / 50))

                // Coffee color interpolation (from base gray to coffee highlight)
                const r = Math.round(200 + (217 - 200) * intensity) // toward #D97706
                const g = Math.round(200 + (119 - 200) * intensity)
                const b = Math.round(200 + (6 - 200) * intensity)

                return (
                  <span
                    key={charIndex}
                    style={{
                      color: intensity > 0.01 ? `rgb(${r}, ${g}, ${b})` : undefined,
                      textShadow: intensity > 0.1
                        ? `0 0 ${20 * intensity}px rgba(217, 119, 6, ${0.6 * intensity})`
                        : undefined,
                      transition: "color 0.05s ease-out",
                    }}
                  >
                    {c}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-pointer select-none"
      onMouseEnter={handleHover}
      aria-label="BREWCLAW"
    >
      {/* Screen reader accessible text */}
      <span className="sr-only">BREWCLAW</span>

      {/* ASCII Art Display */}
      <div
        className="font-mono whitespace-pre"
        style={{
          fontSize: "clamp(0.5rem, 2vw, 1rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.05em",
          color: "rgba(200, 200, 200, 0.9)",
        }}
      >
        {renderAscii()}
      </div>
    </motion.div>
  )
}
