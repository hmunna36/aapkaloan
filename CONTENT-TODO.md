# Content to confirm before launch

The brief left some fields blank, and some content was carried over from the current site. Everything below is
**placeholder or assumed**. Please confirm or replace it.

## 1. Leadership (`src/content/team.ts`) — highest priority
The brief's table (Name / Designation / LinkedIn / Experience / Message) was empty.
- [ ] **Photo ↔ name mapping.** Photos were matched to names in the order they appear in the brief:
  grey suit (bald) → **Raghu**, glasses / navy blazer → **Suresh**, grey blazer (smiling) → **Nagarajan**, black suit → **Pradeep**.
- [ ] Designation for each (currently "Leadership Team")
- [ ] Years of experience (currently "XX+")
- [ ] 2–3 line professional bio (currently placeholder text)
- [ ] Expertise tags: Banking / NBFC / VC Funding / Private Placement / Financial Services (the current tags are guesses)
- [ ] LinkedIn profile URL (the button stays inactive until one is added)
- [ ] Optional personal message / quote (the brief's "Message" column)

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
- [ ] Privacy Policy and Terms pages. These aren't in the brief but are recommended before collecting leads (DPDP Act, 2023).
- [ ] Footer disclaimer wording (currently: "advisory & facilitation service, not a lender; rates indicative; not affiliated with TransUnion CIBIL")
- [ ] Consent line on forms, and the "details are confidential" statement

## 6. Setup
- [ ] `LEAD_WEBHOOK_URL`: the CRM or automation endpoint that should receive leads
- [ ] Vector logo (SVG/AI), if available
- [ ] Production map tile provider (see README)

> Note: the WhatsApp link on the current live site (`wa.me/9900092109`) is missing the country code and may not open a chat.
> The new site uses `wa.me/919900092109`.
