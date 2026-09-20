import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, KeyRound, ShieldCheck, Unlock } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { loanCategories } from "@/content/loans";

export const metadata: Metadata = {
  title: "Loans — Secured & Unsecured",
  description:
    "Home Loan, Loan Against Property, MSME and Business Loans — compared across 100+ banks and NBFCs by AapKaLoan. Understand secured vs unsecured loans and find the right fit.",
  alternates: { canonical: "/loans" },
};

const compare = [
  { label: "What backs the loan", secured: "Property or another asset", unsecured: "Your income & credit profile" },
  { label: "Typical amount", secured: "Higher", unsecured: "Moderate" },
  { label: "Typical tenure", secured: "Longer — up to 15–30 years", unsecured: "Shorter — 1 to 7 years" },
  { label: "Interest rates", secured: "Generally lower", unsecured: "Generally higher" },
  { label: "Processing time", secured: "Longer (valuation & legal)", unsecured: "Faster" },
];

export default function LoansPage() {
  const cats = [
    { key: "secured" as const, icon: KeyRound },
    { key: "unsecured" as const, icon: Unlock },
  ];

  return (
    <>
      <PageHero
        eyebrow="Loans"
        title={
          <>
            Start with what you have. <span className="italic text-bronze-300">We'll find who funds it best.</span>
          </>
        }
        intro="Every loan is either secured against an asset or unsecured. Choose your path below — or tell us your requirement and we'll recommend the right one."
        crumbs={[{ label: "Home", href: "/" }, { label: "Loans" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ConsultButton className="btn btn-primary btn-lg">Schedule a Consultation</ConsultButton>
          <Link href="/resources#requirement-finder" className="btn btn-outline-light btn-lg">
            Tell us your requirement
          </Link>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-4 lg:grid-cols-2">
          {cats.map(({ key, icon: Icon }) => {
            const c = loanCategories[key];
            return (
              <article key={key} className="card flex flex-col p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-900 text-bronze-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-bronze-700">{c.kicker}</span>
                </div>
                <h2 className="heading mt-6 text-4xl text-ink-950">{c.title}</h2>
                <p className="mt-3 leading-relaxed text-ink-600">{c.summary}</p>
                <p className="mt-4 text-sm text-ink-700">
                  <span className="font-bold">Best for:</span> {c.bestFor}
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                  {c.products.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/loans/${key}?product=${p.slug}`}
                        className="group flex h-full items-center justify-between gap-2 rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm font-bold text-ink-900 transition hover:border-bronze-400 hover:bg-white"
                      >
                        {p.name}
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-bronze-600" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/loans/${key}`} className="btn btn-dark mt-8 self-start">
                  Explore {c.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="container-x mt-16">
          <SectionHeading eyebrow="At a glance" title="Secured vs unsecured" />
          <div className="card mt-8 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50 text-xs uppercase tracking-[0.12em]">
                  <th scope="col" className="p-4 font-bold text-ink-500">
                    <span className="sr-only">Aspect</span>
                  </th>
                  <th scope="col" className="p-4 font-bold text-ink-900">Secured loans</th>
                  <th scope="col" className="p-4 font-bold text-ink-900">Unsecured loans</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.label} className="border-b border-sand-200 last:border-0">
                    <th scope="row" className="p-4 font-bold text-ink-900">
                      {r.label}
                    </th>
                    <td className="p-4 text-ink-700">{r.secured}</td>
                    <td className="p-4 text-ink-700">{r.unsecured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
            <ShieldCheck className="h-4 w-4 text-moss-500" aria-hidden="true" /> General guidance — actual terms vary by lender and profile.
          </p>
        </div>
      </section>

      <section id="emi-calculator" className="scroll-mt-24 border-t border-sand-200 bg-sand-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="EMI calculator" title="What will your EMI look like?" intro="Adjust the amount, rate and tenure to see your monthly EMI, total interest and total payable." />
          <div className="card mt-10 p-5 sm:p-8">
            <EmiCalculator />
          </div>
        </div>
      </section>
    </>
  );
}
