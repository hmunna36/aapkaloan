"use client";

import { CalendarCheck, Phone } from "lucide-react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

/** Floating WhatsApp button on desktop; sticky Call / WhatsApp / Consult bar on mobile. */
export function QuickActions() {
  const { open } = useConsultation();
  return (
    <>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-wa py-3 pl-3 pr-3 text-wa-ink shadow-[0_12px_30px_-10px_rgb(7_59_31/0.55)] transition-all hover:pr-5 lg:flex"
        aria-label="Chat with AapKaLoan on WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-40">
          Chat on WhatsApp
        </span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-ivory/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2">
          <a href={site.phone.href} className="btn btn-outline btn-sm">
            <Phone className="h-4 w-4" aria-hidden="true" /> Call
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
            <WhatsAppIcon className="h-4 w-4" /> Chat
          </a>
          <button type="button" onClick={() => open()} className="btn btn-primary btn-sm">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Consultation
          </button>
        </div>
      </div>
    </>
  );
}
