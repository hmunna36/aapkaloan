import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { LeadForm } from "@/components/consultation/LeadForm";
import { Branches } from "@/components/branches/Branches";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us — Schedule a Consultation",
  description: "Schedule a consultation with AapKaLoan, call, WhatsApp or visit our Bengaluru head office and Chennai regional office.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: Phone, label: "Call us", value: site.phone.display, sub: `Office: ${site.landline.display}`, href: site.phone.href },
  { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with an advisor", sub: "Fastest for CIBIL queries", href: whatsappUrl(), external: true },
  { icon: Mail, label: "Email", value: site.email, sub: "For documents & detailed queries", href: `mailto:${site.email}` },
  { icon: Clock, label: "Working hours", value: site.hours, sub: "Bengaluru & Chennai" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Schedule a consultation. <span className="italic text-bronze-300">We'll take it from there.</span>
          </>
        }
        intro="Pick a date and time, and an AapKaLoan advisor will call you to understand your requirement. Prefer to talk now? Call or WhatsApp us."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div className="card p-6 sm:p-9">
            <h2 className="heading text-3xl text-ink-950">Book your consultation</h2>
            <p className="mt-2 text-sm text-ink-600">It takes under a minute.</p>
            <div className="mt-8">
              <LeadForm type="consultation" variant="full" />
            </div>
          </div>
          <ul className="space-y-3">
            {channels.map(({ icon: Icon, label, value, sub, href, external }) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-900 text-bronze-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{label}</span>
                    <span className="mt-1 block font-extrabold text-ink-950">{value}</span>
                    <span className="block text-sm text-ink-500">{sub}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="card flex items-center gap-4 p-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="branches" className="scroll-mt-24 border-t border-sand-200 bg-sand-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Branches" title="Visit us" intro="Tap a branch to find it on the map, or get directions straight to our door." />
          <div className="mt-10">
            <Branches />
          </div>
        </div>
      </section>
    </>
  );
}
