# MapDelta website audit (Phase 1)

Audited 1 November 2026, before the redesign.

- **Live site:** `https://www.mapdeltahq.com/`. It is served from Vercel (`x-vercel-cache: HIT`, last modified 29 Oct 2026) and deployed from `main` at commit `93069f0`.
- **Repository:** `ayman485/MapDelta`, folder `Mapdeltahq/` (the Vercel project root).
- **Screenshots:** the live site before the redesign is in `docs/screenshots/before-*`.

I read every result here as a sceptical CFO would: someone deciding whether to hand sensitive financial records to a provider they have never heard of.

## Summary

The current site is well built and honest, but it sells **the wrong business**. Every word, visual, page and piece of metadata describes MAP (minimum advertised price) enforcement for marketplace sellers. MapDelta is now a managed **retailer deduction investigation and recovery** operation for consumer-goods suppliers. A finance leader who arrives from outreach about deductions would conclude they had the wrong company. Everything else in this audit is secondary to that, but there are also three trust problems that need fixing whatever the business is:

- **Internal notes are public.** `/CHANGES.md` and `/DESIGN.md` are served publicly, including owner TODOs.
- **Canonical URLs point at a redirect.** They use `mapdeltahq.com`, which 308-redirects to `www.mapdeltahq.com`.
- **The SEO fixes aren't live.** They sit on a branch but were never merged, so `robots.txt`, `sitemap.xml` and `favicon.ico` all return 404 in production.

## Technical baseline (measured)

| Check | Result |
|---|---|
| Stack | Static HTML, one CSS file, one vanilla JS file, self-hosted fonts (6 × woff2, ~100 KB). No framework, no build step. Vercel static hosting with `vercel.json` redirects and headers. |
| Page weight | 109 KB transferred (home) |
| LCP, throttled mobile (slow 4G, 4× CPU) | 1.59 s |
| LCP, desktop | 1.35 s |
| CLS | 0.000 (mobile) / 0.001 (desktop) |
| INP proxy, throttled mobile | 920 ms on the first tap (menu button) under 4× CPU throttling. Needs attention; see T6. |
| Accessibility (axe-core 4.10, WCAG 2.1 AA + best practice) | 1 moderate issue: duplicate landmark name (`#compare` region shares its label with its heading region) |
| Console errors | None |
| Horizontal overflow | None at 1440 / 834 / 390 px |
| Broken internal links | None |
| Live 404s | `/robots.txt`, `/sitemap.xml`, `/favicon.ico` |
| Analytics | None installed |
| Form | FormSubmit AJAX endpoint to `ayman@mapdeltahq.com`, honeypot field, falls back to `mailto:` on failure |
| Redirects | `*.vercel.app` → `mapdeltahq.com` → `www.mapdeltahq.com` (two hops) |

## Findings

Priority: **C** Critical · **H** High · **M** Medium · **L** Low

### Positioning and content

| # | Existing element | Observed problem | Why it matters commercially | Recommended change | P | Proposed replacement |
|---|---|---|---|---|---|---|
| P1 | Entire site: title, hero, sections, FAQ, legal pages | Describes MAP enforcement for marketplace sellers (Amazon, Walmart, Google Shopping, eBay). | A CFO arriving from deduction-recovery outreach meets an unrelated service. The visit ends there. | Rebuild positioning, copy, visuals and metadata around retailer deduction investigation and recovery. | C | New homepage and inner pages (see `STRATEGY.md`) |
| P2 | Hero: "Your MAP policy is only as good as the follow-through." | It's the wrong problem for the target buyer (CFO, controller, AR, deductions lead). | The first screen decides the visit. | Name the buyer's problem in finance language. | C | "The deductions your finance team hasn't had time to challenge." |
| P3 | Pricing ledger: $750 / $1,750 / $3,500 retainers | These retainers belong to the MAP service. The new model is a monthly managed fee plus a performance fee on realised recoveries, with the exact fee set in each service agreement. | Publishing the wrong prices anchors expectations and creates contractual ambiguity. | Remove the published prices. Explain the fee structure in words and define "recovery". | C | Engagement-model section and FAQ answer on performance fees |
| P4 | "Sample report" with illustrative below-MAP data | Illustrative data about the wrong domain. | It shows competence in something the buyer isn't buying. | Replace with a clearly labelled, synthetic, interactive claim register. | H | "Every case has a record. Every outcome has a status." |
| P5 | Comparison table vs "Monitoring software" and "Enforcement firms" | Wrong competitor set. Its claims about third parties ("Rarely", "Typically annual contracts") are generalisations nobody has verified. | Unverified statements about competitors cost credibility with careful buyers. | Contrast a fragmented process with a structured workflow, without naming or characterising competitors. | H | "Typical fragmented process" vs "Structured MapDelta workflow" |
| P6 | Location | The previous round deliberately removed every location reference. The business is operated from India. | Hiding where a provider operates is a trust failure once discovered, and it matters for data handling. | State it plainly on About, in the FAQ and in the Privacy Policy. | C | "MapDelta is founder-led and operated from India." |
| P7 | No founder or company identity | No name, no "who does the work". | An unfamiliar provider asking for financial records must be accountable. | A founder-led About page with direct accountability. Founder details must be supplied and approved by the founder (see `REDESIGN-REPORT.md`). | H | About page plus a homepage About section |
| P8 | Legal pages | Written for MAP monitoring: public seller data, test purchases, marketplace screenshots. They don't cover client financial records, remittances or invoices. | The data-processing information doesn't match what clients will share. | Rewrite Privacy and Terms for the deduction-recovery service and flag them for counsel review. | C | New `privacy/` and `terms/` |
| P9 | OG image, favicon | Both show the MAP line with seller dots. | Link previews in outreach emails and LinkedIn show the old business. | New identity mark and OG image. | H | New `og-image.png`, `favicon.*` |

