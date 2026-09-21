# Demo details — credit score check

Use these to demo the CIBIL flow before real bureau access is in place. Everything is **sample data**; no bureau is
contacted, nothing is charged, and the screen says "Demo mode" throughout.

## Turn demo mode on

Already enabled locally in `.env.local`:

```bash
CIBIL_PROVIDER=mock
NEXT_PUBLIC_CIBIL_MODE=mock
CIBIL_HASH_SALT=local-dev-salt
```

Then `npm run dev` and open **http://localhost:3100/resources#cibil-check** (or the homepage → "Check your CIBIL").

> Never set these on the live site. The default is `off`, which shows the enquiry form instead — so real visitors can
> never be shown invented numbers.

## What to type

| Field | What to enter |
| --- | --- |
| Full name | Any name, e.g. *Demo Customer* |
| **PAN** | One of the four below — **this decides the score** |
| Date of birth | Any date 18+ years ago, e.g. *14/03/1988* |
| Mobile | Any valid Indian mobile, e.g. *9876543210* (no OTP is really sent) |
| City | Anything, or leave blank |
| Consent | Must be ticked — the form won't submit otherwise |
| **OTP** | **`123456`** (shown on screen in demo mode) |

## PANs for each outcome

The same PAN always gives the same score, so demos are repeatable:

| PAN | Score | Band | Good for showing |
| --- | --- | --- | --- |
| `AAPKA0023X` | **800** | Excellent | The happy path — "you can negotiate the best terms" |
| `AAPKA0001B` | **685** | Good | The common case — most lenders will consider you |
| `AAPKA0003D` | **631** | Fair | High utilisation, one overdue account — the advisory upsell |
| `AAPKA0007H` | **380** | Needs attention | The rectification pitch — the "Fix errors on my report" button appears |

Any other correctly formatted PAN (5 letters, 4 digits, 1 letter) also works and returns a consistent score of its own.

> These four map to those scores because of `CIBIL_HASH_SALT=local-dev-salt`. Change the salt and the scores change.
> To recompute after a change, see the snippet at the end of this file.

## Suggested demo flow (about 2 minutes)

1. **Homepage → "Check your CIBIL"** in the Quick start row. The page scrolls to the tools panel on the CIBIL tab.
2. Fill the form with `AAPKA0003D` (Fair). Point out the consent line and "this is a soft enquiry — it does not
   affect your score".
3. OTP `123456` → the score appears on the gauge: **631, Fair**, with what's affecting it and the account summary.
4. Show the follow-through: **"What can I borrow?"** opens the consultation form, and because the score is under 650,
   **"Fix errors on my report"** links to the rectification service.
5. Run `AAPKA0007H` (380) to show the weak-score journey, or `AAPKA0023X` (800) for the strong one.
6. Mention that a lead is raised automatically on every completed check, carrying the score and band but never the PAN.

## Recomputing the PANs after a salt change

```bash
node -e "
const {createHash}=require('crypto');
const SALT=process.env.CIBIL_HASH_SALT||'local-dev-salt';
const hashId=v=>createHash('sha256').update(SALT+':'+v).digest('hex').slice(0,32);
const score=s=>{const h=createHash('sha256').update(s).digest();
  const u1=((h[0]<<8)|h[1])/65535,u2=((h[2]<<8)|h[3])/65535;return Math.round(300+((u1+u2)/2)*600);};
const band=s=>s>=750?'Excellent':s>=650?'Good':s>=550?'Fair':'Needs attention';
const want={};
for(let n=1;n<=99999;n++){const pan='AAPKA'+String(n%10000).padStart(4,'0')+String.fromCharCode(65+(n%26));
  const s=score(hashId(pan)),b=band(s); if(!want[b])want[b]={pan,score:s};
  if(Object.keys(want).length===4)break;}
console.log(want);"
```
