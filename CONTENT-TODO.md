# Content to confirm before launch

The brief left some fields blank, and some content was carried over from the current site. Everything below is
**placeholder or assumed**. Please confirm or replace it.

## 1. Leadership (`src/content/team.ts`)
Updated on 2026-09-28 from the client's leadership table: five leaders, with names, designations, photos and LinkedIn
links exactly as in the table, and bios condensed from their LinkedIn write-ups.
- [ ] **Nagarajan V** — the table has no LinkedIn link, write-up or message. His bio is built from the table's
      "20 years + banking experience; Loans | Property Loan | MSME Loan Expert". No LinkedIn button shows until a link is added.
- [ ] Sita Rama Raju V's education is listed as "BA, MBA, (LLB)" in the table and shown as "BA, MBA (LLB)". Confirm
      whether the LLB is completed.

## 2. Business facts (`src/content/site.ts`)
Carried over from the current aapkaloan.com. Please confirm they are still accurate:
- [ ] "Since 2010" (shows as 16+ years)
- [ ] "100+ bank & NBFC channels" (the current site also says 125+ in one place)
- [ ] "₹100 Cr+ funding facilitated"
- [ ] "4.7★ Google rating"
- [ ] Testimonials (Reshma Marathi, Roopa Devi, Venkatesh C)
- [ ] Working hours (currently assumed Mon–Sat, 9:30 AM – 6:30 PM)

## 3. Branches (`src/content/branches.ts`)
- [ ] Bengaluru address. The current site shows **two** different Jayanagar addresses (#820 RNS Reddy Complex, and
      #1/1 4th Cross, 7th Block (W) on the Bengaluru page). The new site uses #820 RNS Reddy Complex.
- [ ] Chennai phone number. It currently shows the Bengaluru landline, +91 80 4991 0994.
- [ ] Map pins are approximate: JSS Circle for Bengaluru, and Anna Salai near Gemini for Chennai. The "Get directions" links use the full address.
- [ ] Any additional branches

## 4. Products (`src/content/loans.ts`, `src/content/funding.ts`)
- [ ] Indicative figures, marked with * on the site: tenure, loan-to-value and collateral notes. Please check them against current lender policies.
- [ ] "Other secured / unsecured" product lists (Lease Rental Discounting, Car, Gold, Personal, Professional, Education, etc.).
      These come from the current site's menu plus common advisory products. Remove any you don't offer.

## 5. Legal & compliance
- [ ] Privacy Policy and Terms pages. These aren't in the brief but are recommended before collecting leads (DPDP
      Act, 2023) and effectively **required before collecting PAN** for the live credit check.
- [ ] Footer disclaimer wording (currently: "advisory & facilitation service, not a lender; rates indicative; not affiliated with TransUnion CIBIL")
- [ ] Consent line on forms, and the "details are confidential" statement

## 6. Setup
- [ ] `LEAD_WEBHOOK_URL`: the CRM or automation endpoint that should receive leads
- [ ] **Credit bureau access for the live CIBIL check** — the flow is built, but needs an account with a bureau
      aggregator (or a direct bureau membership). See [docs/CIBIL-INTEGRATION.md](docs/CIBIL-INTEGRATION.md).
      Until then the site shows the CIBIL enquiry form, which is the safe default.
- [ ] Vector logo (SVG/AI), if available — the updated logo (29 Sep) came as a 9000px PNG inside a PDF, which is sharp enough for the web
- [ ] Production map tile provider (see README)

> Note: the WhatsApp link on the current live site (`wa.me/9900092109`) is missing the country code and may not open a chat.
> The new site uses `wa.me/919900092109`.

## 7. Client update list — waiting on files
- [ ] **Leadership Posters** — the home slides should follow them. The slides are built; the copy in
      `src/content/heroSlides.ts` is a placeholder from the existing site. Add each poster as that slide's `image`.

## 8. New copy to approve
- [ ] "Partner with us" tab — heading, intro and the three benefit points (`src/components/consultation/EnquiryTabs.tsx`,
      `ConsultationProvider.tsx`). We have not promised any commercial terms.
- [ ] Partner categories in the dropdown (`partnerTypes` in `src/lib/leads.ts`) — remove any AapKaLoan doesn't onboard.
- [ ] Home slide trigger questions (`src/content/heroSlides.ts`).
- [ ] About Us company paragraph (`src/app/about/page.tsx`) — merged from the three paragraphs that were there before.
