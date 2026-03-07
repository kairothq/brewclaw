"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/onboarding-store"

// Plan data
const PLANS = [
  {
    id: "free",
    name: "Free Trial",
    price: "₹0",
    period: "7 days",
    description: "Try before you commit",
    features: ["1.5GB RAM", "BYOK (Your API Key)", "Test your bot", "Email Support"],
    cta: "Start Free Trial",
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹199",
    period: "/month",
    description: "Perfect for personal use",
    features: ["1.5GB RAM", "BYOK (Your API Key)", "Unlimited messages", "Email Support"],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For power users",
    features: ["3GB RAM", "BYOK (Your API Key)", "Unlimited messages", "Priority Support", "Custom commands"],
    popular: true,
    cta: "Go Pro",
  },
  {
    id: "business",
    name: "Business",
    price: "₹1,499",
    period: "/month",
    description: "For teams and businesses",
    features: ["4GB RAM", "BYOK (Your API Key)", "Unlimited messages", "Dedicated Support", "Custom integrations", "SLA"],
    cta: "Contact Sales",
  },
]

// Testimonial data (same as onboarding)
const testimonial = {
  quote: "Brewclaw transformed how we serve our customers. The ordering system is incredibly intuitive and our staff loves it.",
  author: "Maria Rodriguez",
  role: "Owner",
  company: "The Coffee House",
}

const stats = [
  { value: "10K+", label: "Daily orders" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.8/5", label: "User rating" },
]

declare global {
  interface Window {
    Razorpay: any
  }
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
        <span className="text-zinc-950 font-bold text-sm">B</span>
      </div>
      <span className="font-semibold text-lg">Brewclaw</span>
    </Link>
  )
}

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-0 lg:h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        {/* Logo */}
        <Logo />

        {/* Main content - Testimonial */}
        <div className="space-y-8">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-relaxed text-white text-balance">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-medium">
                {testimonial.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-white">{testimonial.author}</p>
                <p className="text-sm text-zinc-400">{testimonial.role} at {testimonial.company}</p>
              </div>
            </footer>
          </blockquote>

          {/* Stats */}
          <div className="flex gap-8 pt-8 border-t border-zinc-800">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Empty footer space */}
        <div />
      </div>
    </div>
  )
}

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const store = useOnboardingStore()

  const initialPlan = searchParams.get("plan") || store.selectedPlan || "free"
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Check if user completed onboarding
  useEffect(() => {
    if (!store.botToken || !store.aiProvider) {
      // User hasn't completed onboarding, redirect back
      router.push("/onboarding")
    }
  }, [store.botToken, store.aiProvider, router])

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId)
    setIsProcessing(true)
    setError("")

    try {
      // Generate temp userId
      const tempUserId = crypto.randomUUID().replace(/-/g, "").substring(0, 16)
      const email = store.email || "user@example.com"
      const isTrial = planId === "free"

      // Store provision data
      const pendingProvision = {
        telegramToken: store.botToken,
        telegramUserId: store.telegramUserId,
        aiProvider: store.aiProvider,
        apiKey: "", // BYOK - user provides via bot
        email: email,
        plan: planId,
      }
      sessionStorage.setItem("pending_provision", JSON.stringify(pendingProvision))

      // Create subscription
      const subRes = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: tempUserId,
          email,
          planId: isTrial ? "starter" : planId,
          name: email.split("@")[0],
          trial: isTrial,
        }),
      })

      const subData = await subRes.json()

      if (!subData.success) {
        sessionStorage.removeItem("pending_provision")
        setError(subData.error || "Failed to create subscription")
        setIsProcessing(false)
        return
      }

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subData.subscriptionId,
        name: "BrewClaw",
        description: `${PLANS.find((p) => p.id === planId)?.name} Plan`,
        image: "/logo.png",
        handler: async function (response: any) {
          const storedProvision = sessionStorage.getItem("pending_provision")
          const provisionData = storedProvision ? JSON.parse(storedProvision) : null

          const verifyRes = await fetch("/api/subscriptions/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              provisionData,
            }),
          })

          const verifyData = await verifyRes.json()
          sessionStorage.removeItem("pending_provision")

          if (verifyData.verified && verifyData.provisioned) {
            const instanceData = JSON.stringify({
              userId: verifyData.userId,
              botUsername: store.botUsername,
              subdomain: verifyData.subdomain,
              url: verifyData.url,
              email: email,
              name: email.split("@")[0],
            })
            localStorage.setItem("brewclaw_instance", instanceData)
            store.reset()
            router.push("/dashboard")
          } else {
            setError("Payment verification failed. Please contact support.")
          }
          setIsProcessing(false)
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            sessionStorage.removeItem("pending_provision")
            setIsProcessing(false)
            setError("Payment was cancelled. You can try again.")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (e) {
      console.error("Payment error:", e)
      sessionStorage.removeItem("pending_provision")
      setError("Failed to process payment. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left testimonial panel */}
      <LeftPanel />

      {/* Right content area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Mobile header with logo */}
        <div className="lg:hidden p-6 pb-0">
          <Logo />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
              <p className="text-zinc-400">
                Your bot <span className="text-orange-400">@{store.botUsername || "bot"}</span> is ready. Pick a plan to deploy.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Pricing cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing}
                  className={`relative text-left p-6 rounded-2xl border transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="text-sm text-zinc-400">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-400 text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`w-full py-3 rounded-xl text-center font-medium transition-colors ${
                      plan.popular
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-white"
                    }`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-zinc-500 mt-6">
              All plans auto-renew monthly. Cancel anytime from your dashboard.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  )
}
