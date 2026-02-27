/**
 * AI Provider Types
 *
 * TypeScript types for AI provider configuration and credentials.
 */

/**
 * Available provider types in the system.
 * - brewclaw: Default credits (no setup needed)
 * - anthropic: Claude API
 * - google: Gemini API
 * - openai: GPT API
 */
export type ProviderType = "brewclaw" | "anthropic" | "google" | "openai"

/**
 * AI Provider configuration.
 * Defines the metadata and connection options for each provider.
 */
export interface AIProvider {
  /** Unique identifier matching ProviderType */
  id: ProviderType
  /** Display name shown in UI */
  name: string
  /** Brief description of provider capabilities */
  description: string
  /** Path to provider logo (e.g., /providers/anthropic.svg) */
  logoUrl?: string
  /** Whether provider supports OAuth authentication */
  hasOAuth: boolean
  /** URL to provider's API key dashboard */
  apiKeyUrl?: string
  /** OAuth authorization URL (if hasOAuth is true) */
  oauthUrl?: string
  /** OAuth scopes required (if hasOAuth is true) */
  oauthScopes?: string
}

/**
 * Credential type for provider authentication.
 * - oauth: User authenticated via OAuth flow
 * - api_key: User provided API key directly
 */
export type CredentialType = "oauth" | "api_key"

/**
 * Provider credentials storage.
 * Represents the stored authentication for a provider.
 */
export interface ProviderCredentials {
  /** Provider ID this credential belongs to */
  providerId: ProviderType
  /** How the credential was obtained */
  credentialType: CredentialType
  /** The actual credential value (token or API key) */
  value: string
  /** Whether the credential has been validated */
  validated: boolean
}

/**
 * Provider configuration for the selection UI.
 * Extended provider info with UI-specific properties.
 */
export interface ProviderConfig extends AIProvider {
  /** Whether to show as recommended option */
  recommended?: boolean
  /** Order in the provider list (lower = first) */
  order: number
}
