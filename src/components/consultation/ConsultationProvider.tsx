"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BadgeCheck, CalendarCheck, Scale, X } from "lucide-react";
import type { LeadType } from "@/lib/leads";
import { LeadForm, type LeadFormVariant } from "./LeadForm";

export type ConsultPreset = {
  type?: LeadType;
  variant?: LeadFormVariant;
  title?: string;
  subtitle?: string;
  requirement?: string;
  message?: string;
  submitLabel?: string;
};

const ConsultationContext = createContext<{ open: (preset?: ConsultPreset) => void } | null>(null);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be used inside <ConsultationProvider>");
  return ctx;
}

/** Hash that opens the booking modal from any link, e.g. /loans#schedule-consultation */
export const CONSULT_HASH = "#schedule-consultation";

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preset, setPreset] = useState<ConsultPreset>({});
  const [session, setSession] = useState(0);

  const open = useCallback((p: ConsultPreset = {}) => {
    setPreset(p);
    setSession((s) => s + 1);
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === CONSULT_HASH) {
        open();
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [open]);

  return (
    <ConsultationContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        className="modal m-auto"
        aria-labelledby="consult-title"
        onClose={() => (document.documentElement.style.overflow = "")}
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        <div className="relative grid max-h-[calc(100dvh-1.5rem)] w-[min(calc(100vw-1.5rem),58rem)] overflow-y-auto rounded-[1.75rem] bg-ivory shadow-2xl md:grid-cols-[18rem_1fr]">
          <aside className="grain relative hidden overflow-hidden bg-ink-950 p-8 text-ivory md:block">
            <div className="grid-lines absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow eyebrow-light">Consultation</p>
              <p className="heading mt-4 text-2xl leading-snug">
                One conversation.
                <br />
                <span className="italic text-bronze-300">Every lender compared.</span>
              </p>
              <ul className="mt-8 space-y-5 text-sm text-ink-300">
                <li className="flex gap-3">
                  <Scale className="mt-0.5 h-5 w-5 shrink-0 text-bronze-300" aria-hidden="true" />
                  Lender-neutral advice across 100+ banks & NBFCs
                </li>
                <li className="flex gap-3">
                  <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-bronze-300" aria-hidden="true" />
                  An advisor calls you at a time that suits you
                </li>
                <li className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-bronze-300" aria-hidden="true" />
                  No-obligation first conversation
                </li>
              </ul>
            </div>
          </aside>
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow md:hidden">Consultation</p>
                <h2 id="consult-title" className="heading mt-2 text-[1.75rem] text-ink-950 md:mt-0">
                  {preset.title ?? "Schedule a consultation"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {preset.subtitle ?? "Share a few details and an advisor will call you at your preferred time."}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-700 transition hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <LeadForm
              key={session}
              type={preset.type ?? "consultation"}
              variant={preset.variant ?? "full"}
              submitLabel={preset.submitLabel}
              defaults={{ requirement: preset.requirement, message: preset.message }}
            />
          </div>
        </div>
      </dialog>
    </ConsultationContext.Provider>
  );
}

/** Drop-in button for server components. */
export function ConsultButton({
  preset,
  className = "btn btn-primary",
  children,
}: {
  preset?: ConsultPreset;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useConsultation();
  return (
    <button type="button" className={className} onClick={() => open(preset)}>
      {children}
    </button>
  );
}
