# Phase 1: Foundation - Research

**Researched:** 2025-02-22
**Domain:** Next.js 15 scaffolding, animation provider setup, typography system, design tokens, accessibility
**Confidence:** HIGH

## Summary

Phase 1 establishes the technical foundation for BrewClaw's animated landing page. This involves scaffolding a Next.js 15 project with Tailwind CSS v4 and shadcn/ui, configuring dual animation providers (Motion for component animations, GSAP for scroll-triggered animations), implementing a three-font typography system (Space Grotesk headings, Geist body, Geist Mono code), defining design tokens as CSS variables following the PRD's espresso color palette, and building a reduced-motion detection system that respects user accessibility preferences.

The v0 templates in the project already demonstrate the exact patterns needed. The `sticky-nav-pricing` template shows Tailwind v4's CSS-first configuration with `@theme inline` and `@import "tailwindcss"`. The `orange-animation` template contains working implementations of SplitFlap animations, GSAP ScrollTrigger integration with Lenis smooth scroll, and the `useGSAP` hook pattern. Both templates use shadcn/ui with the `new-york` style.

**Primary recommendation:** Initialize Next.js 15 with `create-next-app`, configure Tailwind v4 using the CSS-first `@theme` directive for design tokens, register GSAP plugins once in a centralized client component, and wrap the app with Motion's `MotionConfig` for global reduced-motion handling.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Component organization:** Claude's discretion - pick appropriate structure for project size
- **Data files location:** Claude's discretion - pick sensible pattern
- **Template integration:** Copy and adapt v0 templates - copy code into project, modify for BrewClaw branding and requirements
- **File naming:** kebab-case for component files (hero-section.tsx, pricing-card.tsx)

- **Framer Motion handles:**
  - Component entrance animations (fade in, slide in on mount)
  - Hover effects (scale, color changes)
  - Layout animations (AnimatePresence, layoutId for shared elements)
  - All non-scroll component-level animations

- **GSAP handles:**
  - Scroll-triggered animations (fade on scroll, parallax, timeline scrubbing)
  - Complex timelines with precise timing
  - SplitFlap character-by-character animation

- **Ownership rule:** Never apply both Motion and GSAP to the same DOM element - clear boundaries
- **Reduced motion:** Claude's discretion - implement reasonable accessibility defaults

- **Color organization:** Claude's discretion - follow PRD color palette (#0A0A0A dark, #FFFFFF light, #78350F espresso accent)
- **Spacing scale:** Claude's discretion - pick sensible defaults
- **Dark/light sections:** Claude's discretion - clean approach for alternating section themes
- **Shadows:** Medium depth - clear but not heavy, premium SaaS aesthetic
- **Border radius:** Claude's discretion - reference PRD for guidance

- **Font loading strategy:** Claude's discretion - pick best for performance
- **Font-display:** Claude's discretion - balanced approach
- **Fonts from PRD:** Space Grotesk (headings), Geist (body), Geist Mono (code/ASCII)

