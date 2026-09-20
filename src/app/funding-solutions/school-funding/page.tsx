import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Building,
  CalendarClock,
  Check,
  FileText,
  GraduationCap,
  LandPlot,
  Laptop,
  Layers,
  RefreshCw,
  School,
  Users,
  Wallet,
} from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { LeadForm } from "@/components/consultation/LeadForm";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "School Funding — Loans & Capital for Schools and Educational Trusts",
  description:
    "Dedicated funding for schools, educational trusts and societies: campus expansion, land, buses, smart classrooms, working capital and refinancing — structured around the academic fee cycle.",
  alternates: { canonical: "/funding-solutions/school-funding" },
};

const beneficiaries = [
  { icon: School, t: "K-12 private schools", d: "CBSE, ICSE, State Board and international-curriculum schools." },
  { icon: Users, t: "Educational trusts & societies", d: "Trusts and societies running one or more institutions." },
  { icon: GraduationCap, t: "Pre-schools & chains", d: "Play schools and pre-school networks planning new centres." },
  { icon: Building, t: "New school projects", d: "Promoters setting up a greenfield school campus." },
];

const requirements = [
  { icon: Building, t: "Campus construction & expansion", d: "New blocks, classrooms, auditoriums and sports facilities." },
  { icon: LandPlot, t: "Land purchase", d: "Acquiring land for a new campus or expansion." },
  { icon: Bus, t: "School buses & transport", d: "Adding or replacing the transport fleet." },
  { icon: Laptop, t: "Smart classrooms, labs & IT", d: "Digital classrooms, science and computer labs." },
  { icon: Wallet, t: "Working capital", d: "Salaries and operations between fee-collection cycles." },
  { icon: RefreshCw, t: "Refinancing", d: "Moving expensive existing debt to better terms." },
];

const fundingTypes = [
  { t: "Term loans for infrastructure", d: "Long-tenure loans for construction and expansion, often with a moratorium during the build." },
  { t: "Loan against school / trust property", d: "Unlock the value of existing campus or trust-owned property." },
  { t: "Lease rental discounting", d: "Where the campus is leased, borrow against future rentals." },
  { t: "Working-capital limits", d: "Overdraft / cash-credit limits sized on fee receivables." },
  { t: "Vehicle & equipment finance", d: "Dedicated finance for buses, IT and lab equipment." },
  { t: "Growth capital & private placement", d: "For school chains raising structured or equity capital to scale." },
];

const role = [
  { t: "Understand the institution", d: "Trust structure, enrolment trends, fee collections and expansion plans." },
  { t: "Prepare the file", d: "Financials, projections, trust-deed and compliance documentation — lender-ready." },
  { t: "Approach the right lenders", d: "Banks and NBFCs with an appetite for the education sector." },
  { t: "Structure & negotiate", d: "Tenure, moratorium and repayments aligned to the academic fee cycle." },
  { t: "Support to disbursement", d: "We coordinate legal, technical and disbursement steps end to end." },
];

const documents = [
  "Trust deed / society registration and by-laws",
  "Board affiliation / recognition certificates",
  "Audited financials for the last 3 years",
  "Student strength and fee structure",
  "Property documents and approved plans (for construction / LAP)",
  "KYC of trustees / promoters",
];

const faqs = [
  {
    q: "Can a trust or society borrow for a school?",
    a: "Yes. Many banks and NBFCs lend to educational trusts and societies. The trust deed must permit borrowing, and trustees typically provide guarantees. We check this upfront.",
  },
  {
    q: "Is collateral always required?",
    a: "Larger infrastructure loans are usually secured by the school or trust property. Smaller working-capital or equipment needs may have lighter collateral requirements, depending on the lender and the institution's track record.",
  },
  {
    q: "Can repayments follow our fee-collection cycle?",
    a: "Often, yes. Lenders familiar with the education sector can structure moratoriums during construction and repayment schedules that match term-wise fee inflows.",
  },
  {
    q: "How long does the process take?",
    a: "It depends on the loan type, amount and how complete the documentation is. A well-prepared file moves significantly faster — which is where we help most.",
  },
];

