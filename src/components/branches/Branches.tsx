"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { branches, directionsUrl } from "@/content/branches";

const BranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[22rem] w-full animate-pulse bg-sand-100" />,
});

export function Branches() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[24rem_1fr]">
      <ul className="divide-y divide-sand-200">
        {branches.map((b) => {
          const on = active === b.id;
          return (
            <li key={b.id} className={`p-6 transition-colors ${on ? "bg-sand-50" : ""}`}>
              <button type="button" onClick={() => setActive(b.id)} className="group w-full text-left" aria-pressed={on}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-bronze-700">{b.kind}</p>
                <p className="mt-1 flex items-center justify-between text-lg font-extrabold text-ink-950">
                  {b.name}
                  <MapPin className={`h-4 w-4 transition ${on ? "text-bronze-600" : "text-ink-300 group-hover:text-bronze-500"}`} aria-hidden="true" />
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{b.address}</p>
                <span className="sr-only">Show on map</span>
              </button>
              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                <li>
                  <a href={b.phone.href} className="flex items-center gap-2.5 hover:text-bronze-700">
                    <Phone className="h-4 w-4 text-bronze-600" aria-hidden="true" /> {b.phone.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${b.email}`} className="flex items-center gap-2.5 hover:text-bronze-700">
                    <Mail className="h-4 w-4 text-bronze-600" aria-hidden="true" /> {b.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-bronze-600" aria-hidden="true" /> {b.hours}
                </li>
              </ul>
              <a href={directionsUrl(b)} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm mt-5">
                <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
              </a>
            </li>
          );
        })}
      </ul>
      <div className="relative min-h-[22rem] border-t border-sand-200 lg:border-l lg:border-t-0">
        <BranchMap activeId={active} onSelect={setActive} />
      </div>
    </div>
  );
}
