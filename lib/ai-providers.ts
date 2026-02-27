/**
 * AI Provider Configuration
 *
 * Defines the available AI providers and their connection details.
 */

import type { AIProvider, ProviderConfig, ProviderType } from "@/types/ai-provider"

/**
 * Provider configurations for the AI selection step.
 *
 * Order:
 * 1. BrewClaw Credits (default, no setup)
 * 2. Anthropic (recommended)
 * 3. Google
 * 4. OpenAI
 */
export const providers: ProviderConfig[] = [
  {
    id: "brewclaw",
    name: "BrewClaw Credits",
    description: "$2 credits included - No setup needed",
    logoUrl: "/providers/brewclaw.svg",
    hasOAuth: false,
    order: 0,
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    description: "Best for complex reasoning and long-form writing",
    logoUrl: "/providers/anthropic.svg",
    hasOAuth: true,
    oauthUrl: "https://claude.ai/oauth/authorize",
    oauthScopes: "org:create_api_key user:profile user:inference",
    apiKeyUrl: "https://platform.claude.com/settings/keys",
    recommended: true,
    order: 1,
  },
  {
    id: "google",
    name: "Google (Gemini)",
    description: "Strong with images, documents, and large context",
    logoUrl: "/providers/google.svg",
    hasOAuth: false,
    apiKeyUrl: "https://aistudio.google.com/api-keys",
    order: 2,
  },
  {
    id: "openai",
    name: "OpenAI (GPT)",
    description: "General-purpose chat, coding, and everyday tasks",
    logoUrl: "/providers/openai.svg",
    hasOAuth: true,
    oauthUrl: "https://auth.openai.com/oauth/authorize",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    order: 3,
  },
]

/**
 * Get a provider by its ID.
 *
 * @param id - The provider ID to look up
 * @returns The provider configuration, or undefined if not found
 */
export function getProviderById(id: ProviderType): AIProvider | undefined {
  return providers.find((p) => p.id === id)
}

/**
 * Get the default provider (BrewClaw Credits).
 *
 * @returns The BrewClaw provider configuration
 */
export function getDefaultProvider(): AIProvider {
  return providers[0]
}

/**
 * Get only the optional providers (excludes BrewClaw).
 *
 * @returns Array of optional provider configurations
 */
export function getOptionalProviders(): ProviderConfig[] {
  return providers.filter((p) => p.id !== "brewclaw")
}
