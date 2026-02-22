import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      {/* Heading with Space Grotesk */}
      <h1 className="text-5xl font-heading font-bold">BrewClaw</h1>

      {/* Body text with Geist Sans */}
      <p className="text-lg text-muted-foreground max-w-md text-center">
        Deploy your personal AI assistant in under 5 minutes.
        No code needed.
      </p>

      {/* Code sample with Geist Mono */}
      <code className="font-mono text-sm bg-card px-4 py-2 rounded-lg border border-border">
        npx brewclaw init
      </code>

      {/* Button with accent styling */}
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
        Get Started
      </Button>

      {/* Trust line */}
      <span className="text-sm text-muted-foreground">
        $2 credits included - No code needed
      </span>
    </main>
  )
}
