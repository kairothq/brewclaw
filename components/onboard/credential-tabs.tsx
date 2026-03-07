"use client"

import type { AIProvider } from "@/types/ai-provider"

/**
 * Props for the CredentialTabs component
 */
interface CredentialTabsProps {
  /** The AI provider being configured */
  provider: AIProvider
  /** Currently active tab */
  activeTab: "signin" | "apikey"
  /** Callback when tab changes */
  onTabChange: (tab: "signin" | "apikey") => void
  /** Content to render based on active tab */
  children: React.ReactNode
}

/**
 * CredentialTabs Component
 *
 * Tab switcher for Sign In (OAuth) vs API Key credential entry.
 * Uses BrewClaw design system - minimal with espresso accents.
 */
export function CredentialTabs({
  provider,
  activeTab,
  onTabChange,
  children,
}: CredentialTabsProps) {
  const tabs = [
    { id: "signin" as const, label: "Sign In" },
    { id: "apikey" as const, label: "API Key" },
  ]

  return (
    <div className="w-full">
      {/* Tab list - minimal pill style */}
      <div
        className="inline-flex p-1 rounded-lg bg-[#0A0A0A] border border-[#222222]"
        role="tablist"
        aria-label="Credential type selection"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              className={`
                px-5 py-2 text-sm font-medium rounded-md
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78350F]/50
                ${isActive
                  ? "bg-white text-[#0A0A0A] shadow-sm"
                  : "bg-transparent text-[#666666] hover:text-[#999999]"
                }
              `}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-5"
      >
        {children}
      </div>
    </div>
  )
}
