"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Factory,
  Handshake,
  House,
  KeyRound,
  Rocket,
  School,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { requirementOptions } from "@/content/funding";
import { amountRanges } from "@/lib/leads";
import { LeadForm } from "@/components/consultation/LeadForm";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

const icons: Record<string, LucideIcon> = {
  house: House,
  factory: Factory,
  key: KeyRound,
  briefcase: Briefcase,
  school: School,
  wallet: Wallet,
  rocket: Rocket,
  handshake: Handshake,
  sparkles: Sparkles,
};

const timelines = ["Immediately", "Within 1–3 months", "In 3–6 months", "Just exploring"];

const hints: Record<string, { text: string; href: string; cta: string }> = {
  "school-funding": { text: "We have a dedicated school-funding desk.", href: "/funding-solutions/school-funding", cta: "See how it works" },
  "vc-funding": { text: "Equity raises start with an investment-readiness review.", href: "/funding-solutions#vc-funding", cta: "Learn more" },
  "private-placement": { text: "Private placement suits larger, structured raises.", href: "/funding-solutions#private-placement", cta: "Learn more" },
  "home-loan": { text: "Compare home-loan eligibility, features and documents.", href: "/loans/secured?product=home-loan", cta: "View Home Loan" },
  "loan-against-property": { text: "See what you can raise against your property.", href: "/loans/secured?product=loan-against-property", cta: "View LAP" },
  "msme-loan": { text: "Collateral-free options may be available for MSMEs.", href: "/loans/unsecured?product=msme-loan", cta: "View MSME Loan" },
};

export function RequirementFinder({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { open } = useConsultation();
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const dark = tone === "dark";
  const selected = requirementOptions.find((o) => o.id === choice);

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      on ? "border-ink-900 bg-ink-900 text-ivory" : dark ? "border-white/15 text-ink-300 hover:border-white/40" : "border-sand-300 bg-white text-ink-700 hover:border-ink-400"
    }`;

  return (
    <div>
      {/* progress */}
      <div className="mb-7 flex items-center gap-3" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= step ? "bg-bronze-500" : dark ? "bg-white/10" : "bg-sand-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-bronze-300" : "text-bronze-700"}`}>Step {step} of 3</p>

      {step === 1 && (
        <fieldset className="mt-2">
          <legend className={`heading text-3xl sm:text-4xl ${dark ? "text-ivory" : "text-ink-950"}`}>What kind of funding are you looking for?</legend>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {requirementOptions.map((o) => {
              const Icon = icons[o.icon];
              const on = choice === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setChoice(o.id);
                    setStep(2);
                  }}
                  className={`group flex min-h-[5.5rem] flex-col items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                    on
                      ? "border-bronze-500 bg-bronze-100"
                      : dark
                        ? "border-white/10 bg-white/[0.03] hover:border-bronze-400"
                        : "border-sand-200 bg-white hover:-translate-y-0.5 hover:border-bronze-400 hover:shadow-[var(--shadow-card)]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${on ? "text-bronze-700" : "text-bronze-500"}`} aria-hidden="true" />
                  <span className={`text-sm font-bold leading-tight ${on ? "text-ink-950" : dark ? "text-ivory" : "text-ink-900"}`}>{o.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {step === 2 && selected && (
        <div className="mt-2">
          <h3 className={`heading text-3xl sm:text-4xl ${dark ? "text-ivory" : "text-ink-950"}`}>
            {selected.label}: how much, and how soon?
          </h3>
          <fieldset className="mt-6">
            <legend className={`text-sm font-bold ${dark ? "text-ivory" : "text-ink-800"}`}>Approximate amount</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {amountRanges.map((a) => (
                <button key={a} type="button" aria-pressed={amount === a} onClick={() => setAmount(a)} className={chip(amount === a)}>
                  {a}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6">
            <legend className={`text-sm font-bold ${dark ? "text-ivory" : "text-ink-800"}`}>When do you need it?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {timelines.map((t) => (
                <button key={t} type="button" aria-pressed={timeline === t} onClick={() => setTimeline(t)} className={chip(timeline === t)}>
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {choice && hints[choice] && (
            <p className={`mt-6 text-sm ${dark ? "text-ink-300" : "text-ink-600"}`}>
              {hints[choice].text}{" "}
              <Link href={hints[choice].href} className="link-arrow">
                {hints[choice].cta}
              </Link>
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setStep(1)} className={`btn ${dark ? "btn-outline-light" : "btn-outline"}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && selected && (
        <div className="mt-2">
          <h3 className={`heading text-3xl sm:text-4xl ${dark ? "text-ivory" : "text-ink-950"}`}>Get in touch</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[selected.label, amount, timeline].filter(Boolean).map((t) => (
              <span key={t} className="chip !bg-bronze-100 !text-bronze-800">
                {t}
              </span>
            ))}
            <button type="button" onClick={() => setStep(1)} className={`text-sm font-semibold underline underline-offset-4 ${dark ? "text-ink-300" : "text-ink-600"}`}>
              Change
            </button>
          </div>
          <div className="mt-6">
            <LeadForm
              type="requirement-finder"
              variant="compact"
              hideRequirement
              tone={tone}
              submitLabel="Get a call back"
              defaults={{ requirement: selected.label, amount: amount || undefined, timeline: timeline || undefined }}
            />
          </div>
          <p className={`mt-5 text-sm ${dark ? "text-ink-400" : "text-ink-500"}`}>
            Prefer to pick a time?{" "}
            <button
              type="button"
              className="link-arrow"
              onClick={() =>
                open({
                  requirement: selected.id === "other" ? "Other" : selected.label,
                  message: [amount && `Amount: ${amount}`, timeline && `Timeline: ${timeline}`].filter(Boolean).join(" · ") || undefined,
                })
              }
            >
              Schedule a Consultation
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
