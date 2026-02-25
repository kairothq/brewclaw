"use client"

import { useState } from "react"
import { Check, ChevronRight, Play, X, Sparkles, MessageCircle, Bot, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

// Step indicator component
function StepIndicator({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                index < currentStep
                  ? "bg-emerald-500 text-white"
                  : index === currentStep
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs mt-2 ${index === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 mb-6 ${index < currentStep ? "bg-emerald-500" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Video modal component
function VideoModal({ isOpen, onClose, platform }: { isOpen: boolean; onClose: () => void; platform: string }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">How to set up {platform}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-secondary flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Tutorial video placeholder</p>
            <p className="text-sm mt-2">Video will show how to create a {platform} bot</p>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} className="w-full">Got it, continue</Button>
        </div>
      </div>
    </div>
  )
}

// Step 1: Select Plan
function SelectPlanStep({ onSelect }: { onSelect: (plan: string) => void }) {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "₹199",
      period: "/month",
      description: "For casual personal use",
      features: ["Full Agent abilities", "1.5 GB RAM", "10 GB Storage", "Email support"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹499",
      period: "/month",
      description: "For power users",
      features: ["Everything in Starter", "3 GB RAM", "20 GB Storage", "Priority support", "More AI credits"],
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: "₹1,499",
      period: "/month",
      description: "For teams and heavy usage",
      features: ["Everything in Pro", "4 GB RAM", "60 GB Storage", "Dedicated support", "Advanced analytics"],
      popular: false,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Choose your plan</h1>
        <p className="text-muted-foreground mt-2">Select the plan that best fits your needs. You can upgrade anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border p-6 transition-all duration-200 hover:border-foreground/50 cursor-pointer ${
              plan.popular ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"
            }`}
            onClick={() => onSelect(plan.id)}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
                onClick={() => onSelect(plan.id)}
              >
                Select {plan.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 2: Choose Platform
function ChoosePlatformStep({ onSelect }: { onSelect: (platform: string) => void }) {
  const [videoModal, setVideoModal] = useState<string | null>(null)

  const platforms = [
    {
      id: "telegram",
      name: "Telegram",
      description: "Most popular choice",
      icon: MessageCircle,
      available: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Coming soon",
      icon: MessageCircle,
      available: false,
    },
    {
      id: "discord",
      name: "Discord",
      description: "Coming soon",
      icon: MessageCircle,
      available: false,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Choose your platform</h1>
        <p className="text-muted-foreground mt-2">Select where you want your AI assistant to live</p>
      </div>

      <div className="grid gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`relative rounded-xl border p-6 transition-all duration-200 ${
              platform.available
                ? "border-border bg-card hover:border-foreground/50 cursor-pointer"
                : "border-border/50 bg-card/50 opacity-60 cursor-not-allowed"
            }`}
            onClick={() => platform.available && setVideoModal(platform.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  platform.available ? "bg-secondary" : "bg-secondary/50"
                }`}>
                  <platform.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
              </div>
              {platform.available && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Watch tutorial</span>
                  <Play className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <VideoModal
        isOpen={!!videoModal}
        onClose={() => {
          setVideoModal(null)
          onSelect("telegram")
        }}
        platform={videoModal || ""}
      />

      <p className="text-center text-sm text-muted-foreground">
        Click on a platform to see the setup tutorial, then continue to the next step
      </p>
    </div>
  )
}

// Step 3: Choose AI Provider
function ChooseAIStep({ onSelect }: { onSelect: (ai: string, apiKey?: string) => void }) {
  const [selectedAI, setSelectedAI] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [useOwnKey, setUseOwnKey] = useState(true)

  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Great for general tasks",
      icon: Sparkles,
      docsUrl: "https://makersuite.google.com/app/apikey",
    },
    {
      id: "openai",
      name: "OpenAI (GPT-4)",
      description: "Most capable model",
      icon: Bot,
      docsUrl: "https://platform.openai.com/api-keys",
    },
    {
      id: "anthropic",
      name: "Anthropic (Claude)",
      description: "Best for reasoning",
      icon: Bot,
      docsUrl: "https://console.anthropic.com/settings/keys",
    },
  ]

  const selectedProvider = providers.find((p) => p.id === selectedAI)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Choose your AI</h1>
        <p className="text-muted-foreground mt-2">Select an AI provider to power your assistant</p>
      </div>

      {/* AI Provider Selection */}
      <div className="grid gap-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
              selectedAI === provider.id
                ? "border-foreground bg-secondary"
                : "border-border bg-card hover:border-foreground/50"
            }`}
            onClick={() => setSelectedAI(provider.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <provider.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{provider.name}</h3>
                <p className="text-sm text-muted-foreground">{provider.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedAI === provider.id ? "border-foreground bg-foreground" : "border-muted-foreground"
              }`}>
                {selectedAI === provider.id && <Check className="w-4 h-4 text-background" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Key or Skip Option */}
      {selectedAI && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                useOwnKey ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
              onClick={() => setUseOwnKey(true)}
            >
              Use my API key
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                !useOwnKey ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
              onClick={() => setUseOwnKey(false)}
            >
              Get AI from Brewclaw
            </button>
          </div>

          {useOwnKey ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {selectedProvider?.name} API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <a
                href={selectedProvider?.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Get your API key from {selectedProvider?.name}
                <ChevronRight className="w-4 h-4" />
              </a>
              <Button
                className="w-full"
                disabled={!apiKey}
                onClick={() => onSelect(selectedAI, apiKey)}
              >
                Continue with my key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                <p className="text-sm text-foreground">
                  <strong>Brewclaw Credits:</strong> We'll provide AI credits as part of your subscription.
                  No API key setup required!
                </p>
              </div>
              <Button className="w-full" onClick={() => onSelect(selectedAI)}>
                Continue with Brewclaw credits
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Step 4: Payment
function PaymentStep({ plan, onComplete }: { plan: string; onComplete: () => void }) {
  const planDetails: Record<string, { name: string; price: string }> = {
    starter: { name: "Starter", price: "₹199" },
    pro: { name: "Pro", price: "₹499" },
    business: { name: "Business", price: "₹1,499" },
  }

  const selected = planDetails[plan] || planDetails.starter

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Complete your purchase</h1>
        <p className="text-muted-foreground mt-2">You're almost there! Review and confirm your subscription.</p>
      </div>

      {/* Order Summary */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Order Summary</h3>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">{selected.name} Plan (Monthly)</span>
          <span className="font-medium text-foreground">{selected.price}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">{selected.price}<span className="text-sm text-muted-foreground">/month</span></span>
        </div>
      </div>

      {/* Payment Button (Placeholder) */}
      <div className="space-y-4">
        <Button className="w-full h-12 text-base" onClick={onComplete}>
          <CreditCard className="w-5 h-5 mr-2" />
          Pay with Razorpay
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Secure payment powered by Razorpay. Cancel anytime.
        </p>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 pt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-sm">7-day free trial</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-sm">Cancel anytime</span>
        </div>
      </div>
    </div>
  )
}

// Success Step
function SuccessStep() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-20 h-20 rounded-full bg-emerald-500 mx-auto flex items-center justify-center">
        <Check className="w-10 h-10 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">You're all set!</h1>
        <p className="text-muted-foreground mt-2">Your AI assistant is being deployed. This usually takes less than 60 seconds.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
        <h3 className="font-semibold text-foreground">What happens next?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
            <span>We're setting up your private server</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
            <span>Your Telegram bot is being configured</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
            <span>You'll receive a confirmation message on Telegram</span>
          </li>
        </ul>
      </div>
      <Button className="w-full" onClick={() => window.location.href = "/dashboard"}>
        Go to Dashboard
      </Button>
    </div>
  )
}

// Main Onboarding Component
export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    plan: "",
    platform: "",
    ai: "",
    apiKey: "",
  })

  const steps = ["Plan", "Platform", "AI", "Payment"]

  const handlePlanSelect = (plan: string) => {
    setFormData({ ...formData, plan })
    setCurrentStep(1)
  }

  const handlePlatformSelect = (platform: string) => {
    setFormData({ ...formData, platform })
    setCurrentStep(2)
  }

  const handleAISelect = (ai: string, apiKey?: string) => {
    setFormData({ ...formData, ai, apiKey: apiKey || "" })
    setCurrentStep(3)
  }

  const handlePaymentComplete = () => {
    setCurrentStep(4)
  }

  return (
    <div>
      {currentStep < 4 && <StepIndicator steps={steps} currentStep={currentStep} />}

      {currentStep === 0 && <SelectPlanStep onSelect={handlePlanSelect} />}
      {currentStep === 1 && <ChoosePlatformStep onSelect={handlePlatformSelect} />}
      {currentStep === 2 && <ChooseAIStep onSelect={handleAISelect} />}
      {currentStep === 3 && <PaymentStep plan={formData.plan} onComplete={handlePaymentComplete} />}
      {currentStep === 4 && <SuccessStep />}

      {/* Back button */}
      {currentStep > 0 && currentStep < 4 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to previous step
          </button>
        </div>
      )}
    </div>
  )
}
