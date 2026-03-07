"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"

export function MagicLinkForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [lastSent, setLastSent] = useState<number>(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Rate limit: 60 seconds between requests
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
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/onboarding",
      })

      if (result?.error) {
        setStatus("error")
        setErrorMessage("Failed to send magic link. Please try again.")
      } else {
        setStatus("sent")
        setLastSent(now)
      }
    } catch (e) {
      setStatus("error")
      setErrorMessage("Failed to send magic link. Please try again.")
    }
  }

  // Show success state with checkmark
  if (status === "sent") {
    return (
      <div className="space-y-4 text-center py-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-white">Check your email</h3>
          <p className="text-sm text-zinc-400">
            We sent a magic link to <span className="text-white">{email}</span>
          </p>
          <p className="text-xs text-zinc-500">
            Click the link in your email to sign in
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle")
            setEmail("")
          }}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="email"
        type="email"
        placeholder="email@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "sending"}
        aria-describedby={status === "error" ? "email-error" : undefined}
      />
      <Button
        type="submit"
        disabled={status === "sending" || !email}
        className="w-full"
      >
        {status === "sending" ? (
          <>
            <Mail className="w-4 h-4 mr-2 animate-pulse" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Send Magic Link
          </>
        )}
      </Button>
      {status === "error" && (
        <p id="email-error" className="text-red-400 text-sm text-center" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