export default function SchoolFundingPage() {
  return (
    <>
      <PageHero
        eyebrow="School funding"
        title={
          <>
            Funding for schools <span className="italic text-bronze-300">building the next generation.</span>
          </>
        }
        intro="A dedicated funding desk for schools, educational trusts and societies — from campus expansion and transport to working capital and refinancing, structured around the academic year."
        crumbs={[{ label: "Home", href: "/" }, { label: "Funding Solutions", href: "/funding-solutions" }, { label: "School Funding" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#enquire" className="btn btn-primary btn-lg">
            Enquire about school funding <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={whatsappUrl("Hi AapKaLoan, I'd like to discuss funding for our school.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-lg"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp our school desk
          </a>
        </div>
      </PageHero>

      {/* Who can benefit */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHeading index="01" eyebrow="Who can benefit" title="Built for educational institutions" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beneficiaries.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-bronze-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink-950">{t}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding requirements */}
      <section className="border-y border-sand-200 bg-sand-50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading index="02" eyebrow="Funding requirements" title="What schools typically raise funds for" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.25rem] border border-sand-200 bg-sand-200 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map(({ icon: Icon, t, d }) => (
              <div key={t} className="bg-white p-7">
                <Icon className="h-6 w-6 text-bronze-600" aria-hidden="true" />
                <h3 className="mt-4 font-extrabold text-ink-950">{t}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of funding */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading index="03" eyebrow="Types of funding" title="The right instrument for each need" intro="Most school projects combine more than one. We design the mix." />
          </div>
          <ul className="divide-y divide-sand-200 border-y border-sand-200">
            {fundingTypes.map((f) => (
              <li key={f.t} className="flex gap-4 py-6">
                <Layers className="mt-1 h-5 w-5 shrink-0 text-bronze-500" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-extrabold text-ink-950">{f.t}</h3>
                  <p className="mt-1 text-ink-600">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AapKaLoan's role */}
      <section className="grain relative overflow-hidden bg-ink-950 py-20 text-ivory md:py-28">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <SectionHeading index="04" eyebrow="AapKaLoan's role" tone="dark" title="What we do for your institution" />
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {role.map((r, i) => (
              <li key={r.t} className="rounded-2xl bg-white/[0.05] p-6 ring-1 ring-white/10">
                <span className="display num text-3xl text-bronze-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-extrabold">{r.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{r.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex items-center gap-3 text-sm text-ink-300">
            <CalendarClock className="h-5 w-5 text-bronze-300" aria-hidden="true" />
            Repayment schedules can be aligned to term-wise fee collections, subject to lender approval.
          </div>
        </div>
      </section>

      {/* Documents + FAQ */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Documents" title="Typically required" />
            <ul className="card mt-8 space-y-3 p-7">
              {documents.map((d) => (
                <li key={d} className="flex gap-3 text-ink-700">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-bronze-600" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-8 divide-y divide-sand-200 border-y border-sand-200">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink-950 [&::-webkit-details-marker]:hidden">
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
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-24 border-t border-sand-200 bg-sand-50 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              index="05"
              eyebrow="Enquire"
              title={
                <>
                  Tell us about <span className="italic text-bronze-600">your school.</span>
                </>
              }
              intro="Share a few details and our school-funding desk will call you to understand the requirement."
            />
            <ul className="mt-8 space-y-3 text-ink-700">
              {["No-obligation first conversation", "Your institution's information handled confidentially", "Structured around your academic year"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-moss-500" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-600">
              Prefer to talk now? Call{" "}
              <a href={site.phone.href} className="font-bold text-ink-900 underline underline-offset-4">
                {site.phone.display}
              </a>
            </p>
          </div>
          <div className="card p-6 sm:p-9">
            <LeadForm type="school-funding" variant="school" submitLabel="Request a call back" />
          </div>
        </div>
      </section>
    </>
  );
}
