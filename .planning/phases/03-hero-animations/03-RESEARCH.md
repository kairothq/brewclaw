# Phase 3 Research: Hero Animations

## Overview

Phase 3 implements the hero section with brand animation, status chip, and sound toggle. Two animation styles are required: IronClaw-style ASCII shimmer (default) and SplitFlap mechanical flip (A/B test option).

## Requirements Covered

- CHIP-01: Status chip positioned below nav, above hero
- CHIP-02: 3 rotating messages with pulse-glow animation
- CHIP-03: Click scrolls to Batch Counter section
- HERO-01: Dark background (#0A0A0A) full-width section
- HERO-02: SplitFlap OR ASCII shimmer brand animation (A/B test ready)
- HERO-03: Web Audio API click sounds for SplitFlap (muted by default, toggle)
- HERO-04: Tagline displays: "Deploy your personal AI assistant..."
- HERO-05: Sub-copy with bullet separators
- HERO-06: CTA button links to signup funnel
- HERO-07: Trust line: "$2 credits included - No code needed"

## Animation Research

### Option A: IronClaw ASCII Animation (Default)

**Character Set:**
- Solid blocks: `█` (full block)
- Dense shade: `▓` (dark shade)
- Light shade: `░` (light shade)
- Empty/space for gaps

**Implementation Approach:**
1. Create ASCII art representation of "BREWCLAW" using block characters
2. Each letter is a 2D grid of characters (approximately 5-7 chars wide, 6-7 lines tall)
3. Shimmer effect: animate character density from left to right
4. Use CSS or Motion for timing, apply character swaps in sequence

**Shimmer Animation:**
- Wave moves left-to-right across the text
- Characters transition: `░` → `▓` → `█` → `▓` → `░`
- Stagger timing per column (50-80ms delay between columns)
- Loop continuously with 2-3 second cycle

**ASCII Letter Designs (compact, blocky style):**
```
B      R      E      W      C      L      A      W
██▓    ██▓    ███    █   █  ███    █      ███    █   █
█  ░   █  ░   █      █   █  █      █     █   █   █   █
███    ██▓    ██     █ █ █  █      █     █████   █ █ █
█  ░   █  ░   █      █ █ █  █      █     █   █   █ █ █
██▓    █  ░   ███    ██ ██  ███    ███   █   █   ██ ██
```

### Option B: SplitFlap Animation (A/B Test)

**Source:** `/v0 templates/New/orange-animation/components/split-flap-text.tsx`

**Key Features:**
- Mechanical flip board aesthetic (airport/train station displays)
- Characters cycle through alphabet before settling on target
- 3D flip animation using CSS transforms
- Web Audio API for click sounds

**Implementation Notes:**
- Port SplitFlapText component directly from template
- Include SplitFlapAudioProvider and SplitFlapMuteToggle
- Sound is muted by default (per requirement HERO-03)
- Re-animate on hover for engagement

**Audio Implementation:**
- Web Audio API oscillator creates mechanical click sounds
- Bandpass filter for authentic sound
- Haptic feedback on mobile (navigator.vibrate)
- Toggle button shows Volume2/VolumeX icons

### A/B Test Switching

**Implementation:**
1. URL search parameter: `?hero=ascii` (default) or `?hero=splitflap`
2. Read param in hero component using `useSearchParams()`
3. Conditionally render ASCII or SplitFlap component
4. Optional: Add internal toggle for easier testing

**Code Pattern:**
```tsx
const searchParams = useSearchParams()
const heroStyle = searchParams.get('hero') || 'ascii'

return heroStyle === 'splitflap' ? <SplitFlapHero /> : <AsciiHero />
```

## Status Chip Research

**Design:**
- Positioned above hero, below navbar
- Rotating messages with fade/slide transitions
- Pulse-glow animation on status indicator dot

**Messages (3 rotating):**
1. "Now accepting Batch 2 applications"
2. "1,247 assistants deployed this month"
3. "New: Skills Store now live"

**Animation:**
- Use Motion's AnimatePresence for message transitions
- Interval-based rotation (4-5 seconds per message)
- Click navigates to batch counter section

**Pulse-Glow CSS:**
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px currentColor; }
  50% { opacity: 0.6; box-shadow: 0 0 8px currentColor; }
}
```

## Technical Decisions

1. **Font rendering:** ASCII art uses monospace font (Geist Mono) for consistent character width
2. **Responsive:** Scale ASCII art using `clamp()` for font-size
3. **Performance:** Use CSS animations where possible, Motion for entrance
4. **Accessibility:** Include sr-only text "BREWCLAW" for screen readers
5. **Sound default:** Muted by default, user must explicitly enable

## Dependencies

- `motion/react` - already installed (Phase 1)
- `lucide-react` - already installed (for Volume icons)
- Web Audio API - browser native
- `next/navigation` - for useSearchParams

## File Structure

```
src/components/
  hero-section.tsx        # Main hero with A/B switch
  ascii-brand.tsx         # ASCII BREWCLAW animation
  split-flap-text.tsx     # Ported from template
  status-chip.tsx         # Rotating status messages
```

## RESEARCH COMPLETE
