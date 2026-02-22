# BrewClaw Landing Page PRD - Phase 1

**Product:** BrewClaw
**Domain:** brewclaw.com
**Target Audience:** Non-technical consumers
**Status:** Not Started
**Version:** 1.0

---

## Global Design System

### Color Palette
| Token | Usage | Value |
|-------|-------|-------|
| `--bg-light` | Light sections | `#FFFFFF` |
| `--bg-dark` | Dark sections | `#0A0A0A` or `#111111` |
| `--bg-gradient` | Transitional sections | Gradient between light ↔ dark |
| `--accent-primary` | CTAs, highlights | TBD (recommend warm tone to match "brew" theme) |
| `--text-primary` | Main text on light | `#1A1A1A` |
| `--text-secondary` | Muted text | `#6B7280` |
| `--text-inverse` | Text on dark | `#FFFFFF` |

### Typography
- **Headings:** Sans-serif, bold weight (recommend: Inter, Satoshi, or General Sans)
- **Body:** Same family, regular weight
- **Mono/Code:** For technical elements (command snippets)

### Spacing Scale
- Section padding: `80px` (desktop), `48px` (mobile)
- Component gaps: `24px`, `32px`, `48px`

---

## Section 1: Navigation Bar

### Design Specifications
| Property | Value |
|----------|-------|
| Position | Fixed/Sticky top |
| Background | Transparent → Solid on scroll (blur effect) |
| Height | `64px` desktop, `56px` mobile |
| Z-index | `1000` |

### Layout
```
[Logo + "BrewClaw"]     [Features ▼]  [Pricing]  [Docs*]     [Try it now for free]
     ↑ Left                        Center                         Right ↑
```
*Docs link greyed out with "Coming Soon" tooltip (Phase 2)

### Elements

#### 1.1 Logo & Brand Name
| Property | Specification |
|----------|---------------|
| Logo | BrewClaw icon (to be provided) |
| Text | "BrewClaw" |
| Font weight | Semi-bold |
| Link | `brewclaw.com` (homepage) |

#### 1.2 Features Dropdown
| Property | Specification |
|----------|---------------|
| Trigger | Hover |
| Animation | Fade + slide down (200ms ease-out) |
| Content | Links to "Use Cases" section + "Skills Store" section |

**Dropdown Items:**
| Label | Action |
|-------|--------|
| Use Cases | Scroll to Section 7 |
| Skills Store | Scroll to Section 8 |

#### 1.3 Pricing Link
| Property | Specification |
|----------|---------------|
| Text | "Pricing" |
| Action | Scroll to Section 10 |

#### 1.4 Docs Link (Phase 2)
| Property | Specification |
|----------|---------------|
| Text | "Docs" |
| State | Disabled/greyed |
| Hover | Tooltip: "Coming soon" |
| Action | None (Phase 2: link to docs.brewclaw.com) |

#### 1.5 Primary CTA Button
| Property | Specification |
|----------|---------------|
| Text | "Try it now for free" |
| Style | Filled button, accent color |
| Link | `brewclaw.com/signup` (signup funnel) |
| Hover | Slight scale (1.02) + shadow |

### Acceptance Criteria
- [ ] Logo links to homepage
- [ ] Features dropdown appears on hover with 2 items
- [ ] Features dropdown items scroll to respective sections smoothly
- [ ] Pricing scrolls to pricing section
- [ ] Docs shows "Coming soon" tooltip and is non-clickable
- [ ] CTA button redirects to signup funnel
- [ ] Nav becomes solid/blurred on scroll (after 50px)
- [ ] Mobile: Hamburger menu with all items

### Copy
| Element | Copy |
|---------|------|
| Brand | BrewClaw |
| Nav Item 1 | Features |
| Nav Item 2 | Pricing |
| Nav Item 3 | Docs |
| CTA | Try it now for free |

---

## Section 2: Rotating Status Chip

### Design Specifications
| Property | Value |
|----------|-------|
| Position | Below nav, above hero OR integrated in hero |
| Background | Subtle dark/light contrast pill |
| Border | 1px subtle border or none |
| Border-radius | `9999px` (full pill) |

### Animation
| Property | Specification |
|----------|---------------|
| Type | Vertical slide (bottom to top) |
| Easing | `ease-in-out` |
| Duration | `400ms` per transition |
| Pause | `2000ms` (2 seconds) between messages |
| Loop | Infinite |

### Rotating Messages
| Order | Message | Icon |
|-------|---------|------|
| 1 | "Powered by OpenClaw" | Red/orange dot |
| 2 | "[X] people registered" | User icon |
| 3 | "[X] seats left in Batch 3" | Timer/seat icon |

### Links
| Message | Action |
|---------|--------|
| "Powered by OpenClaw" | External link to OpenClaw repo/website |
| "[X] people registered" | Scroll to Section 9 (Batch counter) |
| "[X] seats left" | Scroll to Section 9 (Batch counter) |

### Acceptance Criteria
- [ ] Chip displays one message at a time
- [ ] Messages rotate with vertical slide animation
- [ ] Each message pauses for 2 seconds
- [ ] Animation loops infinitely
- [ ] Each message is clickable with appropriate action
- [ ] Numbers update dynamically (connected to backend in Phase 2)

