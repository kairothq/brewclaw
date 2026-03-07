"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

/**
 * Props for the TelegramForm component
 */
interface TelegramFormProps {
  /** Called when user continues with validated data */
  onContinue: (data: { botToken: string; userId: string }) => void
  /** Called when user navigates back */
  onBack: () => void
}

/**
 * TelegramForm Component
 *
 * Progressive disclosure form for Telegram bot connection.
 * User ID field appears only after bot token is validated.
 * Both fields must be validated to proceed.
 */
export function TelegramForm({ onContinue, onBack }: TelegramFormProps) {
  // Bot token state
  const [botToken, setBotToken] = useState("")
  const [tokenValidating, setTokenValidating] = useState(false)
  const [tokenValidated, setTokenValidated] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // User ID state
  const [userId, setUserId] = useState("")
  const [userIdValidating, setUserIdValidating] = useState(false)
  const [userIdValidated, setUserIdValidated] = useState(false)
  const [userIdError, setUserIdError] = useState<string | null>(null)

  /**
   * Validate bot token via API
   */
  const handleValidateToken = async () => {
    if (!botToken.trim()) return

    setTokenValidating(true)
    setTokenError(null)

    try {
      const response = await fetch("/api/telegram/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: botToken }),
      })

      const data = await response.json()

      if (data.valid) {
        setTokenValidated(true)
        setTokenError(null)
      } else {
        setTokenValidated(false)
        setTokenError(data.error || "Invalid bot token")
      }
    } catch {
      setTokenValidated(false)
      setTokenError("Failed to validate token. Please try again.")
    } finally {
      setTokenValidating(false)
    }
  }

  /**
   * Validate user ID via API
   */
  const handleValidateUserId = async () => {
    if (!userId.trim()) return

    setUserIdValidating(true)
    setUserIdError(null)

    try {
      const response = await fetch("/api/telegram/validate-userid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, botToken }),
      })

      const data = await response.json()

      if (data.valid) {
        setUserIdValidated(true)
        setUserIdError(null)
      } else {
        setUserIdValidated(false)
        setUserIdError(data.error || "Invalid user ID")
      }
    } catch {
      setUserIdValidated(false)
      setUserIdError("Failed to validate user ID. Please try again.")
    } finally {
      setUserIdValidating(false)
    }
  }

  /**
   * Handle continue button click
   * Validates both fields if not already validated
   */
  const handleContinue = async () => {
    let tokenValid = tokenValidated
    let userIdValid = userIdValidated

    // Validate token if not already validated
    if (!tokenValidated && botToken.trim()) {
      setTokenValidating(true)
      setTokenError(null)

      try {
        const response = await fetch("/api/telegram/validate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: botToken }),
        })

        const data = await response.json()
        tokenValid = data.valid
        setTokenValidated(data.valid)

        if (!data.valid) {
          setTokenError(data.error || "Invalid bot token")
        }
      } catch {
        tokenValid = false
        setTokenError("Failed to validate token. Please try again.")
      } finally {
        setTokenValidating(false)
      }
    }

    if (!tokenValid) return

    // Validate user ID if not already validated
    if (!userIdValidated && userId.trim()) {
      setUserIdValidating(true)
      setUserIdError(null)

      try {
        const response = await fetch("/api/telegram/validate-userid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, botToken }),
        })

        const data = await response.json()
        userIdValid = data.valid
        setUserIdValidated(data.valid)

        if (!data.valid) {
          setUserIdError(data.error || "Invalid user ID")
        }
      } catch {
        userIdValid = false
        setUserIdError("Failed to validate user ID. Please try again.")
      } finally {
        setUserIdValidating(false)
      }
    }

    if (!userIdValid) return

    // Both validated, proceed
    onContinue({ botToken, userId })
  }

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Connect your Telegram Bot
        </h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll guide you through creating a bot with @BotFather
        </p>
      </div>

      {/* Bot Token section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Bot Token
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Create a bot with{" "}
          <a
            href="https://t.me/BotFather"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition-colors inline-flex items-center gap-1"
          >
            @BotFather
            <ExternalLinkIcon className="w-3 h-3" />
          </a>{" "}
          and paste the token below
        </p>

        {/* Token input with check button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={botToken}
            onChange={(e) => {
              setBotToken(e.target.value)
              // Reset validation when token changes
              if (tokenValidated) {
                setTokenValidated(false)
                setTokenError(null)
              }
            }}
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            className={`flex-1 h-10 px-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              tokenError
                ? "border-red-500 focus:ring-red-500"
                : tokenValidated
                ? "border-green-500"
                : "border-input"
            }`}
          />
          <Button
            onClick={handleValidateToken}
            disabled={!botToken.trim() || tokenValidating}
            variant="outline"
            className="px-4"
          >
            {tokenValidating ? (
              <SpinnerIcon className="w-4 h-4 animate-spin" />
            ) : (
              "Check"
            )}
          </Button>
        </div>

        {/* Token validation feedback */}
        {tokenValidated && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-500">
            <CheckIcon className="w-4 h-4" />
            <span>Valid bot token</span>
          </div>
        )}
        {tokenError && (
          <p className="mt-2 text-sm text-red-500">{tokenError}</p>
        )}
      </div>

      {/* User ID section (conditional - slides in after token validates) */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          tokenValidated
            ? "opacity-100 max-h-96 mb-6"
            : "opacity-0 max-h-0"
        }`}
      >
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Telegram User ID
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Send /start to{" "}
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition-colors inline-flex items-center gap-1"
          >
            @userinfobot
            <ExternalLinkIcon className="w-3 h-3" />
          </a>{" "}
          to get your user ID
        </p>

        {/* User ID input with check button */}
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value)
              // Reset validation when user ID changes
              if (userIdValidated) {
                setUserIdValidated(false)
                setUserIdError(null)
              }
            }}
            placeholder="123456789"
            className={`flex-1 h-10 px-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              userIdError
                ? "border-red-500 focus:ring-red-500"
                : userIdValidated
                ? "border-green-500"
                : "border-input"
            }`}
          />
          <Button
            onClick={handleValidateUserId}
            disabled={!userId.trim() || userIdValidating}
            variant="outline"
            className="px-4"
          >
            {userIdValidating ? (
              <SpinnerIcon className="w-4 h-4 animate-spin" />
            ) : (
              "Check"
            )}
          </Button>
        </div>

        {/* User ID validation feedback */}
        {userIdValidated && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-500">
            <CheckIcon className="w-4 h-4" />
            <span>Valid user ID</span>
          </div>
        )}
        {userIdError && (
          <p className="mt-2 text-sm text-red-500">{userIdError}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-8 space-y-4">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full"
          disabled={tokenValidating || userIdValidating}
        >
          {tokenValidating || userIdValidating ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              Validating...
            </span>
          ) : (
            "Continue"
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  )
}

// Icon components
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
