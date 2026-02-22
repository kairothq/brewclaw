"use client"

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
  // Simple render for CSS gradient shimmer
  const renderAsciiSimple = () => {
    return BRAND_NAME.split("").map((char, letterIndex) => {
      const letter = LETTERS[char]
      if (!letter) return null

      return (
        <div key={letterIndex} className="inline-block align-top">
          {letter.map((line, lineIndex) => (
            <div key={lineIndex} className="leading-none">
              {line}
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
      aria-label="BREWCLAW"
    >
      {/* Screen reader accessible text */}
      <span className="sr-only">BREWCLAW</span>

      {/* ASCII Art Display with CSS Shimmer */}
      <div
        className="font-mono whitespace-pre"
        style={{
          fontSize: "clamp(0.5rem, 2vw, 1rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.05em",
          background: "linear-gradient(90deg, #D97706, #fff, #D97706)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      >
        {renderAsciiSimple()}
      </div>
    </motion.div>
  )
}
