# Project Research Summary

**Project:** BrewClaw Landing Page
**Domain:** Premium Animated SaaS Landing Page
**Researched:** 2026-02-22
**Confidence:** HIGH

## Executive Summary

BrewClaw is a premium SaaS landing page with sophisticated animations including SplitFlap text effects with audio, scroll-triggered timelines, and shader-based CTA buttons. Research confirms this is a well-understood domain with established patterns: Next.js 15 for SSR, dual animation libraries (Motion for component-level, GSAP for scroll-driven), and Tailwind v4 with shadcn/ui for rapid styling. The recommended approach is to use server-rendered static sections with client-side animation wrappers, keeping interactive boundaries tight to minimize JavaScript bundle size.

The primary risk is animation performance degradation, particularly on mobile devices. The PRD specifies several complex animations (backdrop-filter blur on sticky nav, WebGL shader buttons, Web Audio API for SplitFlap sounds) that have documented failure modes. Mitigation requires establishing performance budgets early (maintain 50+ FPS), implementing CSS fallbacks for mobile, and respecting `prefers-reduced-motion` from day one. The secondary risk is GSAP ScrollTrigger memory leaks in React's lifecycle - this is fully solved by using the official `@gsap/react` package with `useGSAP()` hooks.

The stack is battle-tested and well-documented, features align with 2026 landing page best practices, and architecture patterns are established. This project can proceed with high confidence, provided the team addresses Web Audio autoplay restrictions and establishes clear Framer Motion vs GSAP ownership rules before building animations.

## Key Findings

### Recommended Stack

The stack is production-ready and specifically chosen for Next.js 15 compatibility. Tailwind v4 is mandatory (3.x is deprecated for shadcn), and Motion 12 + GSAP 3.14 are both free after GSAP's Webflow acquisition.

**Core technologies:**
- **Next.js 15.5+**: SSR framework - v15 is stable, avoid v16 RSC complexity for landing page
- **React 19.x**: Required by Next.js 15, concurrent rendering improves animation performance
- **Tailwind CSS 4.x**: 5x faster builds, automatic content detection, ~70% smaller CSS
- **shadcn/ui**: Own the code, no runtime dependency, built on Radix + Tailwind
- **Motion 12.x**: Component-level animations (entrance, hover, AnimatePresence)
- **GSAP 3.14.x + ScrollTrigger**: Scroll-linked animations (timeline, parallax, scrubbing)
- **Space Grotesk + Geist**: Premium typography pairing for headings and body
- **Lucide React**: 1000+ icons, tree-shakable, shadcn default

**Do NOT use:** Three.js (overkill), Lottie (another runtime), react-split-flap-effect (abandoned), tailwindcss-animate (Tailwind v4 incompatible).

### Expected Features

**Must have (table stakes):**
- Hero with clear value proposition (10-20 second window to hook users)
- Sticky navigation with persistent CTA (83% mobile traffic needs quick access)
- Transparent pricing section (hidden pricing creates suspicion)
- Mobile-first responsive design (vertical stacking, tap-friendly)
- Fast load times (<2.5s LCP, each second loses 7% conversions)
- Features/benefits section (scannable, bento grid is 2026 trend)
- Footer with contact/legal (professional completion, legal compliance)

**Should have (differentiators):**
- SplitFlap/ASCII brand animation with sound (unique, memorable)
- Interactive installation steps with synced video demo
- Comparison section with measurable outcomes (60 min vs coffee time)
- Batch counter with progress indicator (urgency/social proof)
- Use cases marquee (versatility showcase)
- Border beam animation on highlighted pricing tier
- Shader/liquid metal CTA buttons (premium feel)

**Defer (v2+):**
- Docs section and blog
- WhatsApp integration
- Interactive Skills Store filtering (use static for v1)
- Real-time batch counter (use preset numbers)
- Annual pricing toggle
- Full testimonials section

### Architecture Approach

Server-rendered root layout with client-side animation providers. Each section is a client component with GSAP scoped via `useGSAP()` hook. Data lives in `/src/data/*.ts` files for easy updates. Animation primitives (`fade-in`, `marquee`, `border-beam`, `split-flap`) are extracted into reusable components.

**Major components:**
1. **Animation Provider** (context) - global sound/motion settings, reduced-motion detection
2. **Section Wrapper** - consistent padding, spacing, dark/light background
3. **Animation Primitives** - SplitFlap, Marquee, FadeIn, CountUp, BorderBeam, LiquidMetal
4. **12 Page Sections** - Navbar, StatusChip, Hero, Installation, Comparison, Features, UseCases, SkillsStore, BatchCounter, Pricing, FinalCTA, Footer

### Critical Pitfalls

1. **Web Audio API Autoplay Blocked** - Browsers block audio until user interaction. Default to muted, create AudioContext only after first click, add visible mute toggle. Phase: Hero section.

2. **Backdrop-Filter Blur Scroll Jank** - Glass-blur nav causes frame drops on mobile/4K displays. Use modest blur (8px max), test on real devices, add `will-change: transform`, have CSS fallback. Phase: Navigation.

3. **GSAP ScrollTrigger Memory Leaks** - Without cleanup, triggers persist after unmount causing leaks and ghost animations. Always use `@gsap/react` with `useGSAP()` hook, kill triggers on route change. Phase: All scroll-triggered sections.

4. **Framer Motion + GSAP Conflicts** - Both libraries fighting for same element causes jitter. Establish clear ownership: Motion for entrance/hover, GSAP for scroll-triggered. Never apply both to same DOM element. Phase: Architecture decision.

