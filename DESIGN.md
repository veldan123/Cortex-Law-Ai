---
name: PrismStatic.web
description: Singapore web agency portfolio — bold, sharp, premium
colors:
  bg: "#080808"
  surface-1: "#111111"
  surface-2: "#181818"
  ink: "#ffffff"
  brand-purple: "#8b5cf6"
  brand-blue: "#3b82f6"
  brand-cyan: "#06b6d4"
  success: "#22c55e"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6.5rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  pill: "100px"
  card: "16px"
  input: "10px"
  icon: "10px"
spacing:
  content-max: "1300px"
  content-pad: "48px"
  section-v: "clamp(80px, 12vw, 160px)"
  nav-h: "70px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.brand-purple}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  input-default:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "14px 16px"
  input-focus:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "14px 16px"
---

# Design System: PrismStatic.web

## 1. Overview

**Creative North Star: "The Precision Studio"**

PrismStatic.web is a dark room with precise instruments. Every surface is near-black, every action is deliberate, every animation is controlled. The site doesn't pitch—it demonstrates. A prospect arrives skeptical and leaves convinced, not because of what was said, but because of what was built. The site is the proof.

The palette is almost achromatic. Three surface steps (Forge Black → Carbon → Ash) give depth without decoration. A single tri-color gradient arc—violet through blue to cyan—is the only saturated presence; it appears where it earns attention and nowhere else. Motion is expo-out: springs snap into position, page transitions slide like heavy panels, and the custom cursor lags behind the pointer with a measured 11% follow coefficient that reads as physical weight.

This system explicitly rejects: the AI-agency aesthetic (cream backgrounds, eyebrow labels above every section, gradient text in headings, 01/02/03 section markers, identical icon-card grids, hero stat blocks). It also rejects the editorial-typographic lane (Fraunces italic + mono labels + broadsheet grid). PrismStatic.web is not a magazine, not a SaaS dashboard, not a freelance marketplace profile. It is a precision studio.

**Key Characteristics:**
- Near-absolute dark, three-layer surface system
- One gradient arc (violet → blue → cyan), used as highlight only
- Single typeface (Inter), extreme weight contrast (900 display vs 400 body)
- Cursor-driven interactivity: magnetic CTAs, lagging ring cursor, card tilt
- Expo-out easing throughout; no bounce, no elastic
- SVG icons only, no emoji anywhere

## 2. Colors: The Forge Palette

A near-monochrome dark system with one saturated accent. Restraint is the point; the gradient arc earns its place because nothing else is fighting for attention.

### Primary
- **Spectrum Arc — Violet** (`#8b5cf6`): The leading stop of the brand gradient. Used as a solo accent color where the full gradient can't be applied (focus states, icon glows, active underlines). Never used as a fill on large surfaces.
- **Spectrum Arc — Blue** (`#3b82f6`): Mid-stop of the brand gradient. Appears only within the gradient sequence, never as a standalone fill.
- **Spectrum Arc — Cyan** (`#06b6d4`): Trailing stop. The gradient always runs left-to-right at 135°: violet → blue → cyan. Never reversed.

### Neutral
- **Forge Black** (`#080808`): Page background. Near-absolute dark with the faintest chroma. The floor everything sits on.
- **Carbon Surface** (`#111111`): Primary elevated surface. Nav background (on scroll), service rows, cards at rest.
- **Ash Surface** (`#181818`): Secondary elevated surface. Nested panels, hover backgrounds on list items.
- **Studio White** (`#ffffff`): Primary text and primary button fill. Full opacity only; never tinted.
- **Dim White** (`rgba(255,255,255,0.42)`, composited ≈ `#6f6f6f`): Secondary body text. Nav links at rest, paragraph copy, contact detail values.
- **Ghost White** (`rgba(255,255,255,0.16)`, composited ≈ `#2f2f2f`): Placeholder text, disabled labels, the lowest tier of visible text.
- **Hairline Border** (`rgba(255,255,255,0.07)`): Dividers, card borders at rest.
- **Definition Border** (`rgba(255,255,255,0.13)`): Card borders on hover, focused form fields at rest.

### Functional
- **Signal Green** (`#22c55e`): Form success state, WhatsApp FAB. Used nowhere else.

### Named Rules
**The One Arc Rule.** The violet-blue-cyan gradient (`linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)`) is the only saturated presence in the system. It may appear as a loader fill, a button hover background, a progress bar, or a highlight on a key word. It may not appear as a decorative stripe, a card background, or a page-section fill. Its rarity is the point.

