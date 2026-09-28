# Design System: MapDelta

## 1. Visual Theme & Atmosphere
Quiet and typographic, with a single green family for colour. Apple product-page restraint with OpenAI-style calm: warm off-white canvas, hairline structure, one confident black for action. Density is gallery-airy (3/10), variance is offset (6/10: sticky left headings against right-hand content, split hero), motion is fluid CSS (4/10: short fade-and-rise, one line-draw, one breathing status dot). Trust comes from clarity, not decoration.

## 2. Color Palette & Roles
- **Warm Canvas** (#FAFAF9): page background
- **Pure Surface** (#FFFFFF): cards, form, alternate sections
- **Ink** (#0A0A0A): primary text, primary buttons, featured-plan border
- **Graphite** (#6B6B6B): secondary copy, labels, captions (5.2:1 on canvas)
- **Hairline** (#E7E5E4): every border and divider; **Hairline Strong** (#D6D3D1) for inputs and secondary buttons
- **Night** (#0B0B0C) with **Bone** (#F5F5F4) text: the sample-report section only
- **Compliance Green** (#0E9F6E): dots, lines, and fills for positive/compliant states. Text uses the AA-safe **Deep Green** (#0A7A55)
- **Violation Red** (#E5484D): only inside report visuals. Text uses **Deep Red** (#C4292F)
- **Form Error** (#B42318): validation messages only, deliberately not the violation red
- **Green family** for colour: Green 50 (#F0F8F4) tinted surfaces, Green 100/200 (#DDF1E7 / #BFE5D2) tinted borders and lines, Mint (#F2F8F5) section wash, Green 700 (#0A7A55) numbers, badges and labels, Green 900 (#053D2B) text on tints. Colour arrives as soft radial washes (hero, dark report, final CTA) and tinted surfaces (How it works, MapDelta comparison column, featured plan, founding banner, footer). Primary buttons stay Ink.

## 3. Typography Rules
- **Family:** Inter 400/500/600 (per brand brief)
- **Hero:** 40px to 72px (clamp), semibold, -0.03em, line-height 1.05
- **Section headings:** 30px to 46px, semibold, -0.03em, line-height 1.1, `text-wrap: balance`
- **Body:** 17px/1.6; leads 18–19px in Graphite, max ~34em
- **Eyebrows:** 13px uppercase, +0.08em, Graphite
- **Numbers:** tabular figures everywhere prices or KPIs appear

## 4. Component Stylings
- **Buttons:** 48px pills. Primary is an Ink fill with white text; secondary is transparent with a 1px Hairline Strong border. Press state is `scale(.98)`. No glows.
- **Cards:** 22px radius, 1px hairline, `0 1px 2px rgba(0,0,0,.04)`. Hero report and form add one wide, faint diffusion layer.
- **Pills:** 24px status chips with a 5px leading dot: Notified (neutral), Resolved (green), Escalated (red).
- **Inputs:** label above, error below, 48px, 12px radius, Ink focus border with a 4px soft ring. 16px text prevents iOS zoom.
- **FAQ:** native `<details>` with a plus that rotates 45°, and height animated via `::details-content`.

## 5. Layout Principles
- Max content width 1120px; gutters 20–32px; section padding 96–152px.
- Hero is a split layout (copy left, product mockup right) at ≥1024px and stacks below that.
- Problem and FAQ sections use a sticky heading on the left and content on the right at ≥960px.
- Everything collapses to a single column below 768px. The comparison table becomes labelled rows below 720px. No horizontal page scroll (verified at 375px).

## 6. Motion & Interaction
- Scroll reveal: opacity plus a 14px rise, 300ms, `cubic-bezier(.2,.7,.2,1)`, staggered 70ms, via IntersectionObserver.
- Hero: staggered rise on load, price line draws in, violation dots pop in sequence.
- Report: compliance line draws when it enters view.
- `prefers-reduced-motion` disables all of it. Only `transform` and `opacity` are animated.

## 7. Anti-Patterns (Banned)
No emojis. No marketplace or client logos. No testimonials, client counts, or invented stats outside the clearly labelled sample report. No gradients on text, no neon glows, no carousels, no parallax, no stock photos, no "scroll to explore" filler. Red never appears outside report visuals.
