# Design System: MapDelta

## 1. Atmosphere
An audit report on paper: warm paper background, ink text, hairline rules, flat panels with a 6px radius and no shadows. Calm and exact, with numbers that line up.

## 2. Colour
Light only (no dark mode). One accent, ink; red is reserved for below-MAP.
| Token | Value | Use |
|---|---|---|
| `--bg` | #F5F1E8 | Paper |
| `--panel` / `--panel-2` | #FBF9F3 / #EDE8DB | Panels / tiles and table heads |
| `--ink` / `--ink-2` | #14130F / #5B574C | Text / secondary text |
| `--line` | #DDD6C5 | Hairlines |
| `--brand` | #14130F | The one accent (ink): buttons, checks, timeline |
| `--signal` | #B3261E | **Below MAP** (dots, deltas, tinted zone), plus form errors |
| `--ok` | #5B574C | "Back at MAP": neutral, not a second colour |

No gradients, glows or shadows.

## 3. Type
- **Headlines:** Source Serif 4, regular (wordmark semibold). Sentence case, tight leading.
- **Body:** IBM Plex Sans 400/500. Measure capped at 64ch.
- **Numbers:** Plex Sans with tabular figures, so columns align. Mono only for seller IDs and capture stamps.
- Fonts are self-hosted in `/fonts`: static Latin subsets (about 100 KB in total), with the serif and sans preloaded.

## 4. Layout
- 1160px max width, one continuous flow. A small green kicker sits above each heading.
- Panels: 6px radius, 1px line. Buttons are squared (4px). Pricing is a ledger table (Monitoring & notices, Full enforcement, Channel programme), not cards.
- Below 1024px everything stacks into a single column.
- Tables scroll inside their own container, never the page.

## 5. The MAP line
A single ink hairline labelled "MAP $129.00". It recurs:
- as the full-width hero strip plot under the headline (12 illustrative offers; 8 on phones);
- as the spine of the "How it works" timeline;
- in the sample report's three-month chart.

Dots above the line are ink. Dots below are red on a soft red zone, with their delta labelled "−$24.05 / −18.6%".

## 6. Motion
- On first load, the hero dots settle from the MAP line onto their prices over 600ms, and the below-MAP ones turn red.
- Elsewhere: a single opacity plus 12px rise on scroll, once.
- `prefers-reduced-motion` removes all motion.

## 7. Words
- Say "below-MAP listings", "flags", "flags to verify", and "confirmed below-MAP listings" only after the brand has checked them.
- Never say "violators", "unauthorized sellers", "offenders" or "violations" about a prospect's sellers.
- Describe source checks as something run with the brand's approval, never as already done.
- Sample data is always labelled "Illustrative data" and uses placeholder sellers ("Seller A").
- No people, testimonials, logos, ratings or invented statistics. No location is named anywhere.
