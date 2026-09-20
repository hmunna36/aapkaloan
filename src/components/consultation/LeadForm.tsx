"use client";

import { usePathname } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CircleCheck, LoaderCircle, ShieldCheck } from "lucide-react";
import { requirementLabels } from "@/content/funding";
import { amountRanges, isEmail, normaliseMobile, submitLead, timeSlots, type LeadPayload, type LeadType } from "@/lib/leads";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export type LeadFormVariant = "full" | "compact" | "cibil" | "school";

export const schoolPurposes = [
  "Campus construction / expansion",
  "Land purchase",
  "School buses & transport",
  "Smart classrooms, labs & IT",
  "Working capital",
  "Refinance existing loans",
  "Acquire / start a new school",
  "Other",
];

type Values = Omit<LeadPayload, "type" | "consent"> & { consent: boolean; purpose?: string };
type Errors = Partial<Record<keyof Values, string>>;

export function LeadForm({
  type,
  variant = "full",
  defaults = {},
  submitLabel = "Request consultation",
  tone = "light",
  hideRequirement = false,
}: {
  type: LeadType;
  variant?: LeadFormVariant;
  defaults?: Partial<Values>;
  submitLabel?: string;
  tone?: "light" | "dark";
  hideRequirement?: boolean;
}) {
  const uid = useId();
  const pathname = usePathname();
  const [values, setValues] = useState<Values>({ name: "", phone: "", consent: false, ...defaults });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");
  const [refId, setRefId] = useState("");

  const dark = tone === "dark";
  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate(): Errors {
    const er: Errors = {};
    if (!values.name || values.name.trim().length < 2) er.name = "Please enter your name.";
    if (!normaliseMobile(values.phone)) er.phone = "Enter a valid 10-digit mobile number.";
    if (values.email && !isEmail(values.email)) er.email = "Enter a valid email address.";
    if (variant === "school" && !values.institution?.trim()) er.institution = "Please enter the institution name.";
    if (!values.consent) er.consent = "Please agree so our advisor can contact you.";
    return er;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      const first = Object.keys(er)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    const { purpose, ...rest } = values;
    const payload: LeadPayload = {
      ...rest,
      type,
      source: pathname,
      requirement: variant === "school" ? `School Funding${purpose ? ` — ${purpose}` : ""}` : rest.requirement,
    };
    const res = await submitLead(payload);
    if (res.ok) {
      setRefId(res.id);
      setStatus("done");
    } else {
      setServerError(res.error);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <LeadSuccess name={values.name} refId={refId} tone={tone} requirement={values.requirement} />;
  }

  const label = `field-label ${dark ? "!text-ivory" : ""}`;
  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className={`mt-1.5 text-xs font-semibold ${dark ? "text-bronze-300" : "text-rose-700"}`}>
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Values) => ({
    id: `${uid}-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const showEmail = variant !== "compact";
  const showRequirement = !hideRequirement && (variant === "full" || variant === "compact");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={set("website")} />
        </label>
      </div>

      {variant === "school" && (
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-institution`} className={label}>
            School / Trust name
          </label>
          <input className="field" placeholder="e.g. Sunrise Public School" value={values.institution ?? ""} onChange={set("institution")} {...a11y("institution")} />
          {err("institution")}
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-name`} className={label}>
          {variant === "school" ? "Contact person" : "Full name"}
        </label>
        <input className="field" autoComplete="name" placeholder="Your name" value={values.name} onChange={set("name")} {...a11y("name")} />
        {err("name")}
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className={label}>
          Mobile number
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-500">+91</span>
          <input
            className="field !pl-12 num"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={values.phone}
            onChange={set("phone")}
            {...a11y("phone")}
          />
        </div>
        {err("phone")}
      </div>

      {showEmail && (
        <div>
          <label htmlFor={`${uid}-email`} className={label}>
            Email <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={values.email ?? ""} onChange={set("email")} {...a11y("email")} />
          {err("email")}
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-city`} className={label}>
          City
        </label>
        <input className="field" autoComplete="address-level2" placeholder="Bengaluru" value={values.city ?? ""} onChange={set("city")} {...a11y("city")} />
      </div>

      {showRequirement && (
        <div className={variant === "compact" ? "" : "sm:col-span-1"}>
          <label htmlFor={`${uid}-requirement`} className={label}>
            What do you need?
          </label>
          <select className="field" value={values.requirement ?? ""} onChange={set("requirement")} {...a11y("requirement")}>
            <option value="">Select a requirement</option>
            {requirementLabels.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      {variant === "school" && (
        <div>
          <label htmlFor={`${uid}-purpose`} className={label}>
            Funding purpose
          </label>
          <select className="field" value={values.purpose ?? ""} onChange={set("purpose")} {...a11y("purpose")}>
            <option value="">Select purpose</option>
            {schoolPurposes.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      {(variant === "full" || variant === "school") && (
        <div>
          <label htmlFor={`${uid}-amount`} className={label}>
            Approximate amount
          </label>
          <select className="field" value={values.amount ?? ""} onChange={set("amount")} {...a11y("amount")}>
            <option value="">Select a range</option>
            {amountRanges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      {variant === "full" && (
        <>
          <div>
            <label htmlFor={`${uid}-preferredDate`} className={label}>
              Preferred date
            </label>
            <input className="field" type="date" min={today} value={values.preferredDate ?? ""} onChange={set("preferredDate")} {...a11y("preferredDate")} />
          </div>
          <div>
            <label htmlFor={`${uid}-preferredTime`} className={label}>
              Preferred time
            </label>
            <select className="field" value={values.preferredTime ?? ""} onChange={set("preferredTime")} {...a11y("preferredTime")}>
              <option value="">Any time</option>
              {timeSlots.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {variant !== "compact" && (
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className={label}>
            {variant === "cibil" ? "Anything we should know?" : "Tell us briefly about your requirement"} <span className="font-normal opacity-60">(optional)</span>
          </label>
          <textarea className="field min-h-24 resize-y" rows={3} value={values.message ?? ""} onChange={set("message")} {...a11y("message")} />
        </div>
      )}

      <div className="sm:col-span-2">
        <label className={`flex cursor-pointer items-start gap-3 text-sm leading-snug ${dark ? "text-ink-300" : "text-ink-600"}`}>
          <input
            type="checkbox"
            className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-bronze-600"
            checked={values.consent}
            onChange={(e) => {
              setValues((v) => ({ ...v, consent: e.target.checked }));
              if (errors.consent) setErrors((er) => ({ ...er, consent: undefined }));
            }}
            {...a11y("consent")}
          />
          <span>I agree to be contacted by AapKaLoan via call, SMS, WhatsApp or email about this enquiry.</span>
        </label>
        {err("consent")}
      </div>

      {serverError && (
        <p role="alert" className="sm:col-span-2 rounded-xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={`flex items-center gap-2 text-xs ${dark ? "text-ink-400" : "text-ink-500"}`}>
          <ShieldCheck className="h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
          Your details are confidential and never shared without consent.
        </p>
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
          {status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {status === "sending" ? "Sending…" : submitLabel}
          {status !== "sending" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

export function LeadSuccess({
  name,
  refId,
  tone = "light",
  requirement,
}: {
  name: string;
  refId: string;
  tone?: "light" | "dark";
  requirement?: string;
}) {
  const dark = tone === "dark";
  const first = name.trim().split(/\s+/)[0];
  return (
    <div role="status" className="flex flex-col items-start gap-4 py-2">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-moss-100 text-moss-700">
        <CircleCheck className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h3 className={`heading text-2xl ${dark ? "text-ivory" : "text-ink-950"}`}>Thank you, {first}.</h3>
        <p className={`mt-2 max-w-md leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>
          Your request has been received. An AapKaLoan advisor will call you during working hours to understand your
          requirement.
        </p>
        <p className={`mt-3 text-sm ${dark ? "text-ink-400" : "text-ink-500"}`}>
          Reference: <span className="num font-bold">{refId}</span>
        </p>
      </div>
      <a
        href={whatsappUrl(`Hi AapKaLoan, I just submitted an enquiry (ref ${refId})${requirement ? ` for ${requirement}` : ""}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-wa"
      >
        <WhatsAppIcon className="h-5 w-5" /> Can't wait? Chat on WhatsApp
      </a>
    </div>
  );
}
