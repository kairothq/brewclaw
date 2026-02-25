---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - app/(auth)/layout.tsx
  - app/(auth)/signin/page.tsx
  - components/ui/button.tsx
  - components/ui/input.tsx
  - components/auth/google-signin-button.tsx
  - components/auth/magic-link-form.tsx
autonomous: true
requirements: [QUICK-01]

must_haves:
  truths:
    - "Sign-in page uses dark theme with black/gray color palette"
    - "Auth layout has split-panel design (left marketing panel, right form)"
    - "Left panel shows animated gradient orbs and testimonial content"
    - "Form inputs and buttons use dark theme styling"
  artifacts:
    - path: "app/globals.css"
      provides: "Dark theme CSS variables and animations"
      contains: "--background: oklch(0 0 0)"
    - path: "app/(auth)/layout.tsx"
      provides: "Split-panel auth layout with testimonial"
      min_lines: 80
    - path: "app/(auth)/signin/page.tsx"
      provides: "Dark-themed sign-in page"
      contains: "text-muted-foreground"
  key_links:
    - from: "app/(auth)/signin/page.tsx"
      to: "components/auth/google-signin-button.tsx"
      via: "component import"
      pattern: "GoogleSignInButton"
    - from: "app/(auth)/layout.tsx"
      to: "app/globals.css"
      via: "CSS variables"
      pattern: "bg-background"
---

<objective>
Update the sign-in page to use the v0 auth-flows-ui-kit dark theme styling.

Purpose: Transform the current light-themed, simple sign-in page into a professional dark-themed auth experience with split-panel layout featuring testimonials and animated gradient effects.

Output: Updated sign-in page matching the v0 template's dark aesthetic while preserving existing authentication functionality (Google OAuth and magic link).
</objective>

<execution_context>
@/Users/divykairoth/.claude/get-shit-done/workflows/execute-plan.md
@/Users/divykairoth/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
Source template location (for reference patterns):
- /Users/divykairoth/Downloads/Needed/Divys Workspace/1. Projects/brewclaw/brewclaw-extras/v0 templates/Old/auth-flows-ui-kit/app/globals.css
- /Users/divykairoth/Downloads/Needed/Divys Workspace/1. Projects/brewclaw/brewclaw-extras/v0 templates/Old/auth-flows-ui-kit/app/auth/layout.tsx
- /Users/divykairoth/Downloads/Needed/Divys Workspace/1. Projects/brewclaw/brewclaw-extras/v0 templates/Old/auth-flows-ui-kit/app/auth/login/page.tsx
- /Users/divykairoth/Downloads/Needed/Divys Workspace/1. Projects/brewclaw/brewclaw-extras/v0 templates/Old/auth-flows-ui-kit/components/auth/oauth-buttons.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add dark theme CSS variables and animations</name>
  <files>app/globals.css</files>
  <action>
  Update globals.css to add the dark theme CSS variables and animations from the v0 template:

  1. Add all CSS custom properties for dark theme colors:
     - --background: oklch(0 0 0) (pure black)
     - --foreground: oklch(0.985 0 0) (near white)
     - --card, --card-foreground
     - --muted, --muted-foreground: oklch(0.18 0 0), oklch(0.6 0 0)
     - --border: oklch(0.25 0 0)
     - --input: oklch(0.18 0 0)
     - --primary, --primary-foreground
     - --secondary, --secondary-foreground
     - --destructive, --destructive-foreground
     - --ring: oklch(0.5 0 0)
     - --radius: 0.625rem

  2. Add @theme inline block to expose CSS variables as Tailwind colors:
     - Map all --color-* variables
     - Add --radius-sm, --radius-md, --radius-lg, --radius-xl

  3. Add @layer base rules:
     - * { @apply border-border outline-ring/50; }
     - body { @apply bg-background text-foreground; }

  4. Add keyframes and animations:
     - gradient-shift animation for animated orbs (15s ease infinite)
     - animate-gradient class

  Keep existing @import "tailwindcss" at top.
  </action>
  <verify>Run `npm run dev` and verify the app loads with dark background</verify>
  <done>globals.css contains dark theme variables, @theme inline block, and gradient animations</done>
</task>

