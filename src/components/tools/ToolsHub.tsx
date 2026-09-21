"use client";

import { useEffect, useRef, useState } from "react";
import { Calculator, ClipboardList, Gauge, ShieldAlert, type LucideIcon } from "lucide-react";
import { TOOL_EVENT } from "./ToolLink";
import { RequirementFinder } from "./RequirementFinder";
import { EmiCalculator } from "./EmiCalculator";
import { CibilCheck } from "./CibilCheck";
import { CibilRectification } from "./CibilRectification";

export const toolTabs: { id: string; label: string; sub: string; icon: LucideIcon }[] = [
  { id: "finder", label: "Tell us your requirement", sub: "30-second funding finder", icon: ClipboardList },
  { id: "emi", label: "Calculate your EMI", sub: "EMI, interest & total payable", icon: Calculator },
  { id: "cibil", label: "Check your CIBIL", sub: "Know where you stand", icon: Gauge },
  { id: "rectify", label: "Fix CIBIL errors", sub: "Straight to WhatsApp", icon: ShieldAlert },
];

/** Homepage tools panel. Deep-linkable via #tool-finder, #tool-emi, #tool-cibil, #tool-rectify. */
export function ToolsHub() {
  const [active, setActive] = useState("finder");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (id: string) => {
      if (!toolTabs.some((t) => t.id === id)) return;
      setActive(id);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // On load / back-forward, from the URL…
    const fromHash = () => {
      const m = window.location.hash.match(/^#tool-([\w-]+)/);
      if (m) show(m[1]);
    };
    // …and from a ToolLink click, which the History API wouldn't announce.
    const fromEvent = (e: Event) => show((e as CustomEvent<string>).detail);

    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener(TOOL_EVENT, fromEvent);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener(TOOL_EVENT, fromEvent);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = toolTabs[(i + dir + toolTabs.length) % toolTabs.length];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div ref={rootRef} id="tools" className="grid scroll-mt-28 gap-6 lg:grid-cols-[17rem_1fr]">
      <div role="tablist" aria-label="Interactive tools" aria-orientation="vertical" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {toolTabs.map((t, i) => {
          const on = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex min-w-[13.5rem] items-center gap-3 rounded-2xl border p-4 text-left transition lg:min-w-0 ${
                on ? "border-ink-900 bg-ink-900 text-ivory shadow-[var(--shadow-lift)]" : "border-sand-200 bg-white text-ink-800 hover:border-sand-300"
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-bronze-500 text-ink-950" : "bg-sand-100 text-bronze-700"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold">{t.label}</span>
                <span className={`block text-xs ${on ? "text-ink-300" : "text-ink-500"}`}>{t.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="card min-h-[34rem] p-5 sm:p-8">
        {toolTabs.map((t) => (
          <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={active !== t.id}>
            {active === t.id && (
              <>
                {t.id === "finder" && <RequirementFinder />}
                {t.id === "emi" && <EmiCalculator compact />}
                {t.id === "cibil" && <CibilCheck />}
                {t.id === "rectify" && <CibilRectification />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
