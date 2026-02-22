# Requirements: BrewClaw Landing Page

**Defined:** 2025-02-22
**Core Value:** Convert visitors to signups by communicating BrewClaw eliminates all technical complexity

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Project scaffolded with Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- [x] **FOUND-02**: Animation providers configured (Motion + GSAP with proper cleanup)
- [x] **FOUND-03**: Typography system with Space Grotesk, Geist, Geist Mono fonts
- [x] **FOUND-04**: Design tokens (colors, spacing) implemented as CSS variables
- [x] **FOUND-05**: Reduced-motion detection and respect system

### Navigation

- [x] **NAV-01**: Sticky navbar with glass blur effect (backdrop-filter)
- [x] **NAV-02**: Logo links to homepage
- [x] **NAV-03**: Center links scroll to respective sections (Features, Pricing, FAQs)
- [x] **NAV-04**: Docs link disabled with "Coming soon" tooltip
- [x] **NAV-05**: Get Started CTA button with shimmer effect
- [x] **NAV-06**: Mobile hamburger menu with Sheet component

### Status Chip

- [x] **CHIP-01**: Status chip positioned below nav, above hero
- [x] **CHIP-02**: 3 rotating messages with pulse-glow animation
- [x] **CHIP-03**: Click scrolls to Batch Counter section

### Hero

