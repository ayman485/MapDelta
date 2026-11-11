# Design system: MapDelta (WIP reporting for electrical contractors)

## Atmosphere
A finance workpaper: warm off-white page, navy ink, hairline rules, flat white panels with a 6px radius, no gradients, glows or shadows. Calm and exact, with numbers that line up (tabular figures).

## Colour
| Token | Value | Use |
|---|---|---|
| `--bg` | #F6F4EE | Page |
| `--panel` / `--panel-2` | #FFFFFF / #EFECE3 | Panels / table heads, totals |
| `--ink` / `--ink-2` | #14202E / #4F5B69 | Text / secondary text |
| `--navy` | #14202E | Buttons, workpaper bars, "How it works" and contact bands |
| `--green` | #2C6A4B | Positive indicators (check marks) |
| `--amber` | #8F5F0B (on #F6E9CC) | Needs attention |
| `--red` | #A3322A (on #F4DEDA) | Negative margin movement, form errors |

Over/under billing is shown neutral (it is a reconciling figure, not good or bad). Red is used only for margin declines of 1.0 point or more and for form errors.

## Type
- Headings: Source Serif 4 (400; wordmark 600). Body and tables: IBM Plex Sans with tabular figures. Both are self-hosted in `/fonts` (about 80 KB), so no third-party font requests.
- Hero headline is large, sentence case; measure of body copy is capped at about 64 characters.

## Layout
- 1180px max width; sections alternate off-white and navy bands. Section head: small uppercase kicker, serif heading, optional lead, all left-aligned.
- Tables scroll inside their own container with a sticky project column; the page itself never scrolls sideways.
- Below 900px the navigation collapses to a menu and grids stack.

## The sample workpaper
One fictional company (Harbor Electric Co.) and eight fictional jobs, used in the hero, the package preview and the social image. All derived figures follow one cost-to-cost model (see the note under the schedule) and are re-checked by `tools/verify-wip.mjs`. Every instance is labelled "Illustrative sample data".

## Motion
Fade and a 14px rise once per block on scroll, 0.5s; hover colour transitions; smooth anchor scrolling. `prefers-reduced-motion` removes all of it.

## Words
- Use: prepare, organize, reconcile, identify, flag, report, support.
- Never: certify, sign off, guarantee, advise (accounting, tax, legal, surety).
- No customers, logos, testimonials, statistics, certifications or addresses unless the owner supplies them.
- Day 10 is always qualified as a service target that depends on receiving agreed data and PM inputs.

## Billing Desk page (November 2026)
Same system, new content. Additions: the Friday report panel (navy bar, white rows, serif figures; amber for the "Missing POD" count), a pricing ledger table (stacks into labelled rows below 640px), a navy "promise" callout and a bordered "what we don't touch" note. Words to avoid on this page: platform, dashboard, free trial, any founder name or photo.
