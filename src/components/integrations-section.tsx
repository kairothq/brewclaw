"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap-config"
import { motion } from "motion/react"

// Integration logos with brand colors
const integrations = [
  { name: "Google Drive", color: "#4285F4", initials: "GD" },
  { name: "Notion", color: "#000000", initials: "N" },
  { name: "Salesforce", color: "#00A1E0", initials: "SF" },
  { name: "HubSpot", color: "#FF7A59", initials: "HS" },
  { name: "Gmail", color: "#EA4335", initials: "GM" },
  { name: "Calendar", color: "#4285F4", initials: "31" },
  { name: "Obsidian", color: "#7C3AED", initials: "OB" },
  { name: "Slack", color: "#4A154B", initials: "SL" },
  { name: "LinkedIn", color: "#0A66C2", initials: "in" },
  { name: "Asana", color: "#F06A6A", initials: "AS" },
  { name: "Monday", color: "#FF3D57", initials: "MO" },
  { name: "ClickUp", color: "#7B68EE", initials: "CU" },
  { name: "PostHog", color: "#1D4AFF", initials: "PH" },
  { name: "Sheets", color: "#0F9D58", initials: "SH" },
  { name: "Notes", color: "#000000", initials: "NT" },
  { name: "GitHub", color: "#181717", initials: "GH" },
]

function IntegrationIcon({ name, color, initials }: { name: string; color: string; initials: string }) {
  return (
    <motion.div
      className="integration-icon flex flex-col items-center gap-2"
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center"
      >
        <span
          className="text-lg font-bold"
          style={{ color }}
        >
          {initials}
        </span>
      </div>
      <span className="text-xs text-zinc-500 font-medium">{name}</span>
    </motion.div>
  )
}

export function IntegrationsSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      gsap.fromTo(".integrations-header",
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

      gsap.fromTo(".integration-icon",
        { opacity: 0, scale: 0.8 },
        {
          scrollTrigger: {
            trigger: ".integrations-grid",
            start: "top 80%",
          },
          opacity: 1,
          scale: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="integrations"
      className="relative py-24 px-6 bg-[#FAFAF9]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="integrations-header text-center mb-16">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em] mb-4">
            Integrations
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 italic">
            Import your data from anywhere
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Contacts, notes, documents, CRM records — bring everything into one workspace.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="integrations-grid grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-8 justify-items-center">
          {integrations.map((integration) => (
            <IntegrationIcon
              key={integration.name}
              name={integration.name}
              color={integration.color}
              initials={integration.initials}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center mt-12 text-sm text-zinc-400 font-mono">
          + 50 more integrations via Skills Store
        </p>
      </div>
    </section>
  )
}
