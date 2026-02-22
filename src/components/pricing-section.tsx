"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out BrewClaw",
    price: { monthly: 0, yearly: 0 },
    features: [
      "$2 AI credits included",
      "1 connected messenger",
      "Basic task automation",
      "Community support",
      "7-day conversation history",
    ],
    cta: "Get Started",
    ctaLink: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For power users who need more",
    price: { monthly: 19, yearly: 15 },
    features: [
      "$20 AI credits/month",
      "Unlimited messengers",
      "Full skill marketplace",
      "Priority support",
      "Unlimited history",
      "Custom workflows",
      "API access",
    ],
    cta: "Start Free Trial",
    ctaLink: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    description: "For teams that need collaboration",
    price: { monthly: 49, yearly: 39 },
    features: [
      "Everything in Pro",
      "$100 shared credits/month",
      "5 team members included",
      "Shared skill library",
      "Team analytics",
      "Admin controls",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false,
  },
]

function BorderBeam() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
      <div
        className="absolute w-20 h-20 blur-xl"
        style={{
          background: "linear-gradient(135deg, #78350F 0%, #D97706 50%, #78350F 100%)",
          offsetPath: "rect(0 100% 100% 0 round 16px)",
          animation: "border-beam 4s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes border-beam {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export function PricingSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Header animation
      gsap.fromTo(".pricing-header",
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

      // Staggered cards animation
      gsap.fromTo(".pricing-card",
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.15,
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
      id="pricing"
      className="relative py-24 px-6 bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="pricing-header text-center mb-12">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "monthly" ? "text-white" : "text-zinc-400"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-zinc-800 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "yearly" ? "text-white" : "text-zinc-400"
              }`}
            >
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-zinc-800 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 ml-2 px-2 py-0.5 text-xs bg-[#78350F]/20 text-[#D97706] rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`pricing-card relative p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-zinc-900 border-[#78350F]/50"
                  : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600"
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {plan.highlighted && <BorderBeam />}

              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#78350F] text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-white">
                    ${plan.price[billingCycle]}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-zinc-400 text-sm">/month</span>
                  )}
                </div>
                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Billed annually (${plan.price.yearly * 12}/year)
                  </p>
                )}
                {plan.price.monthly === 0 && (
                  <p className="text-xs text-zinc-500 mt-1">Free forever</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        plan.highlighted ? "text-[#D97706]" : "text-zinc-500"
                      }`}
                      strokeWidth={2}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full rounded-full ${
                  plan.highlighted
                    ? "shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-zinc-500 text-sm mt-8">
          All plans include SOC2 compliant infrastructure and end-to-end encryption.
        </p>
      </div>
    </section>
  )
}
