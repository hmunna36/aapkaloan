# Credit bureau (CIBIL) integration

The website can fetch a visitor's credit score live: consent → PAN / date of birth / mobile → OTP → score,
band and the factors affecting it, with a lead raised automatically for the advisory team.

Everything in this repo is **built and working**. What's missing is bureau access, which has to be bought,
not coded. This page explains what to get, and what to change once you have it.

---

## 1. What you actually need

**CIBIL has no public API you can sign up for.** TransUnion CIBIL does not sell self-serve API access the way a
payment gateway does. There are two legitimate routes:

### Route A — through an aggregator (faster, normal choice)

Licensed fintech platforms already hold bureau agreements and resell access over a modern REST API. In India the
commonly used ones include **Setu, Signzy, Decentro, Surepass, Karza (now Perfios), HyperVerge** and similar
KYC/credit-data providers. Typically involved:

- A signed agreement and KYC of your business (GST, PAN, CIN, address proof)
- Per-pull pricing, usually prepaid credits
- A sandbox with test PANs, then production keys
- Approval of the consent text you show the visitor

Timeline is usually days to a few weeks. This is the practical route for a loan-advisory business.

### Route B — direct bureau membership

A direct agreement with TransUnion CIBIL (or Experian, Equifax, CRIF High Mark). This normally requires being a
regulated credit institution — a bank, NBFC or another entity permitted under the **Credit Information Companies
(Regulation) Act, 2005** — or qualifying as a specified user. It brings a member ID, certificate-based
authentication and IP whitelisting, and a longer onboarding.

> A ready-to-send request covering eligibility, pricing, technical and compliance questions is in
> **[BUREAU-ACCESS-REQUEST.md](BUREAU-ACCESS-REQUEST.md)** — fill in the placeholders and email it to two or three
> providers. To demo the flow meanwhile, see **[DEMO-SCRIPT.md](DEMO-SCRIPT.md)**.

> Ask any provider two questions before signing: *"Can a loan DSA / advisory firm use this?"* and *"Is the consumer
> consent flow included?"* If the answer to either is no, that provider won't work for this site.

### Compliance that applies either way

- **Explicit consumer consent** before every pull, with a declared purpose — the site captures and timestamps this.
- **Soft enquiry.** A consumer checking their own score must not affect it. Confirm the provider does a soft pull;
  the site tells visitors it won't affect their score.
- **Data protection (DPDP Act, 2023).** PAN and score are personal data. This site stores neither — see §4.
- A **Privacy Policy** page is effectively mandatory before you collect PAN. It's still outstanding (see CONTENT-TODO.md).

---

## 2. Turning it on

Three modes, set by `CIBIL_PROVIDER` (server) with `NEXT_PUBLIC_CIBIL_MODE` mirroring it (browser):

| Mode | `CIBIL_PROVIDER` | `NEXT_PUBLIC_CIBIL_MODE` | Behaviour |
| --- | --- | --- | --- |
| Off (default) | `off` or unset | `off` | No live check. The CIBIL section shows the enquiry form, as before. |
| Demo | `mock` | `mock` | Full flow with **sample data**, labelled "Demo mode" in the UI. OTP is `123456`. For client demos. |
| Live | `http` | `live` | Real pulls through your provider. |

Demo mode is already enabled for local development in `.env.local`. **Never set `mock` on the production site** —
it would show visitors invented numbers. The default is `off` precisely so that can't happen by accident.

For live mode also set:

```bash
CIBIL_PROVIDER=http
NEXT_PUBLIC_CIBIL_MODE=live
CIBIL_API_BASE_URL=https://api.yourprovider.com
CIBIL_API_KEY=...
CIBIL_API_CLIENT_ID=...          # if the provider issues one
CIBIL_BUREAU_NAME=CIBIL          # shown to the visitor
CIBIL_SESSION_SECRET=<long random string>   # encrypts the check token
CIBIL_HASH_SALT=<long random string>        # salts PAN/IP hashes
```

Generate the secrets with `openssl rand -base64 32`.

---

## 3. Wiring your provider

Only one file changes: **`src/lib/cibil/providers/http.ts`**. It has three marked sections:

1. **EDIT 1 — auth.** Bearer token, basic auth, or the provider's own header.
2. **EDIT 2 — initiate.** The "start a score pull" request: field names for PAN, date of birth, mobile and consent,
   and where the reference ID comes back.
3. **EDIT 3 — verify.** The OTP submit, plus mapping their response onto `score`, `factors` and `summary`.

The shapes currently in that file are **generic placeholders**, not any real provider's API — replace them with the
provider's documented request and response.

Then:

```bash
npm run dev            # with sandbox keys
```

Run one sandbox pull end to end before switching production on.

Notes:

- **Mutual TLS.** Direct bureau membership often requires a client certificate. Node's global `fetch` can't attach
  one — use `undici`'s `Agent` with a `connect.cert`/`connect.key`, or the `https` module, inside `call()`.
- **A different bureau** (Experian, Equifax, CRIF) needs no structural change: same adapter, different mapping, and
  set `CIBIL_BUREAU_NAME`.
- **No OTP step?** Some providers verify identity differently. Return `otpRequired: false` from `initiate` and the
  UI can be adjusted to skip that step.

---

## 4. How the data is handled

- **The PAN is never stored.** It's validated, sent to the provider, hashed for rate limiting, and dropped. It is
  never written to a database, a log or the lead record.
- **Nothing sensitive is logged.** The audit line records a salted PAN hash and the consent timestamp only — never
  the PAN, date of birth or OTP.
- **The browser only ever sees a masked PAN** (`ABC****34F`).
- **No server session.** The handle between "send OTP" and "verify OTP" is an AES-256-GCM encrypted token that
  expires in 10 minutes and carries no raw PAN. Tampering with it fails the auth tag and is rejected. This also
  means the flow works on serverless, where the two requests may hit different instances.
- **Abuse limits** (per IP, mobile and PAN hash, plus OTP attempts per check) are in-memory and therefore
  best-effort per instance. For strict limits in production, back `src/lib/cibil/sessions.ts` with Redis (Upstash);
  nothing else changes.
- **The lead** raised after a successful check carries name, mobile, city, score and band — never PAN or DOB.

---

## 5. Files

| File | Role |
| --- | --- |
| `src/lib/cibil/types.ts` | Provider contract and shared types |
| `src/lib/cibil/index.ts` | Chooses the provider from `CIBIL_PROVIDER` |
| `src/lib/cibil/providers/mock.ts` | Sample data for demos |
| `src/lib/cibil/providers/http.ts` | **Edit this** for your real provider |
| `src/lib/cibil/token.ts` | Encrypted, expiring check token |
| `src/lib/cibil/validate.ts` | PAN / DOB / mobile validation, masking, hashing |
| `src/lib/cibil/sessions.ts` | Rate limiting |
| `src/app/api/cibil/initiate/route.ts` | Step 1: consent + identity → OTP |
| `src/app/api/cibil/verify/route.ts` | Step 2: OTP → score, then raises the lead |
| `src/components/tools/CibilScoreCheck.tsx` | The visitor-facing flow |
| `src/components/tools/CibilCheck.tsx` | Section wrapper; falls back to the enquiry form when off |

---

## 6. Full credit reports

The current integration returns a **score with factors and a summary** (open accounts, overdue, enquiries,
utilisation). A full report — every tradeline, address history and dispute detail — is a different, costlier product
and carries heavier data-protection obligations.

If you want that for the CIBIL rectification service, the same adapter extends with a `fetchReport` method; the
retrieved report should be shown to the customer in a session and not stored on the website.
