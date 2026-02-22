# BrewClaw Landing Page

## What This Is

A premium landing page for BrewClaw — a hosted AI assistant deployment platform that lets non-technical users deploy their personal AI assistant "in the time it takes to brew a coffee." The landing page showcases the product's value proposition with sophisticated animations, template-based design components, and a clear signup funnel.

## Core Value

The landing page must convert visitors to signups by communicating that BrewClaw eliminates all technical complexity of self-hosting AI assistants.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Sticky glass-blur navigation with scroll links
- [ ] Rotating status chip with pulse-glow animation
- [ ] Hero with SplitFlap/ASCII brand animation and sound
- [ ] 4-step installation process with beating dot timeline
- [ ] Side-by-side comparison (60 min vs coffee brewing time)
- [ ] 5-feature bento grid showcasing capabilities
- [ ] Use cases marquee (dual-row, opposite directions)
- [ ] Skills store directory interface
- [ ] Batch counter with progress visualization
- [ ] 3-tier pricing cards with border beam animation
- [ ] Final CTA with shader button
- [ ] 4-column footer with social links

### Out of Scope

- Docs section — Phase 2
- WhatsApp integration — Phase 2
- Interactive Skills Store filtering — Phase 2
- Real-time batch counter — preset numbers only
- Annual pricing toggle — Phase 2
- Testimonials/social proof — Phase 2
- Blog section — Phase 2

## Context

**Templates Available:**
- `/v0 templates/New/sticky-nav-pricing/` — Nav, pricing, animations
- `/v0 templates/New/orange-animation/` — SplitFlap, hero components
- `/v0 templates/Old/` — Additional references

**Design System:**
- Typography: Space Grotesk (headings), Geist (body), Geist Mono (code/ASCII)
- Colors: #0A0A0A (dark), #FFFFFF (light), #78350F (espresso accent on <5% area)
- Rule: No emojis, premium icons only (Lucide, custom SVGs)

**Animation Libraries:**
- Framer Motion for entrance/hover effects
- GSAP ScrollTrigger for scroll-based animations
- Web Audio API for SplitFlap click sounds

**External References:**
- clawi.ai — Installation steps style
- easyclaw.app — Feature cards and footer style
- ironclaw.sh — Skills store visual reference

## Constraints

- **Stack**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Templates**: Must copy exact styles from v0 templates, no self-generated designs
- **Accessibility**: Semantic HTML, proper ARIA labels
- **Performance**: Optimize animations for 60fps
- **Responsive**: Mobile-first, all sections stack properly

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SplitFlap + ASCII A/B test for hero | User wants to test both approaches | — Pending |
| Dark/Light alternating sections | Creates visual rhythm, matches PRD spec | — Pending |
| Template-first approach | Ensures premium quality, avoids AI-generated designs | — Pending |

---
*Last updated: 2025-02-22 after initialization*
