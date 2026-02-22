"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react"

// Preset batch data (static for v1) - matches StatusChip
const BATCH_DATA = {
  currentBatch: 2,
  maxBatch: 3,
  totalProcessed: 12847,
  batchCapacity: 200,
  currentFill: 163,
  status: "Filling" as const, // "Filling" | "Full" | "Processing"
}

function CountUpNumber({ target, duration = 2 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      })
      return controls.stop
    }
  }, [inView, target, count, duration])

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  )
}

// Shimmer animation component
function ShimmerOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-y-0 w-1/3"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(120, 53, 15, 0.15) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "400%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function BatchCounter() {
  const containerRef = useRef<HTMLElement>(null)
  const inView = useInView(containerRef, { once: true, margin: "-100px" })

  const fillPercentage = (BATCH_DATA.currentFill / BATCH_DATA.batchCapacity) * 100
  const seatsRemaining = BATCH_DATA.batchCapacity - BATCH_DATA.currentFill

  return (
    <section
      ref={containerRef}
      id="batch-counter"
      className="relative py-24 px-6 bg-zinc-100"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Large number with shimmer */}
          <div className="relative text-center lg:text-left">
            <ShimmerOverlay />

            {/* Header Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4"
            >
              Batches Processed
            </motion.p>

            {/* Large Count-Up Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-zinc-900"
            >
              <CountUpNumber target={BATCH_DATA.totalProcessed} duration={2.5} />
            </motion.div>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-600 mt-4"
            >
              AI tasks completed by BrewClaw users
            </motion.p>
          </div>

          {/* Right side - Batch Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200"
          >
            {/* Batch header */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-[#78350F] text-white rounded-full text-sm font-medium">
                Batch {BATCH_DATA.currentBatch}
              </span>
              <span className="text-zinc-600 text-sm">
                {BATCH_DATA.currentFill}/{BATCH_DATA.batchCapacity} seats
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#78350F]"
                initial={{ width: 0 }}
                animate={inView ? { width: `${fillPercentage}%` } : {}}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Status indicator */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-sm text-zinc-600">{BATCH_DATA.status}</span>
              </div>
              <span className="text-sm font-medium text-[#78350F]">
                {seatsRemaining} seats left
              </span>
            </div>

            {/* Urgency CTA */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 pt-4 border-t border-zinc-100 text-sm text-zinc-500 text-center"
            >
              Only {BATCH_DATA.maxBatch} batches available — join Batch {BATCH_DATA.currentBatch} now
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
