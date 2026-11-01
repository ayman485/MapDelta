# MapDelta redesign strategy (Phase 2)

## Positioning

**What MapDelta is:** a managed, founder-led operation that investigates retailer deductions for consumer-goods suppliers. It organises the evidence, prepares disputes for the client's approval, follows them up when authorised, and reconciles outcomes against cash actually received or credit actually applied.

**One-line positioning:** *Managed retailer deduction investigation and recovery operations.*

**What it is not:** software, a dashboard, an AI tool, or a law or accounting firm.

**Initial scope, stated plainly:** Walmart supplier deductions. Other retailers are assessed case by case and are only shown as supported once the procedures have been validated.

**Proof strategy for an early-stage firm.** There are no clients, results or testimonials, and none are invented. Credibility comes from:

1. **Specificity of process.** The five stages, the record each produces, and who approves what.
2. **Precision of language.** "Potentially supportable", not "recoverable". "Recovered" means cash received or credit applied.
3. **Visible honesty.** It is founder-led and operated from India, with a narrow initial scope, fees only on realised recoveries, and no certifications claimed.
4. **A worked example.** A synthetic claim register, clearly labelled, that shows how a case moves from identified to closed.

## Sitemap

```
/                 Home (12-section conversion journey)
/how-it-works/    The five-stage workflow in depth, approvals, what you provide
/services/        Each service, its output and its limits; what we don't do
/who-we-help/     Supplier categories, situations, fit and not-yet-a-fit
/about/           Founder-led, operated from India, principles, accountability
/contact/         Short qualifying form; what happens next; records policy
/privacy/         Rewritten for client financial records (counsel review)
/terms/           Rewritten for the new service (counsel review)
/404.html         Branded not-found page
```

Primary navigation: How It Works · Services · Who We Help · About · Contact, plus the primary CTA button. The wordmark links home.

## Homepage structure

| # | Section | Job it does for a cold CFO visitor |
|---|---|---|
| 1 | Hero | Explains the service in one screen. Primary CTA visible without scrolling. |
| 2 | The problem | Names the accumulated operational work, with an explicit caveat that not every deduction is disputable. |
| 3 | The approach | Five stages, each with its output. |
| 4 | What MapDelta does | A concrete service inventory. It reads as a service, not software. |
| 5 | The difference | A fragmented process vs a structured workflow, with no claims about competitors. |
| 6 | Visibility | An interactive, illustrative claim register with the eight statuses defined. |
| 7 | Who we help | Supplier categories and profile; no claim of universal suitability. |
| 8 | Engagement model | Backlog investigation, then ongoing recovery. Fee structure in words, no prices. |
| 9 | Trust | Traceability, human review, client approval, responsibilities, handling, corrections. |
| 10 | About | Founder-led, operated from India, direct accountability. |
| 11 | FAQ | All 15 questions answered from current capability. |
| 12 | Final CTA | "Start with the records." |

## Content strategy

- **Voice:** a careful finance operator. Short declarative sentences, no hype, and no "transform", "unlock" or "AI-powered".
- **Fixed vocabulary**, used the same way everywhere:
  - deduction
  - case
  - potentially supportable
  - evidence
  - dispute
  - client-approved submission
  - retailer decision
  - recovery (cash received or credit applied)
  - performance fee
  - service agreement
- **Hedging is deliberate, not nervous.** "May be incorrect or disputable" appears where it's true; it isn't sprinkled everywhere.
- **No numbers that look like results.** Every figure on the site is either synthetic and labelled "Illustrative", or a definition.
- **Missing facts become placeholders,** listed in `REDESIGN-REPORT.md`: founder biography, the secure file-exchange method, registered business entity and governing law.

## Visual direction

The brief's reference points ("Apple meets Nolan") translate as:

- **Restraint:** one accent, large type, generous space, and nothing decorative that doesn't carry information.
- **Depth:** a graphite canvas lit by one soft, directional light. Ivory "documents" sit on it like paper under a desk lamp: ledgers, registers and case files.
- **Tension, resolved:** scattered records align into a case file, and a thin copper line draws from a deduction to its outcome.
- **Architecture:** thin rules, a 12-column grid, and monospace identifiers and amounts.

## Design tokens (summary; full system in `DESIGN.md`)

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0B0C0E` | Page background |
| `--raised` / `--raised-2` | `#121418` / `#181B20` | Panels on the canvas |
| `--rule` / `--rule-strong` | `#24282E` / `#353A42` | Hairlines |
| `--fg` / `--fg-2` / `--fg-3` | `#ECE8E1` / `#A9ADB3` / `#80858D` | Text on graphite |
| `--ivory` / `--ivory-2` | `#F1ECE3` / `#E4DDD0` | Document surfaces |
| `--paper-ink` / `--paper-ink-2` | `#16171A` / `#5C5850` | Text on ivory |
| `--copper` | `#C98A53` | The single accent: primary CTA, highlighted discrepancies, progress |
| `--copper-deep` | `#8E4F1F` | Copper text on ivory (AA contrast) |

## Key conversion decisions

1. **One primary action everywhere:** "Discuss Your Deduction Backlog", which leads to `/contact/`. The secondary action is "See How It Works".
2. **A short form with qualifying fields only** (Part 6 of the brief). No file uploads. The form states that records are exchanged later, through a secure method agreed after engagement.
3. **Campaign attribution.** UTM parameters and the referrer are captured on landing (session storage only, no cookies) and sent with the form, so outreach performance is visible. This is disclosed in the Privacy Policy.
4. **Analytics.** A provider-agnostic `track()` layer records CTA clicks, form starts, form submissions and page views with source. No third-party analytics script loads until the founder chooses a provider.
5. **No published prices.** The fee structure is explained in words, and "recovery" is defined. Exact fees go in the service agreement.
6. **Honesty is part of the pitch.** The site says plainly that MapDelta is operated from India, that the initial scope is Walmart, and that performance fees apply to realised recoveries only. For a sceptical CFO these answer the questions they would otherwise have to ask.
