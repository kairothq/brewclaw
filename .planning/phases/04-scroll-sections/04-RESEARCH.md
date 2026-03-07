# Phase 4 Research: Scroll Sections

## Summary

Phase 4 implements three scroll-triggered content sections: Installation Steps, Comparison, and Features Bento Grid. All sections use GSAP ScrollTrigger for scroll-based animations as decided in Phase 1.

## Key Decisions

### Animation Strategy
- **GSAP ScrollTrigger**: Used for all scroll-triggered entrance animations
- **Motion (Framer Motion)**: Used for component-level hover effects
- Never mix both on the same DOM element (per Phase 1 decision)

### Section Order
1. **Installation Section** (light background) - immediately after Hero
2. **Comparison Section** (dark background) - demonstrates value prop
3. **Features Section** (dark background) - bento grid with 5 cards

### Installation Steps (INST-*)
- 3 steps: Create Config → Deploy → Use
- Vertical timeline with connecting line
- Beating dot animation in espresso color (#78350F) for active step
- Grey/muted for upcoming steps
- Video placeholder syncs with step progression

### Comparison Section (COMP-*)
- Two-column layout: Traditional (60 min list) vs BrewClaw (coffee brewing)
- Traditional method shows boring time breakdown
- BrewClaw side uses coffee emoji with steam animation
- Fade-in on scroll via ScrollTrigger

### Features Bento Grid (FEAT-*)
- 5 cards in asymmetric bento layout
- Cards:
  1. Persistent Memory (col-span-2, Brain icon)
  2. Privacy First (Terminal icon, animated code)
  3. Always Awake (Clock icon, pulse effect)
  4. Secure by Default (Shield icon)
  5. Any Messenger (col-span-2, platform logos)
- Motion hover effects: scale 1.02, border glow
- GSAP staggered entrance animation

## Template References

### Bento Grid Pattern (from sticky-nav-pricing/components/bento-grid.tsx)
```tsx
// Grid layout pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="md:col-span-2">Large card</div>
  <div>Standard card</div>
  ...
</div>

// Hover effect pattern
className="hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300"
```

### GSAP Usage Pattern (existing in project)
```tsx
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-config'

useGSAP(() => {
  gsap.from('.element', {
    scrollTrigger: {
      trigger: '.section',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.1,
  })
}, { scope: containerRef })
```

## Color Tokens Used
- Light background: #FAFAF9 (cream/off-white)
- Dark background: #0A0A0A (near-black)
- Espresso accent: #78350F (for beating dot)
- Muted: #666666 (for inactive states)

## Implementation Notes

1. All sections are client components ("use client") due to GSAP requirement
2. GSAP cleanup handled via useGSAP hook's automatic cleanup
3. Reduced motion preference respected via prefers-reduced-motion media query
4. Mobile responsiveness: all grids collapse to single column
