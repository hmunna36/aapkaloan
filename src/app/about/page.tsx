import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, Check, Compass, GraduationCap, House, Rocket, Target, Users } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { LinkedInButton } from "@/components/team/LeaderCard";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { mission, site, stats, vision } from "@/content/site";
import { expertiseAreas, team } from "@/content/team";

export const metadata: Metadata = {
  title: "About Us — Vision, Mission & Leadership",
  description:
    "Who AapKaLoan is, what we do and the leadership team behind it — experience across banking, NBFC, VC funding and private placement.",
  alternates: { canonical: "/about" },
};

const segments = [
  { icon: House, title: "Salaried individuals & families", text: "Home loans, balance transfers and personal credit." },
  { icon: Briefcase, title: "Self-employed professionals", text: "Doctors, CAs, architects and consultants." },
  { icon: Building2, title: "MSMEs & traders", text: "Working capital, term loans and machinery finance." },
  { icon: GraduationCap, title: "Schools & educational trusts", text: "Infrastructure, transport and working capital." },
  { icon: Rocket, title: "Startups & growth companies", text: "Venture capital and structured growth capital." },
  { icon: Users, title: "Promoters & property owners", text: "LAP, lease rental discounting, private placement." },
];

const expertise = [
  "Loan structuring across secured and unsecured products",
  "Working-capital assessment and CMA preparation",
  "Venture capital and investment-readiness advisory",
  "Private placement of debt and equity",
  "Credit-report review and CIBIL rectification support",
  "Refinancing and debt consolidation",
];

const process = [
  { t: "Understand", d: "We start with your goal, cash flows and assets — not a product list." },
  { t: "Structure", d: "We design the right mix of product, tenure and security, and prepare your file." },
  { t: "Match", d: "We approach the lenders or investors most likely to say yes on good terms." },
  { t: "Negotiate", d: "We compare offers side by side and negotiate on your behalf." },
  { t: "Disburse & beyond", d: "We see it through to disbursement — and stay available for what's next." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AapKaLoan"
        title={
          <>
            A funding partner, <span className="italic text-bronze-300">not a loan counter.</span>
          </>
        }
        intro={`Since ${site.since}, AapKaLoan has helped individuals, businesses and institutions raise capital the right way — by understanding the requirement first, then finding the best route to fund it.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ConsultButton className="btn btn-primary btn-lg">Schedule a Consultation</ConsultButton>
          <Link href="#leadership" className="btn btn-outline-light btn-lg">
            Meet the leadership
          </Link>
        </div>
      </PageHero>

      {/* Company introduction */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="heading mt-4 text-4xl text-ink-950 md:text-5xl">
              Built to put the borrower <span className="italic text-bronze-600">first.</span>
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              <p>
                AapKaLoan is a financial advisory and funding partner headquartered in Bengaluru, with a regional office in
                Chennai. We work with 100+ banks, NBFCs and private capital providers — which means we can recommend what is
                genuinely right for you, not just what one institution happens to sell.
              </p>
              <p>
                <strong className="font-bold text-ink-900">What we do:</strong> we assess your requirement, structure the
                funding, prepare a strong application, approach the best-fit lenders or investors, negotiate terms, and
                support you all the way to disbursement.
              </p>
              <p>
                <strong className="font-bold text-ink-900">Why it matters:</strong> a well-structured application in front of
                the right lender is approved faster, on better terms — and avoids the rejections that can damage your credit
                score.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="card p-7 sm:p-9 lg:sticky lg:top-32">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-bronze-700">Core expertise</p>
              <ul className="mt-5 space-y-3.5">
                {expertise.map((e) => (
                  <li key={e} className="flex gap-3 text-ink-800">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
                    {e}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-sand-200">
                {stats.map((s) => (
                  <div key={s.label} className="bg-sand-50 p-4">
                    <dt className="text-xs text-ink-500">{s.label}</dt>
                    <dd className="display num mt-1 text-3xl text-ink-950">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Customer segments */}
      <section className="border-y border-sand-200 bg-sand-50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Who we serve" title="Customer segments we work with" intro="Different borrowers need different lenders. Our breadth of relationships lets us serve each segment well." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand-100 text-bronze-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink-950">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-4 lg:grid-cols-2">
          <article className="grain relative overflow-hidden rounded-[1.75rem] bg-ink-950 p-8 text-ivory md:p-12">
            <div className="grid-lines absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <Compass className="h-8 w-8 text-bronze-300" aria-hidden="true" />
              <p className="eyebrow eyebrow-light mt-8">Our vision</p>
              <p className="heading mt-4 text-2xl leading-snug md:text-[1.9rem]">{vision}</p>
            </div>
          </article>
          <article className="rounded-[1.75rem] bg-bronze-100 p-8 md:p-12">
            <Target className="h-8 w-8 text-bronze-700" aria-hidden="true" />
            <p className="eyebrow mt-8">Our mission</p>
            <p className="heading mt-4 text-2xl leading-snug text-ink-950 md:text-[1.9rem]">{mission}</p>
          </article>
        </div>

        <div className="container-x mt-20">
          <SectionHeading eyebrow="Our approach" title="How we work with every client" />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[1.25rem] border border-sand-200 bg-sand-200 md:grid-cols-5">
            {process.map((p, i) => (
              <li key={p.t} className="bg-white p-6">
                <span className="display num text-3xl text-bronze-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-extrabold text-ink-950">{p.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="scroll-mt-24 border-t border-sand-200 bg-sand-50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Leadership"
            title={
              <>
                The team behind <span className="italic text-bronze-600">your mandate.</span>
              </>
            }
            intro={`Collective experience across ${expertiseAreas.slice(0, -1).join(", ")} and ${expertiseAreas.at(-1)!.toLowerCase()}.`}
            action={<ConsultButton className="btn btn-dark">Speak with our leadership</ConsultButton>}
          />

          <div className="mt-14 space-y-6">
            {team.map((l, i) => (
              <article key={l.slug} id={l.slug} className="card grid scroll-mt-28 overflow-hidden md:grid-cols-[18rem_1fr] lg:grid-cols-[20rem_1fr]">
                <div className="relative aspect-[4/5] bg-sand-100 md:aspect-auto md:min-h-[22rem]">
                  <Image
                    src={l.photo}
                    alt={`${l.name}, ${l.designation} at AapKaLoan`}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 20rem, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="heading text-3xl text-ink-950">{l.name}</h3>
                      <p className="mt-1 font-semibold text-bronze-700">{l.designation}</p>
                    </div>
                    <div className="rounded-2xl bg-ink-950 px-5 py-3 text-center text-ivory">
                      <p className="display num text-3xl text-bronze-300">{l.experienceYears}</p>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-300">Years experience</p>
                    </div>
                  </div>
                  <p className="mt-5 max-w-2xl leading-relaxed text-ink-600">{l.bio}</p>
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Experience across</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {l.expertise.map((a) => (
                        <li key={a} className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-bronze-200">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {l.message && (
                    <blockquote className="heading mt-6 border-l-2 border-bronze-400 pl-4 text-lg italic text-ink-800">“{l.message}”</blockquote>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-7">
                    <LinkedInButton leader={l} />
                    <ConsultButton className="btn btn-primary btn-sm" preset={{ title: `Schedule a consultation`, message: `I'd like to speak with ${l.name}.` }}>
                      Book a consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </ConsultButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
