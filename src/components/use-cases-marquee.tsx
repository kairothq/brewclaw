"use client"

import {
  Mail,
  Calendar,
  Search,
  FileText,
  MessageCircle,
  FileEdit,
  Languages,
  Briefcase,
  CheckSquare,
  Bell,
  FolderOpen,
  StickyNote,
  BarChart,
  Code,
  Lightbulb,
  Kanban,
  Reply,
  AlignLeft,
  Zap,
} from "lucide-react"

// Use cases with Lucide icons
const row1Cases = [
  { title: "Draft Emails", icon: Mail },
  { title: "Schedule Meetings", icon: Calendar },
  { title: "Research Topics", icon: Search },
  { title: "Summarize Documents", icon: FileText },
  { title: "Answer Questions", icon: MessageCircle },
  { title: "Write Reports", icon: FileEdit },
  { title: "Translate Content", icon: Languages },
  { title: "Create Briefs", icon: Briefcase },
  { title: "Track Tasks", icon: CheckSquare },
]

const row2Cases = [
  { title: "Send Reminders", icon: Bell },
  { title: "Organize Files", icon: FolderOpen },
  { title: "Take Notes", icon: StickyNote },
  { title: "Analyze Data", icon: BarChart },
  { title: "Review Code", icon: Code },
  { title: "Generate Ideas", icon: Lightbulb },
  { title: "Plan Projects", icon: Kanban },
  { title: "Follow Up", icon: Reply },
  { title: "Format Documents", icon: AlignLeft },
  { title: "Automate Workflows", icon: Zap },
]

interface UseCaseCardProps {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

function UseCaseCard({ title, icon: Icon }: UseCaseCardProps) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 hover:border-zinc-600 transition-colors whitespace-nowrap">
      <Icon className="w-5 h-5 text-[#D97706]" strokeWidth={1.5} />
      <span className="text-sm font-medium text-zinc-200">{title}</span>
    </div>
  )
}

interface MarqueeRowProps {
  items: typeof row1Cases
  direction: "left" | "right"
  duration?: number
}

function MarqueeRow({ items, direction, duration = 30 }: MarqueeRowProps) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items]

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {duplicatedItems.map((item, index) => (
          <UseCaseCard key={`${item.title}-${index}`} title={item.title} icon={item.icon} />
        ))}
      </div>
    </div>
  )
}

export function UseCasesMarquee() {
  return (
    <section id="use-cases" className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Use Cases
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
          What can BrewClaw do?
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Endless possibilities for automating your daily tasks with AI
        </p>
      </div>

      {/* Marquee Container - pauses on hover */}
      <div className="marquee-container space-y-4">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

        {/* Row 1 - scrolls left (right-to-left) */}
        <MarqueeRow items={row1Cases} direction="left" duration={35} />

        {/* Row 2 - scrolls right (left-to-right) */}
        <MarqueeRow items={row2Cases} direction="right" duration={40} />
      </div>
    </section>
  )
}
