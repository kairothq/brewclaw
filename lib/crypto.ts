import crypto from "crypto"

/**
 * AES-256-GCM encryption utilities for credential storage
 *
 * Uses Node.js crypto module (available in Next.js API routes)
 * - AES-256-GCM provides authenticated encryption
 * - Random IV for each encryption (12 bytes)
 * - Authentication tag prevents tampering (16 bytes)
 *
 * Security considerations:
 * - Each encryption uses a unique random IV
 * - Same plaintext produces different ciphertext each time
 * - Auth tag ensures integrity (tampered data will fail to decrypt)
 * - Key must be kept secret (use environment variable)
 */

/**
 * Environment variable name for the encryption key
 */
export const ENCRYPTION_KEY_ENV = "CREDENTIAL_ENCRYPTION_KEY"

/**
 * Development-only fallback key (used when env var not set in non-production)
 * WARNING: This is for development convenience only. Always set the env var in production.
 */
const DEV_FALLBACK_KEY = "brewclaw-dev-encryption-key-32ch"

/**
 * Get the encryption key from environment
 *
 * In production: CREDENTIAL_ENCRYPTION_KEY must be set
 * In development: Falls back to dev key with console warning
 *
 * @returns 32-byte Buffer for AES-256
 * @throws Error if production and env var missing
 */
export function getEncryptionKey(): Buffer {
  const keyString = process.env[ENCRYPTION_KEY_ENV]

  if (!keyString) {
    // In production, encryption key is required
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required environment variable: ${ENCRYPTION_KEY_ENV}. ` +
          "Generate a key with: openssl rand -base64 32"
      )
    }

    // In development, use fallback with warning
    console.warn(
      `WARNING: ${ENCRYPTION_KEY_ENV} not set, using development fallback key. ` +
        "Set this environment variable before deploying to production."
    )
    return crypto.createHash("sha256").update(DEV_FALLBACK_KEY).digest()
  }

  // Hash the key string to ensure exactly 32 bytes for AES-256
  return crypto.createHash("sha256").update(keyString).digest()
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 *
 * The output format is: base64(IV + ciphertext + authTag)
 * - IV: 12 bytes (random, unique per encryption)
 * - ciphertext: variable length
 * - authTag: 16 bytes (authentication tag)
 *
 * @param plaintext - The string to encrypt
 * @returns Base64-encoded encrypted string
 * @throws Error if encryption fails
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey()

    // Generate random 12-byte IV (recommended size for GCM)
    const iv = crypto.randomBytes(12)

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

    // Encrypt
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ])

    // Get auth tag (16 bytes)
    const authTag = cipher.getAuthTag()

    // Concatenate: IV (12) + ciphertext + authTag (16)
    const combined = Buffer.concat([iv, encrypted, authTag])

    // Return as base64
    return combined.toString("base64")
  } catch (error) {
    // Never log the plaintext value
    const message =
      error instanceof Error ? error.message : "Unknown encryption error"
    throw new Error(`Encryption failed: ${message}`)
  }
}

/**
 * Decrypt a base64-encoded encrypted string using AES-256-GCM
 *
 * Expected input format: base64(IV + ciphertext + authTag)
 * - IV: first 12 bytes
 * - authTag: last 16 bytes
 * - ciphertext: everything in between
 *
 * @param encrypted - Base64-encoded encrypted string
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export function decrypt(encrypted: string): string {
  try {
    const key = getEncryptionKey()

    // Decode base64
    const combined = Buffer.from(encrypted, "base64")

    // Validate minimum length: IV (12) + authTag (16) = 28 bytes minimum
    if (combined.length < 28) {
      throw new Error("Invalid encrypted data: too short")
    }

    // Extract components
    const iv = combined.subarray(0, 12)
    const authTag = combined.subarray(combined.length - 16)
    const ciphertext = combined.subarray(12, combined.length - 16)

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])

    return decrypted.toString("utf8")
  } catch (error) {
    // Never log the encrypted value as it might reveal patterns
    const message =
      error instanceof Error ? error.message : "Unknown decryption error"

    // Check for common auth failure
    if (message.includes("Unsupported state") || message.includes("auth")) {
      throw new Error(
        "Decryption failed: data may be tampered or encrypted with a different key"
      )
    }

    throw new Error(`Decryption failed: ${message}`)
  }
}
