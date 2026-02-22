# Architecture Patterns

**Domain:** Premium animated SaaS landing page
**Project:** BrewClaw Landing Page
**Researched:** 2026-02-22
**Confidence:** HIGH (verified via Next.js docs, GSAP docs, multiple authoritative sources)

---

## Recommended Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Next.js App Router                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Root Layout (Server)                        │  │
│  │  - Fonts (Space Grotesk, Geist, Geist Mono)                   │  │
│  │  - Metadata                                                    │  │
│  │  - Global CSS variables                                        │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │            Animation Context Provider (Client)           │  │  │
│  │  │  - Sound settings (muted/unmuted)                        │  │  │
│  │  │  - Reduced motion detection                              │  │  │
│  │  │  - Animation toggles                                     │  │  │
│  │  │  ┌─────────────────────────────────────────────────────┐ │  │  │
│  │  │  │                   Page Content                       │ │  │  │
│  │  │  │  [Navbar] [Chip] [Hero] ... [Footer]                │ │  │  │
│  │  │  └─────────────────────────────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata) - SERVER
│   ├── page.tsx                # Landing page assembly - SERVER
│   ├── globals.css             # Tailwind + CSS animations
│   ├── fonts/                  # Local font files
│   └── (marketing)/            # Route group for landing pages
│       └── page.tsx            # Optional: if multiple marketing pages
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── sections/               # Page sections (12 total)
│   │   ├── navbar.tsx          # CLIENT - hover animations
│   │   ├── status-chip.tsx     # CLIENT - rotating messages
│   │   ├── hero.tsx            # CLIENT - SplitFlap/ASCII + sound
│   │   ├── installation.tsx    # CLIENT - beating dot + video sync
│   │   ├── comparison.tsx      # CLIENT - scroll animations
│   │   ├── features.tsx        # CLIENT - hover effects
│   │   ├── use-cases.tsx       # CLIENT - marquee animation
│   │   ├── skills-store.tsx    # CLIENT - filters + search
│   │   ├── batch-counter.tsx   # CLIENT - count-up animation
│   │   ├── pricing.tsx         # CLIENT - border beam
│   │   ├── final-cta.tsx       # CLIENT - shader button
│   │   └── footer.tsx          # SERVER (mostly static)
│   │
│   ├── animations/             # Reusable animation components
│   │   ├── split-flap.tsx      # SplitFlap character animation
│   │   ├── ascii-shimmer.tsx   # ASCII gradient shimmer
│   │   ├── marquee.tsx         # Infinite scroll marquee
│   │   ├── border-beam.tsx     # Animated border effect
│   │   ├── liquid-metal.tsx    # Shader button effect
│   │   ├── fade-in.tsx         # Scroll-triggered fade
│   │   ├── count-up.tsx        # Number animation
│   │   └── pulse-glow.tsx      # Status chip pulse
│   │
│   └── shared/                 # Shared components
│       ├── section-wrapper.tsx # Consistent section padding/spacing
│       ├── glass-blur.tsx      # Gaussian blur glass effect
│       └── video-player.tsx    # Demo video component
│
├── hooks/                      # Custom React hooks
│   ├── use-gsap.tsx            # GSAP + ScrollTrigger integration
│   ├── use-sound.tsx           # Web Audio API wrapper
│   ├── use-intersection.tsx    # Viewport detection
│   ├── use-reduced-motion.tsx  # Accessibility preference
│   └── use-scroll-lock.tsx     # Mobile menu scroll lock
│
├── context/
│   ├── animation-provider.tsx  # Animation settings context
│   └── sound-provider.tsx      # Sound state context
│
├── lib/
│   ├── utils.ts                # cn() and helper functions
│   ├── gsap.ts                 # GSAP registration + plugins
│   └── constants.ts            # Animation durations, easing
│
├── data/
│   ├── site.ts                 # Site metadata, brand info
│   ├── pricing.ts              # Pricing tier data
│   ├── features.ts             # Feature cards data
│   ├── use-cases.ts            # Marquee use cases data
│   ├── steps.ts                # Installation steps data
│   └── navigation.ts           # Nav links data
│
└── styles/
    └── animations.css          # Keyframe animations (pulse-glow, etc.)
