"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { MessageSquare, Shield, Brain, Terminal } from "lucide-react"

// Messaging app colors for floating icons
const messengerIcons = [
  { name: "WhatsApp", color: "#25D366", position: "top-4 left-1/2 -translate-x-8" },
  { name: "Signal", color: "#3A76F0", position: "top-1/3 right-8" },
  { name: "Telegram", color: "#0088CC", position: "bottom-8 right-12" },
]

function AnyMessengerCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden md:col-span-2"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-6">
        {/* Left content */}
        <div className="flex-1 max-w-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
            <MessageSquare className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
            Any Messenger
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            WhatsApp, Telegram, Discord, Slack, Signal, iMessage — talk to your assistant wherever you already are.
          </p>
        </div>

        {/* Right: Floating messenger icons */}
        <div className="relative w-48 h-40 hidden md:block">
          {/* Central message bubble */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>

          {/* Floating icons */}
          {messengerIcons.map((icon, i) => (
            <motion.div
              key={icon.name}
              className={`absolute ${icon.position} w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md`}
              style={{ backgroundColor: icon.color }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {icon.name.slice(0, 2)}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function PrivacyFirstCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
        <Shield className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
        Privacy First
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed mb-4">
        Your data stays private. We don&apos;t log your conversations. Your assistant, your business.
      </p>

      {/* Terminal mockup */}
      <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center justify-between">
          <code className="text-xs text-zinc-500 font-mono">LOGGING DISABLED...</code>
          <div className="w-6 h-6 rounded border border-zinc-200 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PersistentMemoryCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
        <Brain className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
        Persistent Memory
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed mb-4">
        Your preferences, context, and past conversations are remembered instantly.
      </p>

      {/* Memory cards */}
      <div className="space-y-2">
        <div className="bg-amber-50 rounded-lg p-3 border-l-2 border-amber-400">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">Last Conversation</p>
          <p className="text-sm text-zinc-700 font-medium">&quot;Book flight to Tokyo...&quot;</p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-3 border-l-2 border-zinc-300">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">User Preference</p>
          <p className="text-sm text-zinc-600">Vegetarian meal plan</p>
        </div>
      </div>
    </motion.div>
  )
}

function SystemAccessCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden md:col-span-2"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
            <Terminal className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-xl font-semibold text-zinc-900 mb-2">
            System Access
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Full access to files, shell commands, and scripts. It can do anything you could do at your computer.
          </p>
        </div>

        {/* Right: Terminal mockup */}
        <div className="hidden md:block flex-shrink-0 w-64">
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="p-3 font-mono text-xs space-y-1">
              <p className="text-zinc-400">$ clawi access --level=root</p>
              <p className="text-emerald-400">Access granted.</p>
              <p className="text-zinc-400">$ run daily_report.py</p>
              <p className="text-amber-400">Generating report...</p>
              <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.fromTo(".features-header",
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
      id="features"
      className="relative py-24 px-6 bg-[#FAFAF9]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="features-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              What You Get
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
              Everything in one install
            </h2>
          </div>
          <p className="text-zinc-500 max-w-sm text-sm md:text-right">
            OpenClaw, ClawdBot, and MoltBot — configured and connected. No terminal commands, no config files.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top row */}
          <AnyMessengerCard />
          <PrivacyFirstCard />

          {/* Bottom row */}
          <PersistentMemoryCard />
          <SystemAccessCard />
        </div>
      </div>
    </section>
  )
}
