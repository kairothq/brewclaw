"use client"

import type { AIProvider } from "@/types/ai-provider"

/**
 * Props for the ProviderCard component
 */
interface ProviderCardProps {
  /** Provider configuration to display */
  provider: AIProvider
  /** Whether this card is currently selected */
  selected: boolean
  /** Whether to show "Recommended" badge */
  recommended?: boolean
  /** Click handler for selection */
  onClick: () => void
}

/**
 * ProviderCard Component
 *
 * Displays a single AI provider option as a selectable card.
 * Shows provider name, description, and optional recommended badge.
 * Selected state indicated by orange border highlight.
 */
export function ProviderCard({
  provider,
  selected,
  recommended = false,
  onClick,
}: ProviderCardProps) {
  // Generate provider initial for logo fallback
  const providerInitial = provider.name.charAt(0).toUpperCase()

  // Logo background colors by provider
  const logoColors: Record<string, string> = {
    brewclaw: "bg-orange-500",
    anthropic: "bg-amber-600",
    google: "bg-blue-500",
    openai: "bg-green-600",
  }

  const logoColor = logoColors[provider.id] || "bg-gray-500"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full p-4 rounded-lg text-left
        transition-all duration-200
        bg-card hover:bg-accent/50
        ${selected
          ? "border-2 border-orange-500 shadow-md shadow-orange-500/10"
          : "border border-border hover:border-border/80"
        }
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `}
      aria-pressed={selected}
      aria-label={`Select ${provider.name}${recommended ? " (Recommended)" : ""}`}
    >
      {/* Recommended badge */}
      {recommended && (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
          Recommended
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Provider logo/initial */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg
            flex items-center justify-center
            text-white font-bold text-lg
            ${logoColor}
          `}
          aria-hidden="true"
        >
          {providerInitial}
        </div>

        {/* Provider info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-base font-semibold text-foreground">
            {provider.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {provider.description}
          </p>
        </div>

        {/* Selection indicator */}
        <div
          className={`
            flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
            flex items-center justify-center
            transition-colors duration-200
            ${selected
              ? "border-orange-500 bg-orange-500"
              : "border-muted-foreground/30"
            }
          `}
          aria-hidden="true"
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
