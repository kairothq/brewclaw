"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Shield, Lock, Zap } from "lucide-react"
import Link from "next/link"

// Border beam animation component
function BorderBeamCTA() {
  return (
    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
      <div
        className="absolute w-24 h-24 blur-md"
        style={{
          background: "linear-gradient(135deg, #D97706 0%, #ffffff 50%, #78350F 100%)",
          offsetPath: "rect(0 100% 100% 0 round 9999px)",
          animation: "border-beam-cta 3s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes border-beam-cta {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
      `}</style>
    </div>
  )
}

// CSS-based liquid metal button effect with border beam
function LiquidMetalButton({
  label = "Get Started",
  href = "/signup",
}: {
  label?: string
  href?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <Link href={href} className="relative inline-block group">
      <motion.div
        className="relative"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Constantly moving border beam */}
        <BorderBeamCTA />

        {/* Outer glow effect - intensifies on hover */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(120, 53, 15, 0.4) 0%, rgba(217, 119, 6, 0.3) 50%, rgba(120, 53, 15, 0.4) 100%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main button */}
        <div
          className="relative px-10 py-5 rounded-full overflow-hidden"
          style={{
            background: isPressed
              ? "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)"
              : isHovered
                ? "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)"
                : "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
            boxShadow: isPressed
              ? "inset 0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)"
              : isHovered
                ? "0 20px 60px rgba(217, 119, 6, 0.4), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "0 8px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Liquid shimmer sweep on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 75%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: isHovered ? ["-200% 0", "200% 0"] : "-200% 0",
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />

          {/* Inner glow pulse on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(217, 119, 6, 0.2) 0%, transparent 70%)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Button text with glow on hover */}
          <span
            className="relative z-10 text-lg font-semibold tracking-wide"
            style={{
              color: "#ffffff",
              textShadow: isHovered
                ? "0 0 30px rgba(217, 119, 6, 0.8), 0 0 60px rgba(217, 119, 6, 0.4)"
                : "0 1px 2px rgba(0,0,0,0.5)",
              transition: "all 0.3s ease",
            }}
          >
            {label}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

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
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(120, 53, 15, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
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
          Join thousands of users who have automated their daily tasks. Setup
          takes under 5 minutes. No code required.
        </p>

        {/* CTA Button */}
        <div className="cta-button mb-12">
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
