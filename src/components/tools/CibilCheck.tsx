"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { CibilGauge, MAX_SCORE, MIN_SCORE, bandOf } from "./CibilGauge";
import { CibilScoreCheck } from "./CibilScoreCheck";

// NEXT_PUBLIC_CIBIL_MODE mirrors the server's CIBIL_PROVIDER so the UI knows
// whether a live check is available. Unset → the enquiry form, exactly as before.
const LIVE_CHECK = (process.env.NEXT_PUBLIC_CIBIL_MODE ?? "off").trim().toLowerCase() !== "off";

export function CibilCheck({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { open } = useConsultation();
  const dark = tone === "dark";

  const openEnquiry = () =>
    open({
      type: "cibil-check",
      variant: "cibil",
      title: "Check your CIBIL score",
      subtitle: "Share your details — an advisor will help you check your score and explain what it means for your loan options.",
      requirement: "CIBIL Score Enquiry",
      submitLabel: "Enquire now",
    });

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_1.05fr]">
      <div>
        <h3 className={`heading text-3xl sm:text-4xl ${dark ? "text-ivory" : "text-ink-950"}`}>Do you know your CIBIL score?</h3>
        <p className={`mt-4 leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>
          It's the first thing every lender checks. Know where you stand before you apply — and what it means for the rate
          and amount you can get.
        </p>

        {!LIVE_CHECK && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={openEnquiry} className="btn btn-primary">
              Check Your CIBIL / Enquire Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <p className={`mt-4 flex items-start gap-2 text-xs leading-relaxed ${dark ? "text-ink-400" : "text-ink-500"}`}>
          <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
          Checking your own score does not lower it. We will never ask for OTPs, PINs or passwords.
        </p>

        {LIVE_CHECK && (
          <details className="mt-6 group">
            <summary className={`cursor-pointer text-sm font-bold ${dark ? "text-bronze-300" : "text-bronze-700"}`}>
              What do the score bands mean?
            </summary>
            <div className="mt-4">
              <BandExplorer dark={dark} />
            </div>
          </details>
        )}
      </div>

      {LIVE_CHECK ? (
        <CibilScoreCheck tone={tone} />
      ) : (
        <div className={`rounded-3xl p-6 sm:p-7 ${dark ? "bg-white/[0.05] ring-1 ring-white/10" : "card"}`}>
          <BandExplorer dark={dark} withGauge />
        </div>
      )}
    </div>
  );
}

/** Educational slider: drag to a score to see what that band means. */
function BandExplorer({ dark, withGauge = false }: { dark: boolean; withGauge?: boolean }) {
  const [score, setScore] = useState(720);
  const band = bandOf(score);

  return (
    <>
      {withGauge && <CibilGauge score={score} dark={dark} />}
      <div className={withGauge ? "mt-2 text-center" : "text-center"}>
        <p className="display num text-5xl" style={{ color: band.color }}>
          {score}
        </p>
        <p className={`mt-1 text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-ink-300" : "text-ink-600"}`}>{band.label}</p>
      </div>
      <label htmlFor="cibil-slider" className={`mt-5 block text-xs font-semibold ${dark ? "text-ink-400" : "text-ink-500"}`}>
        Slide to your score (or your best guess) to see what it means
      </label>
      <input
        id="cibil-slider"
        type="range"
        className="range mt-2"
        min={MIN_SCORE}
        max={MAX_SCORE}
        step={5}
        value={score}
        aria-valuetext={`${score}, ${band.label}`}
        style={{ ["--fill" as string]: `${((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100}%` }}
        onChange={(e) => setScore(Number(e.target.value))}
      />
      <p className={`mt-4 min-h-[3.75rem] text-sm leading-relaxed ${dark ? "text-ink-300" : "text-ink-700"}`} aria-live="polite">
        {band.advice}
      </p>
    </>
  );
}