### Claude's Discretion
- Component folder structure (feature folders vs type folders)
- Data file organization pattern
- CSS variable naming convention
- Spacing scale values
- Dark/light section implementation approach
- Font loading strategy (next/font vs self-hosted)
- Font-display value
- Reduced motion strictness level
- Border radius values

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Project scaffolded with Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui | Templates show exact setup: Next.js 16 (use 15 stable), Tailwind v4 with `@import "tailwindcss"`, shadcn/ui `new-york` style. PostCSS config with `@tailwindcss/postcss`. |
| FOUND-02 | Animation providers configured (Motion + GSAP with proper cleanup) | `orange-animation` template shows pattern: GSAP registered with `gsap.registerPlugin(ScrollTrigger)`, `useGSAP` hook for cleanup. Motion via direct import. Lenis for smooth scroll integrated with GSAP ticker. |
| FOUND-03 | Typography system with Space Grotesk, Geist, Geist Mono fonts | Use `next/font/google` for Space Grotesk, `geist` npm package for Geist fonts. CSS variables `--font-space-grotesk`, `--font-geist-sans`, `--font-geist-mono`. Map to Tailwind via `@theme inline`. |
| FOUND-04 | Design tokens (colors, spacing) implemented as CSS variables | PRD Design System defines full token set. Use Tailwind v4's `@theme` directive. Colors in OKLCH format per shadcn/ui v4 pattern. Spacing uses Tailwind's native 0.25rem base. |
| FOUND-05 | Reduced-motion detection and respect system | Motion provides `useReducedMotion` hook and `<MotionConfig reducedMotion="user">`. GSAP animations should check preference before executing. Wrap app in MotionConfig provider. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5+ | React framework with App Router | Stable version with Turbopack. Templates use v16 but v15 is battle-tested. Avoids RSC complexity for landing page. |
| React | 19.x | UI library | Required by Next.js 15. Concurrent rendering. |
| TypeScript | 5.x | Type safety | Default in Next.js. Catches component prop errors. |
| Tailwind CSS | 4.x | Utility-first CSS | 5x faster builds with Oxide engine. CSS-first config via `@theme`. |
| shadcn/ui | latest | Accessible UI primitives | You own the code. Built on Radix + Tailwind. Templates use `new-york` style. |

### Animation
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion (Framer Motion) | 12.x | Component animations | Entrances, hovers, layout transitions, `AnimatePresence` |
| gsap | 3.14.x | Scroll-linked animations | ScrollTrigger, timeline scrubbing, SplitFlap timing |
| @gsap/react | 2.1.x | React integration | `useGSAP()` hook for automatic cleanup |
| lenis | 1.3.x | Smooth scrolling | Optional: enhances scroll feel, integrates with GSAP ticker |

### Typography
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| geist (npm) | 1.x | Geist Sans + Geist Mono fonts | Body text and code/ASCII art |
| next/font/google | built-in | Space Grotesk font | Headings - auto self-hosted by Next.js |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tw-animate-css | 1.x | Animation utilities | Tailwind v4 compatible replacement for `tailwindcss-animate`. Required by shadcn/ui. |
| lucide-react | 0.454.x | Icons | Tree-shakable icons, used by shadcn/ui |
| class-variance-authority | 0.7.x | Component variants | shadcn/ui dependency for variant patterns |
| clsx + tailwind-merge | latest | Class merging | cn() utility function |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion | React Spring | Motion has better docs, wider adoption, similar capabilities |
| GSAP | Anime.js | GSAP has better React integration, more mature ecosystem |
| Lenis | Locomotive Scroll | Lenis is lighter, official GSAP recommendation |
| next/font | Self-hosted fonts | next/font is simpler, auto-optimized |

**Installation:**
```bash
# Create Next.js 15 project
npx create-next-app@15 brewclaw --typescript --tailwind --eslint --app --src-dir

# Initialize shadcn/ui (will prompt for configuration)
npx shadcn@latest init

# Core dependencies
npm install motion gsap @gsap/react geist lucide-react lenis

# tw-animate-css (Tailwind v4 compatible animations)
npm install tw-animate-css
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers) - SERVER
│   ├── page.tsx                # Landing page assembly - SERVER
│   ├── globals.css             # Tailwind + CSS variables + keyframes
│   └── fonts/                  # Local font files (if self-hosting)
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, card, etc.)
│   ├── sections/               # Page sections (navbar, hero, footer, etc.)
│   ├── animations/             # Reusable animation components
│   └── providers/              # Context providers
│       ├── motion-provider.tsx # MotionConfig wrapper
│       └── gsap-provider.tsx   # GSAP registration (client)
│
├── hooks/
│   ├── use-reduced-motion.ts   # Accessibility preference detection
│   └── use-gsap.ts             # GSAP utilities wrapper
│
├── lib/
│   ├── utils.ts                # cn() helper
│   ├── gsap-config.ts          # GSAP plugin registration
│   └── constants.ts            # Animation timing, design tokens
│
└── data/                       # Static content data files
    ├── site.ts
    └── navigation.ts
```

