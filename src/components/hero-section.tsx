"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AsciiBrand } from "@/components/ascii-brand"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { StatusChip } from "@/components/status-chip"

export function HeroSection() {
  const searchParams = useSearchParams()
  const heroStyle = searchParams.get("hero") || "ascii"

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-32 bg-[#0A0A0A]"
    >
      {/* Status Chip */}
      <div className="mb-8">
        <StatusChip />
      </div>

      {/* Brand Animation - A/B Test Switch */}
      <div className="mb-8">
        {heroStyle === "splitflap" ? (
          <SplitFlapAudioProvider>
            <div className="flex flex-col items-center gap-4">
              <SplitFlapText text="BREWCLAW" speed={80} />
              <SplitFlapMuteToggle />
            </div>
          </SplitFlapAudioProvider>
        ) : (
          <AsciiBrand />
        )}
      </div>

      {/* Tagline */}
      <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white text-center max-w-2xl mb-4">
        Deploy your personal AI assistant in under 5 minutes.
      </h2>

      {/* Sub-copy with bullet separators - 8 capabilities */}
      <p className="font-mono text-sm md:text-base text-muted-foreground text-center mb-12 max-w-3xl">
        <span>Writes</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Researches</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Clears inbox</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Sends briefs</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Schedules</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Summarizes</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Translates</span>
        <span className="mx-2 md:mx-3 text-border">|</span>
        <span>Automates</span>
      </p>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-8 py-6 text-base font-medium"
      >
        <Link href="/signup">Get Started</Link>
      </Button>

      {/* Trust Line */}
      <p className="mt-6 font-mono text-xs text-muted-foreground">
        $2 credits included - No code needed
      </p>

      {/* Animation style indicator (dev mode only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-muted-foreground/50">
          hero={heroStyle}
          {heroStyle === "ascii" && (
            <span className="ml-2">
              <Link href="?hero=splitflap" className="underline hover:text-muted-foreground">
                try splitflap
              </Link>
            </span>
          )}
          {heroStyle === "splitflap" && (
            <span className="ml-2">
              <Link href="/" className="underline hover:text-muted-foreground">
                try ascii
              </Link>
            </span>
          )}
        </div>
      )}
    </section>
  )
}
