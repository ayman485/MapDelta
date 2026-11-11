# MapDelta site: Billing Desk for freight brokers (November 2026)

The home page now sells the **MapDelta Billing Desk** to small US freight brokerages, using the copy and offer from the "Freight Broker Billing Desk" brief (ten sections, pilot CTA). The earlier WIP-reporting page for electrical contractors moved to **/wip/** (unchanged apart from asset paths and the shared form script), so links in earlier contractor emails still reach it. Privacy and Terms were rewritten for the billing desk and mention /wip.

## New in this change
| File | Purpose |
|---|---|
| `index.html` | New home page: hero + sample Friday report, problem, what we deliver, Friday report detail, how it works (pilot), who we serve, pricing, FAQ, contact form (Name, Brokerage, MC number, email, loads a month, TMS, message) |
| `wip/index.html` | Previous WIP site, moved |
| `tools/verify-sample.mjs` | Checks the Friday sample reconciles (112 - 109 = 3 missing; AR over 45 = $18,400; carrier pay = $61,250) and the per-load arithmetic |
| `tools/verify-wip.mjs` | Now reads `wip/index.html` |
| `main.js` | Form handler is generic (`data-key`, `data-rule`, `data-subject`), shared by both forms |
| `privacy/`, `terms/`, `og-image.png`, `tools/og.html` | Rewritten for the billing desk |

## Before launch (owner)
1. **Activate FormSubmit** once: the first submission emails an activation link to `billing@mapdeltahq.com`. Until you click it, visitors see an error with an email fallback.
2. **Business mailbox.** Done: the site uses `billing@mapdeltahq.com` everywhere (footer, contact line, legal pages, form delivery). Submit the form once yourself to trigger FormSubmit's activation email to that inbox, and click the link in it.
3. **US-hours coverage.** The FAQ says "US business hours, Monday to Friday" and the hero promises one-business-day invoicing. Publish only if someone covers those hours.
4. **The promise.** "Invoiced within one business day, or that load is free" is a commercial commitment: define it in the service agreement (POD received, access granted, billing rules supplied).
5. **Pricing** is the brief's recommendation and has not been tested with buyers.
6. **Legal review** of Privacy and Terms (new text, not reviewed by counsel); Terms section 12 still needs a governing law.
7. **CAN-SPAM:** outreach emails need a physical postal address; none is invented on the site.
8. Optional: /wip/ is live but not in the sitemap. Add `noindex` to it if you do not want it found by search.

---

# Earlier change: WIP repositioning (November 2026)

The site moved from MAP enforcement for consumer brands to **monthly WIP preparation and reconciliation for commercial electrical subcontractors**. Everything on the home page, the legal pages, the metadata and the social image was rewritten for the new offer. The old MAP copy no longer appears anywhere.

## What the site is
Static HTML, CSS and a small JS file, deployed on Vercel (no framework, no build step, no dependencies).

| File | Purpose |
|---|---|
| `index.html` | Home page: hero with sample workpaper, problem, deliverables, sample package (3 views), process, who we serve, data handling, FAQ, contact form |
| `privacy/index.html`, `terms/index.html` | Rewritten for the WIP service |
| `styles.css`, `main.js` | Styles; nav, tabs, reveal, mail-link helper, form |
| `tools/verify-wip.mjs` | Recomputes every sample figure from the inputs in `index.html` and fails on any mismatch |
| `tools/og.html` | Source for `og-image.png` |
| `robots.txt`, `sitemap.xml`, `favicon.svg`, `og-image.png` | SEO and brand assets |
| `vercel.json` | From main: trailing slashes, `*.vercel.app` redirects to https://www.mapdeltahq.com, security headers, font caching |

Retained from the old site: fonts, the `vercel.json` redirect, the FormSubmit delivery approach, the mail-link helper, the navigation pattern. Removed: the MAP hero chart, spring animation code, anatomy-of-a-flag section, sample MAP report, pricing ledger, comparison table, snapshot form and all MAP copy.

## Run and deploy
```bash
cd Mapdeltahq
python3 -m http.server 5173     # open http://localhost:5173
node tools/verify-wip.mjs        # checks the sample WIP figures
```
Deploy: push this folder to the Vercel project (root directory `Mapdeltahq`). Nothing to build.

## Owner TODOs before launch
1. **Activate the form once.** The form posts to FormSubmit (`https://formsubmit.co/ajax/billing@mapdeltahq.com`). The first submission triggers an activation email to that inbox; click the link or nothing is delivered. Until then visitors see an error with an email fallback, so no enquiry is lost silently. To use another backend, change `data-endpoint` on `#contact-form`.
2. **Confirm the mailbox** `billing@mapdeltahq.com` receives mail (footer, form, legal pages).
3. **Booking link.** "Book a WIP Discussion" goes to the contact form. If you set up a calendar link (Calendly, Cal.com, etc.), point the CTAs at it.
4. **Verify the data-handling practices.** The Data handling section and Privacy Policy describe seven working practices (client-controlled file sharing, no ERP passwords, limited access, defined scope, version-controlled workpapers, documented adjustments, agreed retention and deletion). They are worded as practices, with an explicit "no certifications" note. Only keep each one if you will actually do it.
5. **Confirm the day-10 commitment** and the WIP Rebuild scope (up to 30 jobs). Pricing is intentionally not shown.
6. **Legal review.** Privacy and Terms were rewritten for this service but not reviewed by counsel. Terms section 12 (governing law) still needs a named law and venue once your entity exists (`TODO(owner)` in `terms/index.html`).
7. **Domain.** Canonical, Open Graph and sitemap URLs use `https://www.mapdeltahq.com/`, matching the redirect in `vercel.json`. Make sure the apex domain redirects to www in Vercel.
8. Optional: add a real case study or testimonial only when you have an approved one. None is shown.
9. **Merged with the earlier deduction-recovery redesign.** The WIP site replaced that redesign on main. Its extra pages and icons are kept in `docs/archive/deduction-site/`, and its docs remain in `docs/`. The `src/` and `scripts/build.py` generator from that redesign is still in the repo but is not used by this site: running it would overwrite `Mapdeltahq/` with the old pages. Delete or adapt it before anyone runs it.

## Claims to keep verified
Nothing on the site asserts customers, years of experience, certifications, ERP partnerships, security controls beyond the seven practices above, or outcomes. Sample figures are fictional and labelled. The site states MapDelta is not a CPA firm and gives no accounting, audit, tax, legal or surety advice.
