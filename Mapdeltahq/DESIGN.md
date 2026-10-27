# Design System: MapDelta — "the audit ledger"

## 1. Atmosphere
A carefully kept evidence file, not a startup landing page. Calm, exact, a little editorial. Hairline rules instead of cards, a visible margin column for small mono notes, numbers that line up. The reader should come away thinking "these people check things".

## 2. Colour
| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | #FAFAF9 | #141210 | Background |
| `--ink` | #16130F | #EDE8DF | Text, rules that matter, primary button |
| `--ink-2` | #6B645A | #A39B8E | Secondary text, margin notes |
| `--rule` | #DAD5CC | #3A352E | 1px hairlines |
| `--tint` | #F2EEE6 | #1F1C18 | MapDelta column in the comparison, active listing row |
| `--signal` | #C2410C | #EE7444 | **Below MAP only**: deltas, below-MAP dots, status markers. Also focus rings. |
| `--ok` | #3F6B4E | #86B094 | **At or above MAP only**: "Back at MAP", month-1 comparison note |

No other colours. No gradients, glows, blur, glass or drop shadows. Dark mode is ink on charcoal, via `prefers-color-scheme`.

## 3. Type
- **Headlines:** Source Serif 4, regular (wordmark semibold). Sentence case, tight leading.
- **Body:** IBM Plex Sans 400/500. Measure capped at 64ch.
- **Numbers:** IBM Plex Mono for every price, percentage, date, SKU and seller ID, so columns align.
- Fonts are self-hosted in `/fonts`: static Latin subsets (about 100 KB in total), with the serif and sans preloaded.

## 4. Layout
- 12-column grid. Columns 1–2 are the margin column (section number plus a mono label); columns 3–12 hold the content, separated by a vertical hairline.
- Under 960px, margin labels move above their section and everything becomes a single column.
- Sections are separated by 1px rules. Corners are square or 2px at most.
- Tables scroll inside their own container, never the page.

## 5. The MAP line
A single ink hairline labelled "MAP $129.00" in mono. It recurs:
- as the hero strip plot (12 illustrative offers; 8 on phones);
- as the spine of the "How it works" timeline;
- as the section divider before How it works, Sample report and Snapshot;
- in the sample report's three-month chart.

Dots above the line are ink. Dots below are vermilion, with their delta labelled "−$24.05 / −18.6%".

## 6. Motion
- On first load, the hero dots settle from the MAP line onto their prices over 600ms, and the below-MAP ones turn vermilion.
- Elsewhere: a single opacity plus 8px fade on scroll, once.
- `prefers-reduced-motion` removes all motion.

## 7. Words
- Say "below-MAP listings", "flags", "flags to verify", and "confirmed below-MAP listings" only after the brand has checked them.
- Never say "violators", "unauthorized sellers", "offenders" or "violations" about a prospect's sellers.
- Describe source checks as something run with the brand's approval, never as already done.
- Sample data is always labelled "Illustrative data" and uses placeholder sellers ("Seller A").
- No people, testimonials, logos, ratings or invented statistics.
