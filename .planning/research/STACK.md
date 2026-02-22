# Technology Stack

**Project:** BrewClaw Landing Page
**Researched:** 2026-02-22
**Overall Confidence:** HIGH

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.5+ | React framework, SSR, routing | Production-stable with Turbopack. React 19 support. v16 exists but v15 is battle-tested for landing pages. Avoid v16's RSC complexity for a static landing page. | HIGH |
| React | 19.x | UI library | Required by Next.js 15. Concurrent rendering improves animation performance. | HIGH |
| TypeScript | 5.x | Type safety | Default in Next.js 15. Catches prop errors in complex component trees. | HIGH |

**Why Next.js 15 over 16:** Next.js 16.1.6 is available but introduces additional RSC complexity. For a landing page with sophisticated animations, 15.5 provides Turbopack stability without the migration overhead. The PRD already specifies Next.js 15.

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.x | Utility-first CSS | 5x faster builds with Oxide engine. CSS-first config via `@theme`. Sub-2.5s load times protect conversion rates. | HIGH |
| tw-animate-css | 1.x | Animation utilities | Tailwind v4 compatible replacement for `tailwindcss-animate`. Required by shadcn/ui components. Pure CSS, tree-shakable. | HIGH |

**Why Tailwind v4:** Automatic content detection, ~70% smaller production CSS, and `@theme` directive simplifies design token management. Browser support (Safari 16.4+, Chrome 111+, Firefox 128+) is acceptable for SaaS target audience.

### Component Library

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| shadcn/ui | latest | Accessible UI primitives | You own the code. No runtime dependency. Built on Radix UI + Tailwind. PRD templates use shadcn patterns. | HIGH |

**Installation:** Use `npx shadcn@latest init` for existing projects or `npx shadcn create` for the new visual builder (supports Next.js + Tailwind v4).

**Components Needed:**
- Button (CTA, nav links)
- Card (pricing, features, skills)
- Badge (batch status, pricing tiers)
- Separator (section dividers)
- Sheet (mobile navigation)
- Tooltip (disabled "Docs" nav item)

### Animation Stack

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Motion (Framer Motion) | 12.x | Entrance/hover/gesture animations | 18M+ monthly downloads. Declarative API. `whileInView` for scroll-triggered reveals. `layoutId` for nav hover effects. | HIGH |
| GSAP | 3.14.x | Scroll-linked animations | 100% FREE since Webflow acquisition. ScrollTrigger for parallax, timeline scrubbing. Pixel-perfect control. | HIGH |
| @gsap/react | 2.1.x | React integration | `useGSAP()` hook handles cleanup automatically. Prevents memory leaks. Scope prevents selector collisions. | HIGH |

**Why both Motion AND GSAP:**
- **Motion:** Best for component-level animations (entrances, hovers, layout transitions). Simpler API for React developers.
- **GSAP ScrollTrigger:** Best for scroll-linked animations (liquid timeline flow, comparison section reveals, counter scrubbing). Industry standard for complex scroll effects.

**Animation Strategy by Section:**
| Section | Library | Animation Type |
|---------|---------|----------------|
| Nav entrance/hover | Motion | `y: -100 -> 0`, `layoutId` pill |
| Status chip rotation | Motion | `AnimatePresence` + vertical slide |
| Hero SplitFlap | Custom + Motion | Character-by-character flip |
| Installation timeline | GSAP ScrollTrigger | Liquid flow on scroll |
| Comparison | GSAP ScrollTrigger | Fade in on scroll |
| Use cases marquee | CSS + Motion | Infinite horizontal scroll, pause on hover |
| Pricing border beam | CSS animation | Shimmer effect |
| Batch counter | Motion | `useInView` + spring counter |

### Typography

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Geist | npm package | Body text + monospace code | Vercel's font. Built for UI/web. Included in Next.js 15 by default. Variable font weights. | HIGH |
| Space Grotesk | Google Fonts | Headings | Variable font. Premium tech aesthetic. SIL Open Font License. Pairs well with Geist. | HIGH |

**Implementation:**
```typescript
// app/layout.tsx
import { GeistSans, GeistMono } from 'geist/font'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
})
```

### Icons

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Lucide React | 0.575.x | UI icons | 1000+ icons. Tree-shakable. Each icon ~1KB. Used by shadcn/ui. | HIGH |

**Why Lucide over alternatives:**
- Heroicons: Fewer icons, less actively maintained
- Phosphor: Good but larger bundle
- React Icons: Bundle size concerns (includes all icon sets)

