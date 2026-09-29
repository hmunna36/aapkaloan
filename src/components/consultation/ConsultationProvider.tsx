"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BadgeCheck, CalendarCheck, ClipboardCheck, Handshake, Scale, Users, X } from "lucide-react";
import { EnquiryTabs, type ConsultationPreset, type EnquiryTabKey } from "./EnquiryTabs";

export type ConsultPreset = ConsultationPreset & {
  /** Which tab the modal opens on. Defaults to the consultation form. */
  tab?: EnquiryTabKey;
};

const ConsultationContext = createContext<{ open: (preset?: ConsultPreset) => void } | null>(null);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be used inside <ConsultationProvider>");
  return ctx;
}

/** Hashes that open the modal from any link, e.g. /loans#schedule-consultation */
export const CONSULT_HASH = "#schedule-consultation";
export const PARTNER_HASH = "#partner-with-us";

// The panel beside the form, which follows the selected tab.
const ASIDE = {
  consultation: {
    eyebrow: "Consultation",
    heading: (
      <>
        One conversation.
        <br />
        <span className="italic text-bronze-300">Every lender compared.</span>
      </>
    ),
    points: [
      { icon: Scale, text: "Lender-neutral advice across 100+ banks & NBFCs" },
      { icon: CalendarCheck, text: "An advisor calls you at a time that suits you" },
      { icon: BadgeCheck, text: "No-obligation first conversation" },
    ],
  },
  partner: {
    eyebrow: "Partnerships",
    heading: (
      <>
        Bring us the client.
        <br />
        <span className="italic text-bronze-300">We'll structure the funding.</span>
      </>
    ),
    // TODO (content): confirm what AapKaLoan offers partners before launch.
    points: [
      { icon: Handshake, text: "Access to 100+ bank, NBFC and private capital relationships" },
      { icon: ClipboardCheck, text: "We handle structuring, documentation and lender follow-up" },
      { icon: Users, text: "One partnerships contact for every file you refer" },
    ],
  },
} as const;

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preset, setPreset] = useState<ConsultPreset>({});
  const [tab, setTab] = useState<EnquiryTabKey>("consultation");
  const [session, setSession] = useState(0);

  const open = useCallback((p: ConsultPreset = {}) => {
    setPreset(p);
    setTab(p.tab ?? "consultation");
    setSession((s) => s + 1);
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash;
      if (hash !== CONSULT_HASH && hash !== PARTNER_HASH) return;
      open(hash === PARTNER_HASH ? { tab: "partner" } : {});
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [open]);

  const aside = ASIDE[tab];

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
          <aside className="grain surface-tan relative hidden overflow-hidden p-8 text-ivory md:block">
            <div className="grid-lines absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow eyebrow-light">{aside.eyebrow}</p>
              <p className="heading mt-4 text-2xl leading-snug">{aside.heading}</p>
              <ul className="mt-8 space-y-5 text-sm text-ink-300">
                {aside.points.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-bronze-300" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="p-6 sm:p-8">
            <EnquiryTabs
              key={session}
              titleId="consult-title"
              initialTab={preset.tab ?? "consultation"}
              consultation={preset}
              onTabChange={setTab}
              trailing={
                <button
                  type="button"
                  onClick={close}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-700 transition hover:bg-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              }
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
