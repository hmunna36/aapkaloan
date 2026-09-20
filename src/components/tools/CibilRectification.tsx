"use client";

import { useState } from "react";
import { Check, PhoneCall } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

const issues = [
  "Closed loan still shows as active",
  "Late payments I didn't make",
  "“Settled” instead of “Closed”",
  "Accounts I don't recognise",
  "Wrong personal details",
  "Duplicate accounts",
  "Too many enquiries",
  "Something else",
];

const steps = [
  { t: "Share your report", d: "Send us your latest credit report on WhatsApp." },
  { t: "We find the errors", d: "An advisor reviews every account and enquiry." },
  { t: "Dispute is raised", d: "Through the bureau's and lender's official process." },
  { t: "We follow through", d: "Until the correction reflects on your report." },
];

export function CibilRectification({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { open } = useConsultation();
  const [picked, setPicked] = useState<string[]>([]);
  const dark = tone === "dark";

  const message = `Hi AapKaLoan, I need help with my CIBIL report.${picked.length ? ` Issue: ${picked.join("; ")}.` : ""}`;
  const toggle = (i: string) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h3 className={`heading text-3xl sm:text-4xl ${dark ? "text-ivory" : "text-ink-950"}`}>Issues with your CIBIL report?</h3>
        <p className={`mt-4 leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>
          A single wrong entry can cost you an approval. Tell us what looks off and chat with an advisor right away — no
          forms, no waiting.
        </p>

        <fieldset className="mt-6">
          <legend className={`text-sm font-bold ${dark ? "text-ivory" : "text-ink-800"}`}>What's wrong? (optional — pick any)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {issues.map((i) => {
              const on = picked.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(i)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                    on
                      ? "border-moss-700 bg-moss-700 text-white"
                      : dark
                        ? "border-white/15 text-ink-300 hover:border-white/40"
                        : "border-sand-300 bg-white text-ink-700 hover:border-ink-400"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {i}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
            <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
          </a>
          <button
            type="button"
            onClick={() =>
              open({
                type: "cibil-rectification",
                variant: "cibil",
                title: "Get help with your CIBIL report",
                subtitle: "Leave your number and a credit advisor will call you back.",
                requirement: "CIBIL Rectification",
                message: picked.length ? `Issues: ${picked.join("; ")}` : undefined,
                submitLabel: "Request a call back",
              })
            }
            className={`btn ${dark ? "btn-outline-light" : "btn-outline"}`}
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" /> Prefer a call back?
          </button>
        </div>
      </div>

      <ol className={`relative space-y-6 rounded-3xl p-6 sm:p-8 ${dark ? "bg-white/[0.05] ring-1 ring-white/10" : "card"}`}>
        <p className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-bronze-300" : "text-bronze-700"}`}>How rectification works</p>
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <span
              className={`num grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                dark ? "bg-bronze-400 text-ink-950" : "bg-ink-900 text-ivory"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className={`font-bold ${dark ? "text-ivory" : "text-ink-900"}`}>{s.t}</p>
              <p className={`mt-0.5 text-sm ${dark ? "text-ink-400" : "text-ink-600"}`}>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
