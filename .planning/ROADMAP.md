# Roadmap: BrewClaw Landing Page

## Overview

This roadmap delivers a premium SaaS landing page for BrewClaw with sophisticated animations, template-based design, and a clear signup funnel. The journey progresses from foundation setup through core layout, hero animations, scroll-triggered sections, interactive components, and finally conversion-critical elements. Each phase builds on the previous, ensuring stable animation providers before complex interactions, and polishing conversion elements last.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Project setup, animation providers, design tokens, typography
- [ ] **Phase 2: Core Layout** - Navigation, footer, basic page structure
- [ ] **Phase 3: Hero Animations** - SplitFlap/ASCII brand animation, status chip, Web Audio
- [ ] **Phase 4: Scroll Sections** - Installation steps, comparison, features bento grid
- [ ] **Phase 5: Interactive Components** - Use cases marquee, batch counter, skills store
- [ ] **Phase 6: Conversion Elements** - Pricing cards, final CTA with shader button

## Phase Details

### Phase 1: Foundation
**Goal**: Establish the technical foundation so all subsequent sections have working providers, typography, and design tokens
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. Next.js 15 app runs locally with no errors
  2. Typography renders correctly (Space Grotesk headings, Geist body, Geist Mono code)
  3. CSS variables for colors and spacing are applied globally
  4. Animation providers (Motion + GSAP) are initialized with proper cleanup
  5. Reduced-motion preference is detected and respected
**Plans**: 2 plans

**Template References:**
- shadcn/ui initialization: `npx shadcn@latest init`
- GSAP registration: `@gsap/react` with `useGSAP()` hook

Plans:
- [x] 01-01-PLAN.md — Project scaffolding with Next.js 15, Tailwind v4, shadcn/ui
- [x] 01-02-PLAN.md — Animation providers (Motion + GSAP), typography, design tokens, reduced-motion

### Phase 2: Core Layout
**Goal**: Frame the page with navigation and footer so users can navigate and the page feels complete
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, NAV-06, FOOT-01, FOOT-02, FOOT-03, FOOT-04, FOOT-05, FOOT-06
**Success Criteria** (what must be TRUE):
  1. Sticky navbar with glass blur effect is visible on scroll
  2. Navigation links scroll to their respective sections (Features, Pricing)
  3. Mobile hamburger menu opens and functions correctly
  4. Footer displays 4-column layout with working links
  5. Email link opens mail client
**Plans**: TBD

**Template References:**
- Navbar: `/v0 templates/New/sticky-nav-pricing/components/navbar.tsx`
- Footer: easyclaw.app reference style

Plans:
- [ ] 02-01: Sticky navigation with glass blur
- [ ] 02-02: Footer 4-column layout

### Phase 3: Hero Animations
**Goal**: Deliver the hero section with brand animation that creates a memorable first impression
**Depends on**: Phase 2
**Requirements**: CHIP-01, CHIP-02, CHIP-03, HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, HERO-07
**Success Criteria** (what must be TRUE):
  1. Status chip displays rotating messages with pulse-glow animation
  2. Brand name animates with SplitFlap OR ASCII shimmer effect
  3. Sound toggle appears and controls SplitFlap audio (muted by default)
  4. Hero CTA button links to signup funnel
  5. Trust line "$2 credits included - No code needed" is visible
**Plans**: TBD

**Template References:**
- Hero section: `/v0 templates/New/orange-animation/components/hero-section.tsx`
- SplitFlap: `/v0 templates/New/orange-animation/components/split-flap-text.tsx`
- Pulse-glow: `/v0 templates/New/sticky-nav-pricing/app/globals.css`

Plans:
- [ ] 03-01: Status chip with rotating messages
- [ ] 03-02: Hero section with SplitFlap/ASCII animation
- [ ] 03-03: Web Audio integration for SplitFlap sounds

### Phase 4: Scroll Sections
**Goal**: Build the scroll-triggered content sections that demonstrate product value
**Depends on**: Phase 3
**Requirements**: INST-01, INST-02, INST-03, INST-04, INST-05, COMP-01, COMP-02, COMP-03, COMP-04, FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05, FEAT-06, FEAT-07
**Success Criteria** (what must be TRUE):
  1. Installation steps display with beating dot animation on active step
  2. Video demo is embedded and syncs with step progression
  3. Comparison section shows 60 min breakdown vs coffee brewing animation
  4. Features bento grid displays 5 cards with hover effects
  5. All sections fade in on scroll via GSAP ScrollTrigger
**Plans**: TBD

**Template References:**
- Installation: clawi.ai reference (liquid flow + beating dot)
- Comparison: Premium template style with scroll fade
- Features: easyclaw.app bento grid reference

Plans:
- [ ] 04-01: Installation steps with timeline animation
- [ ] 04-02: Comparison section with coffee brewing
- [ ] 04-03: Features bento grid

### Phase 5: Interactive Components
**Goal**: Add interactive elements that showcase versatility and create urgency
**Depends on**: Phase 4
**Requirements**: MARQ-01, MARQ-02, MARQ-03, MARQ-04, MARQ-05, SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, BATCH-01, BATCH-02, BATCH-03, BATCH-04, BATCH-05
**Success Criteria** (what must be TRUE):
  1. Two-row marquee scrolls in opposite directions with use cases
  2. Marquee pauses on hover for accessibility
  3. Skills store displays directory with category filter tabs
  4. Batch counter shows count-up animation on viewport entry
  5. Progress bar fills to show batch status
**Plans**: TBD

**Template References:**
- Marquee: `/v0 templates/Old/premium-saa-s-landing-page` (convert to horizontal)
- Skills Store: ironclaw.sh visual reference
- Batch Counter: Custom minimal design

Plans:
- [ ] 05-01: Use cases marquee
- [ ] 05-02: Skills store directory
- [ ] 05-03: Batch counter with progress visualization

### Phase 6: Conversion Elements
**Goal**: Polish the conversion-critical pricing and CTA sections to maximize signups
**Depends on**: Phase 5
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, CTA-01, CTA-02, CTA-03, CTA-04, CTA-05
**Success Criteria** (what must be TRUE):
  1. Three pricing cards display with Pro tier highlighted
  2. Border beam animation runs on Pro card
  3. CTA buttons link to signup with correct plan parameters
  4. Final CTA displays shader button with espresso outline animation
  5. "More options" link scrolls back to pricing section
**Plans**: TBD

**Template References:**
- Pricing: `/v0 templates/New/sticky-nav-pricing/components/pricing.tsx`
- Shader button: `/v0 templates/Old/shader-button/components/liquid-metal-button.tsx`
- Border beam: `/v0 templates/New/sticky-nav-pricing/app/globals.css`

Plans:
- [ ] 06-01: Pricing cards with border beam
- [ ] 06-02: Final CTA with shader button

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete    | 2026-02-22 |
| 2. Core Layout | 0/2 | Not started | - |
| 3. Hero Animations | 0/3 | Not started | - |
| 4. Scroll Sections | 0/3 | Not started | - |
| 5. Interactive Components | 0/3 | Not started | - |
| 6. Conversion Elements | 0/2 | Not started | - |

---
*Roadmap created: 2025-02-22*
*Last updated: 2026-02-22 — Phase 1 complete, 01-02 completed*