- [x] **HERO-01**: Dark background (#0A0A0A) full-width section
- [x] **HERO-02**: SplitFlap OR ASCII shimmer brand animation (A/B test ready)
- [x] **HERO-03**: Web Audio API click sounds for SplitFlap (muted by default, toggle)
- [x] **HERO-04**: Tagline displays: "Deploy your personal AI assistant..."
- [x] **HERO-05**: Sub-copy with bullet separators: Writes, Researches, Clears inbox, Sends briefs
- [x] **HERO-06**: CTA button links to signup funnel
- [x] **HERO-07**: Trust line: "$2 credits included - No code needed"

### Installation Steps

- [x] **INST-01**: Light background section with 3-step vertical timeline
- [x] **INST-02**: Active step has beating dot animation in espresso color
- [x] **INST-03**: Progress line animation down timeline as steps complete
- [x] **INST-04**: Grey/muted upcoming steps
- [x] **INST-05**: Demo code area synced with steps (video placeholder)

### Comparison

- [x] **COMP-01**: Two-column comparison layout
- [x] **COMP-02**: Traditional Method (left) shows itemized breakdown (60 min total)
- [x] **COMP-03**: BrewClaw (right) shows coffee brewing animation
- [x] **COMP-04**: Fade-in on scroll via GSAP ScrollTrigger

### Features

- [x] **FEAT-01**: Bento grid layout with 5 feature cards
- [x] **FEAT-02**: Persistent Memory card with memory icon
- [x] **FEAT-03**: Privacy First card with terminal animation
- [x] **FEAT-04**: Always Awake card with clock icon
- [x] **FEAT-05**: Secure by Default card with lock icon
- [x] **FEAT-06**: Any Messenger card with platform logos (placeholder icons)
- [x] **FEAT-07**: Subtle hover effects on cards

### Use Cases Marquee

- [x] **MARQ-01**: Two-row marquee with opposite scroll directions
- [x] **MARQ-02**: Row 1 scrolls right-to-left with 9 use cases
- [x] **MARQ-03**: Row 2 scrolls left-to-right with 10 use cases
- [x] **MARQ-04**: Pause on hover for accessibility
- [x] **MARQ-05**: Premium icons (no emojis)

### Skills Store

- [x] **SKILL-01**: Dark background section
- [x] **SKILL-02**: Skills directory header with count badge
- [x] **SKILL-03**: Category filter tabs (All, Sales, CRM, Browser, etc.)
- [x] **SKILL-04**: Skill cards with name, description
- [x] **SKILL-05**: Search bar (functional or links to external skills.sh)

### Batch Counter

- [x] **BATCH-01**: Light background section
- [x] **BATCH-02**: Large number with count-up animation on viewport entry
- [x] **BATCH-03**: Progress bar showing batch fill status
- [x] **BATCH-04**: Batch status tags (Full vs remaining seats)
- [x] **BATCH-05**: Preset numbers (not real-time for v1)

### Pricing

- [ ] **PRICE-01**: Dark background section
- [ ] **PRICE-02**: 3 horizontal pricing cards (Basic, Pro, Ultra)
- [ ] **PRICE-03**: Pro tier highlighted as "BEST VALUE" with border beam animation
- [ ] **PRICE-04**: Each card shows features and resource specs
- [ ] **PRICE-05**: CTA buttons link to signup with plan parameter

### Final CTA

- [ ] **CTA-01**: Dark background section
- [ ] **CTA-02**: Pre-headline, headline, subhead copy as specified
- [ ] **CTA-03**: Shader button with espresso color outline animation
- [ ] **CTA-04**: Secondary "More options" link scrolls to pricing
- [ ] **CTA-05**: Trust indicator: "$2 credits included for new users"

### Footer

- [x] **FOOT-01**: 4-column layout (Location, Contact, Social, Legal)
- [x] **FOOT-02**: Column headers with uppercase tracking
- [x] **FOOT-03**: Email opens mail client (mailto:)
- [x] **FOOT-04**: Social links to GitHub, X, LinkedIn, Instagram
- [x] **FOOT-05**: Copyright line with tagline
- [x] **FOOT-06**: Responsive stacking on mobile

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Documentation

- **DOCS-01**: Docs section and docs.brewclaw.com integration
- **DOCS-02**: Blog section

### Integrations

- **INTG-01**: WhatsApp connection option
- **INTG-02**: Interactive Skills Store with full filtering

### Enhancements

- **ENH-01**: Real-time batch counter (live API)
- **ENH-02**: Annual pricing toggle with discount display
- **ENH-03**: Testimonials/social proof section
- **ENH-04**: FAQ accordion section

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication | Landing page only, signup redirects to separate app |
| Blog/CMS integration | Complexity for v1, use static content |
| Payment processing | Signup funnel handles payments |
| Analytics dashboard | Use third-party (Plausible/PostHog) |
| A/B testing infrastructure | Manual deployment of variants for v1 |
| Multi-language support | English only for v1 |
| Dark mode toggle | Fixed light/dark sections per design |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| NAV-05 | Phase 2 | Complete |
| NAV-06 | Phase 2 | Complete |
| FOOT-01 | Phase 2 | Complete |
| FOOT-02 | Phase 2 | Complete |
| FOOT-03 | Phase 2 | Complete |
| FOOT-04 | Phase 2 | Complete |
| FOOT-05 | Phase 2 | Complete |
| FOOT-06 | Phase 2 | Complete |
| CHIP-01 | Phase 3 | Complete |
| CHIP-02 | Phase 3 | Complete |
| CHIP-03 | Phase 3 | Complete |
| HERO-01 | Phase 3 | Complete |
| HERO-02 | Phase 3 | Complete |
| HERO-03 | Phase 3 | Complete |
| HERO-04 | Phase 3 | Complete |
| HERO-05 | Phase 3 | Complete |
| HERO-06 | Phase 3 | Complete |
| HERO-07 | Phase 3 | Complete |
| INST-01 | Phase 4 | Complete |
| INST-02 | Phase 4 | Complete |
| INST-03 | Phase 4 | Complete |
| INST-04 | Phase 4 | Complete |
| INST-05 | Phase 4 | Complete |
| COMP-01 | Phase 4 | Complete |
| COMP-02 | Phase 4 | Complete |
| COMP-03 | Phase 4 | Complete |
| COMP-04 | Phase 4 | Complete |
| FEAT-01 | Phase 4 | Complete |
| FEAT-02 | Phase 4 | Complete |
| FEAT-03 | Phase 4 | Complete |
| FEAT-04 | Phase 4 | Complete |
| FEAT-05 | Phase 4 | Complete |
| FEAT-06 | Phase 4 | Complete |
| FEAT-07 | Phase 4 | Complete |
| MARQ-01 | Phase 5 | Complete |
| MARQ-02 | Phase 5 | Complete |
| MARQ-03 | Phase 5 | Complete |
| MARQ-04 | Phase 5 | Complete |
| MARQ-05 | Phase 5 | Complete |
| SKILL-01 | Phase 5 | Complete |
| SKILL-02 | Phase 5 | Complete |
| SKILL-03 | Phase 5 | Complete |
| SKILL-04 | Phase 5 | Complete |
| SKILL-05 | Phase 5 | Complete |
| BATCH-01 | Phase 5 | Complete |
| BATCH-02 | Phase 5 | Complete |
| BATCH-03 | Phase 5 | Complete |
| BATCH-04 | Phase 5 | Complete |
| BATCH-05 | Phase 5 | Complete |
| PRICE-01 | Phase 6 | Pending |
| PRICE-02 | Phase 6 | Pending |
| PRICE-03 | Phase 6 | Pending |
| PRICE-04 | Phase 6 | Pending |
| PRICE-05 | Phase 6 | Pending |
| CTA-01 | Phase 6 | Pending |
| CTA-02 | Phase 6 | Pending |
| CTA-03 | Phase 6 | Pending |
| CTA-04 | Phase 6 | Pending |
| CTA-05 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 68 total
- Mapped to phases: 68
- Unmapped: 0

---
*Requirements defined: 2025-02-22*
*Last updated: 2026-02-22 — Phase 5 complete (MARQ-01 through MARQ-05, SKILL-01 through SKILL-05, BATCH-01 through BATCH-05)*
