import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Mail, Phone, Quote, Star, X } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/ui/Section";
import { FundingIcon } from "@/components/ui/FundingIcon";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { LeaderCard } from "@/components/team/LeaderCard";
import { ToolsHub } from "@/components/tools/ToolsHub";
import { Branches } from "@/components/branches/Branches";
import { LeadForm } from "@/components/consultation/LeadForm";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { fundingSolutions } from "@/content/funding";
import { loanCategories } from "@/content/loans";
import { site, testimonials } from "@/content/site";
import { team } from "@/content/team";
import { whatsappUrl } from "@/lib/whatsapp";

const comparison = [
  { topic: "Choice", bank: "One lender's products", us: "100+ banks, NBFCs and private capital routes" },
  { topic: "Advice", bank: "Product-led — what the bank sells", us: "Requirement-led and lender-neutral" },
  { topic: "Paperwork", bank: "You work out what's needed", us: "We prepare and structure your file" },
  { topic: "If declined", bank: "Start over somewhere else", us: "We route you to the next best-fit lender" },
  { topic: "Terms", bank: "Standard rate card", us: "We negotiate rate, tenure and fees for you" },
  { topic: "After sanction", bank: "You chase disbursement", us: "Support until funds are in your account" },
];

const reasons = [
  { title: "Expertise", text: "Leadership with backgrounds across banking, NBFCs, venture capital and private placement — we know how credit decisions are really made." },
  { title: "Multiple funding channels", text: "Public and private banks, NBFCs, venture investors and private capital. Your options aren't limited to one institution's appetite." },
  { title: "End-to-end support", text: "From the first conversation to documentation, sanction and disbursement — one team owns the process." },
  { title: "Customised solutions", text: "We structure around your cash flows, assets and goals instead of forcing you into an off-the-shelf product." },
  { title: "Faster, structured assistance", text: "A complete, well-presented file gets decisions faster — and avoids the rejections that hurt your credit score." },
];