5. **Layout-Affecting Animation Properties** - Animating width/height/top causes reflow every frame. Only animate `transform` and `opacity`. Use `scale()` not `width`, `translateY()` not `top`. Phase: All animations.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation
**Rationale:** All other work depends on providers, hooks, utilities, and data structures
**Delivers:** Project setup, animation providers, GSAP registration, CSS variables, data files
**Addresses:** Typography, design tokens, shadcn initialization
**Avoids:** Font loading flash (Pitfall #13), missing reduced-motion (Pitfall #6)

### Phase 2: Core Layout
**Rationale:** Navigation and footer frame the page; hero is first impression
**Delivers:** Navbar with glass blur, Footer, basic Hero structure (without SplitFlap)
**Uses:** shadcn/ui Button/Sheet, Glass Blur component, Navigation data
**Avoids:** Backdrop-filter scroll jank (Pitfall #2)

### Phase 3: Hero Animations
**Rationale:** Hero is the differentiator; needs foundation components first
**Delivers:** SplitFlap OR ASCII shimmer animation, Web Audio integration, Status Chip
**Addresses:** Brand animation differentiator, sound system
**Avoids:** Web Audio autoplay blocked (Pitfall #1), re-render re-trigger (Pitfall #12)

### Phase 4: Scroll Sections
**Rationale:** GSAP ScrollTrigger sections share patterns, build together
**Delivers:** Installation Steps (with video), Comparison Section, Features Bento Grid
**Uses:** GSAP ScrollTrigger, FadeIn primitive, Section Wrapper
**Avoids:** GSAP cleanup failures (Pitfall #3), layout-affecting animations (Pitfall #5)

### Phase 5: Interactive Components
**Rationale:** Complex interactivity - marquee, counter, search/filter
**Delivers:** Use Cases Marquee, Batch Counter with count-up, Skills Store
**Addresses:** Urgency indicators, versatility showcase, ecosystem value
**Avoids:** Marquee accessibility violations (Pitfall #7), setInterval usage (Pitfall #10)

### Phase 6: Conversion Elements
**Rationale:** Pricing and CTAs are conversion-critical, polish last
**Delivers:** Pricing cards with border beam, Final CTA with shader button
**Uses:** BorderBeam animation, LiquidMetal shader (with mobile fallback)
**Avoids:** Border-beam z-index conflicts (Pitfall #11), shader mobile failure (Pitfall #9)

### Phase Ordering Rationale

- **Foundation first:** Providers and hooks are imported by all sections; CSS variables define design tokens
- **Layout second:** Navbar/Footer frame the page; hero structure without animation allows parallel work
- **Hero animations separate:** Complex audio + animation integration needs dedicated focus
- **Scroll sections grouped:** All use GSAP ScrollTrigger with same patterns; build skills transfer
- **Interactive components grouped:** Marquee, counter, and search all need accessibility consideration
- **Conversion elements last:** Pricing and CTAs benefit from lessons learned; highest polish priority

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Hero Animations):** SplitFlap implementation is custom; Web Audio API has browser quirks; may need `/gsd:research-phase` for character-by-character animation timing
- **Phase 6 (Conversion Elements):** WebGL shader buttons on mobile need careful testing; may need research on CSS-only fallback that still looks premium

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Well-documented Next.js 15 + Tailwind v4 setup
- **Phase 2 (Core Layout):** Standard sticky nav and footer patterns
- **Phase 4 (Scroll Sections):** GSAP ScrollTrigger has excellent documentation
- **Phase 5 (Interactive Components):** Marquee and counter have established implementations

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs, version compatibility confirmed |
| Features | MEDIUM-HIGH | Based on multiple 2026 landing page sources; PRD aligns with best practices |
| Architecture | HIGH | Next.js App Router patterns well-documented; GSAP React integration official |
| Pitfalls | MEDIUM-HIGH | Mix of official docs (Web Audio, GSAP) and community experience |

**Overall confidence:** HIGH

### Gaps to Address

- **SplitFlap character timing:** No existing library for premium SplitFlap in React; will need custom implementation. Research character-by-character flip timing during Phase 3 planning.
- **Video sync with steps:** PRD specifies video synced to installation steps; exact implementation (timestamps? chapters?) needs definition during Phase 4.
- **Shader mobile fallback:** Need to define what "graceful degradation" looks like for liquid metal buttons on low-power devices. Consider during Phase 6.
- **Batch counter data:** PRD says "preset numbers" for v1; need to confirm actual values during implementation.

## Sources

### Primary (HIGH confidence)
- Next.js 15 Docs - SSR, App Router, server/client components
- Tailwind CSS v4 Docs - CSS-first config, browser support
- GSAP ScrollTrigger Docs - scroll-linked animation patterns
- Motion.dev Docs - React animation, accessibility
- MDN Web APIs - Web Audio, prefers-reduced-motion, requestAnimationFrame
- W3C WCAG 2.1 - accessibility requirements for animation

### Secondary (MEDIUM confidence)
- GSAP Forums - Next.js integration patterns, cleanup strategies
- SaaSFrame, Unbounce, Design Studio UIX - 2026 landing page trends
- Josh W. Comeau articles - backdrop-filter performance
- CSS-Tricks - counter animation techniques

### Tertiary (needs validation)
- Grafit Agency - liquid glass effect concerns (validate with real device testing)
- Community Medium articles - hydration error patterns

---
*Research completed: 2026-02-22*
*Ready for roadmap: yes*