```

---

## Component Boundaries

### Server vs Client Components

| Component | Rendering | Reason |
|-----------|-----------|--------|
| Root Layout | SERVER | Fonts, metadata, static HTML |
| Animation Provider | CLIENT | Context requires state |
| Sound Provider | CLIENT | Browser Audio API |
| Navbar | CLIENT | Hover animations, scroll state |
| Status Chip | CLIENT | Rotating messages, intervals |
| Hero | CLIENT | SplitFlap animation, sound |
| Installation | CLIENT | Video sync, beating dot |
| Comparison | CLIENT | Scroll-triggered animations |
| Features | CLIENT | Hover effects |
| Use Cases | CLIENT | Marquee animation, pause on hover |
| Skills Store | CLIENT | Search, filter interactions |
| Batch Counter | CLIENT | Count-up animation on viewport |
| Pricing | CLIENT | Border beam animation |
| Final CTA | CLIENT | Shader button animation |
| Footer | SERVER | Mostly static, minimal JS |

### Component Communication

| Component | Communicates With | Data Flow |
|-----------|-------------------|-----------|
| Navbar | Sound Provider | Toggles mute state |
| Navbar | Page sections | Scroll-to-section IDs |
| Status Chip | Batch Counter | Click scrolls to batch section |
| Hero | Sound Provider | Plays SplitFlap click sounds |
| Hero | Animation Provider | Respects reduced motion |
| Installation | Video Player | Step progression syncs video |
| Pricing | URL (query params) | CTA links include plan param |
| All sections | Animation Provider | Global animation settings |

---

## Data Flow

### Static Data (Build Time)

```
data/*.ts  →  Section Components  →  Static HTML
   ↓
┌─────────────────────────────────────────────────────────────┐
│  pricing.ts exports:                                         │
│  { tier: "Pro", price: 60, badge: "BEST VALUE", ... }       │
│                    ↓                                         │
│  <PricingCard {...tier} />  →  Server-rendered HTML          │
└─────────────────────────────────────────────────────────────┘
```

### Animation State (Runtime)

```
┌───────────────────────────────────────────────────────────────────┐
│                    Animation Provider (Context)                    │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  state: {                                                  │    │
│  │    soundEnabled: boolean,                                  │    │
│  │    reducedMotion: boolean,                                 │    │
│  │    animationsEnabled: boolean                              │    │
│  │  }                                                         │    │
│  └───────────────────────────────────────────────────────────┘    │
│           ↓                    ↓                    ↓              │
│     [Navbar]              [Hero]             [All Sections]        │
│   (mute toggle)     (play/skip anims)     (fade vs instant)        │
└───────────────────────────────────────────────────────────────────┘
```

### Scroll-Based Animation Flow

```
User Scrolls
    ↓
GSAP ScrollTrigger (registered globally)
    ↓
┌─────────────────────────────────────────────────────────────┐
│  useGSAP hook in each section:                               │
│                                                              │
│  1. Trigger element enters viewport                          │
│  2. Animation starts (respecting reduced motion)             │
│  3. Timeline plays (scrub: true for scroll-synced)           │
│  4. Cleanup on unmount                                       │
└─────────────────────────────────────────────────────────────┘
```

### Sound Flow (SplitFlap)

```
┌─────────────────────────────────────────────────────────────────┐
│  Sound Provider                                                  │
│  ┌───────────────────┐                                          │
│  │ AudioContext ref  │ ← Created once on user interaction       │
│  │ soundEnabled      │ ← Toggle from navbar                     │
│  └───────────────────┘                                          │
│           ↓                                                      │
│  useSoundEffect('click')                                        │
│           ↓                                                      │
│  SplitFlap component triggers sound per character flip          │
│  (only if soundEnabled && !reducedMotion)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Patterns to Follow

### Pattern 1: Section Component Structure

**What:** Each section follows a consistent structure for maintainability.

**Example:**
```typescript
// components/sections/features.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useAnimationSettings } from "@/context/animation-provider";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { features } from "@/data/features";

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAnimationSettings();

  useGSAP(() => {
    if (reducedMotion) return;

    // GSAP animations scoped to containerRef
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
    });
  }, { scope: containerRef });

  return (
    <SectionWrapper id="features" background="light" ref={containerRef}>
      <h2>What You Get</h2>
      <div className="grid">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </SectionWrapper>
  );
}
```

### Pattern 2: Animation Component Extraction

**What:** Extract reusable animation primitives that accept children.

**Example:**
```typescript
// components/animations/fade-in.tsx
"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { useAnimationSettings } from "@/context/animation-provider";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAnimationSettings();

  useGSAP(() => {
    if (reducedMotion) return;

    const directions = {
      up: { y: 40 },
      down: { y: -40 },
      left: { x: 40 },
      right: { x: -40 },
    };

    gsap.from(ref.current, {
      ...directions[direction],
      opacity: 0,
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
      },
    });
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
```

### Pattern 3: Data-Driven Sections

**What:** Keep content in separate data files for easy updates.

**Example:**
```typescript
// data/pricing.ts
export const pricingTiers = [
  {
    id: "basic",
    name: "Basic",
    badge: "POPULAR",
    price: 30,
    description: "For casual personal use",
    features: [
      "Full Agent abilities",
      "Full Linux environment",
      "Great for simple tasks",
    ],
    resources: { vcpu: 1, ram: 2, storage: 10 },
    ctaText: "Get Started",
    ctaUrl: "/signup?plan=basic",
  },
  // ... more tiers
] as const;
```

### Pattern 4: GSAP Context-Safe Event Handlers

**What:** Use contextSafe for event handlers that trigger GSAP animations.

**Example:**
```typescript
"use client";

import { useGSAP } from "@gsap/react";

export function InteractiveCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleHover = contextSafe(() => {
    gsap.to(".card-shine", { x: "100%", duration: 0.5 });
  });

  return (
    <div ref={containerRef} onMouseEnter={handleHover}>
      <div className="card-shine" />
      {/* content */}
    </div>
  );
}
```

### Pattern 5: Reduced Motion Respect

**What:** Always check user preference and provide fallbacks.

**Example:**
```typescript
// hooks/use-reduced-motion.tsx
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

