"use client"

import { useRef, useEffect, useMemo } from "react"

interface Star {
  x: number
  y: number
  size: number
  baseOpacity: number
  twinkleSpeed: number
  phaseOffset: number
}

export function StarParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Generate random stars on mount
  const stars = useMemo<Star[]>(() => {
    const count = 50 + Math.floor(Math.random() * 30) // 50-80 stars
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 1 + Math.random() * 2, // 1-3px
      baseOpacity: 0.3 + Math.random() * 0.4, // 0.3-0.7 (max 0.7 for subtlety)
      twinkleSpeed: 1 + Math.random() * 3, // 1-4 seconds per cycle
      phaseOffset: Math.random() * Math.PI * 2, // Random starting phase
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Handle resize
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(canvas)

    // Animation loop
    const animate = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const timeInSeconds = time / 1000

      stars.forEach((star) => {
        // Calculate twinkling opacity using sine wave
        const twinkleCycle = (timeInSeconds / star.twinkleSpeed) * Math.PI * 2
        const twinkleValue = Math.sin(twinkleCycle + star.phaseOffset)
        // Map from [-1, 1] to [0.3, 1] of baseOpacity
        const opacity = star.baseOpacity * (0.5 + 0.5 * twinkleValue)

        const x = star.x * rect.width
        const y = star.y * rect.height

        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
    }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