### Pattern 1: Font Configuration with next/font + Tailwind v4

**What:** Configure fonts using next/font for optimal loading, expose as CSS variables, map to Tailwind.

**When to use:** Root layout setup.

**Example:**
```typescript
// app/layout.tsx
import { Space_Grotesk } from 'next/font/google'
import { GeistSans, GeistMono } from 'geist/font/next'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
  --font-heading: var(--font-space-grotesk), system-ui, sans-serif;
}
```

### Pattern 2: Design Tokens with Tailwind v4 @theme

**What:** Define colors, spacing, and other tokens using CSS-first configuration.

**When to use:** globals.css setup.

**Example:**
```css
/* globals.css */
@import "tailwindcss";

:root {
  /* Base colors - from PRD Design System */
  --color-black: #000000;
  --color-near-black: #0A0A0A;
  --color-card-bg: #111111;
  --color-input-bg: #1A1A1A;
  --color-border: #222222;
  --color-border-subtle: #333333;
  --color-muted: #666666;
  --color-secondary: #999999;
  --color-white: #FFFFFF;

  /* Coffee accents - use sparingly (<5% of page) */
  --color-dark-roast: #451A03;
  --color-espresso: #78350F;
  --color-medium-roast: #92400E;
  --color-caramel: #B45309;
  --color-amber: #D97706;

  /* Spacing scale */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}

@theme inline {
  /* Map to Tailwind utilities */
  --color-background: var(--color-near-black);
  --color-foreground: var(--color-white);
  --color-card: var(--color-card-bg);
  --color-accent: var(--color-espresso);
  --radius-lg: var(--radius-lg);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

### Pattern 3: GSAP Registration in Client Component

**What:** Register GSAP plugins once in a dedicated client component to prevent SSR issues.

**When to use:** App initialization.

**Example:**
```typescript
// lib/gsap-config.ts
"use client"

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export { gsap, ScrollTrigger, useGSAP }
```

```typescript
// components/providers/gsap-provider.tsx
"use client"

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Optional: Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    })

    return () => {
      // Cleanup all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
```

### Pattern 4: Motion Provider with Reduced Motion

**What:** Wrap app in MotionConfig to globally handle reduced motion preference.

**When to use:** Root layout.

**Example:**
```typescript
// components/providers/motion-provider.tsx
"use client"

import { MotionConfig } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}
```

```typescript
// app/layout.tsx
import { MotionProvider } from '@/components/providers/motion-provider'
import { GSAPProvider } from '@/components/providers/gsap-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fonts}>
      <body>
        <MotionProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
