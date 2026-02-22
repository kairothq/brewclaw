"use client"

import type React from "react"
import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import {
  Mail,
  Calendar,
  FileText,
  MessageCircle,
  Languages,
  Bell,
  CreditCard,
  Globe,
  DollarSign,
  Tag,
  Percent,
  Share2,
  FileEdit,
  Search,
  Users,
  FileBarChart,
  Send,
  Briefcase,
} from "lucide-react"

// Use case item type
interface UseCaseItem {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  outlined?: boolean
  dashed?: boolean
}

// Use case rows data - organized to match the design
const rows: { items: UseCaseItem[]; direction: "left" | "right" }[] = [
  {
    items: [
      { title: "Schedule meetings from chat", icon: Calendar },
      { title: "Read & summarize email", icon: Mail, outlined: true },
      { title: "Draft replies and follow-ups", icon: FileText, outlined: true },
      { title: "Translate messages in real time", icon: Languages },
    ],
    direction: "left",
  },
  {
    items: [
      { title: "Manage subscriptions", icon: CreditCard },
      { title: "Remind you of deadlines", icon: Bell, outlined: true },
      { title: "Plan your week", icon: Calendar, outlined: true },
      { title: "Take meeting notes", icon: FileText, outlined: true },
      { title: "Sync across timezones", icon: Globe },
    ],
    direction: "right",
  },
  {
    items: [
      { title: "Run payroll calculations", icon: DollarSign },
      { title: "Negotiate refunds", icon: MessageCircle, outlined: true },
      { title: "Find coupons", icon: Tag, outlined: true },
      { title: "Find best prices online", icon: Search, outlined: true },
      { title: "Find discount codes", icon: Percent, dashed: true },
    ],
    direction: "left",
  },
  {
    items: [
      { title: "Draft social posts", icon: Share2, outlined: true },
      { title: "Write contracts and NDAs", icon: FileEdit, outlined: true },
      { title: "Research competitors", icon: Search, outlined: true },
      { title: "Screen and prioritize leads", icon: Users, dashed: true },
    ],
    direction: "right",
  },
  {
    items: [
      { title: "Track OKRs and KPIs", icon: FileBarChart },
      { title: "Monitor news and alerts", icon: Bell, outlined: true },
      { title: "Set and track goals", icon: Calendar, outlined: true },
      { title: "Screen cold outreach", icon: Send, dashed: true },
      { title: "Draft job descriptions", icon: Briefcase, dashed: true },
    ],
    direction: "left",
  },
]

interface UseCaseCardProps {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  outlined?: boolean
  dashed?: boolean
}

function UseCaseCard({ title, icon: Icon, outlined, dashed }: UseCaseCardProps) {
  const borderStyle = dashed
    ? "border-dashed border-zinc-700"
    : outlined
      ? "border-zinc-700"
      : "border-zinc-800 bg-zinc-900"

  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-5 py-3 whitespace-nowrap transition-colors hover:border-zinc-600 ${borderStyle} ${!outlined && !dashed ? "" : "bg-transparent"}`}
    >
      <Icon className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
      <span className="text-sm font-medium text-zinc-300">{title}</span>
    </div>
  )
}

interface MarqueeRowProps {
  items: UseCaseItem[]
  direction: "left" | "right"
  duration?: number
}

function MarqueeRow({ items, direction, duration = 30 }: MarqueeRowProps) {
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {duplicatedItems.map((item, index) => (
          <UseCaseCard
            key={`${item.title}-${index}`}
            title={item.title}
            icon={item.icon}
            outlined={item.outlined}
            dashed={item.dashed}
          />
        ))}
      </div>
    </div>
  )
}

export function UseCasesMarquee() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.fromTo(".use-cases-header",
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

      gsap.fromTo(".use-cases-ps",
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          },
          opacity: 1,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out",
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="use-cases"
      className="relative py-24 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Section Header */}
      <div className="use-cases-header text-center mb-12 px-6">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          What can BrewClaw do for you?
        </h2>
        <p className="text-xl md:text-2xl text-zinc-500">
          One assistant, thousands of use cases
        </p>
      </div>

      {/* Marquee Container */}
      <div className="marquee-container space-y-4 max-w-[90vw] mx-auto">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        {/* All rows */}
        {rows.map((row, index) => (
          <MarqueeRow
            key={index}
            items={row.items}
            direction={row.direction}
            duration={35 + index * 5}
          />
        ))}
      </div>

      {/* PS Line */}
      <p className="use-cases-ps text-center mt-16 px-6 text-zinc-500 italic">
        PS. You can add as many use cases as you want via natural language
      </p>
    </section>
  )
}
