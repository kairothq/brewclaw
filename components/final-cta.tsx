"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Shield, Lock, Zap } from "lucide-react"
import { LiquidMetalButton } from "@/components/liquid-metal-button"

const trustBadges = [
  { icon: Shield, label: "SOC2 Compliant" },
  { icon: Lock, label: "End-to-End Encrypted" },
  { icon: Zap, label: "99.9% Uptime" },
]

export function FinalCTA() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Headline animation
      gsap.from(".cta-headline", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      })

      // Subtext animation
      gsap.from(".cta-subtext", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      })

      // Button animation
      gsap.from(".cta-button", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 0.4,
        ease: "back.out(1.7)",
      })

      // Trust badges stagger
      gsap.from(".trust-badge", {
        scrollTrigger: {
          trigger: ".trust-badges",
          start: "top 85%",
        },
        opacity: 0,
        y: 15,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="cta"
      className="relative py-32 px-6 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Grid/Checkbox background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial gradient accent at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(120, 53, 15, 0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h2 className="cta-headline font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Deploy Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#78350F]">
            Personal AI Assistant?
          </span>
        </h2>

        {/* Subtext */}
        <p className="cta-subtext text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Get real work done by the world&apos;s fastest growing software
          <span className="block text-sm text-zinc-500 mt-2 font-mono">
            (0 → 215,920 stars in 86 days on GitHub)
          </span>
        </p>

        {/* CTA Button - Shader Liquid Metal */}
        <div className="cta-button mb-12 flex justify-center">
          <LiquidMetalButton label="Start Free Today" href="/signup" />
        </div>

        {/* Secondary CTA */}
        <p className="text-sm text-zinc-500 mb-16">
          $2 in free credits included{" "}
          <span className="text-zinc-600">|</span>{" "}
          No credit card required
        </p>

        {/* Trust Badges */}
        <div className="trust-badges flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {trustBadges.map((badge) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.label}
                className="trust-badge flex items-center gap-2 text-zinc-500"
                whileHover={{ scale: 1.05, color: "#a1a1aa" }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
