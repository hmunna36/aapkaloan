import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ClipboardList, Gauge, ShieldAlert } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { CibilCheck } from "@/components/tools/CibilCheck";
import { CibilRectification } from "@/components/tools/CibilRectification";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { RequirementFinder } from "@/components/tools/RequirementFinder";

export const metadata: Metadata = {
  title: "Resources — CIBIL Check, CIBIL Rectification, EMI Calculator",
  description:
    "Free tools from AapKaLoan: check your CIBIL score, get help fixing CIBIL report errors on WhatsApp, calculate your loan EMI and tell us your funding requirement.",
  alternates: { canonical: "/resources" },
};

const jump = [
  { href: "#requirement-finder", label: "Funding requirement finder", icon: ClipboardList },
  { href: "#emi-calculator", label: "EMI calculator", icon: Calculator },
  { href: "#cibil-check", label: "Check your CIBIL", icon: Gauge },
  { href: "#cibil-rectification", label: "CIBIL rectification", icon: ShieldAlert },
];

const faqs = [
  {
    q: "What is a good CIBIL score?",
    a: "Scores range from 300 to 900. Most lenders view 750 and above as strong; 650–749 is generally acceptable, and below 650 approvals become harder and costlier.",
  },
  {
    q: "Does checking my own score reduce it?",
    a: "No. Checking your own report is a soft enquiry and doesn't affect your score. Hard enquiries happen when a lender pulls your report for an application — many in a short period can lower it, which is why applying to the right lender first matters.",
  },
  {
    q: "How is EMI calculated?",
    a: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the loan amount, r the monthly interest rate and n the number of monthly instalments. Our calculator does this for you.",
  },
  {
    q: "What's the difference between secured and unsecured loans?",
    a: "Secured loans are backed by an asset such as property, so they usually offer larger amounts and lower rates. Unsecured loans rely on your income and credit history — faster, but typically at higher rates.",
  },
  {
    q: "How long does CIBIL rectification take?",
    a: "It depends on the bureau and the lender that reported the data. Once a dispute is raised through the official process, the lender must verify and correct the record. We follow up until it reflects on your report.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources & tools"
        title={
          <>
            Know your numbers <span className="italic text-bronze-300">before you apply.</span>
          </>
        }
        intro="Free, instant tools — and every one of them leads straight to an advisor when you're ready."
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      >
        <ul className="flex flex-wrap gap-2">
          {jump.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-ink-300 transition hover:border-bronze-300 hover:text-ivory"
              >
                <Icon className="h-4 w-4 text-bronze-300" aria-hidden="true" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section id="requirement-finder" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <div className="card mx-auto max-w-4xl p-6 sm:p-10">
            <RequirementFinder />
          </div>
        </div>
      </section>

      <section id="emi-calculator" className="scroll-mt-24 border-y border-sand-200 bg-sand-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="EMI calculator" title="Calculate your EMI" intro="See your monthly EMI, total interest and total amount payable — then talk to us about beating the rate." />
          <div className="card mt-10 p-5 sm:p-8">
            <EmiCalculator />
          </div>
        </div>
      </section>

      <section id="cibil-check" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <CibilCheck />
        </div>
      </section>

      <section id="cibil-rectification" className="grain relative scroll-mt-24 overflow-hidden bg-ink-950 py-16 text-ivory md:py-24">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <CibilRectification tone="dark" />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="FAQ" title="Good to know" />
          <div className="divide-y divide-sand-200 border-y border-sand-200">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-ink-950 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-500 transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
