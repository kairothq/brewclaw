"use client"

import { useState } from "react"
import { signInWithEmail } from "@/app/(auth)/signin/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MagicLinkForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [lastSent, setLastSent] = useState<number>(0)

  async function handleSubmit(formData: FormData) {
    // Rate limit: 60 seconds between requests (SIGNUP-03)
    const now = Date.now()
    if (now - lastSent < 60000 && lastSent !== 0) {
      setStatus("error")
      const remaining = Math.ceil((60000 - (now - lastSent)) / 1000)
      setErrorMessage(`Please wait ${remaining} seconds before requesting another link`)
      return
    }

    setStatus("sending")
    setErrorMessage("")

    try {
      await signInWithEmail(formData)
      setStatus("sent")
      setLastSent(now)
    } catch (e) {
      setStatus("error")
      setErrorMessage("Failed to send magic link. Please try again.")
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <Input
        name="email"
        type="email"
        placeholder="email@example.com"
        required
        disabled={status === "sending"}
        aria-describedby={status === "error" ? "email-error" : undefined}
      />
      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full"
      >
        {status === "sending"
          ? "Sending..."
          : status === "sent"
          ? "Check your email!"
          : "Send Magic Link"}
      </Button>
      {status === "error" && (
        <p id="email-error" className="text-red-500 text-sm" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "sent" && (
        <p className="text-green-600 text-sm">
          We sent a magic link to your email. Click the link to sign in.
        </p>
      )}
    </form>
  )
}