**The Forge Rule.** Surfaces layer in three steps: `#080808` → `#111111` → `#181818`. Never lighter than Ash Surface for an elevated component. Never a fourth layer.

## 3. Typography

**Display / Body Font:** Inter (variable `opsz` axis, weights 400–900)

**Character:** A single family pushed to extremes. 900-weight display copy is compressed and loud; 400-weight body copy breathes at 1.7 line-height. The contrast between these two poles is the typographic identity. No second family is needed because the range within Inter covers every role.

### Hierarchy
- **Display** (900, `clamp(3rem, 7vw, 6.5rem)`, line-height 0.95, letter-spacing -0.045em): Hero headings only. The compressed tracking at this weight creates visual mass without needing a second font.
- **Headline** (800, `clamp(1.8rem, 4vw, 3.5rem)`, line-height 1.05, letter-spacing -0.03em): Page-section headings, work card titles.
- **Title** (700, `clamp(1.1rem, 2vw, 1.4rem)`, line-height 1.3, letter-spacing -0.02em): Sub-section headings, service names, card sub-titles.
- **Body** (400–500, 0.875–1rem, line-height 1.7): Paragraph copy. Keep to 65ch max.
- **Label** (700, 0.68rem, letter-spacing 0.12em, uppercase): Metadata only: price tags, category tags, form field labels, loading percentage. Short strings only — never a full sentence in label type.

### Named Rules
**The Compression Rule.** Display headings use line-height 0.95 and letter-spacing -0.045em. At 900 weight these are the floor; go tighter and letters touch. Go looser and the mass dissolves. Don't adjust these values.

**The Weight-Only Hierarchy Rule.** Hierarchy is expressed through weight (400 → 700 → 800 → 900) and size. Never through color steps — don't make a heading purple or a subheading dimmed-white to create hierarchy. Weight and size only.

## 4. Elevation

Flat by default. No box-shadows at rest. Depth is communicated through the three-step surface system (Forge Black / Carbon / Ash) and border transparency. Shadows appear only as state changes, not as decorative structure.

### Shadow Vocabulary
- **Tonal Lift** (no shadow, background shifts from `#080808` to `#111111`): Cards, panels, and list items at hover. The lift is a background step, not a shadow.
- **Ambient Glow** (`0 0 0 0 → 0 0 0 14px` pulsing rgba of brand color): WhatsApp FAB ring animation only. Not a structural shadow; a pulse that draws attention to the single FAB.
- **Nav Blur** (`backdrop-filter: blur(24px)` with `rgba(8,8,8,0.88)` background): Nav bar on scroll only. Conveys that the nav has elevated above the page.

### Named Rules
**The No-Shadow Rule.** No `box-shadow` on cards, panels, or any resting-state component. The surface system (three background steps) conveys depth. Shadows are reserved for the pulse animation and the nav blur; nothing else gets them.

## 5. Components

### Buttons
The button is the primary conversion touchpoint. It behaves physically: it attracts the cursor and responds to it.

- **Shape:** Full pill (`border-radius: 100px`). No compromise. Rounded-rectangle buttons are not this system.
- **Primary:** White fill (`#fff`), dark text (`#080808`), padding `14px 32px`, weight 700. On hover, a pseudo-element (`::before`) with the brand gradient fades in (`opacity: 0 → 1`) under the text, which simultaneously shifts from dark (`#0a0a0a`) to white. The transition is `opacity 0.3s`, not a background-color transition.
- **Magnetic behavior:** On `mousemove`, the button translates toward the cursor by 30% of the offset distance. On `mouseleave`, it springs back with `transition: 0.5s cubic-bezier(0.16,1,0.3,1)`. This behavior is reserved for primary CTAs only.
- **Submit / Form CTA:** Same as primary, but full-width, centered, with an arrow icon that translates `+4px` on hover.
- **No secondary/ghost buttons as interactive CTAs.** Text links serve secondary actions. Ghost buttons appear in nav only.

### Navigation
- **Default state:** Transparent background, no border.
- **Scrolled state (`.sc`):** `rgba(8,8,8,0.88)` background + `backdrop-filter: blur(24px)` + `border-bottom: 1px solid rgba(255,255,255,0.07)`. Triggered at `scrollY > 40`.
- **Nav links:** 0.875rem, weight 500, `rgba(255,255,255,0.42)` at rest. Hover and active: `#fff`. Underline reveal: `scaleX(0 → 1)` from left origin on hover.
- **Active page link:** white color + underline always visible.
- **Mobile menu:** Full-screen overlay (`background: #080808`), slides in from right. Hamburger animates to ×. Links are 2.8rem / 800-weight.