### Audio

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Web Audio API | Native | SplitFlap click sounds | No dependencies. Fine-grained control. 7KB library alternative (howler.js) available if needed. | MEDIUM |
| howler.js | 2.2.4 | Audio fallback | Cross-browser fallback for Web Audio. 7KB gzipped. Use if native API proves problematic. | MEDIUM |

**Audio Strategy:**
1. Start muted (respect autoplay policies)
2. User must interact to enable sound
3. Provide visible mute toggle with `role="switch"` for accessibility
4. Preload short click samples (~10-50ms each)

---

## Do NOT Use

| Technology | Why Not | Use Instead |
|------------|---------|-------------|
| Next.js 16 | Unnecessary RSC complexity for landing page. Security patches available for 15.x. | Next.js 15.5+ |
| Tailwind CSS 3 | v4 is production-ready with better performance. No reason to use legacy. | Tailwind CSS 4 |
| tailwindcss-animate | Incompatible with Tailwind v4. Deprecated. | tw-animate-css |
| Three.js/WebGL | Overkill for this landing page. Increases bundle size. PRD doesn't require 3D. | CSS animations + GSAP |
| Lottie | Another runtime. PRD animations achievable with Motion/GSAP. | Motion keyframes |
| React Spring | Motion is more widely adopted, better docs, same capabilities. | Motion 12 |
| Anime.js | Less React integration. GSAP has better ecosystem. | GSAP |
| AOS (Animate on Scroll) | Basic. GSAP ScrollTrigger far more capable. | GSAP ScrollTrigger |
| Chakra UI | Adds runtime. shadcn gives you ownership. | shadcn/ui |
| Material UI | Heavy bundle. Wrong aesthetic for premium SaaS. | shadcn/ui |
| react-split-flap-effect | Last updated 5+ years ago. Build custom with Motion. | Custom SplitFlap component |

---

## Installation

```bash
# Create Next.js 15 project with Tailwind v4
npx create-next-app@15 brewclaw --typescript --tailwind --eslint --app --src-dir

# Initialize shadcn/ui
npx shadcn@latest init

# Core dependencies
npm install motion gsap @gsap/react lucide-react geist

# Optional: Audio fallback
npm install howler
npm install -D @types/howler

# Dev dependencies (if not included)
npm install -D typescript @types/node @types/react @types/react-dom
```

### shadcn Components

```bash
npx shadcn@latest add button card badge separator sheet tooltip
```

### Font Configuration

```css
/* globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --font-family-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-family-mono: var(--font-geist-mono), monospace;
  --font-family-heading: var(--font-space-grotesk), system-ui, sans-serif;
}
```

---

## Version Pinning Strategy

| Package | Strategy | Rationale |
|---------|----------|-----------|
| next | Pin major `~15.5.0` | Avoid automatic v16 upgrade |
| react, react-dom | Pin major `~19.0.0` | Match Next.js requirements |
| tailwindcss | Pin major `~4.0.0` | CSS-first config locked in |
| motion | Allow patch `^12.0.0` | Frequent bug fixes, stable API |
| gsap | Allow patch `^3.14.0` | Stable, infrequent breaking changes |
| shadcn components | N/A | Copied to codebase, not versioned |

---

## Browser Support

Based on Tailwind v4 requirements:

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 111+ | 2023+ |
| Safari | 16.4+ | 2023+ |
| Firefox | 128+ | 2024+ |
| Edge | 111+ | Chromium-based |

**Acceptable for SaaS target audience.** Non-technical consumers on modern devices.

---

## Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | SSR, optimized fonts, lazy animations |
| FID | < 100ms | Defer non-critical JS |
| CLS | < 0.1 | Reserve space for dynamic content |
| Bundle (JS) | < 200KB gzipped | Tree-shake Motion/GSAP |
| Animation | 60fps | Use transform/opacity only |

---

## Sources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs/app/guides/upgrading/version-15) - HIGH confidence
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) - HIGH confidence
- [Motion Documentation](https://motion.dev/docs) - HIGH confidence
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - HIGH confidence
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation) - HIGH confidence
- [Geist Font](https://vercel.com/font) - HIGH confidence

### Package Registries (version verification)
- [Next.js Releases](https://github.com/vercel/next.js/releases) - v16.1.6 latest, v15.5 stable
- [Motion npm](https://www.npmjs.com/package/motion) - v12.34.3 (Feb 2026)
- [GSAP npm](https://www.npmjs.com/package/gsap) - v3.14.2 (Dec 2025)
- [Lucide React npm](https://www.npmjs.com/package/lucide-react) - v0.575.0 (Feb 2026)
- [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) - Tailwind v4 compatible

### Best Practices
- [Web Audio API Best Practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [GSAP React Integration](https://gsap.com/resources/React/)
- [shadcn Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4)