### Copy
| Message ID | Copy Template |
|------------|---------------|
| MSG_1 | Powered by OpenClaw |
| MSG_2 | {count} people registered |
| MSG_3 | {seats} seats left in Batch 3 |

---

## Section 3: Hero / Big Tag Section

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Dark (`--bg-dark`) or gradient |
| Min-height | `90vh` |
| Layout | Centered, single column |
| Text alignment | Center |

### Layout Structure
```
        [Status Chip - Section 2]

        ╔═══════════════════════════════╗
        ║      B R E W C L A W          ║  ← Large animated logo
        ╚═══════════════════════════════╝

        "Deploy your personal AI assistant
         in the time it takes to brew a coffee"

        ────────────────────────────────────

        [Sub-capabilities with icons]
        Writes for you • Does research • Clears inbox • Sends morning briefs

        "On WhatsApp, Telegram, or wherever you are"
        ↑ "usecases" is underlined, links to Section 7

        ────────────────────────────────────

        [Try it now for free]  ← Primary CTA Button

        Free $2 credits included • No code needed • No subscription
```

### Elements

#### 3.1 Large Brand Name
| Property | Specification |
|----------|---------------|
| Text | "BREWCLAW" |
| Style | Large, bold, possibly stylized/ASCII art like IronClaw |
| Animation | Left-to-right shimmer effect on load |
| Size | Responsive, dominant |

#### 3.2 Primary Tagline
| Property | Specification |
|----------|---------------|
| Font size | `48px` desktop, `32px` mobile |
| Font weight | Bold |
| Color | `--text-inverse` (white on dark) |
| Max-width | `800px` |

#### 3.3 Sub-capabilities Row
| Property | Specification |
|----------|---------------|
| Layout | Horizontal, icon + text pairs |
| Separator | Bullet (•) or vertical line |
| Font size | `16px` |
| Color | `--text-secondary` |

**Capabilities:**
| Icon | Text |
|------|------|
| Pen/Write | Writes for you |
| Search/Magnify | Does research |
| Inbox | Clears inbox |
| Sun/Morning | Sends morning briefs |

#### 3.4 Platform Line
| Property | Specification |
|----------|---------------|
| Text | "On WhatsApp, Telegram, or wherever you are" |
| Style | "usecases" word underlined |
| Link | "usecases" scrolls to Section 7 |

#### 3.5 Hero CTA Button
| Property | Specification |
|----------|---------------|
| Text | "Try it now for free" |
| Size | Large (`56px` height) |
| Style | Filled, accent color, prominent |
| Link | `brewclaw.com/signup` |

#### 3.6 Trust Indicators
| Property | Specification |
|----------|---------------|
| Layout | Small text below CTA |
| Items | "Free $2 credits included • No code needed • No subscription" |
| Separator | Bullet (•) |

### Acceptance Criteria
- [ ] Brand name displays with shimmer animation on load
- [ ] Tagline is readable and properly responsive
- [ ] Sub-capabilities display with appropriate icons
- [ ] "usecases" text in platform line scrolls to Section 7
- [ ] CTA button redirects to signup funnel
- [ ] Trust indicators display below CTA
- [ ] Section maintains proper contrast ratios (WCAG AA)

### Copy
| Element | Copy |
|---------|------|
| Brand Display | BREWCLAW |
| Tagline | Deploy your personal AI assistant in the time it takes to brew a coffee |
| Capability 1 | Writes for you |
| Capability 2 | Does research |
| Capability 3 | Clears inbox |
| Capability 4 | Sends morning briefs |
| Platform Line | On WhatsApp, Telegram, or wherever you are |
| CTA | Try it now for free |
| Trust Line | Free $2 credits included • No code needed • No subscription |

---

## Section 4: Installation Process (4 Steps)

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Light (`--bg-light`) |
| Layout | Two columns: Steps (left) + Demo Video (right) |
| Steps style | Vertical timeline with numbered circles |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   >_ Up and running in 3 minutes                               │
│                                                                 │
│   ┌──────────────────────┐    ┌────────────────────────────┐   │
│   │                      │    │                            │   │
│   │  ① Sign Up          ●│    │    [Demo Video Player]    │   │
│   │     Create account   │    │                            │   │
│   │     instantly        │    │    Shows onboarding flow   │   │
│   │                      │    │    synced with steps       │   │
│   │  ② Connect Messenger │    │                            │   │
│   │     Telegram, WhatsApp│    │                            │   │
│   │     (coming soon)    │    │                            │   │
│   │                      │    │                            │   │
│   │  ③ Connect AI        │    │                            │   │
│   │     Use your API key │    │                            │   │
│   │     or buy tokens    │    │                            │   │
│   │                      │    │                            │   │
│   │  ④ Start Chatting   ●│    │                            │   │
│   │     Your AI is live  │    │                            │   │
│   │                      │    └────────────────────────────┘   │
│   └──────────────────────┘                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animation Behavior
| State | Behavior |
|-------|----------|
| Initial | Step 1 highlighted, others greyed |
| Progression | Each step highlights in sequence, synced with video |
| Active step | Full color + checkmark animation |
| Completed step | Checkmark icon, muted color |
| Upcoming step | Greyed out, number visible |

