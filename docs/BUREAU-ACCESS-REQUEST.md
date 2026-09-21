# Credit bureau API access — request to send providers

Send this to two or three providers and compare the replies. Suggested: **Karza (Perfios), IDfy, Signzy, Setu,
Decentro, Surepass** — all hold bureau agreements and expose a REST API.

**Before sending, fill in every `[ ]` placeholder.** Question 1 is the one that decides everything: if a provider
can't onboard a non-lending advisory firm, nothing else matters.

---

## Part A — Cover email (copy, paste, send)

> **Subject:** Credit bureau API access — consumer score & report pull for a loan advisory firm
>
> Hello,
>
> We are **[ legal entity name ]**, a loan advisory and funding facilitation firm operating as **[ DSA / channel
> partner / other — describe ]**, based in Bengaluru with an office in Chennai. We work with 100+ banks and NBFCs and
> advise individuals, MSMEs and educational institutions on raising finance.
>
> We are adding a consent-based credit score check to our website, so a prospective borrower can see their own score
> before we advise them on lenders. The integration is already built and tested against a sandbox interface; we need a
> bureau data partner to go live.
>
> Before we go further, one qualifying question: **can you onboard a loan advisory firm / DSA that is not itself an
> RBI-registered lender for consumer credit score pulls, with the consumer's consent?** If yes, we've attached our
> requirements and questions below.
>
> Expected volume at launch is approximately **[ e.g. 100 ]** pulls per month, growing to **[ e.g. 500–1,000 ]** per
> month within **[ 6–12 ]** months.
>
> Could you share pricing, the minimum commitment, onboarding requirements and your sandbox documentation?
>
> Regards,
> **[ Name ]**, **[ Designation ]**
> **[ Company ]** · **[ Phone ]** · **[ Email ]** · www.aapkaloan.com

---

## Part B — Our details

| | |
| --- | --- |
| Legal entity name | `[ ]` |
| Entity type | `[ Pvt Ltd / LLP / Proprietorship ]` |
| CIN / registration no. | `[ ]` |
| GSTIN | `[ ]` |
| PAN (entity) | `[ ]` |
| Registered address | `[ ]` |
| Website | www.aapkaloan.com |
| Primary contact | `[ name, designation, phone, email ]` |
| Business since | 2010 |
| Nature of business | Loan advisory and funding facilitation — we are not a lender |
| Existing lender tie-ups | `[ list a few bank / NBFC partners — this materially helps eligibility ]` |

## Part C — What we need

1. **Consumer credit score pull**, with the consumer's explicit consent, initiated by the consumer on our website.
2. **Soft enquiry** — a consumer checking their own score must not affect it.
3. **OTP-based identity verification** of the consumer, as part of your flow.
4. Response containing, at minimum:
   - Credit score (300–900) and the bureau it came from
   - Score date
   - Factors affecting the score (reason codes with descriptions)
   - Summary: number of open accounts, overdue accounts, recent enquiries, credit utilisation
5. **Optionally, later:** the full credit report (tradelines, enquiries, dispute details) to support our CIBIL
   rectification service. Please quote this separately.

Bureau preference: **CIBIL (TransUnion)** first; we're open to Experian, Equifax or CRIF High Mark if that's what you
offer — please say which.

## Part D — Questions we need answered

**Eligibility (answer this first)**
1. Can you onboard a loan advisory firm / DSA that is not an RBI-registered credit institution?
2. If not directly, is there a compliant route — for example through one of our lender partners as the credit
   institution of record?
3. What regulatory basis do you rely on for this use case, and what obligations pass to us?

**Commercials**
4. Price per pull for (a) score only, (b) score + factors + summary, (c) full report.
5. Minimum commitment: smallest prepaid pack or monthly minimum?
6. One-time setup, integration or certification fee?
7. Do prepaid credits expire?
8. Volume tiers — at what monthly volumes does the price drop?
9. Is sandbox access free and unlimited?

**Technical**
10. Is the API REST/JSON? Please share documentation and a Postman collection.
11. Does the flow work as: submit PAN + DOB + mobile + consent → OTP to consumer → OTP verified → score returned?
12. Is mutual TLS or IP whitelisting required? (We deploy on a managed cloud platform; static egress IPs may need
    arranging, so tell us early.)
13. Typical and worst-case response time, and your uptime SLA.
14. Rate limits, and how errors and retries are signalled.
15. Sandbox test PANs covering different score bands.

**Compliance & data**
16. Do you provide the consent text we must display, and does it need your approval?
17. Who is the data fiduciary under the DPDP Act, 2023 for this flow — you or us?
18. Are we permitted or required to store the score or report? For how long? Our current design stores neither.
19. What audit records must we retain — consent timestamp, purpose, request reference?
20. Any restrictions on displaying the score or report to the consumer on our website?

**Onboarding**
21. Documents required from us, and expected timeline to production.
22. Is there a security review or a penetration-test requirement?
23. Agreement type and term — please share a draft.

## Part E — How we'll integrate (for your assessment)

Our website is a Next.js application on a managed cloud platform. The bureau call happens **server-side only**; no
credentials or personal data touch the browser.

**We send you:** full name, PAN, date of birth, 10-digit mobile, consent flag with timestamp and declared purpose.

**We expect back:** a reference ID and a masked mobile at initiation; then, after OTP verification, the score, score
date, factors and account summary.

**Our data handling today:** the PAN is validated, passed to the provider and discarded — never stored in a database,
never written to logs (we log a salted hash only), and never returned to the browser beyond a masked form
(`ABC****34F`). The handle between OTP dispatch and verification is an encrypted token that expires in 10 minutes.
We apply rate limits per IP, per mobile and per PAN hash.

If your API differs in shape, that's fine — the integration is written against an adapter interface, so mapping to
your specification is a contained change.

## Part F — What we need to proceed

- [ ] Confirmation on eligibility (question 1)
- [ ] Pricing sheet and minimum commitment
- [ ] API documentation and sandbox credentials
- [ ] Draft agreement
- [ ] Onboarding checklist and timeline
