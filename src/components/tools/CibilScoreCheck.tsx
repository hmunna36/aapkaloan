"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Info, LoaderCircle, Lock, Minus, RotateCcw, TriangleAlert } from "lucide-react";
import type { ScoreResult } from "@/lib/cibil/types";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { CibilGauge, bandOf } from "./CibilGauge";

type Step = "form" | "otp" | "result";

type Values = { name: string; pan: string; dob: string; mobile: string; city: string; consent: boolean };

const CONSENT_TEXT =
  "I authorise AapKaLoan to fetch my credit score and report summary from the credit bureau for this enquiry, and to contact me about my loan requirement. I confirm the PAN belongs to me.";

export function CibilScoreCheck({ tone = "light" }: { tone?: "light" | "dark" }) {
  const uid = useId();
  const { open } = useConsultation();
  const dark = tone === "dark";

  const [step, setStep] = useState<Step>("form");
  const [values, setValues] = useState<Values>({ name: "", pan: "", dob: "", mobile: "", city: "", consent: false });
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [check, setCheck] = useState<{ checkId: string; maskedMobile: string; bureau: string; isSample: boolean; demoOtp?: string } | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const raw = e.target.value;
    setValues((v) => ({ ...v, [k]: k === "pan" ? raw.toUpperCase().slice(0, 10) : raw }));
    setError("");
  };

  async function startCheck(e: FormEvent) {
    e.preventDefault();
    if (!values.consent) return setError("Please give consent for the credit bureau check.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/cibil/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent: true }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "We couldn't start the check.");
      setCheck({ checkId: data.checkId, maskedMobile: data.maskedMobile, bureau: data.bureau, isSample: data.isSample, demoOtp: data.demoOtp });
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/cibil/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId: check?.checkId, otp, city: values.city }),
      });
      const data = await res.json();
      if (!data.ok) {
        if (data.code === "otp_expired" || data.code === "not_found") {
          setStep("form");
          setOtp("");
        }
        throw new Error(data.error ?? "We couldn't verify that OTP.");
      }
      setResult(data.result as ScoreResult);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStep("form");
    setOtp("");
    setResult(null);
    setCheck(null);
    setError("");
  }

  const label = `field-label ${dark ? "!text-ivory" : ""}`;
  const card = dark ? "bg-white/[0.05] ring-1 ring-white/10" : "card";

  return (
    <div className={`rounded-3xl p-6 sm:p-7 ${card}`}>
      {check?.isSample && step !== "form" && <SampleBanner />}

      {step === "form" && (
        <form onSubmit={startCheck} className="grid gap-4">
          <div>
            <h4 className={`heading text-2xl ${dark ? "text-ivory" : "text-ink-950"}`}>Check your score free</h4>
            <p className={`mt-1.5 text-sm ${dark ? "text-ink-300" : "text-ink-600"}`}>
              Takes a minute. This is a soft enquiry — it does not affect your score.
            </p>
          </div>

          <div>
            <label htmlFor={`${uid}-name`} className={label}>
              Full name (as on PAN)
            </label>
            <input id={`${uid}-name`} className="field" autoComplete="name" required value={values.name} onChange={set("name")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-pan`} className={label}>
                PAN
              </label>
              <input
                id={`${uid}-pan`}
                className="field num uppercase"
                placeholder="ABCDE1234F"
                required
                inputMode="text"
                autoCapitalize="characters"
                maxLength={10}
                value={values.pan}
                onChange={set("pan")}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-dob`} className={label}>
                Date of birth
              </label>
              <input id={`${uid}-dob`} className="field" type="date" required max={new Date().toISOString().slice(0, 10)} value={values.dob} onChange={set("dob")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-mobile`} className={label}>
                Mobile (registered with the bureau)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-500">+91</span>
                <input
                  id={`${uid}-mobile`}
                  className="field num !pl-12"
                  type="tel"
                  inputMode="numeric"
                  required
                  placeholder="98765 43210"
                  value={values.mobile}
                  onChange={set("mobile")}
                />
              </div>
            </div>
            <div>
              <label htmlFor={`${uid}-city`} className={label}>
                City <span className="font-normal opacity-60">(optional)</span>
              </label>
              <input id={`${uid}-city`} className="field" autoComplete="address-level2" placeholder="Bengaluru" value={values.city} onChange={set("city")} />
            </div>
          </div>

          <label className={`flex cursor-pointer items-start gap-3 text-xs leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-bronze-600"
              checked={values.consent}
              onChange={(e) => {
                setValues((v) => ({ ...v, consent: e.target.checked }));
                setError("");
              }}
            />
            <span>{CONSENT_TEXT}</span>
          </label>

          {error && <ErrorNote message={error} />}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy}>
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Checking…" : "Get my score"}
            {!busy && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>

          <p className={`flex items-start gap-2 text-[0.7rem] leading-relaxed ${dark ? "text-ink-400" : "text-ink-500"}`}>
            <Lock className="mt-px h-3.5 w-3.5 shrink-0 text-moss-500" aria-hidden="true" />
            Your PAN is used only for this check and is never stored on this site. We will never ask for your passwords, card
            numbers or banking OTPs.
          </p>
        </form>
      )}

      {step === "otp" && check && (
        <form onSubmit={submitOtp} className="grid gap-4">
          <div>
            <h4 className={`heading text-2xl ${dark ? "text-ivory" : "text-ink-950"}`}>Enter the OTP</h4>
            <p className={`mt-1.5 text-sm ${dark ? "text-ink-300" : "text-ink-600"}`}>
              {check.isSample ? "A one-time password was sent to" : `${check.bureau} sent a one-time password to`}{" "}
              <span className="num font-bold">{check.maskedMobile}</span>.
            </p>
          </div>

          <div>
            <label htmlFor={`${uid}-otp`} className={label}>
              One-time password
            </label>
            <input
              id={`${uid}-otp`}
              className="field num !text-center !text-2xl !tracking-[0.5em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              placeholder="······"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
            />
            {check.demoOtp && (
              <p className="mt-2 text-xs text-ink-500">
                Demo mode — use <span className="num font-bold">{check.demoOtp}</span>
              </p>
            )}
          </div>

          {error && <ErrorNote message={error} />}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary btn-lg flex-1" disabled={busy || otp.length < 4}>
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {busy ? "Verifying…" : "See my score"}
            </button>
            <button type="button" onClick={reset} className={`btn ${dark ? "btn-outline-light" : "btn-outline"}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
            </button>
          </div>
        </form>
      )}

      {step === "result" && result && <Result result={result} dark={dark} onReset={reset} openConsult={open} />}
    </div>
  );
}

function Result({
  result,
  dark,
  onReset,
  openConsult,
}: {
  result: ScoreResult;
  dark: boolean;
  onReset: () => void;
  openConsult: ReturnType<typeof useConsultation>["open"];
}) {
  const band = bandOf(result.score);
  const weak = result.score < 650;

  return (
    <div aria-live="polite">
      <CibilGauge score={result.score} dark={dark} />
      <div className="mt-2 text-center">
        <p className="display num text-5xl" style={{ color: band.color }}>
          {result.score}
        </p>
        <p className={`mt-1 text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-ink-300" : "text-ink-600"}`}>{band.label}</p>
        <p className={`mt-1 text-xs ${dark ? "text-ink-400" : "text-ink-500"}`}>
          {result.bureau} · {result.maskedPan} · as on {result.scoreDate}
        </p>
      </div>

      <p className={`mt-4 text-sm leading-relaxed ${dark ? "text-ink-300" : "text-ink-700"}`}>{band.advice}</p>

      {result.summary && <SummaryGrid summary={result.summary} dark={dark} />}

      {result.factors.length > 0 && (
        <div className="mt-5">
          <p className={`text-xs font-bold uppercase tracking-[0.14em] ${dark ? "text-bronze-300" : "text-bronze-700"}`}>What's affecting your score</p>
          <ul className="mt-3 space-y-2.5">
            {result.factors.map((f) => {
              const Icon = f.impact === "positive" ? CircleCheck : f.impact === "negative" ? TriangleAlert : Minus;
              const colour = f.impact === "positive" ? "text-moss-500" : f.impact === "negative" ? "text-rose-700" : "text-ink-400";
              return (
                <li key={f.label} className="flex gap-2.5">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colour}`} aria-hidden="true" />
                  <span className={`text-sm leading-snug ${dark ? "text-ink-300" : "text-ink-700"}`}>
                    <span className={`font-bold ${dark ? "text-ivory" : "text-ink-900"}`}>{f.label}.</span> {f.detail}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {result.isSample && <SampleBanner className="mt-5" />}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() =>
            openConsult({
              type: "cibil-check",
              title: "Talk through your options",
              subtitle: `With a score of ${result.score}, an advisor can tell you which lenders are realistic and on what terms.`,
              requirement: "CIBIL Score Enquiry",
              message: `Checked CIBIL on site: score ${result.score} (${band.label}).`,
            })
          }
        >
          What can I borrow? <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        {weak && (
          <Link href="/resources#cibil-rectification" className={`btn btn-sm ${dark ? "btn-outline-light" : "btn-outline"}`}>
            Fix errors on my report
          </Link>
        )}
        <a
          href={whatsappUrl(`Hi AapKaLoan, I checked my credit score on your site (${result.score}) and would like to discuss my options.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa btn-sm"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
        <button type="button" onClick={onReset} className={`btn btn-sm ${dark ? "btn-outline-light" : "btn-outline"}`}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Check another
        </button>
      </div>
    </div>
  );
}

function SummaryGrid({ summary, dark }: { summary: NonNullable<ScoreResult["summary"]>; dark: boolean }) {
  const items = [
    { label: "Open accounts", value: summary.openAccounts },
    { label: "Overdue", value: summary.overdueAccounts },
    { label: "Enquiries (6m)", value: summary.enquiriesLast6Months },
    { label: "Utilisation", value: summary.creditUtilisationPct, suffix: "%" },
  ].filter((i) => i.value !== undefined);
  if (!items.length) return null;

  return (
    <dl className={`mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4 ${dark ? "bg-white/10" : "bg-sand-200"}`}>
      {items.map((i) => (
        <div key={i.label} className={dark ? "bg-ink-950/60 p-3" : "bg-sand-50 p-3"}>
          <dt className={`text-[0.68rem] ${dark ? "text-ink-400" : "text-ink-500"}`}>{i.label}</dt>
          <dd className={`num mt-0.5 text-xl font-extrabold ${dark ? "text-ivory" : "text-ink-950"}`}>
            {i.value}
            {i.suffix}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SampleBanner({ className = "mb-5" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 rounded-xl bg-bronze-100 px-4 py-3 text-xs leading-relaxed text-bronze-800 ${className}`}>
      <Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        <strong className="font-bold">Demo mode.</strong> These are sample numbers, not a real credit bureau check. Connect a
        bureau provider to show live scores.
      </span>
    </p>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
