"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Clock, Shield, Zap, MessageCircle, Settings2 } from "lucide-react"

// Messaging app colors
const messagingApps = [
  { name: "WhatsApp", color: "#25D366", initials: "WA" },
  { name: "iMessage", color: "#007AFF", initials: "iM" },
  { name: "Messages", color: "#34C759", initials: "MS" },
  { name: "Telegram", color: "#0088CC", initials: "TG" },
  { name: "Discord", color: "#5865F2", initials: "DC" },
  { name: "Slack", color: "#4A154B", initials: "SL" },
]

// AI providers (used in AIProviderCard component visually)
// Keeping for reference: Anthropic, OpenAI, Google, OpenRouter

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Clock
  title: string
  description: string
}) {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative circle */}
      <div className="absolute -top-8 -right-8 w-32 h-32 border border-zinc-100 rounded-full" />
      <div className="absolute -top-4 -right-4 w-24 h-24 border border-zinc-100 rounded-full" />

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl border border-zinc-200 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

function MessagingCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex gap-6">
        {/* Left content */}
        <div className="flex-1">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl border border-zinc-200 flex items-center justify-center mb-6">
            <MessageCircle className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
          </div>

          <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
            Every messaging app
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            WhatsApp, iMessage, Signal, Telegram, Discord, Slack — all connected through one interface.
          </p>
        </div>

        {/* Right: App icons mockup */}
        <div className="flex-shrink-0">
          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
            {/* Window dots */}
            <div className="flex gap-1.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
            </div>

            {/* App icons grid */}
            <div className="grid grid-cols-3 gap-3">
              {messagingApps.map((app) => (
                <motion.div
                  key={app.name}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: app.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  {app.initials}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AIProviderCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex gap-6">
        {/* Left content */}
        <div className="flex-1">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl border border-zinc-200 flex items-center justify-center mb-6">
            <Settings2 className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
          </div>

          <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
            Pick your AI provider
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Anthropic, OpenAI, Google, or OpenRouter. Choose what fits your needs and budget.
          </p>
        </div>

        {/* Right: AI providers diagram */}
        <div className="flex-shrink-0 relative w-48 h-40">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 160">
            <path d="M 40 80 Q 96 40 152 30" stroke="#e4e4e7" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <path d="M 40 80 Q 96 70 152 60" stroke="#e4e4e7" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <path d="M 40 80 Q 96 90 152 100" stroke="#e4e4e7" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <path d="M 40 80 Q 96 110 152 130" stroke="#e4e4e7" strokeWidth="1" fill="none" strokeDasharray="4 4" />
          </svg>

          {/* Provider chips */}
          <motion.div
            className="absolute top-0 right-0 flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-6 h-6 rounded-full bg-[#D4A574] flex items-center justify-center text-white text-[10px] font-bold">AI</div>
            <span className="text-xs text-zinc-700 font-medium">Anthropic</span>
          </motion.div>

          <motion.div
            className="absolute top-10 right-0 flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">◎</div>
            <span className="text-xs text-zinc-700 font-medium">OpenAI</span>
          </motion.div>

          <motion.div
            className="absolute top-20 right-0 flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[10px]">✦</div>
            <span className="text-xs text-zinc-700 font-medium">Google</span>
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-0 flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-sm"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">⟳</div>
            <span className="text-xs text-zinc-700 font-medium">OpenRouter</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function EverythingSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.fromTo(".everything-header",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      )

      gsap.fromTo(".feature-card",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="everything"
      className="relative py-24 px-6 bg-[#FAFAF9]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="everything-header flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              What You Get
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
              Everything in one install
            </h2>
          </div>
          <p className="text-zinc-500 max-w-sm md:text-right">
            OpenClaw, ClawdBot, and MoltBot — configured and connected. No terminal commands, no config files.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid space-y-4">
          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Clock}
              title="Always awake"
              description="Your AI runs 24/7, ready to respond whenever you or your contacts need it."
            />
            <FeatureCard
              icon={Shield}
              title="Secure by default"
              description="Your data stays on your machine. End-to-end encryption where supported."
            />
            <FeatureCard
              icon={Zap}
              title="Lightning fast"
              description="One-click install. No terminal commands, no config files. Just download and run."
            />
          </div>

          {/* Bottom row - 2 larger cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MessagingCard />
            <AIProviderCard />
          </div>
        </div>
      </div>
    </section>
  )
}
