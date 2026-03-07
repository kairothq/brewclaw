"use client"

import { useRef, useState, useMemo } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"
import { Search, Download, ArrowUpRight, Box } from "lucide-react"

// Skills data with downloads and authors
const skills = [
  {
    id: 1,
    name: "crm-automation",
    author: "denchhq",
    description: "CRM workflow automation, lead scoring, pipeline management, and deal tracking",
    tags: ["crm", "sales"],
    downloads: 18200,
    category: "CRM",
  },
  {
    id: 2,
    name: "linkedin-outreach",
    author: "denchhq",
    description: "Automated LinkedIn prospecting, connection requests, and follow-up sequences",
    tags: ["linkedin", "sales"],
    downloads: 14800,
    category: "Sales",
  },
  {
    id: 3,
    name: "lead-enrichment",
    author: "denchhq",
    description: "Enrich contacts with LinkedIn, email, company data, and social profiles",
    tags: ["crm", "sales"],
    downloads: 12100,
    category: "CRM",
  },
  {
    id: 4,
    name: "email-sequences",
    author: "denchhq",
    description: "Multi-step cold email campaigns with personalisation and A/B testing",
    tags: ["email", "sales"],
    downloads: 9700,
    category: "Sales",
  },
  {
    id: 5,
    name: "sales-pipeline",
    author: "denchhq",
    description: "Track deals through stages with automated status updates and forecasting",
    tags: ["crm", "sales"],
    downloads: 8300,
    category: "CRM",
  },
  {
    id: 6,
    name: "agent-browser",
    author: "vercel-labs",
    description: "Browser automation and web scraping capabilities for agents",
    tags: ["browser", "automation"],
    downloads: 35800,
    category: "Browser",
  },
  {
    id: 7,
    name: "browser-use",
    author: "browser-use",
    description: "Control Chrome programmatically — click, type, navigate",
    tags: ["browser", "automation"],
    downloads: 24500,
    category: "Browser",
  },
  {
    id: 8,
    name: "web-design-guidelines",
    author: "vercel-labs",
    description: "Best practices for modern web design and accessibility",
    tags: ["frontend", "design"],
    downloads: 19200,
    category: "Frontend",
  },
  {
    id: 9,
    name: "frontend-design",
    author: "anthropics",
    description: "Expert frontend engineering patterns and component design",
    tags: ["frontend", "react"],
    downloads: 16400,
    category: "Frontend",
  },
  {
    id: 10,
    name: "ml-pipeline",
    author: "denchhq",
    description: "Build and deploy ML models with automated training pipelines",
    tags: ["ml", "automation"],
    downloads: 11200,
    category: "ML",
  },
  {
    id: 11,
    name: "devops-deploy",
    author: "vercel-labs",
    description: "Automated deployment workflows for CI/CD pipelines",
    tags: ["devops", "automation"],
    downloads: 8900,
    category: "DevOps",
  },
  {
    id: 12,
    name: "data-transform",
    author: "denchhq",
    description: "Transform and clean data with intelligent ETL workflows",
    tags: ["ml", "data"],
    downloads: 7600,
    category: "ML",
  },
]

const categories = ["All", "Sales", "CRM", "Browser", "Frontend", "DevOps", "ML"]

function formatDownloads(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

interface SkillCardProps {
  skill: typeof skills[0]
}

function SkillCard({ skill }: SkillCardProps) {
  return (
    <motion.a
      href="#"
      className="skill-card group bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer block"
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header with name and arrow */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-mono font-semibold text-zinc-900 text-base flex items-center gap-1.5">
          {skill.name}
          <ArrowUpRight className="w-4 h-4 text-[#D97706]" strokeWidth={2} />
        </h3>
      </div>

      {/* Author */}
      <p className="text-xs text-zinc-400 font-mono mb-3">{skill.author}</p>

      {/* Description */}
      <p className="text-sm text-zinc-600 mb-4 line-clamp-2">{skill.description}</p>

      {/* Footer with tags and downloads */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-500 rounded font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="text-xs font-mono">{formatDownloads(skill.downloads)}</span>
        </div>
      </div>
    </motion.a>
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
          skill.description.toLowerCase().includes(query) ||
          skill.author.toLowerCase().includes(query)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  const totalSkills = 58237 // Display number from screenshot

  // GSAP scroll entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.fromTo(".skills-header",
        { opacity: 0, y: 20 },
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

      gsap.fromTo(".skills-tabs",
        { opacity: 0, y: 15 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
        }
      )

      gsap.fromTo(".skill-card",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
        }
      )
    },
    { scope: containerRef, dependencies: [filteredSkills] }
  )

  return (
    <section
      ref={containerRef}
      id="skills-store"
      className="relative py-24 px-6 bg-zinc-100"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Intro */}
        <div className="skills-header mb-10">
          <p className="text-zinc-700 text-lg max-w-2xl">
            Browse skills from{" "}
            <a href="#" className="text-zinc-900 underline hover:text-[#D97706] transition-colors">
              skills.sh
            </a>
            {" "}and{" "}
            <a href="#" className="text-zinc-900 underline hover:text-[#D97706] transition-colors">
              ClawHub
            </a>
            . Install any skill with a single command — your agent learns new capabilities instantly.
          </p>
        </div>

        {/* Skills Directory Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              <span className="font-semibold text-zinc-900">Skills Directory</span>
              <span className="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-500 rounded-full font-mono">
                {totalSkills.toLocaleString()} skills
              </span>
            </div>
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="skills-tabs flex items-center gap-1 px-5 py-3 border-b border-zinc-100 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid - Scrollable window */}
          <div className="skills-grid-container max-h-[480px] overflow-y-auto overscroll-contain p-5">
            <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500">No skills found matching your criteria</p>
            </div>
          )}

          {/* Bottom Command Bar */}
          <div className="flex items-center gap-4 px-5 py-4 bg-zinc-50 border-t border-zinc-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono text-sm">
              <span className="text-zinc-400">$</span>
              <span className="text-zinc-700">npx skills add</span>
              <span className="text-[#D97706]">vercel-labs/agent-browser</span>
            </div>
            <span className="text-sm text-zinc-500">Install any skill instantly</span>
          </div>
        </div>
      </div>
    </section>
  )
}
