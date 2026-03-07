"use client"

import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { MagicLinkForm } from "@/components/auth/magic-link-form"

interface StepSignInProps {
  onSuccess?: () => void
}

/**
 * StepSignIn Component
 *
 * Step 1 of onboarding: Sign in/Sign up.
 * Shows Google OAuth and Magic Link options.
 */
export function StepSignIn({ onSuccess }: StepSignInProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-heading text-[28px] font-semibold tracking-tight text-white">
          Get Started
        </h2>
        <p className="mt-3 text-[15px] text-[#999999] leading-relaxed">
          Sign in or create an account to continue
        </p>
      </div>

      {/* Google Sign In */}
      <GoogleSignInButton />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2 text-zinc-500">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Magic Link Form */}
      <MagicLinkForm />

      {/* Terms */}
      <p className="text-center text-xs text-zinc-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
