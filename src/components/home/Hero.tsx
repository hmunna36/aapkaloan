import Link from "next/link";
import { ArrowRight, Calculator, Check, ClipboardList, Gauge } from "lucide-react";
import { stats } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { ToolLink } from "@/components/tools/ToolLink";

const routes = [
  { name: "Bank term loan", tag: "Lowest cost", term: "12-yr tenure", best: true },
  { name: "NBFC facility", tag: "Faster approval", term: "10-yr tenure" },
  { name: "Private placement", tag: "Most flexible", term: "Structured" },
];

const steps = ["Assess", "Compare", "Negotiate", "Disburse"];

// 2×2 on mobile, 1×4 on desktop — hairlines only between cells.
const statCell = [
  "pr-6",
  "border-l pl-6 lg:pl-8",
  "border-t pr-6 lg:border-l lg:border-t-0 lg:pl-8",
  "border-l border-t pl-6 lg:border-t-0 lg:pl-8",
];

export function Hero() {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 text-ivory">
      <div className="grid-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
      <div
        className="absolute -left-40 top-10 h-[40rem] w-[40rem] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(202 144 63 / 0.55), transparent 62%)" }}
        aria-hidden="true"
      />

      <div className="container-x relative grid items-center gap-14 pb-16 pt-32 md:pt-40 lg:grid-cols-[1.12fr_0.88fr] lg:pb-24 lg:pt-44">
        <div className="min-w-0 animate-[rise_.8s_cubic-bezier(.2,.7,.2,1)_both]">
          <p className="eyebrow eyebrow-light">Financial advisory & funding partner</p>
          <h1 className="display mt-6 text-[2.9rem] sm:text-6xl lg:text-[4.6rem]">
            One partner.
            <br />
            <span className="italic text-bronze-300">100+ lenders.</span>
            <br />
            The right capital.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-300">
            AapKaLoan works on your side of the table. Instead of accepting what a single bank offers, we assess your
            requirement, compare banks, NBFCs and private capital, negotiate the terms — and stay with you until the funds
            reach your account.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ConsultButton className="btn btn-primary btn-lg">
              Schedule a Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ConsultButton>
            <Link href="/loans" className="btn btn-outline-light btn-lg">
              Explore Loan Solutions
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Quick start</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              <QuickPill tool="cibil" icon={<Gauge className="h-4 w-4" aria-hidden="true" />}>
                Check your CIBIL
              </QuickPill>
              <QuickPill tool="emi" icon={<Calculator className="h-4 w-4" aria-hidden="true" />}>
                Calculate your EMI
              </QuickPill>
              <QuickPill tool="finder" icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}>
                Tell us your requirement
              </QuickPill>
              <li>
                <a
                  href={whatsappUrl("Hi AapKaLoan, I have an issue with my CIBIL report and need help.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-wa/40 bg-wa/10 px-3.5 py-2 font-semibold text-[#9ff0bd] transition hover:bg-wa/20"
                >
                  <WhatsAppIcon className="h-4 w-4" /> CIBIL issue? WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Illustrative "how we match" card */}
        <div className="relative min-w-0 animate-[rise_.9s_.15s_cubic-bezier(.2,.7,.2,1)_both]">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-bronze-500/15 to-transparent blur-2xl" aria-hidden="true" />
          <figure className="relative rounded-[1.75rem] bg-ivory p-6 text-ink-900 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-bronze-700">Your requirement</p>
              <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[0.68rem] font-semibold text-ink-500">Illustrative</span>
            </div>
            <p className="heading mt-3 text-[1.7rem]">₹2.5 Cr for a school campus expansion</p>
            <p className="mt-1 text-sm text-ink-500">Educational trust · Bengaluru</p>

            <div className="mt-6 space-y-2.5">
              <p className="text-xs font-semibold text-ink-500">Routes we compared for you</p>
              {routes.map((r) => (
                <div
                  key={r.name}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 ${
                    r.best ? "border-moss-500/40 bg-moss-100/60" : "border-sand-200 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-ink-500">
                      {r.tag} · {r.term}
                    </p>
                  </div>
                  {r.best ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-moss-700 px-2.5 py-1 text-[0.7rem] font-bold text-white">
                      <Check className="h-3 w-3" aria-hidden="true" /> Best fit
                    </span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-sand-300" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <figcaption className="mt-6 border-t border-sand-200 pt-5">
              <ol className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-500 sm:flex sm:items-center sm:justify-between sm:gap-1">
                {steps.map((s, i) => (
                  <li key={s} className="flex flex-1 items-center gap-1.5">
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${i < 3 ? "bg-ink-900 text-bronze-300" : "bg-bronze-500 text-ink-950"}`}>
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {s}
                    {i < steps.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-sand-300 sm:block" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Trust numbers */}
      <div className="relative border-t border-white/10">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`border-white/10 py-7 lg:py-9 ${statCell[i]}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display num block text-4xl text-ivory lg:text-5xl">{s.value}</span>
                <span className="mt-2 block text-sm font-semibold text-ink-300">{s.label}</span>
                <span className="block text-xs text-ink-500">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function QuickPill({ tool, icon, children }: { tool: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li>
      <ToolLink
        tool={tool}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 font-semibold text-ink-300 transition hover:border-bronze-300 hover:text-ivory"
      >
        <span className="text-bronze-300">{icon}</span>
        {children}
      </ToolLink>
    </li>
  );
}