```

### Pattern 5: Reduced Motion Hook for GSAP

**What:** Custom hook to detect reduced motion preference and disable GSAP animations.

**When to use:** Any component using GSAP.

**Example:**
```typescript
// hooks/use-reduced-motion.ts
"use client"

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
```

```typescript
// Usage in a section component
"use client"

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useGSAP(() => {
    // Skip GSAP animations if user prefers reduced motion
    if (prefersReducedMotion) return

    gsap.from('.animate-item', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
    })
  }, { scope: containerRef, dependencies: [prefersReducedMotion] })

  return (
    <div ref={containerRef}>
      {/* Content */}
    </div>
  )
}
```

### Anti-Patterns to Avoid

- **Mixing Motion and GSAP on same element:** The user decision explicitly prohibits this. Use Motion for component-level animations (entrances, hovers), GSAP for scroll-triggered effects.

- **GSAP in Server Components:** Will cause hydration errors. Always use "use client" directive.

- **Creating GSAP animations without useGSAP:** Memory leaks and React Strict Mode issues. Always use the hook.

- **Not checking reduced motion before GSAP:** Motion handles this automatically with `reducedMotion="user"`, but GSAP needs manual checks.

- **Large "use client" boundaries:** Push client directives down to smallest interactive units.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling | Custom scroll hijacking | Lenis + GSAP ticker integration | Edge cases with touch, accessibility, performance |
| Font loading | Manual @font-face | next/font + geist npm | Auto-optimization, FOUT handling, subset generation |
| Design tokens | Custom CSS variable system | Tailwind v4 @theme | Automatic utility generation, IDE support |
| Animation cleanup | Manual useEffect cleanup | useGSAP hook | Handles React Strict Mode, scoping, automatic revert |
| Reduced motion | Custom media query listener | Motion's useReducedMotion + MotionConfig | Handles edge cases, SSR-safe |
| Component variants | Inline conditional classes | class-variance-authority (cva) | Type-safe, maintainable, shadcn pattern |

**Key insight:** The v0 templates already demonstrate production-ready patterns. Copy their approaches rather than inventing new solutions.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Configuration Confusion
**What goes wrong:** Using Tailwind v3 syntax (`tailwind.config.js`, `@tailwind` directives) with v4.
**Why it happens:** Many tutorials still reference v3 patterns.
**How to avoid:** Use CSS-first configuration: `@import "tailwindcss"` and `@theme` directive. No `tailwind.config.js` needed for basic setup.
**Warning signs:** Build errors mentioning "unknown directive", utilities not generating.

### Pitfall 2: GSAP ScrollTrigger Hydration Errors
**What goes wrong:** Console warning "Extra attributes from the server: style" on body.
**Why it happens:** ScrollTrigger modifies body styles during enable, but server-rendered HTML doesn't have them.
**How to avoid:** Ensure ScrollTrigger only initializes client-side. Use dynamic import or check `typeof window !== 'undefined'`.
**Warning signs:** Style attribute mismatch warnings in console.

### Pitfall 3: Font Loading Flash
**What goes wrong:** FOUT (Flash of Unstyled Text) on initial load.
**Why it happens:** Fonts not preloaded or wrong `display` value.
**How to avoid:** Use `display: 'swap'` with next/font. Geist package handles this automatically.
**Warning signs:** Visible font swap after page appears.

### Pitfall 4: Motion + GSAP Conflicts
**What goes wrong:** Jittery animations, competing transforms.
**Why it happens:** Both libraries trying to animate the same property on same element.
**How to avoid:** User decision is clear: Motion for component animations, GSAP for scroll. Never overlap.
**Warning signs:** Transform flickers, animations fighting each other.

### Pitfall 5: Reduced Motion Not Respected
**What goes wrong:** Animations play even when user has system preference set.
**Why it happens:** Not wrapping app in MotionConfig, not checking preference in GSAP code.
**How to avoid:** Use `<MotionConfig reducedMotion="user">` wrapper and `useReducedMotion` hook for GSAP.
**Warning signs:** Accessibility audit failures, user complaints.

### Pitfall 6: shadcn/ui + Tailwind v4 Init Issues
**What goes wrong:** Component styles broken after shadcn init.
**Why it happens:** shadcn/ui recently updated for Tailwind v4; old tutorials may have wrong steps.
**How to avoid:** Use `npx shadcn@latest init` (not `shadcn-ui`). Select `new-york` style. Use OKLCH colors in globals.css.
**Warning signs:** Missing styles, wrong color format errors.

## Code Examples

### Complete Root Layout Setup
```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GeistSans, GeistMono } from 'geist/font/next'
import { MotionProvider } from '@/components/providers/motion-provider'
import { GSAPProvider } from '@/components/providers/gsap-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BrewClaw - Your Personal AI Assistant',
  description: 'Deploy your personal AI assistant in under 5 minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <MotionProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