export default function HomePage() {
  const featured = fundingSolutions.find((f) => f.featured)!;
  const others = fundingSolutions.filter((f) => !f.featured);

  return (
    <>
      <Hero />

      {/* 01 — Who is AapKaLoan */}
      <section className="py-20 md:py-28" aria-labelledby="who">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow">
                <span className="num opacity-70">01</span> Who is AapKaLoan?
              </p>
              <h2 id="who" className="heading mt-4 text-[2.1rem] text-ink-950 sm:text-[2.6rem] md:text-5xl">
                Not a lender. <span className="italic text-bronze-600">Your side of the table.</span>
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-600">
                <p>
                  AapKaLoan is a financial advisory and funding partner, headquartered in Bengaluru with a regional office in
                  Chennai. Since {site.since}, we've helped salaried families, professionals, MSMEs, schools and growing
                  companies raise capital on the right terms.
                </p>
                <p>
                  A bank can only offer you its own products. We start with your requirement, then find the institution — and
                  the structure — that fits it best.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="btn btn-dark">
                  About AapKaLoan <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <ConsultButton className="btn btn-outline">Schedule a Consultation</ConsultButton>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="grid grid-cols-2 border-b border-sand-200 bg-sand-50 text-xs font-bold uppercase tracking-[0.12em] sm:grid-cols-[8rem_1fr_1fr]">
                <span className="hidden p-4 sm:block" />
                <span className="p-4 text-ink-500 sm:border-l sm:border-sand-200">Going to a bank directly</span>
                <span className="border-l border-sand-200 bg-ink-950 p-4 text-bronze-300">With AapKaLoan</span>
              </div>
              <dl>
                {comparison.map((c) => (
                  <div key={c.topic} className="grid grid-cols-2 border-b border-sand-200 text-sm last:border-b-0 sm:grid-cols-[8rem_1fr_1fr]">
                    <dt className="col-span-2 px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink-500 sm:col-span-1 sm:p-4 sm:text-sm sm:normal-case sm:tracking-normal sm:text-ink-900">
                      {c.topic}
                    </dt>
                    <dd className="flex gap-2 p-4 text-ink-500 sm:border-l sm:border-sand-200">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
                      {c.bank}
                    </dd>
                    <dd className="flex gap-2 border-l border-sand-200 bg-bronze-100/50 p-4 font-semibold text-ink-900">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
                      {c.us}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Financial solutions */}
      <section className="border-y border-sand-200 bg-sand-50 py-20 md:py-28" aria-labelledby="solutions">
        <div className="container-x">
          <SectionHeading
            index="02"
            eyebrow="Financial solutions"
            title={
              <span id="solutions">
                Capital for every stage — <span className="italic text-bronze-600">not just loans.</span>
              </span>
            }
            intro="From bank finance to venture capital and private placement, we arrange the funding route that suits where you are — and where you're going."
            action={
              <Link href="/funding-solutions" className="link-arrow">
                All funding solutions <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/funding-solutions/school-funding"
              className="grain group relative flex flex-col overflow-hidden rounded-[1.25rem] bg-ink-950 p-7 text-ivory md:col-span-2 lg:col-span-1 lg:row-span-3 lg:p-8"
            >
              <div className="grid-lines absolute inset-0" aria-hidden="true" />
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-bronze-500 text-ink-950">
                    <FundingIcon name={featured.icon} className="h-6 w-6" />
                  </span>
                  <span className="rounded-full border border-bronze-300/40 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-bronze-300">
                    Focus sector
                  </span>
                </div>
                <h3 className="heading mt-8 text-3xl lg:text-4xl">{featured.name}</h3>
                <p className="mt-3 text-ink-300">{featured.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-ink-300">
                  {["Campus construction & expansion", "Transport, labs & smart classrooms", "Working capital & refinancing"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-bronze-300" aria-hidden="true" /> {t}
                    </li>
                  ))}
                </ul>
                <span className="link-arrow mt-auto pt-8 !text-bronze-300 group-hover:!text-ivory">
                  Explore school funding <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {others.map((f) => (
              <Link
                key={f.id}
                href={`/funding-solutions#${f.id}`}
                className={`card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${
                  f.id === "other" ? "md:col-span-2" : ""
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand-100 text-bronze-700 transition group-hover:bg-ink-900 group-hover:text-bronze-300">
                  <FundingIcon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink-950">{f.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.tagline}</p>
                <span className="link-arrow mt-auto pt-5 text-sm">
                  Learn more <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Why AapKaLoan */}
      <section className="py-20 md:py-28" aria-labelledby="why">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              index="03"
              eyebrow="Why AapKaLoan?"
              title={
                <span id="why">
                  Why clients choose us <span className="italic text-bronze-600">over going direct.</span>
                </span>
              }
              intro="Approaching a lender directly gets you one answer. Approaching AapKaLoan gets you the best answer available."
            />
            <ConsultButton className="btn btn-primary mt-8">
              Schedule a Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ConsultButton>
          </div>
          <ol className="divide-y divide-sand-200 border-y border-sand-200">
            {reasons.map((r, i) => (
              <li key={r.title} className="grid grid-cols-[3.5rem_1fr] gap-4 py-7 sm:grid-cols-[5rem_1fr]">
                <span className="display num text-4xl text-bronze-400 sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-ink-950">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{r.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* testimonials */}
        <div className="container-x mt-20">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex text-bronze-500" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-sm font-semibold text-ink-700">Rated 4.7 on Google by our clients</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card flex flex-col p-6">
                <Quote className="h-6 w-6 text-bronze-300" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-ink-950">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Leadership */}
      <section className="border-y border-sand-200 bg-sand-50 py-20 md:py-28" aria-labelledby="leadership">
        <div className="container-x">
          <SectionHeading
            index="04"
            eyebrow="Leadership"
            title={
              <span id="leadership">
                Experience you can <span className="italic text-bronze-600">sit across the table from.</span>
              </span>
            }
            intro="Our leadership brings experience across banking, NBFCs, venture capital, private placement and financial services."
            action={
              <div className="flex flex-wrap gap-3">
                <Link href="/about#leadership" className="btn btn-outline">
                  Full profiles
                </Link>
                <ConsultButton className="btn btn-dark">Speak with our team</ConsultButton>
              </div>
            }
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((l) => (
              <LeaderCard key={l.slug} leader={l} />
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Interactive tools */}
      <section className="py-20 md:py-28" aria-labelledby="tools-title">
        <div className="container-x">
          <SectionHeading
            index="05"
            eyebrow="Interactive tools"
            title={
              <span id="tools-title">
                Get answers now — <span className="italic text-bronze-600">then talk to us.</span>
              </span>
            }
            intro="Check your CIBIL, work out your EMI or tell us what you need. Every tool leads straight to an advisor — no digging through pages."
          />
          <div className="mt-12">
            <ToolsHub />
          </div>
        </div>
      </section>

      {/* 06 — Loan products */}
      <section className="border-y border-sand-200 bg-sand-50 py-20 md:py-28" aria-labelledby="loans">
        <div className="container-x">
          <SectionHeading
            index="06"
            eyebrow="Loan products"
            title={
              <span id="loans">
                Loans, <span className="italic text-bronze-600">clearly organised.</span>
              </span>
            }
            intro="Every loan is either secured against an asset or unsecured. Start with what you can offer — we'll take it from there."
            action={
              <Link href="/loans" className="link-arrow">
                Compare all loans <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {(["secured", "unsecured"] as const).map((key) => {
              const c = loanCategories[key];
              return (
                <div key={key} className="card flex flex-col p-7 lg:p-9">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-bronze-700">{c.kicker}</p>
                  <h3 className="heading mt-2 text-3xl text-ink-950 lg:text-4xl">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-600">{c.summary}</p>
                  <ul className="mt-6 divide-y divide-sand-200 border-y border-sand-200">
                    {c.products.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/loans/${key}?product=${p.slug}`} className="group flex items-center justify-between gap-4 py-4">
                          <span>
                            <span className="block font-bold text-ink-900 group-hover:text-bronze-700">{p.name}</span>
                            <span className="block text-sm text-ink-500">{p.short}</span>
                          </span>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bronze-600" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/loans/${key}`} className="btn btn-dark mt-7 self-start">
                    Explore {c.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 — Branches */}
      <section className="py-20 md:py-28" aria-labelledby="branches">
        <div className="container-x">
          <SectionHeading
            index="07"
            eyebrow="Branches"
            title={
              <span id="branches">
                Meet us in <span className="italic text-bronze-600">Bengaluru or Chennai.</span>
              </span>
            }
            intro="Walk in for a face-to-face consultation, or tap a branch to see it on the map."
          />
          <div className="mt-12">
            <Branches />
          </div>
        </div>
      </section>

      {/* 08 — Final CTA */}
      <section className="grain relative overflow-hidden bg-ink-900 py-20 text-ivory md:py-28" aria-labelledby="final-cta">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-light">Schedule a consultation</p>
            <h2 id="final-cta" className="display mt-5 text-5xl md:text-6xl">
              Tell us what you need. <span className="italic text-bronze-300">We'll find the way.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-300">
              Leave your details and an advisor will call you — or reach us directly, whichever is easier.
            </p>
            <ul className="mt-10 space-y-3">
              <li>
                <a href={site.phone.href} className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-bronze-300/60">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-bronze-300">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Call us</span>
                    <span className="num block font-bold">{site.phone.display}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-wa/60">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-wa text-wa-ink">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Chat on WhatsApp</span>
                    <span className="block font-bold">Message an advisor directly</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition hover:border-bronze-300/60">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-bronze-300">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Email</span>
                    <span className="block font-bold">{site.email}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-ivory p-6 text-ink-900 sm:p-9">
            <h3 className="heading text-3xl">Request a consultation</h3>
            <p className="mt-2 text-sm text-ink-600">Pick a time that suits you. It takes under a minute.</p>
            <div className="mt-7">
              <LeadForm type="consultation" variant="full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
