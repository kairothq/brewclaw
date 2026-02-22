"use client"

import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"

interface HighlightTextProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function HighlightText({ children, className = "", delay = 0.5 }: HighlightTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !highlightRef.current) return

    const ctx = gsap.context(() => {
      // Create timeline that plays on mount after delay
      const tl = gsap.timeline({
        delay,
      })

      // Animate highlight scaleX from 0 to 1
      tl.fromTo(
        highlightRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [delay])

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Highlight background - coffee/amber color */}
      <span
        ref={highlightRef}
        className="absolute"
        style={{
          backgroundColor: "#D97706",
          left: "-0.15em",
          right: "-0.15em",
          top: "0.1em",
          bottom: "0.05em",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
        aria-hidden="true"
      />
      {/* Text stays white on dark background */}
      <span className="relative z-10">{children}</span>
    </span>
  )
}
