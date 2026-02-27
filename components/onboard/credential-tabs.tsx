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
 * Used for provider configuration in the onboarding flow.
 * Implemented as custom tabs since shadcn/ui Tabs not installed.
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
    <div className="w-full mt-6">
      {/* Tab list */}
      <div
        className="flex border-b border-border"
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
                px-4 py-2.5 text-sm font-medium
                transition-colors duration-200
                border-b-2 -mb-px
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                ${isActive
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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
        className="pt-6"
      >
        {children}
      </div>
    </div>
  )
}
