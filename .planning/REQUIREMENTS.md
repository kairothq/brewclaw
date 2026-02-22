# Requirements: BrewClaw Landing Page

**Defined:** 2025-02-22
**Core Value:** Convert visitors to signups by communicating BrewClaw eliminates all technical complexity

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Project scaffolded with Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- [ ] **FOUND-02**: Animation providers configured (Motion + GSAP with proper cleanup)
- [ ] **FOUND-03**: Typography system with Space Grotesk, Geist, Geist Mono fonts
- [ ] **FOUND-04**: Design tokens (colors, spacing) implemented as CSS variables
- [ ] **FOUND-05**: Reduced-motion detection and respect system

### Navigation

- [ ] **NAV-01**: Sticky navbar with glass blur effect (backdrop-filter)
- [ ] **NAV-02**: Logo links to homepage
- [ ] **NAV-03**: Center links scroll to respective sections (Features, Pricing, FAQs)
- [ ] **NAV-04**: Docs link disabled with "Coming soon" tooltip
- [ ] **NAV-05**: Get Started CTA button with shimmer effect
- [ ] **NAV-06**: Mobile hamburger menu with Sheet component

### Status Chip

- [ ] **CHIP-01**: Status chip positioned below nav, above hero
- [ ] **CHIP-02**: 3 rotating messages with pulse-glow animation
- [ ] **CHIP-03**: Click scrolls to Batch Counter section

### Hero

- [ ] **HERO-01**: Dark background (#0A0A0A) full-width section
- [ ] **HERO-02**: SplitFlap OR ASCII shimmer brand animation (A/B test ready)
- [ ] **HERO-03**: Web Audio API click sounds for SplitFlap (muted by default, toggle)
- [ ] **HERO-04**: Tagline displays: "Deploy your personal AI assistant..."
- [ ] **HERO-05**: Sub-copy with bullet separators: Writes, Researches, Clears inbox, Sends briefs
- [ ] **HERO-06**: CTA button links to signup funnel
- [ ] **HERO-07**: Trust line: "$2 credits included - No code needed"

### Installation Steps

- [ ] **INST-01**: Light background section with 4-step vertical timeline
- [ ] **INST-02**: Active step has beating dot animation in espresso color
- [ ] **INST-03**: Liquid flow animation down timeline as steps complete
- [ ] **INST-04**: Grey/muted upcoming steps
- [ ] **INST-05**: Embedded demo video synced with steps

### Comparison

- [ ] **COMP-01**: Two-column comparison layout
- [ ] **COMP-02**: Traditional Method (left) shows itemized breakdown (60 min total)
- [ ] **COMP-03**: BrewClaw (right) shows coffee brewing animation
- [ ] **COMP-04**: Fade-in on scroll via GSAP ScrollTrigger

### Features

- [ ] **FEAT-01**: Bento grid layout with 5 feature cards
- [ ] **FEAT-02**: Persistent Memory card with memory icon
- [ ] **FEAT-03**: Privacy First card with terminal animation
- [ ] **FEAT-04**: Always Awake card with clock icon
- [ ] **FEAT-05**: Secure by Default card with lock icon
- [ ] **FEAT-06**: Any Messenger card with platform logos (images)
- [ ] **FEAT-07**: Subtle hover effects on cards

### Use Cases Marquee

- [ ] **MARQ-01**: Two-row marquee with opposite scroll directions
- [ ] **MARQ-02**: Row 1 scrolls right-to-left with 9 use cases
- [ ] **MARQ-03**: Row 2 scrolls left-to-right with 10 use cases
- [ ] **MARQ-04**: Pause on hover for accessibility
- [ ] **MARQ-05**: Premium icons (no emojis)

### Skills Store

- [ ] **SKILL-01**: Dark background section
- [ ] **SKILL-02**: Skills directory header with count badge
- [ ] **SKILL-03**: Category filter tabs (All, Sales, CRM, Browser, etc.)
- [ ] **SKILL-04**: Skill cards with name, description
- [ ] **SKILL-05**: Search bar (functional or links to external skills.sh)

### Batch Counter

- [ ] **BATCH-01**: Light background section
- [ ] **BATCH-02**: Large number with count-up animation on viewport entry
- [ ] **BATCH-03**: Progress bar showing batch fill status
- [ ] **BATCH-04**: Batch status tags (Full vs remaining seats)
- [ ] **BATCH-05**: Preset numbers (not real-time for v1)

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

- [ ] **FOOT-01**: 4-column layout (Location, Contact, Social, Legal)
- [ ] **FOOT-02**: Column headers with uppercase tracking
- [ ] **FOOT-03**: Email opens mail client (mailto:)
- [ ] **FOOT-04**: Social links to GitHub, X, LinkedIn, Instagram
- [ ] **FOOT-05**: Copyright line with tagline
- [ ] **FOOT-06**: Responsive stacking on mobile

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
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| NAV-05 | Phase 2 | Pending |
| NAV-06 | Phase 2 | Pending |
| CHIP-01 | Phase 3 | Pending |
| CHIP-02 | Phase 3 | Pending |
| CHIP-03 | Phase 3 | Pending |
| HERO-01 | Phase 3 | Pending |
| HERO-02 | Phase 3 | Pending |
| HERO-03 | Phase 3 | Pending |
| HERO-04 | Phase 3 | Pending |
| HERO-05 | Phase 3 | Pending |
| HERO-06 | Phase 3 | Pending |
| HERO-07 | Phase 3 | Pending |
| INST-01 | Phase 4 | Pending |
| INST-02 | Phase 4 | Pending |
| INST-03 | Phase 4 | Pending |
| INST-04 | Phase 4 | Pending |
| INST-05 | Phase 4 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| COMP-04 | Phase 4 | Pending |
| FEAT-01 | Phase 4 | Pending |
| FEAT-02 | Phase 4 | Pending |
| FEAT-03 | Phase 4 | Pending |
| FEAT-04 | Phase 4 | Pending |
| FEAT-05 | Phase 4 | Pending |
| FEAT-06 | Phase 4 | Pending |
| FEAT-07 | Phase 4 | Pending |
| MARQ-01 | Phase 5 | Pending |
| MARQ-02 | Phase 5 | Pending |
| MARQ-03 | Phase 5 | Pending |
| MARQ-04 | Phase 5 | Pending |
| MARQ-05 | Phase 5 | Pending |
| SKILL-01 | Phase 5 | Pending |
| SKILL-02 | Phase 5 | Pending |
| SKILL-03 | Phase 5 | Pending |
| SKILL-04 | Phase 5 | Pending |
| SKILL-05 | Phase 5 | Pending |
| BATCH-01 | Phase 5 | Pending |
| BATCH-02 | Phase 5 | Pending |
| BATCH-03 | Phase 5 | Pending |
| BATCH-04 | Phase 5 | Pending |
| BATCH-05 | Phase 5 | Pending |
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
| FOOT-01 | Phase 2 | Pending |
| FOOT-02 | Phase 2 | Pending |
| FOOT-03 | Phase 2 | Pending |
| FOOT-04 | Phase 2 | Pending |
| FOOT-05 | Phase 2 | Pending |
| FOOT-06 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 58
- Unmapped: 0 ✓

---
*Requirements defined: 2025-02-22*
*Last updated: 2025-02-22 after initial definition*