```

### Complete globals.css Structure
```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Design tokens from PRD Design System */
:root {
  /* Base grayscale */
  --color-black: #000000;
  --color-near-black: #0A0A0A;
  --color-card-bg: #111111;
  --color-input-bg: #1A1A1A;
  --color-border: #222222;
  --color-border-subtle: #333333;
  --color-muted: #666666;
  --color-secondary: #999999;
  --color-white: #FFFFFF;

  /* Coffee accents (use sparingly - <5% of page) */
  --color-dark-roast: #451A03;
  --color-espresso: #78350F;
  --color-medium-roast: #92400E;
  --color-caramel: #B45309;
  --color-amber: #D97706;

  /* Semantic colors for shadcn/ui (OKLCH format) */
  --background: oklch(0.09 0 0);
  --foreground: oklch(1 0 0);
  --card: oklch(0.12 0 0);
  --card-foreground: oklch(1 0 0);
  --popover: oklch(0.12 0 0);
  --popover-foreground: oklch(1 0 0);
  --primary: oklch(1 0 0);
  --primary-foreground: oklch(0.09 0 0);
  --secondary: oklch(0.18 0 0);
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.18 0 0);
  --muted-foreground: oklch(0.55 0 0);
  --accent: oklch(0.5 0.15 50); /* Espresso-ish */
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.18 0 0);
  --input: oklch(0.18 0 0);
  --ring: oklch(0.4 0 0);

  /* Spacing */
  --radius: 0.75rem;
}

@theme inline {
  /* Typography */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
  --font-heading: var(--font-space-grotesk), system-ui, sans-serif;

  /* Colors mapped to Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Animation keyframes */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px currentColor; }
  50% { opacity: 0.6; box-shadow: 0 0 8px currentColor; }
}
```

### shadcn/ui components.json for Tailwind v4
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | CSS-first @theme | Tailwind v4 (Jan 2025) | No config file needed, design tokens in CSS |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 (Jan 2025) | Simpler CSS structure |
| tailwindcss-animate | tw-animate-css | Tailwind v4 (Jan 2025) | v4 compatibility |
| HSL colors | OKLCH colors | shadcn/ui 2025 update | Better color perception |
| forwardRef | No forwardRef | React 19 | Simpler component code |
| useEffect for GSAP | useGSAP hook | @gsap/react 2.x | Automatic cleanup, scope support |

**Deprecated/outdated:**
- `tailwindcss-animate`: Use `tw-animate-css` instead
- `shadcn-ui` CLI: Use `shadcn` CLI (package name changed)
- HSL color format in shadcn: Use OKLCH format

## Open Questions

1. **Lenis smooth scroll necessity**
   - What we know: Templates use Lenis integrated with GSAP ticker
   - What's unclear: Whether smooth scroll is essential or optional for this landing page
   - Recommendation: Include Lenis for premium feel, but make it optional/removable

2. **Exact Geist font package import**
   - What we know: Geist is available both as `geist` npm package and via next/font/google (recently added)
   - What's unclear: Which import method is more reliable in 2025
   - Recommendation: Use `geist/font/next` package as shown in template - more stable

## Sources

### Primary (HIGH confidence)
- [Next.js 15 Documentation](https://nextjs.org/docs/app/getting-started) - App Router setup
- [Tailwind CSS v4 Installation](https://tailwindcss.com/docs/guides/nextjs) - PostCSS configuration
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) - Component setup
- [GSAP React Integration](https://gsap.com/resources/React/) - useGSAP hook patterns
- [Motion Accessibility](https://motion.dev/docs/react-accessibility) - reducedMotion configuration
- [Geist Font](https://vercel.com/font) - Official Vercel font

### Secondary (MEDIUM confidence)
- [v0 Templates in Project](file://./v0%20templates/) - Working implementations of all patterns
- [PRD Design System](/PRD/BrewClaw_Design_System.md) - Color palette, typography, spacing

### Tertiary (LOW confidence)
- None - all findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via official docs and working templates
- Architecture: HIGH - Patterns directly from Next.js docs and existing templates
- Pitfalls: HIGH - Common issues documented in official migration guides

**Research date:** 2025-02-22
**Valid until:** 60 days (stable stack, no imminent breaking changes expected)