### Steps Detail

#### Step 1: Sign Up
| Property | Specification |
|----------|---------------|
| Number | 1 |
| Title | Sign Up |
| Description | Create your account with email. Instant provisioning. |
| Icon (complete) | Checkmark |

#### Step 2: Connect Messenger
| Property | Specification |
|----------|---------------|
| Number | 2 |
| Title | Connect Messenger |
| Description | Telegram, WhatsApp (coming soon) |
| Sub-note | Link your preferred messaging app securely |
| Icon (complete) | Checkmark |

#### Step 3: Connect AI
| Property | Specification |
|----------|---------------|
| Number | 3 |
| Title | Connect AI |
| Description | Use existing subscriptions / API key or buy tokens from us |
| Sub-note | Anthropic, OpenAI, Google, OpenRouter supported |
| Icon (complete) | Checkmark |

#### Step 4: Start Chatting
| Property | Specification |
|----------|---------------|
| Number | 4 |
| Title | Start Chatting |
| Description | Your personal AI comes online immediately |
| Icon (complete) | Checkmark with sparkle |

### Demo Video
| Property | Specification |
|----------|---------------|
| Position | Right side of steps |
| Aspect ratio | 16:9 or device mockup |
| Autoplay | Yes, on viewport entry |
| Sync | Video segments sync with step highlights |
| Content | Full onboarding flow walkthrough |

### Acceptance Criteria
- [ ] Section heading displays prominently
- [ ] 4 steps display in vertical timeline format
- [ ] Steps animate sequentially on scroll/time
- [ ] Video plays in sync with step progression
- [ ] Step 2 shows "WhatsApp (coming soon)" indicator
- [ ] Step 3 shows supported AI providers
- [ ] Responsive: stacks vertically on mobile

### Copy
| Element | Copy |
|---------|------|
| Section Title | >_ Up and running in 3 minutes |
| Step 1 Title | Sign Up |
| Step 1 Desc | Create your account with email. Instant provisioning. |
| Step 2 Title | Connect Messenger |
| Step 2 Desc | Telegram, WhatsApp (coming soon) |
| Step 2 Sub | Link your preferred messaging app securely |
| Step 3 Title | Connect AI |
| Step 3 Desc | Use existing subscriptions / API key or buy tokens from us |
| Step 3 Sub | Anthropic • OpenAI • Google • OpenRouter |
| Step 4 Title | Start Chatting |
| Step 4 Desc | Your personal AI comes online immediately |

---

## Section 5: Comparison (Traditional vs BrewClaw)

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Dark (`--bg-dark`) |
| Layout | Two columns side-by-side |
| Contrast | Traditional (negative) vs BrewClaw (positive) |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                        ── Comparison ──                         │
│                                                                 │
│         Traditional Method vs BrewClaw                          │
│                                                                 │
│   ┌───────────────────────┐    ┌───────────────────────────┐   │
│   │ Traditional           │    │ BrewClaw                  │   │
│   │                       │    │                           │   │
│   │ Purchasing VM    15min│    │ < Coffee brewing time    │   │
│   │ SSH keys         10min│    │                           │   │
│   │ Connecting SSH    5min│    │ Pick a model, connect     │   │
│   │ Installing Node   5min│    │ Telegram, deploy — done   │   │
│   │ Installing OC     7min│    │ under 1 minute.           │   │
│   │ Setting up OC    10min│    │                           │   │
│   │ Connecting AI     4min│    │ Servers, SSH, and         │   │
│   │ Pairing Telegram  4min│    │ environment are already   │   │
│   │ ──────────────────────│    │ set up, waiting for you.  │   │
│   │ Total           60 min│    │                           │   │
│   │                       │    │ Simple, secure, fast.     │   │
│   │ *Non-technical?       │    │                           │   │
│   │  Multiply by 10x      │    │                           │   │
│   └───────────────────────┘    └───────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Traditional Method Breakdown
| Step | Time |
|------|------|
| Purchasing local virtual machine | 15 min |
| Creating SSH keys and storing securely | 10 min |
| Connecting to the server via SSH | 5 min |
| Installing Node.js and NPM | 5 min |
| Installing OpenClaw | 7 min |
| Setting up OpenClaw | 10 min |
| Connecting to AI provider | 4 min |
| Pairing with Telegram | 4 min |
| **Total** | **60 min** |

*Footnote: If you're non-technical, multiply these times by 10 — you have to learn each step before doing.*

### BrewClaw Side
| Property | Value |
|----------|-------|
| Time headline | < Coffee brewing time |
| Description | Pick a model, connect Telegram, deploy — done under 1 minute. |
| Supporting text | Servers, SSH and OpenClaw Environment are already set up, waiting to get assigned. Simple, secure and fast connection to your bot. |

### Acceptance Criteria
- [ ] Section displays with "Comparison" label
- [ ] Two-column layout comparing methods
- [ ] Traditional shows itemized time breakdown totaling 60 min
- [ ] Non-technical multiplier note displays
- [ ] BrewClaw shows "< Coffee brewing time" prominently
- [ ] Visual contrast makes BrewClaw appear favorable
- [ ] Responsive: stacks on mobile

