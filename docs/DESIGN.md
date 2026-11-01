# MapDelta design system (Phase 3)

The site is a graphite canvas with ivory documents on it, and one copper accent. The look is restrained, architectural and precise. The site should command attention without asking for it.

## 1. Colour

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--canvas` | #0B0C0E | Page | — |
| `--raised` | #121418 | Panels, header on scroll | — |
| `--raised-2` | #181B20 | Nested panels, chips | — |
| `--rule` | #24282E | Hairlines on graphite | — |
| `--rule-strong` | #353A42 | Input borders, table heads | — |
| `--fg` | #ECE8E1 | Primary text on graphite | 16.0 : 1 |
| `--fg-2` | #A9ADB3 | Body / secondary | 8.7 : 1 |
| `--fg-3` | #80858D | Labels, captions (≥ 14px only) | 5.3 : 1 (4.65 on `--raised-2`) |
| `--ivory` | #F1ECE3 | Document surfaces (ledger, register, case file) | — |
| `--ivory-2` | #E4DDD0 | Rules and row tints on ivory | — |
| `--paper-ink` | #16171A | Text on ivory | 15.2 : 1 |
| `--paper-ink-2` | #5C5850 | Secondary text on ivory | 6.0 : 1 |
| `--copper` | #C98A53 | **The only accent.** Primary button, highlighted discrepancy, progress line, focus ring | 6.75 : 1 either way against canvas |
| `--copper-deep` | #8E4F1F | Copper text and marks on ivory | 5.4 : 1 |

Rules:

- **Copper appears at most a handful of times per screen.** It marks action (the primary button), attention (the highlighted line in a ledger) or progress (drawn lines, active step).
- **No gradients as decoration.** The single permitted light effect is a soft radial falloff behind a document, as if it were under a lamp. It sits at ≤ 6% white and is never coloured.
- **Status colour on the register is typographic, not chromatic.**
  - Neutral statuses are ink.
  - "Cash received" and "Credit applied" get a solid ink chip.
  - The row being investigated carries the copper rule.

## 2. Typography

The site uses only self-hosted fonts:

- **IBM Plex Sans** (400, 500) for display, headings and UI.
- **IBM Plex Mono** (400, 500) for case references, amounts, percentages, stage numbers and technical labels.

| Style | Size (clamp) | Weight / tracking / leading |
|---|---|---|
| Display (hero) | 2.6rem → 5.4rem | 500, −0.035em, 1.02 |
| H2 | 2rem → 3.6rem | 500, −0.03em, 1.06 |
| H3 | 1.25rem → 1.5rem | 500, −0.015em, 1.25 |
| Lead | 1.125rem → 1.3rem | 400, 1.55, `--fg-2` |
| Body | 1.0625rem | 400, 1.65 |
| Label (mono) | 0.75rem | 500, +0.08em, uppercase |
| Figures | inherit | Mono, `tabular-nums`, right-aligned in tables |

- Body measure is capped at 64ch.
- No weight lighter than 400.
- Headings are sentence case.

## 3. Space and grid

- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 px.
- **Container:** 1200px max, with a gutter of `clamp(20px, 5vw, 56px)`.
- **Section rhythm:** `clamp(96px, 12vw, 176px)` between sections. Each section opens with a mono index label ("02 — The problem") and a thin rule.
- **Breakpoints:** phones first, then 640, 900 and 1200px.

## 4. Components

| Component | Spec |
|---|---|
| **Button, primary** | Copper fill, canvas text, 52px tall (44px compact), 4px radius. Hover: lighter copper and a 1px lift. Focus: 2px copper ring with 3px offset. |
| **Button, secondary** | Transparent, 1px `--rule-strong` border, `--fg` text. Hover: border to `--fg-2`. |
| **Text link** | `--fg`, underline offset 4px, decoration in `--rule-strong`, which turns copper on hover. |
| **Navigation** | Transparent over the hero. On scroll it becomes `--canvas` at 88% opacity with a blur and a hairline below. Active page is marked with `aria-current` and a 1px underline. On mobile it is a full-height sheet with large tap targets and closes on Escape. |
| **Section head** | Mono index label, H2, optional lead. |
| **Document** | Ivory surface, 6px radius, deep layered shadow (no glow). Optional mono header strip ("CLAIM REGISTER · ILLUSTRATIVE"). |
| **Panel (dark)** | `--raised`, 1px `--rule`, 8px radius. |
| **Stage row** | Mono number, title, explanation, an "Output" line, and an inline line-art SVG (1.5px strokes, copper highlight). |
| **Chip / filter** | 32px tall, `--raised-2`, mono label. `aria-pressed="true"` gives an ivory fill with ink text. |
| **Form field** | Label above, 48px input, `--raised` fill, `--rule-strong` border. Focus: copper border plus a 3px copper/20% ring. Error: message below, with `aria-invalid`. |
| **FAQ** | `<details>` rows on hairlines, a +/× mark, and animated height when motion is allowed. |

## 5. Motion

All motion comes from one damped spring in `main.js` (stiffness/damping, stepped at 120 Hz), plus CSS transitions for hover and focus.

| Moment | Behaviour | Duration |
|---|---|---|
| Hero text | Headline lines rise 14px and fade in, staggered 70ms | ~450 ms, finishes before 0.8s |
| Hero ledger | Rows settle in, then a copper line draws from the highlighted deduction to "Resolution" | ~1.2 s, never blocks content |
| Problem | Scattered records spring into an aligned case file when in view | ~0.9 s |
| Approach | The stage spine draws as the section scrolls past (scroll-linked, rAF-throttled) | Follows scroll |
| Reveal | Blocks rise 16px and fade in once, staggered 60ms | ~0.6 s |
| Register | Filtering fades rows out and in; the count updates | 200 ms |

Principles:

- Content is never hidden behind an animation. Text is readable at first paint, and the hero CTA is clickable immediately.
- No scroll hijacking. Scroll-linked effects only read the scroll position.
- `prefers-reduced-motion: reduce` turns all of it off, and the page renders in its final state.
- Animations use only transform, opacity and stroke-dashoffset.

## 6. Accessibility

- Every landmark has a unique name. There's a skip link, and focus is visible on every interactive element.
- Charts and illustrations are either decorative (`aria-hidden`) next to equivalent text, or they carry a `<title>`/`<desc>`.
- The claim register is a real `<table>` with a caption. Filters are buttons with `aria-pressed`, and a live region announces the row count.
- Tap targets are at least 44px. No interaction depends on hover.
