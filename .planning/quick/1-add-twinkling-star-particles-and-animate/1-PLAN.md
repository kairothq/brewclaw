---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/star-particles.tsx
  - src/components/highlight-text.tsx
  - src/components/hero-section.tsx
autonomous: true
requirements: [QUICK-01]

must_haves:
  truths:
    - "Twinkling star particles visible in hero background"
    - "Word 'coffee' has animated highlight that slides in from left"
    - "Highlight stays visible after animation completes"
    - "Highlight uses coffee color (#D97706)"
  artifacts:
    - path: "src/components/star-particles.tsx"
      provides: "Canvas-based twinkling star particle effect"
      min_lines: 50
    - path: "src/components/highlight-text.tsx"
      provides: "GSAP-powered highlight animation component"
      exports: ["HighlightText"]
    - path: "src/components/hero-section.tsx"
      provides: "Updated hero with stars and highlighted coffee"
      contains: "StarParticles"
  key_links:
    - from: "src/components/hero-section.tsx"
      to: "src/components/star-particles.tsx"
      via: "import and render"
      pattern: "StarParticles"
    - from: "src/components/hero-section.tsx"
      to: "src/components/highlight-text.tsx"
      via: "wrap coffee text"
      pattern: "HighlightText.*coffee"
---

<objective>
Add visual polish to hero section with twinkling star particles in background and an animated highlight effect on the word "coffee" in the tagline.

Purpose: Enhance hero visual appeal and draw attention to the key value proposition (speed of deployment).
Output: Updated hero section with subtle star animation and eye-catching coffee highlight.
</objective>

<execution_context>
@/Users/divykairoth/.claude/get-shit-done/workflows/execute-plan.md
@/Users/divykairoth/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/hero-section.tsx
@v0 templates/New/orange-animation/components/highlight-text.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create StarParticles component</name>
  <files>src/components/star-particles.tsx</files>
  <action>
Create a "use client" component that renders twinkling star particles on a canvas.

Implementation:
- Use canvas with absolute positioning, pointer-events-none, z-0
- Generate 50-80 random star positions on mount using useMemo
- Each star has: x, y, size (1-3px), baseOpacity (0.3-0.8), twinkleSpeed (random 1-4s)
- Use CSS animations (not JS requestAnimationFrame) for twinkling via opacity keyframes
- Actually: Use canvas + requestAnimationFrame for smooth twinkling since we want individual star timing
- Draw stars as small white circles with varying opacity
- Twinkle effect: sinusoidal opacity change based on time + individual star phase offset
- Handle resize with ResizeObserver to recalculate canvas dimensions
- Stars should be subtle (max opacity 0.7) to not distract from hero content

Export: StarParticles component with no required props
  </action>
  <verify>Component file exists and exports StarParticles. No TypeScript errors.</verify>
  <done>StarParticles component renders animated twinkling stars on canvas.</done>
</task>

<task type="auto">
  <name>Task 2: Create HighlightText component</name>
  <files>src/components/highlight-text.tsx</files>
  <action>
Create a "use client" component based on v0 template reference that animates a highlight behind text.

Adapt from reference template but simplify:
- Remove parallax effect (not needed)
- Use GSAP timeline triggered on mount (not scroll-triggered)
- Highlight background color: #D97706 (coffee/amber)
- Animation: scaleX from 0 to 1, transformOrigin left, duration 0.8s, ease power3.out
- Text color stays white (no color transition like template - dark bg)
- Highlight should extend slightly beyond text bounds (left/right padding via inset)
- After animation, highlight stays at scaleX(1) - use forwards-like behavior

Props:
- children: ReactNode (the text to highlight)
- className?: string
- delay?: number (default 0.5s - wait for hero to settle)

Structure:
- Outer span with relative inline-block
- Highlight span (absolute, behind text, amber bg)
- Text span (relative z-10)

Use GSAP per project decision (Motion for component animations, GSAP for scroll - but this is a mount animation so Motion would work too. However, since we're adapting a GSAP template, stick with GSAP for consistency).
  </action>
  <verify>Component file exists and exports HighlightText. No TypeScript errors.</verify>
  <done>HighlightText component animates highlight from left on mount with coffee color.</done>
</task>

<task type="auto">
  <name>Task 3: Integrate into HeroSection</name>
  <files>src/components/hero-section.tsx</files>
  <action>
Update hero-section.tsx to include both new components:

1. Import StarParticles and HighlightText at top

2. Add StarParticles as first child inside section (before Status Chip):
   ```tsx
   <StarParticles />
   ```
   Position: absolute, inset-0, z-0, pointer-events-none

3. Update the h2 tagline to wrap "coffee" with HighlightText:
   Current: "Deploy your personal AI assistant in time it takes to brew a coffee."
   New: "Deploy your personal AI assistant in time it takes to brew a <HighlightText>coffee</HighlightText>."

4. Ensure other hero content has relative positioning and appropriate z-index to appear above stars

5. Add Suspense boundary around StarParticles if needed for SSR safety (since it uses canvas)
  </action>
  <verify>
npm run build succeeds.
Dev server shows: stars twinkling in hero background, "coffee" word has amber highlight that animates in.
  </verify>
  <done>Hero section displays twinkling stars and animated coffee highlight.</done>
</task>

</tasks>

<verification>
1. npm run build - no errors
2. npm run dev - visit localhost:3000
3. Hero shows subtle twinkling star particles in background
4. Word "coffee" has amber (#D97706) highlight that animates in from left
5. Highlight remains visible after animation
6. Stars don't interfere with clicking CTA button or other interactive elements
</verification>

<success_criteria>
- StarParticles component renders canvas with 50-80 twinkling stars
- HighlightText component animates scaleX from 0 to 1 with coffee color
- Hero integrates both components without breaking existing functionality
- Visual effect is subtle and polished, not distracting
</success_criteria>

<output>
After completion, create `.planning/quick/1-add-twinkling-star-particles-and-animate/1-SUMMARY.md`
</output>