### Cards / Work Items
- **Border:** `1.5px solid rgba(255,255,255,0.09)` at rest; `rgba(255,255,255,0.18)` on hover.
- **Background:** `#111` at rest; subtle lightening on hover.
- **Corner radius:** `16px`.
- **3D tilt:** On `mousemove`, applies `perspective(900px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateZ(10px)`. Springs back on `mouseleave`. The tilt multiplier (7°) is the ceiling — never higher.
- **Hover overlay:** Semi-transparent dark layer fades in; a pill button animates up from `translateY(12px) opacity:0 → translateY(0) opacity:1`.

### Form Inputs
- **Background:** `#111` (Carbon Surface).
- **Border:** `1.5px solid rgba(255,255,255,0.07)` at rest.
- **Focus:** Border shifts to `rgba(139,92,246,0.6)`, background to `rgba(139,92,246,0.04)`. The only place the brand purple appears as a UI state color (not just as an accent).
- **Placeholder:** `rgba(255,255,255,0.16)` (Ghost White). Must still pass 4.5:1 contrast — on `#111` this is marginal; keep at or above this opacity.
- **Corner radius:** `10px`.

### Page Loader
- Brand name centered, large (1.6rem, weight 800). The `.web` suffix uses the brand gradient.
- Progress bar: 220px wide, 1px tall, gradient fill that increments randomly (not linearly).
- Exits by translating `translateY(-100%)` over 0.9s with the custom ease.

### Custom Cursor
- **Dot:** 6px solid white, `border-radius: 50%`, instant follow. Scales to 0 on hover.
- **Ring:** 38px, `1.5px solid rgba(255,255,255,0.35)`. Lags with 11% follow coefficient (`rx += (mx - rx) * 0.11`) in a RAF loop. Scales to 64px and shifts to `rgba(139,92,246,0.6)` on interactive element hover.
- **Cursor is part of the brand.** It signals interactivity before the user touches the element. Never omit it.

## 6. Do's and Don'ts

### Do:
- **Do** use the brand gradient (`135deg, #8b5cf6 → #3b82f6 → #06b6d4`) as a button hover fill, loader bar, or single-word highlight via `background-clip: text` — only where it earns emphasis.
- **Do** use surface layering (`#080808 → #111 → #181818`) to create depth. The three-step system is the elevation model.
- **Do** compress display headings: weight 900, line-height 0.95, letter-spacing -0.045em. This is the typographic identity.
- **Do** apply the magnetic push behavior exclusively to primary CTAs. If everything is magnetic, nothing is.
- **Do** use the custom expo-out ease `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions. This is the system easing; don't mix in `ease` or `ease-in-out`.
- **Do** wrap reveal-animated headings in `overflow: hidden` containers. The text is always present in the DOM; the animation enhances a visible default.
- **Do** include `@media (prefers-reduced-motion: reduce)` alternatives that skip the motion but preserve the final state.
- **Do** use SVG icons at 18–24px stroke-width 1.5, `stroke-linecap: round; stroke-linejoin: round`. No icon fonts, no emoji.

### Don't:
- **Don't** use the brand gradient as a text fill (`background-clip: text; -webkit-text-fill-color: transparent`) except for the site logo and a single hero emphasis word. Gradient text in headings, price tags, service titles, or CTAs is an AI-agency tell — exactly what PRODUCT.md names as the primary anti-reference.
- **Don't** put small-caps tracked labels (`text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.7rem`) above every section heading. One deliberate label in a specific context is voice; a label on every section is AI scaffolding.
- **Don't** use numbered section markers (01, 02, 03) as decorative dividers. Numbers are for ordered sequences only.
- **Don't** build identical icon + heading + text card grids. If cards are needed, differentiate them by size, content density, or visual treatment.
- **Don't** put hero stat blocks ("40+ projects delivered", "99% satisfaction") with big numbers and small labels. This is the hero-metric template—a SaaS cliché.
- **Don't** use a warm-neutral or cream background. The page is `#080808`. There is no light-mode version.
- **Don't** use `box-shadow` on resting-state cards or panels. The surface system handles depth; shadows at rest signal a different system.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any element. Full borders, background tints, or nothing.
- **Don't** use elastic or bounce easing (`cubic-bezier` values that overshoot 1). The system easing is expo-out only.
- **Don't** add a fourth surface level lighter than `#181818`. The three-step ceiling is a hard constraint.
