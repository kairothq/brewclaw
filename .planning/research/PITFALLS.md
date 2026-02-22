# Domain Pitfalls: Premium Animated Landing Page

**Domain:** Premium SaaS Landing Page with Complex Animations
**Project:** BrewClaw
**Researched:** 2026-02-22
**Confidence:** MEDIUM-HIGH (verified with official docs and multiple sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, significant performance degradation, or major user experience issues.

---

### Pitfall 1: Web Audio API Autoplay Blocked on First Visit

**What goes wrong:** SplitFlap click sounds fail silently on page load. Users see the animation but hear nothing, or get browser console errors about AudioContext being suspended.

**Why it happens:** Since Chrome 71, Web Audio API requires user interaction before audio can play. Chrome's autoplay policy blocks audio until the user has interacted with the page (click, tap, or keypress). This affects all modern browsers.

**Consequences:**
- SplitFlap animation appears broken (visual without audio)
- Console errors: "AudioContext was not allowed to start"
- Degraded premium feel on first impression
- Potential for memory leaks from suspended AudioContext instances

**Prevention:**
1. Initialize AudioContext only after first user interaction
2. Default to muted state on page load (PRD already specifies this correctly)
3. Use `audioContext.state` check before playing: if "suspended", call `audioContext.resume()` on user interaction
4. Add visible mute/unmute toggle near the hero section
5. Pre-create AudioContext but delay `start()` calls until interaction

**Detection (Warning Signs):**
- No audio during development testing (may work if you've interacted with the page)
- Console warning: "The AudioContext was not allowed to start"
- `audioContext.state === "suspended"` on page load

**Phase to Address:** Hero section implementation (Phase 1-2)

**Sources:**
- [Chrome Autoplay Policy](https://developer.chrome.com/blog/autoplay) - HIGH confidence
- [MDN Autoplay Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) - HIGH confidence

---

### Pitfall 2: Backdrop-Filter Blur Causes Scroll Jank on Sticky Nav

**What goes wrong:** The glass-blur sticky navigation specified in the PRD causes noticeable stuttering during scroll, especially on:
- Mobile devices
- 4K/high-DPI displays
- Pages with rapidly changing content behind the nav

**Why it happens:** `backdrop-filter: blur()` forces the browser to re-composite the blurred area on every frame during scroll. The GPU must process all pixels behind the element continuously.

**Consequences:**
- Dropped frames during scroll (below 60fps)
- Poor Core Web Vitals (Cumulative Layout Shift, Interaction to Next Paint)
- Battery drain on mobile devices
- Premium feel undermined by janky experience

**Prevention:**
1. Use modest blur values: `blur(8px)` max, avoid `blur(20px)+`
2. Keep nav element small (PRD specifies ~40% width - good)
3. Test on real mobile devices, not just Chrome DevTools
4. Add `will-change: transform` to hint GPU compositing
5. Consider fallback: reduce blur or disable entirely on low-power devices via media query
6. Set `overscroll-behavior: none` to prevent flicker

**Detection (Warning Signs):**
- DevTools Performance panel shows high "Paint" or "Composite" times during scroll
- FPS drops below 50 when scrolling
- Mobile device gets warm during extended scrolling

**Phase to Address:** Navigation implementation (Phase 1)

**Sources:**
- [VitePress Issue #1049](https://github.com/vuejs/vitepress/issues/1049) - MEDIUM confidence
- [Josh W. Comeau - Backdrop Filter](https://www.joshwcomeau.com/css/backdrop-filter/) - HIGH confidence

---

### Pitfall 3: GSAP ScrollTrigger Cleanup Failures in React/Next.js

**What goes wrong:** ScrollTrigger instances persist after navigation or component unmount, causing:
- Memory leaks
- Animations firing on wrong elements
- Multiple overlapping animations
- "Ghost" triggers that fire unexpectedly

**Why it happens:** GSAP operates outside React's lifecycle. ScrollTrigger attaches event listeners and references DOM elements directly. Without explicit cleanup, these persist across React re-renders and Next.js route changes.

**Consequences:**
- Progressively degrading performance as user navigates
- Animations break after returning to the page
- Memory consumption grows unbounded
- Console errors about missing elements

**Prevention:**
1. Use the official `@gsap/react` package with `useGSAP()` hook
2. Always return cleanup function from useEffect/useGSAP:
   ```typescript
   useGSAP(() => {
     const trigger = ScrollTrigger.create({...});
     return () => trigger.kill();
   }, { scope: containerRef });
   ```
3. Use `ScrollTrigger.getAll().forEach(t => t.kill())` on route change
4. Register plugin once at app level: `gsap.registerPlugin(ScrollTrigger)`
5. Mark components as `"use client"` - ScrollTrigger requires DOM access

**Detection (Warning Signs):**
- Memory usage grows in DevTools Memory tab after navigation
- Console warnings about "target not found"
- Animations play multiple times on return visit
- Scroll position resets unexpectedly

**Phase to Address:** Any phase using GSAP ScrollTrigger (Installation Steps, Comparison, Features, Skills Store)

**Sources:**
- [GSAP Forums - ScrollTrigger in Next.js](https://gsap.com/community/forums/topic/40128-using-scrolltriggers-in-nextjs-with-usegsap/) - HIGH confidence
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - HIGH confidence

---

### Pitfall 4: Framer Motion + GSAP Conflict on Same Elements

**What goes wrong:** Using both Framer Motion and GSAP on the same element or component tree causes:
- Conflicting transform values
- Animations "fighting" each other
- Unpredictable visual results
- Performance degradation from double computation

**Why it happens:** Both libraries want to control the same CSS properties (transform, opacity). Framer Motion uses React's render cycle while GSAP directly manipulates the DOM.

**Consequences:**
- Jittery animations
- Elements snap to unexpected positions
- Layout thrashing
- Hard-to-debug visual bugs

**Prevention:**
1. Establish clear ownership: Framer Motion for entrance/hover, GSAP for scroll-triggered
2. Never apply both to the same DOM element
3. Use wrapper elements if necessary: outer for Framer Motion, inner for GSAP
4. Document which library controls each animation in code comments
5. For BrewClaw specifically:
   - Framer Motion: Nav entrance, hover states, AnimatePresence
   - GSAP: Scroll-triggered reveals, comparison section, installation steps timeline

**Detection (Warning Signs):**
- Elements "jump" or snap unexpectedly
- Animation starts from wrong position
- Console shows rapid style changes
- DevTools shows competing inline styles

**Phase to Address:** Initial architecture decision (Phase 0-1)

**Sources:**
- [GSAP Forums - GSAP vs Framer Motion](https://gsap.com/community/forums/topic/38826-why-gsap-but-not-framer-motion/) - MEDIUM confidence
- [Semaphore - React Framer Motion vs GSAP](https://semaphore.io/blog/react-framer-motion-gsap) - MEDIUM confidence

---

### Pitfall 5: Animating Layout-Affecting Properties (Width, Height, Top)

**What goes wrong:** Animating properties like `width`, `height`, `top`, `left`, `margin`, or `padding` causes layout recalculation on every frame, guaranteeing dropped frames.

**Why it happens:** These properties trigger the browser's "reflow" step, which requires recalculating layout for the element and all its neighbors. At 60fps, the browser has only 16ms per frame - layout recalculation often exceeds this.

**Consequences:**
- Animation stutters and jank
- Other page elements may shift during animation
- Battery drain on mobile
- Poor Core Web Vitals scores

**Prevention:**
1. Only animate `transform` and `opacity` - these are GPU-accelerated
2. Use `transform: translateX/Y()` instead of `left/top`
3. Use `transform: scale()` instead of `width/height`
4. For the liquid flow timeline animation in Installation Steps, use SVG path animation or clip-path, not height
5. Check animation performance with DevTools Performance panel

**Detection (Warning Signs):**
- Purple "Layout" bars in DevTools Performance timeline
- "Forced reflow" warnings in console
- Animations visibly stutter on any device
- CPU spikes during animation

**Phase to Address:** All phases with animations (consistent enforcement)

**Sources:**
- [MDN Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) - HIGH confidence
- [Algolia - 60 FPS Web Animations](https://www.algolia.com/blog/engineering/60-fps-performant-web-animations-for-optimal-ux) - MEDIUM confidence

---

## Moderate Pitfalls

Issues that cause user experience degradation or accessibility problems but are recoverable.

---

### Pitfall 6: Missing prefers-reduced-motion Support

**What goes wrong:** Users with vestibular disorders, motion sensitivity, or who simply prefer reduced motion see all animations at full intensity, causing:
- Physical discomfort (dizziness, nausea)
- Difficulty focusing on content
- Accessibility compliance failure (WCAG 2.1 AA)

**Why it happens:** Developers test in environments without reduced motion enabled. It's easy to forget this is a user preference that must be respected.

**Prevention:**
1. Implement global reduced-motion handling:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
2. For Framer Motion, use the `useReducedMotion()` hook
3. Replace transform animations with opacity fades when reduced motion is detected
4. Pause marquee animation entirely - don't just slow it down
5. Add in-page toggle for users who want reduced motion only on this site

**Detection (Warning Signs):**
- Accessibility audit fails WCAG 2.3.3
- User complaints about motion sickness
- No `prefers-reduced-motion` query in codebase

**Phase to Address:** Phase 1 foundation - set up globally before building animations

**Sources:**
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - HIGH confidence
- [W3C WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - HIGH confidence
- [Motion.dev Accessibility](https://motion.dev/docs/react-accessibility) - HIGH confidence

---

### Pitfall 7: Infinite Marquee Accessibility Violations

**What goes wrong:** The dual-row use cases marquee (Section 7) creates multiple accessibility issues:
- Screen readers cannot parse moving content
- Users cannot stop motion that continues for >5 seconds
- Content becomes unreadable at animation speed
- Cognitive overload for users with attention difficulties

**Why it happens:** Marquees are inherently problematic for accessibility. The original `<marquee>` HTML element was deprecated specifically for these reasons.

**Prevention:**
1. Implement pause on hover/focus (PRD specifies this - good)
2. Add a visible pause button for keyboard users
3. Set `aria-hidden="true"` on marquee container (it's decorative)
4. Provide static list alternative below or in aria-label
5. Keep animation speed slow (~45s per loop as specified)
6. Consider completely stopping animation when `prefers-reduced-motion` is set
7. Add keyboard control: Space to pause/play

**Detection (Warning Signs):**
- axe or Lighthouse accessibility audit warnings
- Users with vestibular disorders report discomfort
- Screen reader users cannot access marquee content

**Phase to Address:** Use Cases Marquee implementation

**Sources:**
- [Frontend Masters - Infinite Marquee CSS](https://frontendmasters.com/blog/infinite-marquee-animation-using-modern-css/) - MEDIUM confidence
- [Smashing Magazine - Infinite Scrolling Logos](https://www.smashingmagazine.com/2024/04/infinite-scrolling-logos-html-css/) - MEDIUM confidence

---

### Pitfall 8: Next.js Hydration Mismatches with Animations

**What goes wrong:** Animation components cause React hydration errors:
- "Text content does not match server-rendered HTML"
- "Hydration failed because the initial UI does not match what was rendered on the server"
- Visual flash or flicker on page load

**Why it happens:** Animations that depend on:
- `Math.random()` for staggered delays
- `Date.now()` for timing
- `window` object checks (browser-only code on server)
- localStorage (theme state)

Server renders one value, client renders another, React detects mismatch.

**Consequences:**
- Console errors in production
- Flash of unstyled content
- Potential layout shifts
- SEO impact if hydration fails badly

**Prevention:**
1. Use `dynamic()` import with `{ ssr: false }` for purely client-side animation components
2. Use `suppressHydrationWarning` only for leaf nodes (timestamps, etc.)
3. Initialize animation values in `useEffect`, not during render
4. Use stable keys, not array indices or random values
5. For counter animation: render "0" on server, animate to target on client
6. Mark animation components with `"use client"` directive

**Detection (Warning Signs):**
- Red hydration error in browser console
- Visual "pop" or flash on page load
- Different content visible briefly before settling

**Phase to Address:** All phases - enforce pattern early

**Sources:**
- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error) - HIGH confidence
- [Medium - Next.js 15 Hydration Errors 2026](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702) - MEDIUM confidence

---

### Pitfall 9: WebGL Shader Buttons Fail on Mobile/Low-Power Devices

**What goes wrong:** The shader/liquid-metal CTA button specified in Section 11:
- Causes frame drops on mobile devices
- Drains battery rapidly
- Fails entirely on devices without WebGL support
- Text becomes unreadable over complex shader effects

**Why it happens:** WebGL fragment shaders run on GPU every frame. Mobile GPUs are 10-100x slower than desktop GPUs. Complex effects designed on desktop may be unusable on mobile.

**Consequences:**
- CTA button (most important conversion element) underperforms
- Mobile users have degraded experience
- Some devices show fallback or nothing at all
- Accessibility issues with text contrast

**Prevention:**
1. Test on real mobile devices (not just DevTools simulation)
2. Implement graceful degradation: detect mobile/low-power and use CSS-only effect
3. Reduce shader FPS to 30 or 24 on mobile
4. Keep shader effects simple - avoid liquid glass for text buttons
5. Ensure text remains clearly readable at all times
6. Provide feature detection: `!!window.WebGLRenderingContext`
7. Consider CSS alternative for the primary CTA entirely

**Detection (Warning Signs):**
- Mobile device gets warm when viewing CTA section
- FPS drops below 30 in mobile DevTools
- WebGL context creation fails silently
- Button appears as solid color without effect

**Phase to Address:** Final CTA section implementation

**Sources:**
- [Grafit Agency - Liquid Glass Effect Issues](https://www.grafit.agency/blog/why-you-shouldnt-use-the-liquid-glass-effect-on-your-website-yet) - MEDIUM confidence
- [MDN WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) - HIGH confidence

---

### Pitfall 10: Counter Animation Using setInterval Instead of requestAnimationFrame

**What goes wrong:** The Batch Counter count-up animation (Section 9) uses setInterval, causing:
- Animation speed varies across devices
- Animations continue running in background tabs
- Stuttering and missed frames
- Resource waste when tab is inactive

**Why it happens:** setInterval fires at fixed intervals regardless of browser render cycle. It doesn't synchronize with display refresh rates and doesn't pause when tab is hidden.

**Prevention:**
1. Use `requestAnimationFrame` for all timing-based animations
2. Calculate delta time from the callback's timestamp parameter
3. Cancel animation with `cancelAnimationFrame` on unmount
4. Use Intersection Observer to start animation only when visible
5. Consider CSS `@property` counter for simpler implementation:
   ```css
   @property --num {
     syntax: '<integer>';
     initial-value: 0;
     inherits: false;
   }
   ```
6. Use established libraries: react-countup, framer-motion animate()

**Detection (Warning Signs):**
- Animation speed differs on 60Hz vs 120Hz displays
- Animation continues in background tab (check with DevTools)
- CPU usage when counter section is off-screen

**Phase to Address:** Batch Counter section implementation

**Sources:**
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) - HIGH confidence
- [CSS-Tricks - Animating Number Counters](https://css-tricks.com/animating-number-counters/) - MEDIUM confidence

---

## Minor Pitfalls

Issues that cause minor UX degradation or developer friction.

---

### Pitfall 11: Pricing Card Border-Beam Animation z-index Conflicts

**What goes wrong:** The border-beam animation on pricing cards conflicts with:
- Card hover states
- Dropdown menus
- Modal overlays
- Adjacent card interactions

**Why it happens:** Animated pseudo-elements (`::before`, `::after`) with transforms create new stacking contexts, causing z-index battles.

**Prevention:**
1. Establish clear z-index scale in design system
2. Keep border-beam in isolated pseudo-element layer
3. Test hover states on all cards simultaneously
4. Use `isolation: isolate` to contain stacking context
5. Don't use `z-index: 9999` - use structured values (1-10 scale)

**Detection (Warning Signs):**
- Animation appears behind card content
- Hover on one card affects adjacent cards
- Animation clips at card boundaries

**Phase to Address:** Pricing section implementation

---

### Pitfall 12: SplitFlap Animation Re-trigger on Every Re-render

**What goes wrong:** The SplitFlap brand animation in the hero re-plays on:
- React state changes anywhere on page
- Window resize
- Parent component re-renders
- Next.js route prefetching

**Why it happens:** Animation trigger is tied to component mount rather than stable animation state.

**Prevention:**
1. Store animation completion state in ref, not state
2. Use `useRef` to track if animation has played
3. Only re-trigger on explicit user interaction (hover)
4. Memoize animation components with `React.memo`
5. Keep animation logic isolated from reactive state

**Detection (Warning Signs):**
- Brand name "flips" unexpectedly while scrolling
- Animation plays multiple times on initial load
- Performance degrades as page state changes

**Phase to Address:** Hero section SplitFlap implementation

---

### Pitfall 13: Font Loading Causes Animation Flash

**What goes wrong:** Space Grotesk and Geist Mono load after initial paint, causing:
- Text shifts size when font loads
- SplitFlap animation starts before correct font renders
- ASCII art breaks due to wrong character widths
- Layout shifts (CLS penalty)

**Why it happens:** Fonts are render-blocking resources. If not preloaded, system font renders first, then swaps.

**Prevention:**
1. Preload critical fonts:
   ```html
   <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
   ```
2. Use `font-display: swap` with fallback font of similar metrics
3. Delay hero animation until fonts are loaded (document.fonts.ready)
4. For ASCII art, use fixed-width fallback that matches Geist Mono metrics
5. Consider self-hosting fonts to avoid external request latency

**Detection (Warning Signs):**
- Text visibly changes size/shape on load
- ASCII art misaligns briefly
- Lighthouse reports CLS issues related to fonts

**Phase to Address:** Project setup / typography foundation

---

### Pitfall 14: Installation Steps Video Not Loading Synchronously

**What goes wrong:** The demo video in Section 4 doesn't sync with the step timeline because:
- Video loads asynchronously
- Network latency varies
- Autoplay is blocked until interaction
- Video format not supported on all browsers

**Why it happens:** Video elements are complex resources with many potential failure modes.

**Prevention:**
1. Preload video: `<link rel="preload" href="..." as="video">`
2. Use multiple formats: MP4 (H.264) + WebM
3. Implement skeleton loader while video loads
4. Add `playsinline muted` for mobile autoplay
5. Provide poster image that matches first frame
6. Consider GIF or Lottie animation as fallback
7. Don't tie critical UX to video timing - make steps navigable independently

**Detection (Warning Signs):**
- Steps and video are out of sync
- Video shows black rectangle on mobile
- Autoplay fails silently
- Video never loads on slow connections

**Phase to Address:** Installation Steps section implementation

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Navigation | Backdrop-filter scroll jank (#2) | Test on mobile early, have CSS fallback ready |
| Hero/SplitFlap | Web Audio autoplay blocked (#1) | Default muted, interaction-gated audio |
| Hero/SplitFlap | Re-render re-trigger (#12) | Ref-based animation state |
| Installation Steps | Layout-affecting animations (#5) | Use transform/opacity only for timeline |
| Installation Steps | Video sync issues (#14) | Independent step navigation |
| Comparison | GSAP cleanup (#3) | useGSAP hook with cleanup |
| Features | Animation conflict (#4) | Clear Framer/GSAP ownership |
| Use Cases Marquee | Accessibility violations (#7) | Pause controls, reduced-motion support |
| Skills Store | GSAP cleanup (#3) | Kill ScrollTriggers on unmount |
| Batch Counter | setInterval usage (#10) | requestAnimationFrame + IntersectionObserver |
| Pricing | Border-beam z-index (#11) | Isolation and stacking context management |
| Final CTA | Shader mobile failure (#9) | CSS fallback for mobile |
| Global | Hydration mismatches (#8) | "use client" + stable initial values |
| Global | No reduced-motion (#6) | Implement day 1, test throughout |
| Global | Font loading flash (#13) | Preload fonts, delay animation until ready |

---

## Pre-Development Checklist

Before starting any animation work:

- [ ] Set up `prefers-reduced-motion` global handler
- [ ] Establish Framer Motion vs GSAP ownership rules
- [ ] Configure font preloading
- [ ] Create z-index scale in design system
- [ ] Set up GSAP with `@gsap/react` and cleanup patterns
- [ ] Configure Web Audio API interaction-gated initialization
- [ ] Establish mobile performance testing workflow (real devices)
- [ ] Create animation performance budget (e.g., always maintain 50+ FPS)

---

## Sources

### HIGH Confidence (Official Documentation)
- [Chrome Autoplay Policy](https://developer.chrome.com/blog/autoplay)
- [MDN Autoplay Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error)
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)
- [MDN WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [W3C WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Motion.dev Accessibility](https://motion.dev/docs/react-accessibility)

### MEDIUM Confidence (Community/Technical Articles)
- [GSAP Forums - ScrollTrigger in Next.js](https://gsap.com/community/forums/topic/40128-using-scrolltriggers-in-nextjs-with-usegsap/)
- [Josh W. Comeau - Backdrop Filter](https://www.joshwcomeau.com/css/backdrop-filter/)
- [Frontend Masters - Infinite Marquee CSS](https://frontendmasters.com/blog/infinite-marquee-animation-using-modern-css/)
- [Algolia - 60 FPS Web Animations](https://www.algolia.com/blog/engineering/60-fps-performant-web-animations-for-optimal-ux)
- [Grafit Agency - Liquid Glass Effect](https://www.grafit.agency/blog/why-you-shouldnt-use-the-liquid-glass-effect-on-your-website-yet)
- [CSS-Tricks - Animating Number Counters](https://css-tricks.com/animating-number-counters/)
- [Semaphore - React Framer Motion vs GSAP](https://semaphore.io/blog/react-framer-motion-gsap)

---

*Document Version: 1.0*
*Researched: 2026-02-22*
*Confidence: MEDIUM-HIGH*
