"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { Clock, AlertTriangle, Coffee } from "lucide-react"
import Image from "next/image"

const traditionalSteps = [
  { task: "Server setup & provisioning", time: "15 min" },
  { task: "Database configuration", time: "10 min" },
  { task: "Authentication setup", time: "10 min" },
  { task: "API integration", time: "15 min" },
  { task: "Testing & debugging", time: "10 min" },
]

const totalTime = traditionalSteps.reduce(
  (acc, step) => acc + parseInt(step.time),
  0
)

export function ComparisonSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Fade in entire section
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
      })

      // Stagger the two columns
      gsap.from(".comparison-column", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      })

      // Animate the task list items
      gsap.from(".task-item", {
        scrollTrigger: {
          trigger: ".traditional-column",
          start: "top 70%",
        },
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="comparison"
      className="relative py-24 px-6 bg-[#0A0A0A]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Why BrewClaw?
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Skip the Setup Headache
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Traditional AI assistant setup takes hours. With BrewClaw, you&apos;re up and running in the time it takes to brew your morning coffee.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Method */}
          <div className="comparison-column traditional-column">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-zinc-300">
                    Traditional Method
                  </h3>
                  <p className="text-xs text-zinc-500">The hard way</p>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3 mb-6">
                {traditionalSteps.map((step, index) => (
                  <div
                    key={index}
                    className="task-item flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                  >
                    <span className="text-sm text-zinc-400 line-through decoration-zinc-600">
                      {step.task}
                    </span>
                    <span className="text-sm font-mono text-zinc-500">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-zinc-300">
                    Total Setup Time
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-amber-500">
                  {totalTime} min
                </span>
              </div>
            </div>
          </div>

          {/* BrewClaw Method */}
          <div className="comparison-column">
            <div className="rounded-2xl border border-[#78350F]/30 bg-gradient-to-br from-[#78350F]/10 to-[#B45309]/5 p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#78350F]/20 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-[#B45309]" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-lg font-semibold text-white">
                    With BrewClaw
                  </h3>
                  <p className="text-xs text-zinc-500">The easy way</p>
                </div>
              </div>

              {/* Coffee Making GIF */}
              <div className="relative my-6">
                <Image
                  src="/images/making-coffee.gif"
                  alt="Making coffee"
                  width={180}
                  height={180}
                  className="rounded-xl"
                  unoptimized
                />
              </div>

              {/* Time Display */}
              <div className="space-y-2">
                <p className="text-2xl font-heading font-bold text-white">
                  Time to brew a coffee
                </p>
                <p className="text-sm text-zinc-400">
                  Configure. Deploy. Done.
                </p>
              </div>

              {/* Time Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#78350F]/20 border border-[#78350F]/30">
                <span className="text-sm text-zinc-400">Setup time:</span>
                <span className="text-lg font-bold font-mono text-[#D97706]">
                  ~3 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
