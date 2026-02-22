"use client"

import { useRef, useState, useMemo } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import {
  Search,
  TrendingUp,
  Users,
  Globe,
  CheckSquare,
  Plug,
  BarChart3,
  Mail,
  Calendar,
  Database,
  FileText,
  MessageSquare,
  Zap,
  PieChart,
  FileSpreadsheet,
  Share2,
} from "lucide-react"

// Skills data
const skills = [
  { id: 1, name: "Email Assistant", category: "Sales", description: "Draft, send, and manage emails with AI", icon: Mail },
  { id: 2, name: "Calendar Manager", category: "Productivity", description: "Schedule meetings and manage your calendar", icon: Calendar },
  { id: 3, name: "CRM Sync", category: "CRM", description: "Sync contacts and deals with HubSpot, Salesforce", icon: Database },
  { id: 4, name: "Web Scraper", category: "Browser", description: "Extract data from websites automatically", icon: Globe },
  { id: 5, name: "Document Writer", category: "Productivity", description: "Generate reports, briefs, and summaries", icon: FileText },
  { id: 6, name: "Lead Finder", category: "Sales", description: "Research and qualify potential leads", icon: TrendingUp },
  { id: 7, name: "Slack Notifier", category: "Integrations", description: "Send updates to Slack channels", icon: MessageSquare },
  { id: 8, name: "Data Analyzer", category: "Analytics", description: "Analyze spreadsheets and generate insights", icon: BarChart3 },
  { id: 9, name: "Meeting Notes", category: "Productivity", description: "Transcribe and summarize meeting recordings", icon: FileSpreadsheet },
  { id: 10, name: "Task Tracker", category: "Productivity", description: "Manage tasks across Notion, Asana, Linear", icon: CheckSquare },
  { id: 11, name: "Invoice Generator", category: "Sales", description: "Create and send professional invoices", icon: Zap },
  { id: 12, name: "Social Monitor", category: "Browser", description: "Track mentions and engagement on social media", icon: Share2 },
  { id: 13, name: "Contact Manager", category: "CRM", description: "Keep your contacts organized and up-to-date", icon: Users },
  { id: 14, name: "Report Builder", category: "Analytics", description: "Create visual reports from your data", icon: PieChart },
  { id: 15, name: "Webhook Handler", category: "Integrations", description: "Connect to any service via webhooks", icon: Plug },
  { id: 16, name: "Search Assistant", category: "Browser", description: "Research topics across the web", icon: Search },
]

const categories = ["All", "Sales", "CRM", "Browser", "Productivity", "Integrations", "Analytics"]

interface SkillCardProps {
  skill: typeof skills[0]
}

function SkillCard({ skill }: SkillCardProps) {
  const Icon = skill.icon

  return (
    <motion.div
      className="skill-card group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[#78350F]/20 transition-colors">
          <Icon className="w-5 h-5 text-zinc-400 group-hover:text-[#D97706] transition-colors" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-white text-sm truncate">
            {skill.name}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
            {skill.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function SkillsStore() {
  const containerRef = useRef<HTMLElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter skills based on category and search
  const filteredSkills = useMemo(() => {
    let result = skills

    if (selectedCategory !== "All") {
      result = result.filter((skill) => skill.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // GSAP scroll entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return

      // Header animation
      gsap.from(".skills-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      })

      // Tabs animation
      gsap.from(".skills-tabs", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 15,
        duration: 0.5,
        delay: 0.1,
        ease: "power2.out",
      })

      // Staggered cards animation
      gsap.from(".skill-card", {
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      })
    },
    { scope: containerRef, dependencies: [filteredSkills] }
  )

  return (
    <section
      ref={containerRef}
      id="skills-store"
      className="relative py-24 px-6 bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="skills-header text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Skills Store
            </p>
            <span className="px-2 py-0.5 text-xs bg-[#78350F] text-white rounded-full font-medium">
              {skills.length} skills
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Extend BrewClaw with Skills
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Powerful integrations to connect your AI assistant with your favorite tools
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="skills-tabs flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No skills found matching your criteria</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#D97706] transition-colors"
          >
            View all skills
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
