"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { FileCode, Rocket, Sparkles } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Create Config",
    description: "Define your AI assistant's personality, skills, and permissions in a simple YAML file.",
    icon: FileCode,
    code: `# brewclaw.yaml
name: "MyAssistant"
skills:
  - email-drafting
  - research
  - scheduling`,
  },
  {
    id: 2,
    title: "Deploy",
    description: "One command deploys your assistant to the cloud. No infrastructure to manage.",
    icon: Rocket,
    code: `$ brew deploy

Deploying MyAssistant...
✓ Skills loaded
✓ Connections verified
✓ Live at brewclaw.ai/you`,
  },
  {
    id: 3,
    title: "Use",
    description: "Start chatting through WhatsApp, Telegram, or any supported messenger. It just works.",
    icon: Sparkles,
    code: `You: Schedule a meeting with
     John for next Tuesday

AI: Done! I've scheduled a
    meeting with John for
    Tuesday at 2pm. ✓`,
  },
]

export function InstallationSection() {
  const containerRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Create scroll-triggered progress
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 0.5,
          onUpdate: (self) => {
            const newProgress = self.progress
            setProgress(newProgress)
            // Update active step based on progress
            const newStep = Math.min(Math.floor(newProgress * 3), 2)
            setActiveStep(newStep)
          },
        },
      })

      // Animate step cards on scroll
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      })

      // Animate video/code area
      gsap.from(".demo-area", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power2.out",
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="installation"
      className="relative py-24 px-6 bg-[#FAFAF9]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Get Started in Minutes
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Three Steps to Your AI Assistant
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto">
            No complex setup. No infrastructure headaches. Just configure, deploy, and start using.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div
              ref={timelineRef}
              className="absolute left-[19px] top-0 w-0.5 h-full bg-zinc-200"
            >
              {/* Progress Fill */}
              <div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#78350F] to-[#B45309] transition-all duration-300"
                style={{ height: `${progress * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const isActive = index <= activeStep
                const isCurrent = index === activeStep
                const Icon = step.icon

                return (
                  <div key={step.id} className="step-card relative flex gap-4">
                    {/* Dot */}
                    <div
                      className={`
                        relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isActive ? "bg-[#78350F]" : "bg-zinc-200"}
                        ${isCurrent ? "beating-dot" : ""}
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-400"}`}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 pb-8 transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#78350F]">
                          Step {step.id}
                        </span>
                      </div>
                      <h3
                        className={`font-heading text-xl font-semibold mb-2 ${
                          isActive ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? "text-zinc-600" : "text-zinc-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Demo/Video Area */}
          <div className="demo-area sticky top-24">
            <div className="rounded-xl border border-zinc-200 bg-zinc-900 overflow-hidden shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-zinc-400 font-mono">
                  terminal
                </span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 min-h-[200px]">
                <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">
                  {steps[activeStep]?.code}
                </pre>
              </div>
            </div>

            {/* Video Placeholder Note */}
            <p className="mt-4 text-center text-xs text-zinc-400">
              Demo video syncs with step progression
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