### Copy
| Element | Copy |
|---------|------|
| Section Label | Comparison |
| Section Title | Traditional Method vs BrewClaw |
| Traditional Total | 60 min |
| Traditional Note | If you're non-technical, multiply these times by 10 — you have to learn each step before doing. |
| BrewClaw Time | < Coffee brewing time |
| BrewClaw Desc | Pick a model, connect Telegram, deploy — done under 1 minute. |
| BrewClaw Support | Servers, SSH and OpenClaw Environment are already set up, waiting to get assigned. Simple, secure and fast connection to your bot. |

---

## Section 6: What You Get (5 Features)

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Light (`--bg-light`) or subtle gradient |
| Layout | Bento grid with mixed card sizes |
| Animation | Hover effects + micro-animations on select cards |

### Section Header
| Property | Specification |
|----------|---------------|
| Label | WHAT YOU GET |
| Title | Everything in one install |
| Subtitle | OpenClaw, ClawdBot, and MoltBot — configured and connected. No terminal commands, no config files. |

### Feature Cards Layout
```
┌────────────────────────────────────────────────────────────────┐
│   WHAT YOU GET                                                 │
│   Everything in one install                                    │
│                                                                │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│   │   Always     │ │   Secure     │ │  Lightning   │          │
│   │   Awake      │ │  by Default  │ │    Fast      │          │
│   │   [Clock]    │ │   [Shield]   │ │    [Bolt]    │          │
│   │ Your AI runs │ │ Data stays   │ │ One-click    │          │
│   │ 24/7, ready  │ │ on your      │ │ install. No  │          │
│   │ to respond   │ │ machine.E2E  │ │ config files │          │
│   └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                │
│   ┌─────────────────────┐ ┌─────────────────────────────┐     │
│   │  Every Messaging    │ │   Pick your AI Provider     │     │
│   │       App           │ │                             │     │
│   │   [Chat bubbles]    │ │  [Anthropic] [OpenAI]       │     │
│   │                     │ │  [Google]   [OpenRouter]    │     │
│   │ WhatsApp, Telegram, │ │                             │     │
│   │ Discord, Slack,     │ │ Choose what fits your       │     │
│   │ Signal, iMessage    │ │ needs and budget.           │     │
│   └─────────────────────┘ └─────────────────────────────┘     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Feature Cards Detail

#### Card 1: Always Awake (24/7)
| Property | Specification |
|----------|---------------|
| Size | Small (1x1) |
| Icon | Clock / Moon+Sun |
| Title | Always Awake |
| Description | Your AI runs 24/7, ready to respond whenever you or your contacts need it. |
| Animation | Subtle pulse on icon |

#### Card 2: Secure by Default (Privacy First)
| Property | Specification |
|----------|---------------|
| Size | Small (1x1) |
| Icon | Shield / Lock |
| Title | Secure by Default |
| Description | Your data stays on your machine. End-to-end encryption where supported. |
| Animation | Terminal showing "LOGGING DISABLED..." |

#### Card 3: Lightning Fast
| Property | Specification |
|----------|---------------|
| Size | Small (1x1) |
| Icon | Lightning bolt / Sparkle |
| Title | Lightning Fast |
| Description | One-click install. No terminal commands, no config files. Just download and run. |
| Animation | Sparkle effect |

#### Card 4: Every Messaging App
| Property | Specification |
|----------|---------------|
| Size | Medium (2x1) |
| Icons | WhatsApp, Telegram, Discord, Slack, Signal logos |
| Title | Every Messaging App |
| Description | WhatsApp, Telegram, Discord, Slack, Signal, iMessage — all connected through one interface. |
| Animation | Icons floating/orbiting |

#### Card 5: Pick Your AI Provider
| Property | Specification |
|----------|---------------|
| Size | Medium (2x1) |
| Icons | Anthropic, OpenAI, Google, OpenRouter logos |
| Title | Pick your AI Provider |
| Description | Anthropic, OpenAI, Google, or OpenRouter. Choose what fits your needs and budget. |
| Animation | Provider cards shuffle subtly |

### Acceptance Criteria
- [ ] Section header displays with label, title, subtitle
- [ ] 5 feature cards display in bento grid layout
- [ ] Each card has icon, title, description
- [ ] Designated cards have micro-animations
- [ ] Card 4 shows messenger app logos
- [ ] Card 5 shows AI provider logos
- [ ] Responsive: cards reflow on mobile

### Copy
| Element | Copy |
|---------|------|
| Section Label | WHAT YOU GET |
| Section Title | Everything in one install |
| Section Subtitle | OpenClaw, ClawdBot, and MoltBot — configured and connected. No terminal commands, no config files. |
| Card 1 Title | Always Awake |
| Card 1 Desc | Your AI runs 24/7, ready to respond whenever you or your contacts need it. |
| Card 2 Title | Secure by Default |
| Card 2 Desc | Your data stays on your machine. End-to-end encryption where supported. |
| Card 3 Title | Lightning Fast |
| Card 3 Desc | One-click install. No terminal commands, no config files. Just download and run. |
| Card 4 Title | Every Messaging App |
| Card 4 Desc | WhatsApp, Telegram, Discord, Slack, Signal, iMessage — all connected through one interface. |
| Card 5 Title | Pick your AI Provider |
| Card 5 Desc | Anthropic, OpenAI, Google, or OpenRouter. Choose what fits your needs and budget. |

---

## Section 7: What Can BrewClaw Do For You? (Use Cases Marquee)

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Dark or gradient |
| Layout | Full-width, two horizontal scrolling rows |
| Animation | Continuous scroll, opposite directions |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              What can BrewClaw do for you?                      │
│            One assistant, thousands of use cases                │
│                                                                 │
│   ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←    │
│   [Read email] [Draft replies] [Translate] [Organize inbox]... │
│                                                                 │
│   → → → → → → → → → → → → → → → → → → → → → → → → → → → →    │
│   [Do taxes] [Track expenses] [Find prices] [Set reminders]... │
│                                                                 │
│              PS. You can add as many use cases as you           │
│              want via natural language                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animation Behavior
| Property | Specification |
|----------|---------------|
| Row 1 direction | Right to left (← ←) |
| Row 2 direction | Left to right (→ →) |
| Speed | Slow, readable (~30px/second) |
| Pause on hover | Yes, pauses the hovered row |
| Loop | Infinite seamless |

### Use Case Pills (Full List)

**Row 1 (moves left):**
| Emoji/Icon | Use Case |
|------------|----------|
| ✉️ | Read & summarize email |
| 📝 | Draft replies and follow-ups |
| 🌐 | Translate messages in real time |
| 📥 | Organize your inbox |
| 🎫 | Answer support tickets |
| 📄 | Summarize long documents |
| 🔔 | Notify before a meeting |
| 📅 | Schedule meetings from chat |
| ⏰ | Remind you of deadlines |
| 📋 | Plan your week |

**Row 2 (moves right):**
| Emoji/Icon | Use Case |
|------------|----------|
| 📊 | Do your taxes |
| 🧾 | Track expenses and receipts |
| 🏥 | Compare insurance quotes |
| 💳 | Manage subscriptions |
| 🏷️ | Find discount codes |
| 📉 | Price-drop alerts |
| 🔍 | Find best prices online |
| 📊 | Compare product specs |
| 🤝 | Negotiate deals |
| 🧳 | Book travel and hotels |
| 🍳 | Find recipes from ingredients |
| 📱 | Draft social posts |
| 📰 | Monitor news and alerts |
| 🎯 | Set and track goals |
| 📧 | Screen cold outreach |
| 📋 | Draft job descriptions |
| 📢 | Run standup summaries |

### Clickable Behavior
| Property | Specification |
|----------|---------------|
| On click | Opens modal/popup with demo video for that use case |
| Video source | Specific video per use case (to be created) |
| Modal style | Centered overlay with close button |

### Acceptance Criteria
- [ ] Section header displays centered
- [ ] Two rows of use case pills scroll continuously
- [ ] Rows move in opposite directions
- [ ] Scrolling pauses on hover
- [ ] Each pill is clickable
- [ ] Clicking opens video popup for that use case
- [ ] Footnote about natural language displays below
- [ ] Smooth, seamless infinite loop

### Copy
| Element | Copy |
|---------|------|
| Section Title | What can BrewClaw do for you? |
| Section Subtitle | One assistant, thousands of use cases |
| Footnote | PS. You can add as many use cases as you want via natural language |

---

## Section 8: Skills Store

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Light (`--bg-light`) |
| Layout | Header + Embedded skills directory preview |
| Interactivity | Static for Phase 1 (interactive in Phase 2) |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│   SKILLS STORE                                                  │
│   Extend your agent with one command                           │
│                                                                 │
│   Browse skills from skills.sh and ClawHub. Install any skill  │
│   with a single command — your agent learns new capabilities   │
│   instantly.                                                    │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 🔧 Skills Directory  [58,237 skills]     [🔍 Search]    │  │
│   │                                                          │  │
│   │ [All] [Sales] [CRM] [Browser] [Frontend] [DevOps] [ML] │  │
│   │                                                          │  │
│   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │  │
│   │ │crm-automation│ │linkedin-     │ │lead-         │      │  │
│   │ │    ↗️        │ │outreach ↗️   │ │enrichment ↗️ │      │  │
│   │ │CRM workflow  │ │LinkedIn      │ │Enrich        │      │  │
│   │ │automation... │ │prospecting...│ │contacts...   │      │  │
│   │ └──────────────┘ └──────────────┘ └──────────────┘      │  │
│   │                                                          │  │
│   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │  │
│   │ │email-        │ │sales-        │ │agent-        │      │  │
│   │ │sequences ↗️  │ │pipeline ↗️   │ │browser ↗️    │      │  │
│   │ │Multi-step    │ │Track deals   │ │Browser auto  │      │  │
│   │ │cold email... │ │through...    │ │and scraping..│      │  │
│   │ └──────────────┘ └──────────────┘ └──────────────┘      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### Header
| Property | Specification |
|----------|---------------|
| Label | SKILLS STORE |
| Title | Extend your agent with one command |
| Description | Browse skills from skills.sh and ClawHub. Install any skill with a single command — your agent learns new capabilities instantly. |

#### Skills Preview (Static for Phase 1)
| Property | Specification |
|----------|---------------|
| Layout | Grid of skill cards (3x2 or 3x3) |
| Categories shown | All, Sales, CRM, Browser, Frontend, DevOps, ML |
| Cards shown | 6-9 sample skills |
| Interactivity | Static display (Phase 2: clickable) |

### Sample Skills to Display
| Skill Name | Category | Description |
|------------|----------|-------------|
| crm-automation | CRM | CRM workflow automation, lead scoring, pipeline management |
| linkedin-outreach | Sales | Automated LinkedIn prospecting, connection requests, follow-ups |
| lead-enrichment | Sales | Enrich contacts with LinkedIn, email, company data |
| email-sequences | Email | Multi-step cold email campaigns with personalization |
| sales-pipeline | CRM | Track deals through stages with automated status updates |
| agent-browser | Browser | Browser automation and web scraping capabilities |
| web-design-guidelines | Frontend | Best practices for modern web design |
| frontend-design | Frontend | Expert frontend engineering patterns and component design |
| browser-use | Browser | Control Chrome programmatically — click, type, navigate |

### Acceptance Criteria
- [ ] Section header displays with label, title, description
- [ ] Skills directory preview displays as embedded component
- [ ] Category tabs display (non-functional in Phase 1)
- [ ] 6-9 skill cards display in grid
- [ ] Each card shows name, category tag, description preview
- [ ] Phase 2: Cards become clickable with skill details
- [ ] Responsive: Grid adjusts to screen size

### Copy
| Element | Copy |
|---------|------|
| Section Label | SKILLS STORE |
| Section Title | Extend your agent with one command |
| Section Desc | Browse skills from skills.sh and ClawHub. Install any skill with a single command — your agent learns new capabilities instantly. |
| Skills count | 58,237 skills |

---

## Section 9: Batch / Seats Counter

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Dark with cosmic/space theme or gradient |
| Layout | Centered, single column |
| Mood | Urgency, exclusivity |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                     [Dark cosmic background]                    │
│                                                                 │
│        ┌────────────────────┐ ┌─────────────────────┐          │
│        │  you@email.com     │ │  GET EARLY ACCESS → │          │
│        └────────────────────┘ └─────────────────────┘          │
│                                                                 │
│                          1,100                                  │
│                    PEOPLE SIGNED UP                             │
│                                                                 │
│        ═══════════════════════════════════════════             │
│        |  Batch 1 (50)  |  Batch 2 (350)  | Batch 3 (700) |    │
│                                                                 │
│              Batch 3 filling up — 19 spots left                │
│                                                                 │
│        [✓ Batch 1 full] [✓ Batch 2 full] [Batch 3 - 19 left]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### Email Input + CTA
| Property | Specification |
|----------|---------------|
| Input placeholder | you@email.com |
| Button text | GET EARLY ACCESS → |
| Button link | `brewclaw.com/signup?source=batch` |
| Style | Dark input, accent button |

#### Counter Display
| Property | Specification |
|----------|---------------|
| Number | Dynamic count (e.g., 1,100) |
| Label | PEOPLE SIGNED UP |
| Style | Large number, monospace or bold |
| Animation | Count-up animation on viewport entry |

#### Progress Bar
| Property | Specification |
|----------|---------------|
| Style | Segmented progress bar |
| Segments | Batch 1 (50) → Batch 2 (350) → Batch 3 (700) |
| Colors | Filled segments = accent, unfilled = muted |
| Markers | Vertical lines at batch boundaries |

#### Batch Status Tags
| Property | Specification |
|----------|---------------|
| Batch 1 | "✓ Batch 1 full" (green checkmark) |
| Batch 2 | "✓ Batch 2 full" (green checkmark) |
| Batch 3 | "Batch 3 - [X] spots left" (accent color) |

#### Urgency Message
| Property | Specification |
|----------|---------------|
| Text | "Batch 3 filling up — [X] spots left" |
| Color | Accent/warning (orange/red) |
| Animation | Subtle pulse or none |

### Acceptance Criteria
- [ ] Email input field displays with placeholder
- [ ] CTA button submits to signup funnel with batch source
- [ ] People count displays with count-up animation
- [ ] Progress bar shows batch fill status accurately
- [ ] Batch status tags show full/remaining status
- [ ] Urgency message displays with remaining seats
- [ ] Phase 2: Counter connects to live database

### Copy
| Element | Copy |
|---------|------|
| Input Placeholder | you@email.com |
| CTA Button | GET EARLY ACCESS → |
| Counter Label | PEOPLE SIGNED UP |
| Batch 1 Status | ✓ Batch 1 full |
| Batch 2 Status | ✓ Batch 2 full |
| Batch 3 Status | Batch 3 - {X} spots left |
| Urgency Line | Batch 3 filling up — {X} spots left |

---

## Section 10: Pricing

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Light (`--bg-light`) or subtle gradient |
| Layout | Centered title + 3-column pricing cards |
| Highlight | Middle tier (Pro) highlighted as "BEST VALUE" |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  Simple, flexible pricing                       │
│      Choose the plan that fits your needs. Whether you're      │
│      just starting or need heavy-duty AI power, we have        │
│      an option for you.                                         │
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   POPULAR   │    │  BEST VALUE │    │  MULTIAGENT │        │
│   │   Basic     │    │    Pro      │    │    Ultra    │        │
│   │             │    │             │    │             │        │
│   │   $30/mo    │    │   $60/mo    │    │   $200/mo   │        │
│   │             │    │             │    │             │        │
│   │ ✓ Full agent│    │ ✓ More AI   │    │ ✓ Up to 3   │        │
│   │   abilities │    │   credits   │    │   parallel  │        │
│   │ ✓ Full Linux│    │ ✓ Better    │    │   agents    │        │
│   │   environ.  │    │   perform.  │    │ ✓ Ideal for │        │
│   │ ✓ Great for │    │ ✓ Works     │    │   intense   │        │
│   │   simple    │    │   best for  │    │   workflows │        │
│   │   tasks     │    │   most      │    │ ✓ Best for  │        │
│   │             │    │   people    │    │   advanced  │        │
│   │ ──────────  │    │ ──────────  │    │ ──────────  │        │
│   │ AGENT       │    │ AGENT       │    │ COMBINED    │        │
│   │ RESOURCES   │    │ RESOURCES   │    │ AGENT RES.  │        │
│   │ 1vCPU  2GB  │    │ 2vCPU  2GB  │    │ 6vCPU  6GB  │        │
│   │       10GB  │    │       20GB  │    │       60GB  │        │
│   │             │    │             │    │             │        │
│   │[Get Started]│    │[Get Started]│    │[Get Started]│        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pricing Tiers

#### Basic - $30/mo
| Property | Specification |
|----------|---------------|
| Badge | POPULAR |
| Price | $30/mo |
| Description | For casual personal use. Includes limited AI credits. |
| Features | ✓ Full Agent abilities, ✓ Full Linux environment, ✓ Great for simple tasks |
| Resources | 1 vCPU, 2 GB RAM, 10 GB Storage |
| CTA | Get Started |
| CTA Link | `brewclaw.com/signup?plan=basic` |

#### Pro - $60/mo (Highlighted)
| Property | Specification |
|----------|---------------|
| Badge | BEST VALUE |
| Price | $60/mo |
| Description | For power users. With increased limits and agent resources. |
| Features | ✓ More AI credits, ✓ Better performance, ✓ Works best for most people |
| Resources | 2 vCPU, 2 GB RAM, 20 GB Storage |
| CTA | Get Started |
| CTA Link | `brewclaw.com/signup?plan=pro` |
| Highlight | Border accent color, slight elevation |

#### Ultra - $200/mo
| Property | Specification |
|----------|---------------|
| Badge | MULTIAGENT |
| Price | $200/mo |
| Description | For teams and heavy usage. Manage multiple agents you can share with your team. |
| Features | ✓ Up to 3 parallel agents, ✓ Ideal for intense workflows, ✓ Best for advanced models |
| Resources | 6 vCPU, 6 GB RAM, 60 GB Storage |
| CTA | Get Started |
| CTA Link | `brewclaw.com/signup?plan=ultra` |

### Acceptance Criteria
- [ ] Section heading and subheading display centered
- [ ] 3 pricing cards display in row (responsive: stack on mobile)
- [ ] Each card shows badge, name, price, description, features, resources
- [ ] Pro tier is visually highlighted
- [ ] CTA buttons link to signup with plan parameter
- [ ] Resource specs display clearly
- [ ] Pricing toggles (monthly/annual) - Phase 2

### Copy
| Element | Copy |
|---------|------|
| Section Title | Simple, flexible pricing |
| Section Subtitle | Choose the plan that fits your needs. Whether you're just starting or need heavy-duty AI power, we have an option for you. |
| Basic Badge | POPULAR |
| Basic Name | Basic |
| Basic Price | $30/mo |
| Basic Desc | For casual personal use. Includes limited AI credits. |
| Pro Badge | BEST VALUE |
| Pro Name | Pro |
| Pro Price | $60/mo |
| Pro Desc | For power users. With increased limits and agent resources. |
| Ultra Badge | MULTIAGENT |
| Ultra Name | Ultra |
| Ultra Price | $200/mo |
| Ultra Desc | For teams and heavy usage. Manage multiple agents you can share with your team. |
| CTA (all) | Get Started |

---

## Section 11: Final CTA

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Gradient or solid accent |
| Layout | Centered, attention-grabbing |
| Mood | Encouraging, final push |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Ready to get started?                        │
│                                                                 │
│          Download BrewClaw and set up your AI in seconds.      │
│                                                                 │
│                  ┌──────────────────────────┐                   │
│                  │   Try it now for free    │                   │
│                  └──────────────────────────┘                   │
│                                                                 │
│                        More options →                           │
│                                                                 │
│             New users get $2 credits included!                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### Main Headline
| Property | Specification |
|----------|---------------|
| Text | Ready to get started? |
| Size | Large (48px desktop) |
| Weight | Bold |

#### Supporting Text
| Property | Specification |
|----------|---------------|
| Text | Download BrewClaw and set up your AI in seconds. |
| Size | Medium (20px) |
| Color | Slightly muted |

#### Primary CTA Button
| Property | Specification |
|----------|---------------|
| Text | Try it now for free |
| Size | Large, prominent |
| Style | Filled, contrasting with background |
| Link | `brewclaw.com/signup` |
| Hover | Scale + glow effect |

#### Secondary Link
| Property | Specification |
|----------|---------------|
| Text | More options → |
| Style | Text link with arrow |
| Link | Scroll to Pricing section OR `brewclaw.com/pricing` |

#### Incentive Text
| Property | Specification |
|----------|---------------|
| Text | New users get $2 credits included! |
| Style | Accent color, slightly smaller |

### Acceptance Criteria
- [ ] Headline displays prominently
- [ ] Supporting text displays below
- [ ] Primary CTA button links to signup
- [ ] "More options" link scrolls to pricing
- [ ] Incentive text displays with accent styling
- [ ] Section has visual distinction (background/gradient)

### Copy
| Element | Copy |
|---------|------|
| Headline | Ready to get started? |
| Supporting | Download BrewClaw and set up your AI in seconds. |
| CTA | Try it now for free |
| Secondary Link | More options → |
| Incentive | New users get $2 credits included! |

---

## Section 12: Footer

### Design Specifications
| Property | Value |
|----------|-------|
| Background | Dark (`--bg-dark`) or continuation of CTA |
| Layout | Minimal, centered |
| Height | Compact |

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               Built with ❤️ by Divy Kairoth                     │
│                        ↑ links to LinkedIn                      │
│                                                                 │
│                   [📧 Contact Support]                          │
│                        ↑ opens email                            │
│                                                                 │
│                     © 2025 BrewClaw                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### Credit Line
| Property | Specification |
|----------|---------------|
| Text | Built with ❤️ by Divy Kairoth |
| Link | `https://linkedin.com/in/divy-kairoth` |
| Target | `_blank` (new tab) |