<task type="auto">
  <name>Task 2: Create split-panel auth layout with testimonial</name>
  <files>app/(auth)/layout.tsx</files>
  <action>
  Replace the simple centered layout with the v0 template's split-panel design:

  1. Structure:
     - Full height flex container (min-h-screen flex)
     - Left panel (lg:w-1/2, hidden on mobile): Marketing content
     - Right panel (flex-1): Auth form content

  2. Left panel content:
     - Gradient background: bg-gradient-to-br from-card via-background to-card
     - Animated gradient orbs (emerald-500/10 and blue-500/10 with blur-3xl)
     - Logo component at top: "Brewclaw" branding (replace "Acme")
     - Testimonial blockquote in middle
     - Stats row: "50K+", "99.9%", "4.9/5" (or Brewclaw-relevant stats)
     - Features row at bottom with icons (Shield, Zap, Users from lucide-react)

  3. Right panel:
     - Mobile header with logo (lg:hidden)
     - Centered form container: max-w-md, with animate-in fade-in slide-in-from-bottom-4
     - Padding: p-6 lg:p-12

  4. Logo component (inline):
     - Link to "/" with flex items-center gap-2
     - 8x8 rounded-lg bg-foreground with centered "B" letter
     - "Brewclaw" text next to it

  Use Tailwind classes matching the template. Import Link from next/link and Shield, Zap, Users from lucide-react.
  </action>
  <verify>Visit /signin and verify split-panel layout appears on desktop, single panel on mobile</verify>
  <done>Auth layout shows testimonial left panel on desktop, animated gradient orbs visible, mobile shows only form</done>
</task>

<task type="auto">
  <name>Task 3: Update sign-in page and components for dark theme</name>
  <files>app/(auth)/signin/page.tsx, components/ui/button.tsx, components/ui/input.tsx, components/auth/google-signin-button.tsx, components/auth/magic-link-form.tsx</files>
  <action>
  Update all auth components to use dark theme semantic classes:

  1. Update components/ui/button.tsx variants:
     - default: "bg-primary text-primary-foreground hover:bg-primary/90"
     - outline: "border border-border bg-transparent hover:bg-secondary text-foreground"
     - ghost: "hover:bg-secondary text-foreground"
     - Add h-12 height option in sizes, add transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]

  2. Update components/ui/input.tsx:
     - Change border-gray-300 to border-border
     - Change bg-white to bg-input
     - Change text colors to text-foreground
     - Change placeholder to placeholder:text-muted-foreground
     - Add h-12 height, transition-all duration-200 focus:scale-[1.01]
     - Change focus ring to focus:ring-ring

  3. Update components/auth/google-signin-button.tsx:
     - Change button classes to match v0 template:
       - h-12 border-border bg-transparent hover:bg-secondary
       - transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
       - text-foreground

  4. Update components/auth/magic-link-form.tsx:
     - Change error text from text-red-500 to text-destructive
     - Change success text from text-green-600 to text-emerald-400

  5. Update app/(auth)/signin/page.tsx:
     - Change title/text colors from text-gray-900, text-gray-600, text-gray-500 to:
       - h1: text-3xl font-semibold tracking-tight text-foreground (change from 2xl)
       - subtitle: text-muted-foreground
       - terms text: text-muted-foreground
     - Update divider: border-border, bg-background, text-muted-foreground
     - Update "Or continue with" text
  </action>
  <verify>Visit /signin and verify all elements use dark theme colors, no light gray or white backgrounds visible</verify>
  <done>Sign-in page fully styled with dark theme, all text/inputs/buttons using semantic color variables</done>
</task>

</tasks>

<verification>
1. `npm run dev` completes without errors
2. Visit http://localhost:3000/signin on desktop:
   - Left panel shows gradient background with animated orbs
   - Testimonial and stats visible
   - Brewclaw logo in top left
3. Visit http://localhost:3000/signin on mobile (or resize):
   - Only form visible, no split panel
   - Logo appears above form
4. All form elements (inputs, buttons) styled with dark theme
5. Google OAuth button clickable and styled correctly
6. Magic link form functional with dark-styled error/success states
</verification>

<success_criteria>
- Sign-in page matches v0 auth-flows-ui-kit dark theme aesthetic
- Split-panel layout with testimonial on desktop
- Responsive: mobile shows only form
- All existing auth functionality preserved (Google OAuth, magic link)
- No light theme colors (gray-*, white, etc.) in auth components
</success_criteria>

<output>
After completion, create `.planning/quick/1-update-signin-page-to-use-v0-auth-templa/1-SUMMARY.md`
</output>
