import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/Section";
import { FundingIcon } from "@/components/ui/FundingIcon";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { fundingSolutions } from "@/content/funding";

export const metadata: Metadata = {
  title: "Funding Solutions — Banking, NBFC, VC, Private Placement & School Funding",
  description:
    "AapKaLoan arranges bank finance, NBFC funding, venture capital, private placement and dedicated school funding — structured around your requirement.",
  alternates: { canonical: "/funding-solutions" },
};

const requirementFor: Record<string, string> = {
  banking: "Banking / Working Capital",
  nbfc: "NBFC Financing",
  "vc-funding": "VC Funding",
  "private-placement": "Private Placement",
  "school-funding": "School Funding",
  other: "Business Funding",
};

export default function FundingPage() {
  return (
    <>
      <PageHero
        eyebrow="Funding solutions"
        title={
          <>
            Beyond loans — <span className="italic text-bronze-300">capital for every stage.</span>
          </>
        }
        intro="AapKaLoan is more than a loan provider. From bank finance to venture capital and private placement, we structure and raise the capital your plans need."
        crumbs={[{ label: "Home", href: "/" }, { label: "Funding Solutions" }]}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Choose a funding type</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {fundingSolutions.map((f) => (
            <li key={f.id}>
              <Link
                href={f.id === "school-funding" ? "/funding-solutions/school-funding" : `#${f.id}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  f.featured
                    ? "border-bronze-400 bg-bronze-500 text-ink-950 hover:bg-bronze-400"
                    : "border-white/15 bg-white/[0.04] text-ink-300 hover:border-bronze-300 hover:text-ivory"
                }`}
              >
                <FundingIcon name={f.icon} className="h-4 w-4" />
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="py-12 md:py-20">
        <div className="container-x space-y-5">
          {fundingSolutions.map((f, i) => (
            <article
              key={f.id}
              id={f.id}
              className={`scroll-mt-28 overflow-hidden rounded-[1.5rem] ${
                f.featured ? "grain relative bg-ink-950 text-ivory" : "card"
              }`}
            >
              {f.featured && <div className="grid-lines absolute inset-0" aria-hidden="true" />}
              <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                <div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${
                        f.featured ? "bg-bronze-500 text-ink-950" : "bg-ink-900 text-bronze-300"
                      }`}
                    >
                      <FundingIcon name={f.icon} className="h-6 w-6" />
                    </span>
                    <span className={`num text-sm font-bold ${f.featured ? "text-bronze-300" : "text-ink-400"}`}>
                      {String(i + 1).padStart(2, "0")}
                      {f.featured && <span className="ml-3 rounded-full border border-bronze-300/40 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em]">Focus sector</span>}
                    </span>
                  </div>
                  <h2 className={`heading mt-6 text-4xl ${f.featured ? "" : "text-ink-950"}`}>{f.name}</h2>
                  <p className={`mt-2 text-lg font-semibold ${f.featured ? "text-bronze-300" : "text-bronze-700"}`}>{f.tagline}</p>
                  <p className={`mt-4 leading-relaxed ${f.featured ? "text-ink-300" : "text-ink-600"}`}>{f.description}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ConsultButton
                      className="btn btn-primary"
                      preset={{ title: `Discuss ${f.name}`, requirement: requirementFor[f.id] }}
                    >
                      Discuss {f.name.replace(" Solutions", "")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </ConsultButton>
                    {f.id === "school-funding" && (
                      <Link href="/funding-solutions/school-funding" className="btn btn-outline-light">
                        School funding in detail <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <List title="Who it's for" items={f.forWhom} dark={f.featured} />
                  <List title="How AapKaLoan helps" items={f.howWeHelp} dark={f.featured} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function List({ title, items, dark }: { title: string; items: string[]; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${dark ? "bg-white/[0.05] ring-1 ring-white/10" : "bg-sand-50"}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${dark ? "text-bronze-300" : "text-bronze-700"}`}>{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it} className={`flex gap-2.5 text-sm ${dark ? "text-ink-300" : "text-ink-700"}`}>
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-bronze-300" : "text-moss-500"}`} aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
