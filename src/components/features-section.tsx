"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Clock, Shield, Zap, MessageCircle, Brain, Cpu } from "lucide-react"

// Simple Icons SVG paths for messaging apps
const messagingApps = [
  {
    name: "WhatsApp",
    color: "#25D366",
    svg: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  },
  {
    name: "Signal",
    color: "#3A76F0",
    svg: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"
  },
  {
    name: "Telegram",
    color: "#26A5E4",
    svg: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  },
  {
    name: "Discord",
    color: "#5865F2",
    svg: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
  },
  {
    name: "Slack",
    color: "#4A154B",
    svg: "M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"
  },
  {
    name: "iMessage",
    color: "#34C759",
    svg: "M11.998.001C5.372.001-.001 5.373-.001 11.999c0 2.056.52 4.095 1.512 5.89L.025 24l6.255-1.482a11.938 11.938 0 005.718 1.46c6.625 0 12-5.372 12-11.998C23.998 5.373 18.624.001 11.998.001zm0 21.6c-1.932 0-3.829-.526-5.47-1.52l-.39-.232-4.034 1.058 1.072-3.92-.254-.405a9.539 9.539 0 01-1.463-5.083c0-5.303 4.317-9.62 9.62-9.62 5.302 0 9.618 4.317 9.618 9.62 0 5.302-4.316 9.62-9.618 9.62l-.081-.018z"
  },
]

// Simple Icons SVG paths for AI providers
const aiProviders = [
  {
    name: "Anthropic",
    color: "#191919",
    svg: "M17.304 4.047L12.558 17.72h2.803l.947-2.862h4.986l.946 2.862h2.803L20.296 4.047h-2.992zm-.163 8.462l1.656-5.006 1.656 5.006h-3.312zM6.754 4.047L.957 17.72h2.883l1.16-2.862h5.188l1.159 2.862h2.883L8.434 4.047H6.754zm-.65 8.462l1.81-4.463 1.81 4.463H6.104z"
  },
  {
    name: "OpenAI",
    color: "#412991",
    svg: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4069-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997Z"
  },
  {
    name: "Google",
    color: "#4285F4",
    svg: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
  },
  {
    name: "OpenRouter",
    color: "#6366F1",
    svg: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13v6l5.25 3.15.75-1.23-4.5-2.67V7h-1.5z"
  },
]

function AlwaysAwakeCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
        <Clock className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
        Always awake
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Your AI runs 24/7, ready to respond whenever you or your contacts need it.
      </p>
    </motion.div>
  )
}

function SecureByDefaultCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
        <Shield className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
        Secure by default
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Your data stays on your machine. End-to-end encryption where supported.
      </p>
    </motion.div>
  )
}

function LightningFastCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
        <Zap className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
        Lightning fast
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        One-click install. No terminal commands, no config files. Just download and run.
      </p>
    </motion.div>
  )
}

function EveryMessagingAppCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
            <MessageCircle className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
            Every messaging app
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            WhatsApp, iMessage, Signal, Telegram, Discord, Slack — all connected through one interface.
          </p>
        </div>

        {/* Right: Messaging app icons grid */}
        <div className="hidden md:grid grid-cols-3 gap-2">
          {messagingApps.map((app) => (
            <motion.div
              key={app.name}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${app.color}15` }}
              whileHover={{ scale: 1.1 }}
              title={app.name}
            >
              <svg viewBox="0 0 24 24" fill={app.color} className="w-5 h-5">
                <path d={app.svg} />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function PickAIProviderCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-6">
        {/* Left content */}
        <div className="flex-1">
          <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
            Pick your AI provider
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Anthropic, OpenAI, Google, or OpenRouter. Choose what fits your needs and budget.
          </p>
        </div>

        {/* Right: AI provider icons with labels */}
        <div className="hidden md:flex flex-col gap-2">
          {aiProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white"
              initial={{ x: index % 2 === 0 ? 0 : 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <svg viewBox="0 0 24 24" fill={provider.color} className="w-4 h-4">
                <path d={provider.svg} />
              </svg>
              <span className="text-xs font-medium text-zinc-700">{provider.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function PersistentMemoryCard() {
  return (
    <motion.div
      className="feature-card bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center mb-4">
        <Brain className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-zinc-900 mb-2">
        Persistent memory
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Your preferences, context, and past conversations are remembered instantly.
      </p>
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

        {/* Features Bento Grid - 6 cards */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top row - 3 equal cards */}
          <AlwaysAwakeCard />
          <SecureByDefaultCard />
          <LightningFastCard />

          {/* Bottom row - 2 wide cards + 1 regular */}
          <div className="md:col-span-2">
            <EveryMessagingAppCard />
          </div>
          <PersistentMemoryCard />

          {/* Third row - 1 regular + 1 wide card */}
          <div className="md:col-span-3">
            <PickAIProviderCard />
          </div>
        </div>
      </div>
    </section>
  )
}
