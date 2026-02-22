"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Brain, Terminal, Clock, Shield, MessageCircle } from "lucide-react"

const features = [
  {
    id: 1,
    title: "Persistent Memory",
    description:
      "Never forgets your preferences, history, or context. Your assistant learns and remembers across every conversation.",
    icon: Brain,
    span: "md:col-span-2",
    highlight: true,
  },
  {
    id: 2,
    title: "Privacy First",
    description:
      "Your data stays local. We never see your conversations or store sensitive information on our servers.",
    icon: Terminal,
    span: "",
    showCode: true,
  },
  {
    id: 3,
    title: "Always Awake",
    description:
      "24/7 availability with 99.9% uptime. No downtime, no waiting, always ready when you need it.",
    icon: Clock,
    span: "",
    pulse: true,
  },
  {
    id: 4,
    title: "Secure by Default",
    description:
      "End-to-end encryption, SOC2 compliant infrastructure, and enterprise-grade security out of the box.",
    icon: Shield,
    span: "",
    badges: ["SOC2", "E2EE", "GDPR"],
  },
  {
    id: 5,
    title: "Any Messenger",
    description:
      "Works with WhatsApp, Telegram, Slack, Discord, and more. Connect where your team already communicates.",
    icon: MessageCircle,
    span: "md:col-span-2",
    platforms: true,
  },
]

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[0]
}) {
  const Icon = feature.icon

  return (
    <motion.div
      className={`feature-card group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 ${feature.span}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Icon */}
      <motion.div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          feature.highlight
            ? "bg-[#78350F]/20"
            : "bg-zinc-800"
        }`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon
          className={`w-6 h-6 ${
            feature.highlight
              ? "text-[#D97706]"
              : "text-zinc-400 group-hover:text-zinc-200"
          } transition-colors`}
          strokeWidth={1.5}
        />
        {feature.pulse && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-zinc-400/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Content */}
      <h3 className="font-heading text-lg font-semibold text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Code Animation for Privacy First */}
      {feature.showCode && (
        <div className="mt-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-500 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[#78350F]">encrypted</span>
            <span className="text-zinc-600">:</span>
            <span className="text-emerald-500"> true</span>
          </motion.div>
        </div>
      )}

      {/* Badges for Secure by Default */}
      {feature.badges && (
        <div className="mt-4 flex items-center gap-2">
          {feature.badges.map((badge) => (
            <span
              key={badge}
              className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-400 border border-zinc-700"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Platform Icons for Any Messenger */}
      {feature.platforms && (
        <div className="mt-4 flex items-center gap-3">
          {["WhatsApp", "Telegram", "Slack", "Discord"].map((platform, i) => (
            <motion.div
              key={platform}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <span className="text-xs text-zinc-500 font-medium">
                {platform.slice(0, 2)}
              </span>
            </motion.div>
          ))}
          <span className="text-xs text-zinc-500">+10 more</span>
        </div>
      )}
    </motion.div>
  )
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Staggered fade-in for all feature cards
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }
      )

      // Header animation
      gsap.fromTo(".features-header",
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
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
      className="relative py-24 px-6 bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="features-header text-center mb-16">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Built for Modern Teams
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Powerful features that help you work smarter, not harder. Everything you need to deploy your AI assistant.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
