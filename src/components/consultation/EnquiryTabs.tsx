"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { CalendarCheck, Handshake } from "lucide-react";
import type { LeadType } from "@/lib/leads";
import { LeadForm, type LeadFormVariant } from "./LeadForm";

// The two ways into AapKaLoan: borrowers book a consultation, partners apply to
// work with us. Shared by the consultation modal and the Contact Us page so the
// two stay identical.

export type EnquiryTabKey = "consultation" | "partner";

/** Lets a caller (a tool, a product page) preset the consultation side. */
export type ConsultationPreset = {
  type?: LeadType;
  variant?: LeadFormVariant;
  title?: string;
  subtitle?: string;
  requirement?: string;
  message?: string;
  submitLabel?: string;
};

const TABS = [
  { key: "consultation", label: "Schedule a consultation", short: "Consultation", icon: CalendarCheck },
  { key: "partner", label: "Partner with us", short: "Partner", icon: Handshake },
] as const satisfies readonly { key: EnquiryTabKey; label: string; short: string; icon: typeof CalendarCheck }[];

const PARTNER_COPY = {
  // TODO (content): confirm with AapKaLoan how partners are onboarded.
  title: "Partner with us",
  subtitle: "Refer clients or work with us as a channel partner. Tell us about yourself and our partnerships team will call you back.",
};

export function EnquiryTabs({
  initialTab = "consultation",
  consultation = {},
  titleId,
  onTabChange,
  trailing,
  tone = "light",
}: {
  initialTab?: EnquiryTabKey;
  consultation?: ConsultationPreset;
  /** Id put on the heading, so a dialog can point aria-labelledby at it. */
  titleId?: string;
  onTabChange?: (tab: EnquiryTabKey) => void;
  /** Rendered at the end of the tab row — the modal puts its close button here. */
  trailing?: ReactNode;
  tone?: "light" | "dark";
}) {
  const uid = useId();
  const [tab, setTab] = useState<EnquiryTabKey>(initialTab);
  const tabRefs = useRef<Partial<Record<EnquiryTabKey, HTMLButtonElement | null>>>({});

  const select = (next: EnquiryTabKey) => {
    setTab(next);
    onTabChange?.(next);
  };

  // Left / right arrows move between tabs, as expected of a tablist.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.key === tab);
    const next = e.key === "ArrowRight" ? TABS[(i + 1) % TABS.length] : e.key === "ArrowLeft" ? TABS[(i - 1 + TABS.length) % TABS.length] : null;
    if (!next) return;
    e.preventDefault();
    select(next.key);
    tabRefs.current[next.key]?.focus();
  };

  const dark = tone === "dark";
  const heading = tab === "partner" ? PARTNER_COPY.title : (consultation.title ?? "Schedule a consultation");
  const subtitle =
    tab === "partner"
      ? PARTNER_COPY.subtitle
      : (consultation.subtitle ?? "Share a few details and an advisor will call you at your preferred time.");

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div role="tablist" aria-label="What would you like to do?" onKeyDown={onKeyDown} className={`flex gap-1 rounded-full p-1 ${dark ? "bg-white/10" : "bg-sand-100"}`}>
          {TABS.map(({ key, label, short, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-${key}-tab`}
                aria-selected={active}
                aria-controls={`${uid}-${key}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => select(key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-bronze-800 text-ivory shadow-[var(--shadow-card)]"
                    : dark
                      ? "text-ink-300 hover:text-ivory"
                      : "text-ink-600 hover:text-ink-950"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-bronze-300" : ""}`} aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
              </button>
            );
          })}
        </div>
        {trailing}
      </div>

      <h2 id={titleId} className={`heading mt-6 text-[1.75rem] ${dark ? "text-ivory" : "text-ink-950"}`}>
        {heading}
      </h2>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-ink-300" : "text-ink-600"}`}>{subtitle}</p>

      <div id={`${uid}-consultation-panel`} role="tabpanel" aria-labelledby={`${uid}-consultation-tab`} hidden={tab !== "consultation"} className="mt-7">
        <LeadForm
          type={consultation.type ?? "consultation"}
          variant={consultation.variant ?? "full"}
          tone={tone}
          submitLabel={consultation.submitLabel}
          defaults={{ requirement: consultation.requirement, message: consultation.message }}
        />
      </div>

      <div id={`${uid}-partner-panel`} role="tabpanel" aria-labelledby={`${uid}-partner-tab`} hidden={tab !== "partner"} className="mt-7">
        <LeadForm type="partner" variant="partner" tone={tone} submitLabel="Submit partner enquiry" />
      </div>
    </div>
  );
}