#### Contact Button
| Property | Specification |
|----------|---------------|
| Text | 📧 Contact Support |
| Link | `mailto:divykairoth@gmail.com?subject=brewclaw:%20` |
| Style | Text link or small button |

#### Copyright
| Property | Specification |
|----------|---------------|
| Text | © 2025 BrewClaw |
| Style | Small, muted text |

### Acceptance Criteria
- [ ] Credit line displays with link to LinkedIn
- [ ] Contact support opens email client with prefilled subject
- [ ] Copyright displays current year
- [ ] Footer is visually minimal
- [ ] Links open correctly

### Copy
| Element | Copy |
|---------|------|
| Credit | Built with ❤️ by Divy Kairoth |
| Contact | 📧 Contact Support |
| Copyright | © 2025 BrewClaw |

---

## Master Link Reference Table

| Section | Element | Link/Action |
|---------|---------|-------------|
| Nav | Logo | `brewclaw.com` |
| Nav | Features > Use Cases | Scroll to Section 7 |
| Nav | Features > Skills Store | Scroll to Section 8 |
| Nav | Pricing | Scroll to Section 10 |
| Nav | Docs | Disabled (Phase 2: docs.brewclaw.com) |
| Nav | CTA | `brewclaw.com/signup` |
| Chip | "Powered by OpenClaw" | OpenClaw website/repo |
| Chip | Registration count | Scroll to Section 9 |
| Chip | Seats left | Scroll to Section 9 |
| Hero | "usecases" underline | Scroll to Section 7 |
| Hero | CTA | `brewclaw.com/signup` |
| Section 7 | Use case pill click | Open video modal |
| Section 9 | Email CTA | `brewclaw.com/signup?source=batch` |
| Section 10 | Basic CTA | `brewclaw.com/signup?plan=basic` |
| Section 10 | Pro CTA | `brewclaw.com/signup?plan=pro` |
| Section 10 | Ultra CTA | `brewclaw.com/signup?plan=ultra` |
| Section 11 | Primary CTA | `brewclaw.com/signup` |
| Section 11 | More options | Scroll to Section 10 |
| Footer | Divy Kairoth | `https://linkedin.com/in/divy-kairoth` |
| Footer | Contact Support | `mailto:divykairoth@gmail.com?subject=brewclaw:%20` |

---

## Phase 2 Items (Out of Scope for Phase 1)

| Item | Description |
|------|-------------|
| Docs | Full documentation site at docs.brewclaw.com |
| WhatsApp | WhatsApp messenger integration |
| Skills Store Interactive | Clickable skill cards with detail views |
| Live Counter | Real-time database connection for signup counts |
| Annual Pricing Toggle | Monthly vs Annual pricing switch |
| Social Proof | Testimonials and company logos |
| Blog | Content marketing section |
| FAQs | Separate FAQ section in docs |

---

## Appendix: Animation Specifications

### Shimmer Effect (Hero Brand Name)
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}
```

### Chip Rotation
```css
@keyframes slideUp {
  0% { transform: translateY(100%); opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}
```

### Marquee Scroll
```css
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
```

---

*Document Version: 1.0*
*Last Updated: February 2025*
*Author: Claude (AI-assisted)*
*Owner: Divy Kairoth*
