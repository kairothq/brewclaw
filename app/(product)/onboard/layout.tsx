import React from "react"
import Link from "next/link"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
        <span className="text-background font-bold text-sm">B</span>
      </div>
      <span className="font-semibold text-lg">Brewclaw</span>
    </Link>
  )
}

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Need help? <a href="mailto:support@brewclaw.com" className="text-foreground hover:underline">Contact support</a>
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
