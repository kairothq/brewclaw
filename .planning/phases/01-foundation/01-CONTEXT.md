# Phase 1: Foundation - Context

**Gathered:** 2025-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish technical foundation: Next.js 15 project scaffolding, animation providers (Motion + GSAP), typography system (Space Grotesk, Geist, Geist Mono), design tokens as CSS variables, and reduced-motion support. No UI sections - pure infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **Component organization:** Claude's discretion - pick appropriate structure for project size
- **Data files location:** Claude's discretion - pick sensible pattern
- **Template integration:** Copy and adapt v0 templates - copy code into project, modify for BrewClaw branding and requirements
- **File naming:** kebab-case for component files (hero-section.tsx, pricing-card.tsx)

### Animation Ownership
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

### Design Tokens
- **Color organization:** Claude's discretion - follow PRD color palette (#0A0A0A dark, #FFFFFF light, #78350F espresso accent)
- **Spacing scale:** Claude's discretion - pick sensible defaults
- **Dark/light sections:** Claude's discretion - clean approach for alternating section themes
- **Shadows:** Medium depth - clear but not heavy, premium SaaS aesthetic
- **Border radius:** Claude's discretion - reference PRD for guidance

### Font Loading
- **Strategy:** Claude's discretion - pick best for performance
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

</decisions>

<specifics>
## Specific Ideas

- **Architecture explainer document:** Create a simple document explaining what each tool does (Motion vs GSAP vs shadcn) and why - written in accessible language for future reference
- **PRD is source of truth:** All design decisions should reference PRD. Only ask user if contradicting PRD.
- **Template paths:**
  - `/v0 templates/New/sticky-nav-pricing/` - navbar, pricing, globals.css animations
  - `/v0 templates/New/orange-animation/` - hero, split-flap, scramble-text
  - `/v0 templates/Old/shader-button/` - liquid-metal-button
  - `/v0 templates/Old/premium-saa-s-landing-page/` - testimonials-column (marquee reference)

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2025-02-22*
