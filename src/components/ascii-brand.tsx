"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"

// ASCII art for BREWCLAW using block characters
// Each letter is 7 lines tall, designed for visual impact
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
  const [shimmerColumn, setShimmerColumn] = useState(-1)
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
      let col = 0
      const interval = setInterval(() => {
        setShimmerColumn(col)
        col++
        if (col > totalColumns + 5) {
          clearInterval(interval)
          setShimmerColumn(-1)
          setHasAnimated(true)
        }
      }, 40)

      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(startDelay)
  }, [totalColumns, hasAnimated])

  // Re-trigger shimmer on hover
  const handleHover = () => {
    if (!hasAnimated) return
    let col = 0
    const interval = setInterval(() => {
      setShimmerColumn(col)
      col++
      if (col > totalColumns + 5) {
        clearInterval(interval)
        setShimmerColumn(-1)
      }
    }, 30)
  }

  // Render ASCII art with shimmer effect
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
                const isShimmering =
                  shimmerColumn >= 0 &&
                  absoluteCol >= shimmerColumn - 3 &&
                  absoluteCol <= shimmerColumn + 3

                // Intensity based on distance from shimmer center
                const distance = Math.abs(absoluteCol - shimmerColumn)
                const intensity = isShimmering ? 1 - distance / 4 : 0

                return (
                  <span
                    key={charIndex}
                    className="ascii-char"
                    style={{
                      textShadow: isShimmering
                        ? `0 0 ${8 * intensity}px rgba(255,255,255,${0.8 * intensity}), 0 0 ${16 * intensity}px rgba(255,255,255,${0.4 * intensity})`
                        : "none",
                      opacity: isShimmering ? 0.7 + 0.3 * intensity : 0.85,
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
          background: "linear-gradient(180deg, #D97706 0%, #78350F 30%, #ffffff 60%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {renderAscii()}
      </div>
    </motion.div>
  )
}
