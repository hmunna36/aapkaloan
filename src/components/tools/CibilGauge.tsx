"use client";

import type { CibilBand } from "@/lib/cibil/types";

export const MIN_SCORE = 300;
export const MAX_SCORE = 900;

export const bands: { id: CibilBand; min: number; max: number; label: string; color: string; advice: string }[] = [
  {
    id: "poor",
    min: 300,
    max: 549,
    label: "Needs attention",
    color: "#b4553f",
    advice: "Most lenders will hesitate at this level. Let's review your report for errors and build a plan to rebuild it.",
  },
  {
    id: "fair",
    min: 550,
    max: 649,
    label: "Fair",
    color: "#c98a3c",
    advice: "Approvals are possible with select lenders, usually at higher rates. A little preparation can change that.",
  },
  {
    id: "good",
    min: 650,
    max: 749,
    label: "Good",
    color: "#8f9a4a",
    advice: "Most banks and NBFCs will consider you. Choosing the right lender can still save you meaningfully on interest.",
  },
  {
    id: "excellent",
    min: 750,
    max: 900,
    label: "Excellent",
    color: "#2f7d69",
    advice: "You're in the strongest position to negotiate. Let's use it to secure the best available terms.",
  },
];

export function bandOf(score: number) {
  return bands.find((b) => score >= b.min && score <= b.max) ?? bands[0];
}

export function CibilGauge({ score, dark = false, className = "mx-auto w-full max-w-[18rem]" }: { score: number; dark?: boolean; className?: string }) {
  // Semicircle from 180° (300) to 0° (900)
  const cx = 120;
  const cy = 118;
  const r = 96;
  const angleFor = (v: number) => Math.PI * (1 - (v - MIN_SCORE) / (MAX_SCORE - MIN_SCORE));
  const pt = (a: number, rad = r) => [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
  const arc = (from: number, to: number) => {
    const [x1, y1] = pt(angleFor(from));
    const [x2, y2] = pt(angleFor(to));
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const [nx, ny] = pt(angleFor(score), r - 26);

  return (
    <svg viewBox="0 0 240 132" className={className} role="img" aria-label={`Credit score gauge showing ${score} out of 900`}>
      {bands.map((b, i) => (
        <path
          key={b.id}
          d={arc(b.min + (i ? 3 : 0), b.max - (i < bands.length - 1 ? 3 : 0))}
          stroke={b.color}
          strokeWidth="16"
          fill="none"
          strokeLinecap="butt"
          opacity={score >= b.min && score <= b.max ? 1 : 0.35}
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={dark ? "#fbf8f3" : "#1f1510"}
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{ transition: "all .25s ease" }}
      />
      <circle cx={cx} cy={cy} r="7" fill={dark ? "#fbf8f3" : "#1f1510"} />
      <text x={pt(Math.PI)[0]} y={cy + 14} textAnchor="middle" className={`text-[10px] font-semibold ${dark ? "fill-ink-400" : "fill-ink-500"}`}>
        {MIN_SCORE}
      </text>
      <text x={pt(0)[0]} y={cy + 14} textAnchor="middle" className={`text-[10px] font-semibold ${dark ? "fill-ink-400" : "fill-ink-500"}`}>
        {MAX_SCORE}
      </text>
    </svg>
  );
}
