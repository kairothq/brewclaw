"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { StepProgress } from "@/components/onboard/step-progress"
import { StepSignIn } from "@/components/onboard/step-signin"
import { StepAISelection } from "@/components/onboard/step-ai-selection"
import { StepTelegram } from "@/components/onboard/step-telegram"
import { StepPricing } from "@/components/onboard/step-pricing"
import { Button } from "@/components/ui/button"
import type { ProviderType, ProviderCredentials } from "@/types/ai-provider"

// Extend window type for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

// Testimonial data
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

/**
 * Left panel with testimonial - shown on steps 1 & 2
 */
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

type Step = 1 | 2 | 3 | 4 | 5

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const store = useOnboardingStore()
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [currentStep, setCurrentStep] = useState<Step>(1)

  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  // Track entry point from pricing section
  useEffect(() => {
    const plan = searchParams.get("plan")
    const fromPricing = searchParams.get("from") === "pricing" || !!plan
    if (fromPricing) {
      store.setFromPricing(true, plan || undefined)
    }
  }, [searchParams, store])

  // Auto-advance to step 2 if authenticated and on step 1
  useEffect(() => {
    if (status === "authenticated" && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [status, currentStep])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Slide animation variants
  const slideVariants = {
    enter: (direction: "forward" | "back") => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "back") => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
    }),
  }

  // Navigation handlers
  const handleNext = () => {
    setDirection("forward")
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    // Don't go back to step 1 if already authenticated
    if (currentStep === 2 && status === "authenticated") {
      return
    }
    setDirection("back")
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  // Step 2 completion handler
  const handleAISelectionContinue = (
    provider: ProviderType,
    credentials?: ProviderCredentials
  ) => {
    store.setStepData(2, {
      aiProvider: provider,
      hasValidatedCredentials: credentials?.validated || false,
    })
    handleNext()
  }

  // Step 3 completion handler
  const handleTelegramContinue = (data: { botToken: string; userId: string }) => {
    store.setStepData(3, {
      botToken: data.botToken,
      telegramUserId: data.userId,
    })
    handleNext() // Go to Step 4 (Pricing)
  }

  // Step 4 completion handler - Payment
  const handlePlanSelected = async (planId: string, cycle: 'monthly' | 'yearly') => {
    setSelectedPlan(planId)
    setBillingCycle(cycle)
    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      // Free plan goes directly to success (no payment needed)
      if (planId === 'free') {
        setCurrentStep(5)
        setIsProcessingPayment(false)
        store.reset()
        return
      }

      // Create subscription
      const tempUserId = crypto.randomUUID().replace(/-/g, '').substring(0, 16)

      const subRes = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: tempUserId,
          email: store.email || session?.user?.email,
          planId: planId,
          name: session?.user?.name || 'User',
          trial: false
        })
      })

      const subData = await subRes.json()
      if (!subData.success) {
        setPaymentError(subData.error || 'Failed to create subscription')
        setIsProcessingPayment(false)
        return
      }

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subData.subscriptionId,
        name: 'BrewClaw',
        description: `${planId} Plan`,
        image: '/logo.png',
        handler: async function (response: any) {
          // Verify and provision
          const verifyRes = await fetch('/api/subscriptions/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              provisionData: {
                telegramToken: store.botToken,
                telegramUserId: store.telegramUserId,
                aiProvider: store.aiProvider,
                email: store.email || session?.user?.email,
                plan: planId
              }
            })
          })

          const verifyData = await verifyRes.json()

          if (verifyData.verified && verifyData.provisioned) {
            // Success - go to step 5
            setCurrentStep(5)
            store.reset()
          } else {
            setPaymentError('Payment verification failed')
          }
          setIsProcessingPayment(false)
        },
        prefill: {
          email: store.email || session?.user?.email
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: function() {
            setPaymentError('Payment was cancelled')
            setIsProcessingPayment(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (e) {
      setPaymentError('Failed to process payment')
      setIsProcessingPayment(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    store.reset()
    await signOut({ callbackUrl: "/onboarding" })
  }

  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        if (status === "loading") {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )
        }
        if (status === "authenticated") {
          return null
        }
        return <StepSignIn />

      case 2:
        return (
          <StepAISelection
            onContinue={handleAISelectionContinue}
            onBack={status === "authenticated" ? undefined : handleBack}
          />
        )

      case 3:
        return (
          <StepTelegram
            onContinue={handleTelegramContinue}
            onSkip={() => setCurrentStep(4)}
            onBack={handleBack}
          />
        )

      case 4:
        return <StepPricing onContinue={handlePlanSelected} onBack={handleBack} />

      case 5:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-white">You're Live!</h2>
            <p className="text-zinc-400 mb-8">Your AI assistant is ready to chat.</p>
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          </div>
        )

      default:
        return null
    }
  }

  // Steps 3 (Telegram) and 4 (Pricing) - full width centered layout
  if (currentStep === 3 || currentStep === 4 || currentStep === 5) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col relative">
        {/* Logo - top left */}
        <div className="absolute top-8 left-8">
          <Logo />
        </div>

        {/* Progress indicator - centered at top */}
        <div className="pt-8 px-8 flex flex-col items-center">
          <StepProgress currentStep={currentStep as 1 | 2 | 3 | 4} max={4} />
        </div>

        {/* Logout button - top right */}
        {status === "authenticated" && (
          <div className="absolute top-8 right-8">
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        )}

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className={currentStep === 4 ? "w-full max-w-6xl" : "w-full max-w-4xl"}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Steps 1 & 2 - split layout with left testimonial panel
  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left testimonial panel */}
      <LeftPanel />

      {/* Right content area */}
      <main className="flex-1 flex flex-col relative">
        {/* Mobile header with logo */}
        <div className="lg:hidden p-6 pb-0">
          <Logo />
        </div>

        {/* Progress indicator - centered at top */}
        <div className="pt-8 px-8 flex flex-col items-center">
          <StepProgress currentStep={currentStep as 1 | 2 | 3 | 4} max={4} />
        </div>

        {/* Logout button - top right */}
        {status === "authenticated" && (
          <div className="absolute top-8 right-8">
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full max-w-md"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
