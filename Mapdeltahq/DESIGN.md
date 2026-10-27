# Design System: MapDelta

## 1. Atmosphere
One continuous, polished page: no numbered sections or dividers, just generous space between blocks. Content sits in soft rounded panels (22px radius, gentle shadow). Calm and exact, with numbers that line up.

## 2. Colour
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #FBFCFB | #0B100E | Page |
| `--panel` / `--panel-2` | #FFFFFF / #F3F6F4 | #111916 / #17211D | Panels / tiles inside panels |
| `--ink` / `--ink-2` | #0E1512 / #56615B | #E7EEEA / #9BA8A1 | Text / secondary text |
| `--line` | #E2E8E4 | #23302A | Hairlines inside panels |
| `--brand` | #0F5B46 | #3DBB8E | Buttons, kickers, checks, timeline, MapDelta column |
| `--brand-soft` | #E8F2EC | #12261E | Tinted surfaces (CTA panel, legal summary) |
| `--signal` | #C93D33 | #FF7A6E | **Below MAP** (dots, deltas, tinted zone under the MAP line), plus form errors |
| `--ok` | #0F7A5F | #62D4A9 | "Back at MAP", at-or-above notes |

No gradients or glows.

## 3. Type
- **Headlines:** Source Serif 4, regular (wordmark semibold). Sentence case, tight leading.
- **Body:** IBM Plex Sans 400/500. Measure capped at 64ch.
- **Numbers:** Plex Sans with tabular figures, so columns align. Mono only for seller IDs and capture stamps.
- Fonts are self-hosted in `/fonts`: static Latin subsets (about 100 KB in total), with the serif and sans preloaded.

## 4. Layout
- 1160px max width, one continuous flow. A small green kicker sits above each heading.
- Panels: 22px radius, 1px line, soft shadow. Buttons are pills.
- Below 1024px everything stacks into a single column.
- Tables scroll inside their own container, never the page.

## 5. The MAP line
A single ink hairline labelled "MAP $129.00". It recurs:
- as the hero strip plot (12 illustrative offers; 8 on phones);
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
