# AapKaLoan — website rebuild (POC)

A redesign and rebuild of [aapkaloan.com](https://www.aapkaloan.com) to the *AapKaLoan Website – Development Requirements* brief:
position AapKaLoan as a **financial advisory & funding partner** first, then lead visitors into loans, and convert them through
interactive tools and a site-wide **Schedule a Consultation** flow.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Leaflet + OpenStreetMap · lucide-react

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

> If `npm install` fails with `EACCES … ~/.npm/_cacache`, your npm cache has root-owned files from an earlier `sudo npm`.
> Fix once with `sudo chown -R $(id -u):$(id -g) ~/.npm`, or install with `--cache /tmp/npm-cache`.

## Pages

| Route | Brief section |
| --- | --- |
| `/` | §2 Homepage — hero, Who is AapKaLoan (bank-vs-us comparison), Financial Solutions, Why AapKaLoan + testimonials, Leadership, Interactive Tools hub, Loan Products, Branches map, final CTA with form |
| `/about` | §4 About — intro, what we do, core expertise, customer segments, vision, mission, approach, full leadership profiles with LinkedIn CTA |
| `/loans` | §6 Loans overview — Secured vs Unsecured, comparison table, EMI calculator |
| `/loans/secured`, `/loans/unsecured` | §6–7 Product tabs (deep-linkable `?product=home-loan`) — overview, eligibility, key features, documents, use cases, enquiry CTA, Schedule a Consultation |
| `/funding-solutions` | §5 Banking, NBFC, VC Funding, Private Placement, School Funding, Other |
| `/funding-solutions/school-funding` | §5 Dedicated school-funding landing page — who benefits, requirements, funding types, AapKaLoan's role, documents, FAQ, dedicated enquiry form |
| `/resources` | §8–10 CIBIL Score Enquiry, CIBIL Rectification (WhatsApp), EMI Calculator, Requirement Finder, FAQ |
| `/contact` | §11–12 Consultation booking form, contact channels, branches on an interactive map |

Navigation follows §3 exactly: **Home | About Us | Loans | Funding Solutions | Resources | Contact Us**, with short dropdowns
instead of every product in the top menu.

## Conversion features (§8–11, §14–15)

- **Schedule a Consultation** — one global modal (`ConsultationProvider`) opened from the header, hero, About, Leadership, product
  tabs, funding pages, footer and every tool. Any link ending in `#schedule-consultation` also opens it.
- **CIBIL Score Enquiry** — "Do you know your CIBIL score?" with an interactive score gauge. With a bureau provider
  configured it becomes a **live check**: consent → PAN / DOB / mobile → OTP → score, band and the factors behind it,
  and a lead raised automatically. Off by default (shows the enquiry form instead) —
  see **[docs/CIBIL-INTEGRATION.md](docs/CIBIL-INTEGRATION.md)**.
- **CIBIL Rectification** — pick issues → **Chat on WhatsApp** with a pre-filled message (CIBIL issue → WhatsApp immediately).
- **EMI Calculator** — amount / rate / tenure, presets per loan type; outputs monthly EMI, total interest, total payable,
  principal-vs-interest split and a yearly schedule; then *"Want to explore your loan options? Talk to AapKaLoan"* → Consultation / WhatsApp.
- **Requirement Finder** — "What kind of funding are you looking for?" (the 9 options from the brief) → amount & timeline → call-back request.
- **Mobile** — sticky Call / WhatsApp / Consultation bar; floating WhatsApp button on desktop.

## Leads → CRM

Every form posts to `POST /api/lead` (`src/app/api/lead/route.ts`), which validates the lead (Indian mobile, consent,
honeypot) and forwards it as JSON to **`LEAD_WEBHOOK_URL`** — any Zapier / Make / n8n webhook or CRM web-to-lead endpoint
(Zoho, HubSpot, LeadSquared…). Without it set, leads are printed to the server log. See `.env.example`.

Each lead carries a `type` (`consultation`, `product-enquiry`, `requirement-finder`, `cibil-check`, `cibil-rectification`,
`emi-calculator`, `school-funding`, `contact`), the page it came from, and a reference ID shown to the visitor.

Before launch, add rate limiting (e.g. Vercel WAF or Upstash) to `/api/lead`.

## Credit score check

`/api/cibil/initiate` and `/api/cibil/verify` run the live bureau check behind a provider adapter, so any bureau or
aggregator drops in by editing one file. The PAN is never stored or logged, and the step between OTP send and verify
uses an encrypted, expiring token rather than a server session. Read
**[docs/CIBIL-INTEGRATION.md](docs/CIBIL-INTEGRATION.md)** before enabling it — it covers what bureau access to buy,
the compliance requirements, and how to wire the provider. To demo the flow before access is in place, see
**[docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md)**; to request access from providers, send
**[docs/BUREAU-ACCESS-REQUEST.md](docs/BUREAU-ACCESS-REQUEST.md)**.

## Editing content

All copy and data lives in `src/content/` — no component changes needed:

| File | What's in it |
| --- | --- |
| `site.ts` | Phone, WhatsApp, email, hours, social links, headline stats, testimonials, vision, mission |
| `team.ts` | Leadership profiles (photos in `public/team/`) |
| `loans.ts` | Secured / unsecured products and all product details |
| `funding.ts` | Funding solutions and requirement-finder options |
| `branches.ts` | Branch addresses, phones, hours and map coordinates |
| `navigation.ts` | Top navigation |

Items still needing client input are listed in **[CONTENT-TODO.md](CONTENT-TODO.md)**.

## Brand

The official logo is cut from the supplied artwork into transparent PNGs in `public/brand/` (`-light` variants swap the brown
for ivory on dark backgrounds). The favicon (`src/app/icon.png`), Apple touch icon and social-share image
(`src/app/opengraph-image.png`) are generated from it. Colour tokens in `src/app/globals.css` are built from the logo's
gold `#CA903F` and brown `#5C2A11`. If a vector (SVG/AI) logo is available, drop it into `public/brand/` for the sharpest result.

## Map

The branch map uses Leaflet with OpenStreetMap tiles (no API key). OSM's public tiles are fine for a POC; for production
traffic switch the tile URL in `src/components/branches/BranchMap.tsx` to a provider such as MapTiler, Stadia or Google Maps.

## Deploy

Deploys as-is to Vercel (or any Node host): set `LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_SITE_URL`, then `npm run build`.
