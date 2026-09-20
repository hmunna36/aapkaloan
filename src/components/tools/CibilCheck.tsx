"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

const bands = [
  { min: 300, max: 549, label: "Needs attention", color: "#b4553f", advice: "Most lenders will hesitate at this level. Let's review your report for errors and build a plan to rebuild it." },
  { min: 550, max: 649, label: "Fair", color: "#c98a3c", advice: "Approvals are possible with select lenders, usually at higher rates. A little preparation can change that." },
  { min: 650, max: 749, label: "Good", color: "#8f9a4a", advice: "Most banks and NBFCs will consider you. Choosing the right lender can still save you meaningfully on interest." },
  { min: 750, max: 900, label: "Excellent", color: "#2f7d69", advice: "You're in the strongest position to negotiate. Let's use it to secure the best available terms." },
];

const MIN = 300;
const MAX = 900;

export function CibilCheck({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { open } = useConsultation();
  const [score, setScore] = useState(720);
  const band = bands.find((b) => score >= b.min && score <= b.max)!;
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
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={openEnquiry} className="btn btn-primary">
            Check Your CIBIL / Enquire Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className={`mt-4 flex items-start gap-2 text-xs leading-relaxed ${dark ? "text-ink-400" : "text-ink-500"}`}>
          <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
          Checking your own score does not lower it. We will never ask for OTPs, PINs or passwords.
        </p>
      </div>

      <div className={`rounded-3xl p-6 sm:p-7 ${dark ? "bg-white/[0.05] ring-1 ring-white/10" : "card"}`}>
        <Gauge score={score} dark={dark} />
        <div className="mt-2 text-center">
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
          min={MIN}
          max={MAX}
          step={5}
          value={score}
          aria-valuetext={`${score}, ${band.label}`}
          style={{ ["--fill" as string]: `${((score - MIN) / (MAX - MIN)) * 100}%` }}
          onChange={(e) => setScore(Number(e.target.value))}
        />
        <p className={`mt-4 min-h-[3.75rem] text-sm leading-relaxed ${dark ? "text-ink-300" : "text-ink-700"}`} aria-live="polite">
          {band.advice}
        </p>
      </div>
    </div>
  );
}

function Gauge({ score, dark }: { score: number; dark: boolean }) {
  // Semicircle from 180° (300) to 0° (900)
  const cx = 120;
  const cy = 118;
  const r = 96;
  const angleFor = (v: number) => Math.PI * (1 - (v - MIN) / (MAX - MIN));
  const pt = (a: number, rad = r) => [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
  const arc = (from: number, to: number) => {
    const [x1, y1] = pt(angleFor(from));
    const [x2, y2] = pt(angleFor(to));
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const a = angleFor(score);
  const [nx, ny] = pt(a, r - 26);

  return (
    <svg viewBox="0 0 240 132" className="mx-auto w-full max-w-[18rem]" role="img" aria-label={`CIBIL score gauge showing ${score}`}>
      {bands.map((b, i) => (
        <path
          key={b.label}
          d={arc(b.min + (i ? 3 : 0), b.max - (i < bands.length - 1 ? 3 : 0))}
          stroke={b.color}
          strokeWidth="16"
          fill="none"
          strokeLinecap="butt"
          opacity={score >= b.min && score <= b.max ? 1 : 0.35}
        />
      ))}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={dark ? "#fbf8f3" : "#1f1510"} strokeWidth="3.5" strokeLinecap="round" style={{ transition: "all .25s ease" }} />
      <circle cx={cx} cy={cy} r="7" fill={dark ? "#fbf8f3" : "#1f1510"} />
      <text x={pt(Math.PI)[0]} y={cy + 14} textAnchor="middle" className={`text-[10px] font-semibold ${dark ? "fill-ink-400" : "fill-ink-500"}`}>
        300
      </text>
      <text x={pt(0)[0]} y={cy + 14} textAnchor="middle" className={`text-[10px] font-semibold ${dark ? "fill-ink-400" : "fill-ink-500"}`}>
        900
      </text>
    </svg>
  );
}