### Trust and security

| # | Existing element | Observed problem | Why it matters | Recommended change | P | Proposed replacement |
|---|---|---|---|---|---|---|
| T1 | `/CHANGES.md`, `/DESIGN.md` served publicly | Internal change logs and owner TODOs, including "confirm mailbox", "form endpoint" and the governing-law note, are public. | A diligent prospect can read internal to-do lists. It looks unfinished and leaks process detail. | Move internal docs out of the deployed folder. Add `.vercelignore` as a safeguard. | C | `docs/` at the repository root |
| T2 | Canonical / OG / sitemap URLs | All use `https://mapdeltahq.com/`, which redirects to `www`. | Search engines get mixed signals, and link previews take an extra hop. | Use `https://www.mapdeltahq.com/` everywhere. Send `*.vercel.app` straight to `www`. | H | Updated metadata and `vercel.json` |
| T3 | `/tools/og.html` deployed | An internal helper page is public. | It's noise for crawlers and a little unprofessional. | Keep it (it generates the OG image), noindexed with a title. Already on the branch; ship it. | L | Noindexed tool page |
| T4 | Contact form asks for a product and MAP price | Wrong fields for the new buyer. Nothing tells visitors not to send financial records through the form. | Finance buyers want to know how sensitive records will be exchanged. | Ask only qualifying questions. State that records are exchanged later through a secure method agreed after engagement. | H | New contact form (Part 6 fields) |
| T5 | No data-handling explanation | The current site has nothing on how client records are accessed, stored, retained or deleted. | It's the first question a controller will ask. | A trust section, an FAQ answer and a Privacy section, all without claiming certifications. | H | "Financial work requires more than automation." |

### Design and experience

| # | Existing element | Observed problem | Why it matters | Recommended change | P | Proposed replacement |
|---|---|---|---|---|---|---|
| D1 | Paper/ink "audit report" theme | It suited a MAP evidence report. For a financial-operations firm it reads modest and template-like next to the brief's direction (graphite and ivory, cinematic depth). | First impression of premium credibility. | New design system: graphite canvas, ivory document surfaces, one copper accent, sans headings, monospace figures. | H | `docs/DESIGN.md` (new) |
| D2 | Single long page | A cold visitor can't go deeper on process, scope, suitability or who is behind the firm. | Sceptical buyers look for depth before replying. | Six-page structure: Home, How It Works, Services, Who We Help, About, Contact, plus legal pages. | H | See sitemap in `STRATEGY.md` |
| D3 | CTAs: "Send us one product", "Request a snapshot" | Wrong action for the new offer. | Conversion. | One primary action everywhere: "Discuss Your Deduction Backlog". | C | Contact page form |
| D4 | Serif display face | The brief asks for a sophisticated sans for headings plus monospace for figures. | Brand tone. | IBM Plex Sans (already self-hosted) for display and UI. Plex Mono for identifiers and amounts. Drop the serif files (−39 KB). | M | Typography tokens |
| D5 | Motion: spring reveals, hero dot drop | Good and restrained, but the hero animation is tied to the MAP chart. | Motion should explain the process. | Keep the spring engine. Re-aim it at ledger composition, process-line drawing and register filtering. | M | Animation principles in `DESIGN.md` |

### Technical and SEO

| # | Existing element | Observed problem | Why it matters | Recommended change | P | Proposed replacement |
|---|---|---|---|---|---|---|
| S1 | `robots.txt`, `sitemap.xml`, `favicon.ico` | 404 in production; the fixes are unmerged. | Crawl hygiene, plus the error reports already received. | Ship them with the redesign. Extend the sitemap to the new pages. | H | — |
| S2 | No structured data | Search engines have no machine-readable identity. | Brand searches, knowledge panel. | `Organization` JSON-LD with honest fields, and `FAQPage` on the FAQ. | M | — |
| S3 | Duplicated header/footer per page | Only three pages today, but six to nine after the redesign; hand-copied chrome will drift. | Maintenance errors become broken links. | A small dependency-free build script (`scripts/build.py`) composes shared header/footer into static HTML. Output stays static, so deployment is unchanged. | M | — |
| T6 | First-tap latency on throttled mobile | 920 ms event duration recorded on the first interaction under 4× CPU throttling. | INP target ≤ 200 ms. | Keep main-thread work light. Avoid layout thrash on menu open. Re-measure after the build. | M | — |
| A1 | Landmark naming | Duplicate accessible name on `#compare`. | Accessibility. | Unique labels on all landmarks in the new markup. | L | — |
| AN1 | Analytics | None. | Founder can't see whether outreach converts. | Add a provider-agnostic event layer (CTA click, form start, form submit, page view with campaign source). Connect a provider only after the founder chooses one. | M | `track()` in `main.js` (no third-party script until approved) |