// In components:
const { reducedMotion } = useAnimationSettings();

if (reducedMotion) {
  // Skip animation, show final state immediately
  return <div className="opacity-100">{children}</div>;
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Animations in Server Components

**What:** Adding Framer Motion or GSAP directly in server components.

**Why bad:** Server components cannot use hooks, event handlers, or browser APIs. Build will fail.

**Instead:** Create a thin client component wrapper:
```typescript
// BAD - in server component
export default function Page() {
  return <motion.div animate={{ x: 100 }}>Hello</motion.div>; // Error!
}

// GOOD - separate client component
// hero-animation.tsx
"use client";
export function HeroAnimation() {
  return <motion.div animate={{ x: 100 }}>Hello</motion.div>;
}

// page.tsx (server)
import { HeroAnimation } from "./hero-animation";
export default function Page() {
  return <HeroAnimation />;
}
```

### Anti-Pattern 2: Creating Audio Context on Mount

**What:** Creating Web Audio API AudioContext in useEffect without user gesture.

**Why bad:** Browsers block autoplay. Audio context will be in "suspended" state.

**Instead:** Create AudioContext on first user interaction:
```typescript
// BAD
useEffect(() => {
  const ctx = new AudioContext(); // Suspended!
}, []);

// GOOD
const initAudio = () => {
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }
};

return <button onClick={initAudio}>Enable Sound</button>;
```

### Anti-Pattern 3: GSAP Without Cleanup

**What:** Creating GSAP animations without using useGSAP or manual cleanup.

**Why bad:** Memory leaks, animations continue after unmount, React strict mode issues.

**Instead:** Always use useGSAP hook or gsap.context():
```typescript
// BAD
useEffect(() => {
  gsap.to(".element", { x: 100 });
}, []);

// GOOD
useGSAP(() => {
  gsap.to(".element", { x: 100 });
}, { scope: containerRef }); // Auto-cleanup
```

### Anti-Pattern 4: Inline Animation Definitions

**What:** Defining animation values inline in components.

**Why bad:** Hard to maintain consistency, can't share timing across components.

**Instead:** Centralize in constants:
```typescript
// lib/constants.ts
export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
  },
  ease: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    sharp: "power4.out",
  },
} as const;

// In components:
gsap.to(el, { duration: ANIMATION.duration.normal, ease: ANIMATION.ease.smooth });
```

### Anti-Pattern 5: Large Client Component Boundaries

**What:** Marking entire page or large sections as "use client".

**Why bad:** All child components become client components, increasing JS bundle.

**Instead:** Push "use client" down to smallest interactive units:
```typescript
// BAD
// page.tsx
"use client";
export default function Page() { /* entire page is client */ }

// GOOD
// page.tsx (server)
export default function Page() {
  return (
    <>
      <StaticHeader />          {/* Server */}
      <InteractiveHero />       {/* Client - marked internally */}
      <StaticFeatureList />     {/* Server */}
    </>
  );
}
```

---

## Suggested Build Order

Based on component dependencies, build in this order:

### Phase 1: Foundation (No Dependencies)

| Order | Component | Reason |
|-------|-----------|--------|
| 1.1 | `lib/utils.ts` | cn() helper used everywhere |
| 1.2 | `lib/constants.ts` | Animation timing constants |
| 1.3 | `lib/gsap.ts` | GSAP registration (ScrollTrigger) |
| 1.4 | `globals.css` | CSS variables, keyframe animations |
| 1.5 | `data/*.ts` | All static data files |

### Phase 2: Providers & Hooks (Foundation Required)

| Order | Component | Depends On |
|-------|-----------|------------|
| 2.1 | `use-reduced-motion.tsx` | None |
| 2.2 | `animation-provider.tsx` | use-reduced-motion |
| 2.3 | `sound-provider.tsx` | None |
| 2.4 | `use-gsap.tsx` | lib/gsap.ts |
| 2.5 | `use-sound.tsx` | sound-provider |
| 2.6 | `use-intersection.tsx` | None |

### Phase 3: Shared Components (Providers Required)

| Order | Component | Depends On |
|-------|-----------|------------|
| 3.1 | shadcn/ui components | lib/utils.ts |
| 3.2 | `section-wrapper.tsx` | shadcn primitives |
| 3.3 | `glass-blur.tsx` | Tailwind CSS |

### Phase 4: Animation Primitives (Shared Components Required)

| Order | Component | Depends On |
|-------|-----------|------------|
| 4.1 | `fade-in.tsx` | use-gsap, animation-provider |
| 4.2 | `pulse-glow.tsx` | CSS keyframes |
| 4.3 | `count-up.tsx` | use-intersection |
| 4.4 | `marquee.tsx` | CSS keyframes |
| 4.5 | `border-beam.tsx` | CSS keyframes |
| 4.6 | `split-flap.tsx` | use-sound, animation-provider |
| 4.7 | `ascii-shimmer.tsx` | CSS keyframes |
| 4.8 | `liquid-metal.tsx` | Canvas/WebGL |

### Phase 5: Page Sections (Build order by page flow)

| Order | Section | Depends On |
|-------|---------|------------|
| 5.1 | `footer.tsx` | section-wrapper, data/site |
| 5.2 | `navbar.tsx` | glass-blur, data/navigation |
| 5.3 | `hero.tsx` | split-flap OR ascii-shimmer, sound |
| 5.4 | `status-chip.tsx` | pulse-glow |
| 5.5 | `pricing.tsx` | border-beam, data/pricing |
| 5.6 | `final-cta.tsx` | liquid-metal |
| 5.7 | `features.tsx` | fade-in, data/features |
| 5.8 | `comparison.tsx` | fade-in |
| 5.9 | `use-cases.tsx` | marquee, data/use-cases |
| 5.10 | `batch-counter.tsx` | count-up |
| 5.11 | `installation.tsx` | video-player, data/steps |
| 5.12 | `skills-store.tsx` | search, filter logic |

### Phase 6: Assembly

| Order | File | Depends On |
|-------|------|------------|
| 6.1 | `app/layout.tsx` | All providers, fonts |
| 6.2 | `app/page.tsx` | All sections |

---

## Performance Considerations

| Concern | Approach |
|---------|----------|
| Initial load | Server render static content; defer heavy animations |
| Animation frame rate | Use GSAP's optimized RAF; batch animations |
| Bundle size | Import only needed GSAP plugins; tree-shake Framer |
| Mobile performance | Reduce particle count; simplify shaders on low-power |
| Reduced motion | Provide instant transitions; respect user preference |
| Sound files | Use small WAV/OGG for click sounds (<10KB each) |
| Video | Lazy load; use intersection observer to start loading |

---

## Sources

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) - Official Next.js docs (HIGH confidence)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - Official Next.js docs (HIGH confidence)
- [GSAP React Integration](https://gsap.com/resources/react-basics/) - Official GSAP docs (HIGH confidence)
- [GSAP useGSAP hook](https://github.com/greensock/react) - Official GSAP React package (HIGH confidence)
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) - Official shadcn/ui docs (HIGH confidence)
- [Awwwards Landing Page Tutorial](https://blog.olivierlarose.com/tutorials/awwwards-landing-page) - Practical implementation guide (MEDIUM confidence)
- [Best Next.js Landing Page Layouts](https://www.zignuts.com/blog/nextjs-landing-page-layouts) - SaaS patterns (MEDIUM confidence)
- [Modern Full Stack Application Architecture Using Next.js 15+](https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/) - Architecture patterns (MEDIUM confidence)
- [Next.js Folder Structure Best Practices 2026](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide) - Organization patterns (MEDIUM confidence)
- [use-sound React Hook](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/) - Sound integration pattern (MEDIUM confidence)
