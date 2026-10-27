# MapDelta site: copy changes (October 2026 redesign)

Every wording change from the previous live site, for your review. "Removed" means the text is gone; where its point survives elsewhere, that is noted. The site now uses US spelling throughout ("authorized"), because the readers are US brands.

---

## Round 2 (October 2026): owner feedback

- **Look:** replaced the beige ledger design with a smoother, continuous page. The numbered margin column, vertical rule and section dividers are gone. Content sits in soft rounded panels, with pill buttons. New palette: off-white, green-black ink, deep green brand (#0F5B46); red is kept for below-MAP prices only. Numbers now use Plex Sans tabular figures instead of mono.
- **Email:** all contact addresses are now `ayman@mapdeltahq.com` (footer, form, privacy, terms).
- **Location:** every mention of the team's location was removed. The FAQ "Where is your team based?" became "How quickly do you reply?". The Privacy Policy now says information "may be processed in the United States and in other countries where we and our service providers operate". The Terms governing-law clause no longer names a country or city (see TODO 7).
- Small kicker labels were added above headings: How it works · Anatomy of a flag · Sample report · Comparison · Pricing · Our evidence standard · FAQ · Free snapshot.

## Round 3 (October 2026): owner feedback

- **Redirect:** `vercel.json` now 301-redirects any `*.vercel.app` host to `https://mapdeltahq.com/`. The old copy ("violation snapshot", "direct founder access", Hyderabad, 8-field form) is a stale deployment, not in this repo: redeploy production from this branch.
- **Footer email:** now ink, underlined, a `mailto:` link.
- **Plan names:** Starter / Growth / Scale became Monitoring & notices / Full enforcement / Channel programme everywhere (pricing, timeline, comparison row, FAQ, privacy).
- **Comparison table:** the "Software demo" cell stays; it describes competitors only.
- **Theme:** light paper background, ink text, red only for below-MAP. Dark mode removed. Green and mint removed.
- **Pricing:** three cards and the "Recommended" badge replaced by one ledger table.
- **Hero:** chart is now full width under the headline, with larger labels.
- **Accent:** one accent (ink); the MapDelta comparison column is marked by a rule, not a tint.

## Owner TODOs (must be done before launch)

1. **Mailbox:** confirm `ayman@mapdeltahq.com` receives mail. It's the only contact address on the site, the legal pages and the form fallback. (`index.html` footer, `#snapshot-form` `data-email`, privacy, terms)
2. **What happens after month 3:** the pricing section currently says *"After the first three months, plans continue month to month and can be cancelled with 30 days’ notice."* This is a placeholder. Confirm or replace it. (`index.html`, search `TODO(owner)`)
3. **Form endpoint:** set `data-endpoint` on `#snapshot-form` to a real backend (Formspree, Basin or your own API). Until then, submitting opens the visitor's email app with a pre-filled message, and the success screen says so. Nothing is silently dropped. (`index.html`, `main.js`)
4. **Case study:** a commented-out slot sits under "What we hold ourselves to". Fill it only with a real, approved client case study.
5. **Domain:** the canonical URL, OG URL and OG image use `https://mapdeltahq.com/`. Point the domain at Vercel before sharing links, or link previews won't find the image.
6. **Deploy:** upload the new `fonts/` folder and `vercel.json` along with the changed files.
7. **Governing law (Terms §12):** it now reads "the laws of the jurisdiction in which MapDelta is established". That avoids naming a location but is legally vague. Have counsel name a specific law and venue once your entity is set up. (`terms/index.html`, search `TODO(owner)`)

---

## Site-wide

| Where | Old | New |
|---|---|---|
| Page title | MapDelta — MAP Enforcement for Consumer Brands | MapDelta — MAP Enforcement for US Consumer Brands |
| Meta description | MAP enforcement for consumer brands. We verify every violation by hand, trace where unauthorized stock comes from, and show you the proof before you pay. | MAP enforcement for US consumer brands: below-MAP listings verified by hand, follow-up handled with you, evidence before you pay. |
| OG image alt | MapDelta MAP report showing sellers advertising below a $129.00 MAP. | The MAP line: illustrative seller offers plotted against a $129.00 minimum advertised price, with three below-MAP listings marked in red. |
| OG image | Report-card mockup | New: serif headline, the MAP line with dots, "Illustrative data" |
| Nav | How it works · Why MapDelta · Pricing · FAQ · **Get a free snapshot** | How it works · Sample report · Pricing · FAQ · **Request a snapshot** |
| Footer | Contact: hello@… · Privacy Policy · Terms · © 2026 MapDelta. · MapDelta is not a law firm… | hello@… · Privacy · Terms · © 2026 MapDelta. MapDelta is not a law firm and does not provide legal advice. |

## 01 Hero

| Old | New |
|---|---|
| Eyebrow: MAP ENFORCEMENT FOR CONSUMER BRANDS | Margin label: 01 · MAP enforcement for US consumer brands |
| H1: Your price. Held. | H1: Your MAP policy is only as good as the follow-through. *(Option (a), "Someone is selling your product below MAP. We find out who, and what to do about it.", is a one-line swap if you prefer it.)* |
| We find sellers breaking your MAP policy on Amazon, Walmart and Google Shopping, verify every violation by hand, and trace where unauthorized sellers get their stock. You see the proof before you pay. | MapDelta checks Amazon, Walmart, Google Shopping and eBay for listings below your minimum advertised price, verifies each one by hand against your dealer list, and handles the follow-up with you. You see the evidence before you pay anything. |
| Button: Get your free violation snapshot | Button: Send us one product |
| Button: See how we’re different | Text link: See a sample report → |
| Your own products, checked in 48 hours · No account access needed · Month-to-month | Snapshot in 48 hours · no account access needed · replies within one US business day |
| Hero visual: "MAP report · Last 30 days", "Scanning" status, blurred product name, seller table (Escalated / Notified / Resolved) | Strip plot: "One SKU · 12 offers observed", "Illustrative data", MAP $129.00, three below-MAP deltas (−$24.05 / −18.6%, −$11.00 / −8.5%, −$16.51 / −12.8%), key: At or above MAP · Below MAP |

## Channel strip

| Old | New |
|---|---|
| Monitoring across Amazon · Walmart · Google Shopping · eBay · independent storefronts | Removed. The channels are named in the hero sentence. |

## 02 The problem

| Old | New |
|---|---|
| H2: Every undercut costs you twice. | H2: When one seller drops below MAP, the others follow, your authorized dealers complain, and the price floor stops meaning anything. |
| Card: Your retailers notice. Authorized dealers can’t compete with sellers breaking your policy, and they start asking why they should carry you. | 1. Dealers lose trust. Dealers who hold your price lose sales to listings that don’t, and start asking why they should. |
| Card: Your margin erodes. One seller drops the price, others follow, and your price floor quietly becomes a suggestion. | 2. Margin erodes. Each undercut becomes the new reference price, for shoppers and for the next seller. |
| Card: Your Buy Box slips. Unauthorized sellers take control of your Amazon listing, your reviews, and your customer experience. | 3. The Amazon listing suffers. The Buy Box can shift to the lowest offer, and with it control of how your product is presented. |

## Removed sections

| Old section | What happened |
|---|---|
| **Why MapDelta**: "Other vendors show you a demo. We show you your violations." plus four cards (Proof before you pay · A person checks every violation · We find the leak, not just the listing · You work with the founder) | Deleted. "Proof before you pay" became the How it works heading. "A person checks" became Evidence standard item 2. "Find the leak" became Anatomy note 5, rewritten as an approval-based process. The founder card was dropped (no individuals on the site). |
| **How it works**: "We do the work. You see the results." (We map your catalog · We find and enforce · You see who stopped) | Replaced by the new 03 timeline. |
| **Your first 30 days**: Day 1–2 Free snapshot · Day 3–7 Onboarding · Day 7–30 Enforcement · Day 30 First report | Merged into the 03 timeline. |

## 03 How it works (new)

- H2: You see the evidence before you pay anything.
- **Free snapshot** (Within 48 hours · free): Targeted marketplace observations on your top products, with screenshots and timestamps, sorted into flags to verify.
- **30-day pilot** (Growth plan · month-to-month): We load your policy and dealer list, scan on schedule, verify every flag by hand, send notices in your name using templates your counsel approves, and escalate repeat cases.
- **Keep it or walk away** (Day 30 onward): A monthly report shows who was found, who was notified and who came back to MAP. No contract for the first three months.

## 04 Anatomy of a flag (new)

- H2: What a flag looks like before it reaches you.
- Lead: One illustrative listing and the five checks a person runs on it. Select a number to read its note.
- Wireframe listing (labelled "Illustrative data"): $104.95 · MAP $129.00 · −$24.05 / −18.6% · Sold by Seller A · Condition: New · Pack of 1 · No coupon shown · Agreement with brand: not public · Stock origin: not public · Lot / expiry code: not visible in listing · Captured 21 Oct 2026, 14:02 ET
- Notes:
  1. **Price captured.** $104.95 against a MAP of $129.00: −$24.05 / −18.6%. Timestamp recorded, screenshot kept.
  2. **Seller checked against your dealer list.** Result: not found on your authorized list. That is a fact about your list, not a verdict on the seller.
  3. **Condition and bundle checked.** New or used, single unit or multi-pack, coupon or cart-only price. Any of these can explain a low price, so we check before flagging.
  4. **What public data can’t tell us.** Whether this seller has a private agreement with you, or where the stock came from.
  5. **Next step, with your approval.** A test purchase at cost, lot and expiry code capture, and a match against your shipment records, where records allow.

## 05 Sample report

| Old | New |
|---|---|
| H2: See exactly what you’re paying for. | Unchanged |
| Every client gets a monthly compliance report like this. Seller names below are blurred. | Every client gets a monthly report like this one. The data below is illustrative, and seller names are placeholders. |
| Label: Sample report · Illustrative data | Label: Illustrative data |
| Monthly compliance report · Month 3 | Monthly report · Month 3 |
| KPI: Violations found · 38 · Down from 61 in month 1 | Below-MAP listings found · 38 · 61 in month 1 |
| KPI: Sellers notified · 21 · Evidence attached to each notice | Sellers notified · 21 · In your name, with your approval |
| KPI: Compliance rate · 83.8% · Up from 47.2% | Sellers at or above MAP · 83.8% · 47.2% in month 1 |
| KPI: Stock sources identified · 3 · Leaks traced to specific accounts | Source checks opened · 3 · Test purchases you approved |
| Panel: Violations this month · 6 of 38 shown | Caption: Six of this month’s 38 below-MAP listings |
| Columns: Seller · Channel · Advertised · Below MAP · Status | Seller · Channel · Captured price · vs MAP $129.00 · Status |
| Seller names: blurred invented store names | Seller A–F |
| Statuses: Escalated · Resolved · Notified | Flagged · Notified · Back at MAP · Escalated · Source check in progress |
| Panel: Source tracing · "Peakline Outfitters → stock traced to one authorized account in the Midwest region (lot code match)" · "Cobalt Trading → test purchase in progress" | Removed. It claimed completed tracing and used invented business names. |
| Chart: Compliance rate · Last 3 months · "Share of monitored sellers advertising at or above MAP." | Chart: One SKU over three months (MAP line, 15 offers per month; 7, 4 and 2 of 15 below). Caption: Each dot is one seller’s month-end offer for the same SKU. Dots under the line are below MAP. |

## 06 How we compare

| Old | New |
|---|---|
| Row: Every violation checked by a person | Every flag checked by a person |
| Row: Traces where unauthorized stock comes from · No · Varies · Yes, on Growth and Scale | Source checks (test buys, lot codes) · No · Varies · On Growth and Scale, with your approval |
| Who you talk to · MapDelta: The founder | The team that checked your listings |
| Other rows and the footnote | Unchanged |

## 07 Pricing

| Old | New |
|---|---|
| Sub: No long contracts for your first 3 months. Cancel anytime. | No contract for the first three months. |
| Per-plan buttons: Start with a free snapshot (×2), Talk to us | Removed. One button under the plans: Start with a free snapshot. |
| Starter: Every violation verified by a person before action | Every flag checked by a person before it reaches you |
| Starter: Policy notices sent on your behalf | Notices sent in your name, with your approval |
| Starter: Monthly compliance report | Monthly report |
| Growth: Source tracing on repeat offenders (test purchase costs billed at cost) | Source checks on repeat cases, with your approval *(billing is now stated under the plans)* |
| Growth: Seller identification (who’s behind anonymous storefronts) | Seller identification for anonymous storefronts, from public sources |
| Scale: Compliance reports you can share with your retailers | Reports you can share with your retailers |
| One-time onboarding: $500. Waived for our first 10 founding brands. | Onboarding is $500, waived for our first 10 founding brands, who also keep their pricing locked for 12 months. Test purchases are billed at cost and made only with your approval. |
| Banner: We’re onboarding our first 10 founding brands. Onboarding waived, pricing locked for 12 months, and direct access to the founder. | Folded into the sentence above. "Direct access to the founder" removed. |
| Not sure yet? Start with the free snapshot. It’s the same work we do for clients, on your own products. | Removed |
| — | New: After the first three months, plans continue month to month and can be cancelled with 30 days’ notice. **(TODO: owner to confirm)** |

## 08 Evidence standard (new)

- H2: What we hold ourselves to.
1. Every flag has a timestamp and a screenshot. If we can’t show you the listing as it appeared, we don’t report it.
2. A person checks every flag against your dealer list before it reaches you. Automated matching gets bundles, used items and your own dealers wrong often enough to matter.
3. Nothing is sent to a seller without your approval. Notices go out in your name, using templates your counsel signs off.
4. We tell you what public data can’t establish. Authorization and stock origin need your records or a test purchase. We say which, and what it would cost.
5. Monthly reports show what changed, including what didn’t work. Sellers who ignored a notice are listed next to the ones who came back to MAP.

## 09 FAQ (trimmed from 10 to 7)

| Old | New |
|---|---|
| Heading: Frequently asked questions | Questions |
| Account access: unchanged | Unchanged |
| Who do the notices come from? From your brand, using your MAP policy. We send them on your behalf and log every step. | From your brand, under your MAP policy, using templates your counsel approves. We send them on your behalf only after you approve, and we log every step. |
| No MAP policy yet: We’ll share a policy framework you can review with your legal counsel before enforcement begins. | We’ll share a policy framework you can review with your counsel before anything is sent. |
| Can you guarantee sellers will stop? No one honestly can. What we commit to: every channel you’re on is scanned on schedule, every violation is verified by a person before we act… | **Q:** Can you guarantee sellers will come back to MAP? **A:** No. No one honestly can. What we commit to: every channel in your plan is checked on schedule, every flag is checked by a person before anything is sent, and you see exactly who changed their price and who didn’t. |
| Are you a law firm? No. We handle monitoring and policy enforcement. Formal legal action goes through your counsel. | No. We handle monitoring, verification and policy follow-up. Formal legal action goes through your counsel. |
| How do you avoid flagging our own dealers by mistake? You share your authorized dealer list at onboarding, and a person checks every flagged listing against it before any notice is sent. | **Q:** How do you keep your own dealers from being flagged by mistake? **A:** …before it reaches you. Anything we can’t match comes to you as a flag to verify, never as a notice. |
| Where is your team based? | Removed (the site does not name a location). Replaced by: **How quickly do you reply?** Within one US business day, and your snapshot arrives within 48 hours of your request. |
| We already use a monitoring tool or vendor. Why talk to you? | Removed |
| What happens with sellers who ignore notices? | Removed |
| How is the free snapshot different from the paid service? | Removed |

## 10 Snapshot request

| Old | New |
|---|---|
| H2: See who’s undercutting you today. | Send us one product. |
| Send us your brand. Within 48 hours you’ll have the sellers breaking your policy on your top products, with screenshots. Free, and no account access needed. | We’ll check where it’s listed below MAP and send back what we find within 48 hours, with screenshots. Public listing data only. |
| Fields: Name · Work email · Brand name · Brand website · Main marketplace concern · Company size | Name · Work email · Brand website · Product and its MAP price (optional), with help text: "If you leave this blank, we’ll pick from your best-selling products." |
| Button: Get my free snapshot | Request my snapshot |
| We only use public listing data for your snapshot. | Folded into the sub ("Public listing data only.") |
| Success: Request received. We’ll send your free violation snapshot within 48 hours. | Request received. Thanks. We’ll reply within one US business day. |
| Email-app fallback success: Your email app should open with these details… | One more step. Your email app should have opened with these details. Send that email to ayman@mapdeltahq.com and we’ll reply within one US business day. |

## Privacy Policy

- Effective date: September 28, 2026 → October 27, 2026.
- All contact addresses: founder@mapdeltahq.com → ayman@mapdeltahq.com.
- "request a free violation snapshot" → "request a free snapshot" (meta description and section 1).
- Short version: "(name, work email, brand details)" → "(name, work email, brand website and the product you send us)".
- Snapshot requests: "…brand name, brand website, main marketplace concern and company size." → "…brand website and, if you choose to share them, a product and its MAP price."
- "To find MAP violations, we collect…" → "To find listings below a brand’s MAP, we collect…"
- "To trace where unauthorized stock comes from, we may make test purchases from sellers and record lot codes and packaging details." → "With a client’s approval, we may make test purchases from sellers to check where stock comes from, recording lot and expiry codes and packaging details."
- "To prepare and send your free violation snapshot." → "To prepare and send your free snapshot."
- "monitoring, verifying violations, sending policy notices on your behalf" → "monitoring, verifying below-MAP listings, sending policy notices on your behalf with your approval"
- Cookies: the Google Fonts paragraph was replaced with "Its fonts are served from our own website, not from a third party." (Fonts are now self-hosted.)

## Terms

- Effective date: September 28, 2026 → October 27, 2026.
- All contact addresses: founder@mapdeltahq.com → ayman@mapdeltahq.com.
- "free violation snapshot" → "free snapshot" (meta description, section 1, section 2 heading, contents list).
- "The snapshot is a one-time scan of a sample of your products…" → "The snapshot is a set of targeted marketplace observations on a sample of your products, built from publicly available listing data at the time we check."
- "your violation of these Terms" → "your breach of these Terms"
