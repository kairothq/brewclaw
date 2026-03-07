"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"

/**
 * Onboarding Layout
 *
 * Override the auth layout - no left panel, just centered content
 * Includes SessionProvider for auth state
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-zinc-950">
        {children}
      </div>
    </SessionProvider>
  )
}
