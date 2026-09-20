"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { calculateEmi, formatINR, formatINRShort, yearlySchedule } from "@/lib/finance";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

const MIN_AMOUNT = 1e5;
const MAX_AMOUNT = 1e8;

// Indicative starting points only — lenders price on profile.
const presets = [
  { label: "Home Loan", requirement: "Home Loan", rate: 8.5, years: 20, amount: 50e5 },
  { label: "Loan Against Property", requirement: "Loan Against Property", rate: 9.75, years: 15, amount: 75e5 },
  { label: "MSME Loan", requirement: "MSME Loan", rate: 12, years: 5, amount: 25e5 },
  { label: "Business Loan", requirement: "Unsecured Business Loan", rate: 15, years: 3, amount: 15e5 },
];

// Log-scale slider so ₹1 L – ₹10 Cr are all reachable with fine control at the low end.
const toPos = (amt: number) => (Math.log10(amt / MIN_AMOUNT) / Math.log10(MAX_AMOUNT / MIN_AMOUNT)) * 1000;
const fromPos = (pos: number) => {
  const raw = MIN_AMOUNT * (MAX_AMOUNT / MIN_AMOUNT) ** (pos / 1000);
  const step = raw < 1e6 ? 1e4 : raw < 1e7 ? 5e4 : 5e5;
  return Math.round(raw / step) * step;
};
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function EmiCalculator({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  const { open } = useConsultation();
  const [amount, setAmount] = useState(50e5);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [preset, setPreset] = useState("Home Loan");
  const [amountText, setAmountText] = useState<string | null>(null);

  const months = years * 12;
  const { emi, totalInterest, totalPayable } = useMemo(() => calculateEmi(amount, rate, months), [amount, rate, months]);
  const schedule = useMemo(() => yearlySchedule(amount, rate, months), [amount, rate, months]);
  const principalShare = totalPayable ? amount / totalPayable : 1;

  const summary = `${formatINR(amount)} at ${rate}% for ${years} years — EMI ${formatINR(emi)}`;

  const applyPreset = (p: (typeof presets)[number]) => {
    setPreset(p.label);
    setRate(p.rate);
    setYears(p.years);
    setAmount(p.amount);
  };

  return (
    <div className={`grid gap-6 ${compact ? "xl:grid-cols-[1fr_1fr]" : "lg:grid-cols-[1.15fr_1fr]"}`}>
      {/* Inputs */}
      <div className="space-y-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Start from</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Loan type presets">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                aria-pressed={preset === p.label}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  preset === p.label
                    ? "border-ink-900 bg-ink-900 text-ivory"
                    : "border-sand-300 bg-white text-ink-700 hover:border-ink-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <SliderField
          id={`${uid}-amount`}
          label="Loan amount"
          display={
            <input
              aria-label="Loan amount in rupees"
              className="num w-40 rounded-lg border border-sand-300 bg-white px-3 py-1.5 text-right font-bold text-ink-950 focus:border-bronze-500 focus:outline-none"
              inputMode="numeric"
              value={amountText ?? `₹${new Intl.NumberFormat("en-IN").format(amount)}`}
              onFocus={() => setAmountText(String(amount))}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setAmountText(digits);
                const n = Number(digits);
                if (n >= MIN_AMOUNT && n <= MAX_AMOUNT) setAmount(n);
                setPreset("");
              }}
              onBlur={() => {
                const n = Number(amountText);
                if (amountText !== null) setAmount(clamp(Number.isFinite(n) && n > 0 ? n : amount, MIN_AMOUNT, MAX_AMOUNT));
                setAmountText(null);
              }}
            />
          }
          min={0}
          max={1000}
          step={1}
          value={toPos(amount)}
          onChange={(v) => {
            setAmount(fromPos(v));
            setPreset("");
          }}
          minLabel="₹1 L"
          maxLabel="₹10 Cr"
          valueText={formatINRShort(amount)}
        />

        <SliderField
          id={`${uid}-rate`}
          label="Interest rate (p.a.)"
          display={
            <NumberBox value={rate} suffix="%" min={5} max={24} step={0.05} onChange={(v) => (setRate(v), setPreset(""))} label="Interest rate" />
          }
          min={5}
          max={24}
          step={0.05}
          value={rate}
          onChange={(v) => {
            setRate(Math.round(v * 100) / 100);
            setPreset("");
          }}
          minLabel="5%"
          maxLabel="24%"
          valueText={`${rate}%`}
        />

        <SliderField
          id={`${uid}-tenure`}
          label="Loan tenure"
          display={<NumberBox value={years} suffix="yrs" min={1} max={30} step={1} onChange={(v) => (setYears(v), setPreset(""))} label="Tenure in years" />}
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={(v) => {
            setYears(v);
            setPreset("");
          }}
          minLabel="1 yr"
          maxLabel="30 yrs"
          valueText={`${years} years`}
        />
      </div>

      {/* Results */}
      <div className="grain relative flex flex-col overflow-hidden rounded-3xl bg-ink-950 p-6 text-ivory sm:p-8" aria-live="polite">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-bronze-300">Your monthly EMI</p>
              <p className="display num mt-2 text-[2.6rem] leading-none sm:text-6xl">{formatINR(emi)}</p>
              <p className="mt-2 text-sm text-ink-400">for {months} months</p>
            </div>
            <Donut share={principalShare} />
          </div>

          <dl className="mt-7 space-y-3 text-sm">
            <Row swatch="bg-bronze-300" label="Principal" value={formatINR(amount)} />
            <Row swatch="bg-bronze-600" label="Total interest" value={formatINR(totalInterest)} />
            <div className="border-t border-white/10 pt-3">
              <Row label="Total amount payable" value={formatINR(totalPayable)} strong />
            </div>
          </dl>

          {!compact && schedule.length > 1 && <ScheduleBars schedule={schedule} />}

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="font-bold text-ivory">Want to explore your loan options?</p>
              <p className="mt-1 text-sm text-ink-400">Talk to AapKaLoan — we'll compare lenders to beat this rate where possible.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    open({
                      type: "emi-calculator",
                      title: "Talk to AapKaLoan about this loan",
                      requirement: presets.find((p) => p.label === preset)?.requirement,
                      message: `EMI calculation: ${summary}.`,
                    })
                  }
                >
                  Schedule Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href={whatsappUrl(`Hi AapKaLoan, I calculated an EMI on your site: ${summary}. I'd like to explore my loan options.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
            <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-500">
              Indicative calculation on a reducing-balance basis. Actual EMI depends on the lender's rate, fees and your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
  valueText,
}: {
  id: string;
  label: string;
  display: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
  valueText: string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-bold text-ink-800">
          {label}
        </label>
        {display}
      </div>
      <input
        id={id}
        type="range"
        className="range mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1 flex justify-between text-xs text-ink-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function NumberBox({
  value,
  suffix,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div className="flex items-center rounded-lg border border-sand-300 bg-white pr-3 focus-within:border-bronze-500">
      <input
        aria-label={label}
        className="num w-20 bg-transparent px-3 py-1.5 text-right font-bold text-ink-950 focus:outline-none"
        inputMode="decimal"
        value={text ?? String(value)}
        onFocus={() => setText(String(value))}
        onChange={(e) => {
          setText(e.target.value);
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n >= min && n <= max) onChange(n);
        }}
        onBlur={() => {
          const n = Number(text);
          if (text !== null && Number.isFinite(n)) onChange(clamp(Math.round(n / step) * step, min, max));
          setText(null);
        }}
      />
      <span className="text-sm font-semibold text-ink-500">{suffix}</span>
    </div>
  );
}

function Row({ swatch, label, value, strong }: { swatch?: string; label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-ink-300">
        {swatch && <span className={`h-2.5 w-2.5 rounded-full ${swatch}`} aria-hidden="true" />}
        {label}
      </dt>
      <dd className={`num ${strong ? "text-base font-bold text-ivory" : "font-semibold text-ivory"}`}>{value}</dd>
    </div>
  );
}

function Donut({ share }: { share: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0 -rotate-90 sm:h-24 sm:w-24" role="img" aria-label={`Principal ${Math.round(share * 100)}%, interest ${100 - Math.round(share * 100)}%`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-bronze-600)" strokeWidth="12" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--color-bronze-300)"
        strokeWidth="12"
        strokeDasharray={`${c * share} ${c}`}
        style={{ transition: "stroke-dasharray .4s ease" }}
      />
      <text x="50" y="50" transform="rotate(90 50 50)" textAnchor="middle" dominantBaseline="central" className="fill-ivory text-[15px] font-bold">
        {Math.round(share * 100)}%
      </text>
    </svg>
  );
}

function ScheduleBars({ schedule }: { schedule: { year: number; principal: number; interest: number }[] }) {
  const max = Math.max(...schedule.map((s) => s.principal + s.interest));
  return (
    <div className="mt-7">
      <p className="text-xs font-semibold text-ink-400">Principal vs interest paid, year by year</p>
      <div className="mt-3 flex h-20 items-end gap-[3px]" aria-hidden="true">
        {schedule.map((s) => (
          <div key={s.year} className="flex flex-1 flex-col justify-end" style={{ height: `${((s.principal + s.interest) / max) * 100}%` }}>
            <div className="rounded-t-[2px] bg-bronze-600" style={{ flex: s.interest }} />
            <div className="bg-bronze-300" style={{ flex: s.principal }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.7rem] text-ink-500">
        <span>Year 1</span>
        <span>Year {schedule.length}</span>
      </div>
    </div>
  );
}
