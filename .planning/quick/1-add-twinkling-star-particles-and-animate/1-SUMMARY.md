---
phase: quick
plan: 1
subsystem: hero-section
tags: [animation, visual-polish, gsap, canvas]

dependency_graph:
  requires: [gsap]
  provides: [star-particles, highlight-text]
  affects: [hero-section]

tech_stack:
  added: [canvas-api, requestAnimationFrame]
  patterns: [gsap-timeline, resize-observer]

key_files:
  created:
    - src/components/star-particles.tsx
    - src/components/highlight-text.tsx
  modified:
    - src/components/hero-section.tsx

decisions: []

metrics:
  duration: 3 min
  completed: 2026-02-22T18:38:43Z
---

# Quick Task 1: Add Twinkling Star Particles and Animate Coffee Highlight

Canvas-based twinkling star particles in hero background with GSAP-animated amber highlight on the word "coffee" in the tagline.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create StarParticles component | e985e97 | src/components/star-particles.tsx |
| 2 | Create HighlightText component | 326030d | src/components/highlight-text.tsx |
| 3 | Integrate into HeroSection | 21427b0 | src/components/hero-section.tsx |

## Implementation Details

### StarParticles Component
- Canvas-based rendering with requestAnimationFrame for smooth animation
- Generates 50-80 random stars with individual twinkle speeds (1-4s cycle)
- Each star has unique phase offset for varied twinkling patterns
- Sinusoidal opacity animation creates natural twinkle effect
- ResizeObserver handles responsive canvas sizing
- Max opacity capped at 0.7 for subtle, non-distracting effect
- Positioned absolute, z-0, pointer-events-none

### HighlightText Component
- GSAP timeline animation triggered on mount with configurable delay
- Highlight animates scaleX from 0 to 1 with transformOrigin left
- Coffee/amber color (#D97706) matches brand theme
- Duration 0.8s with power3.out easing for smooth entrance
- Text remains white (relative z-10) for visibility on dark background
- Slight horizontal padding extends highlight beyond text bounds

### Hero Integration
- StarParticles wrapped in Suspense for SSR safety
- HighlightText wraps "coffee" word in tagline
- Tagline gets relative z-10 to ensure visibility above stars

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- [x] npm run build - no errors
- [x] StarParticles exports correctly
- [x] HighlightText exports correctly
- [x] Hero section imports and renders both components

## Self-Check: PASSED

All files created and commits verified.
