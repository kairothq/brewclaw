import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { InstallationSection } from "@/components/installation-section"
import { ComparisonSection } from "@/components/comparison-section"
import { FeaturesSection } from "@/components/features-section"
import { UseCasesMarquee } from "@/components/use-cases-marquee"
import { SkillsStore } from "@/components/skills-store"
import { BatchCounter } from "@/components/batch-counter"
import { PricingSection } from "@/components/pricing-section"
import { FinalCTA } from "@/components/final-cta"

// Loading fallback for Suspense boundary (required for useSearchParams)
function HeroFallback() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-32 bg-[#0A0A0A]"
    >
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-8" />
        <div className="h-32 w-96 bg-zinc-800 rounded mb-8" />
        <div className="h-6 w-64 bg-zinc-800 rounded" />
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with A/B Animation Switch */}
      <Suspense fallback={<HeroFallback />}>
        <HeroSection />
      </Suspense>

      {/* Installation Steps Section */}
      <InstallationSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Features Bento Grid */}
      <FeaturesSection />

      {/* Use Cases Marquee */}
      <UseCasesMarquee />

      {/* Skills Store Directory */}
      <SkillsStore />

      {/* Batch Counter */}
      <BatchCounter />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  )
}
