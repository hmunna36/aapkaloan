import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { branches } from "@/content/branches";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";

export function Footer() {
  const loans = mainNav.find((n) => n.href === "/loans")!.children!;
  const funding = mainNav.find((n) => n.href === "/funding-solutions")!.children!;
  const tools = mainNav.find((n) => n.href === "/resources")!.children!;

  return (
    <footer className="relative bg-ink-950 pb-24 text-ink-300 lg:pb-0">
      <div className="container-x">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div>
            <p className="heading text-3xl text-ivory md:text-4xl">
              Have a requirement in mind?
              <span className="italic text-bronze-300"> Let's talk.</span>
            </p>
            <p className="mt-2 text-ink-400">Speak to an advisor — we'll map the best route across banks, NBFCs and private capital.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ConsultButton className="btn btn-primary btn-lg">Schedule a Consultation</ConsultButton>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" withTagline />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">{site.description}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={site.phone.href} className="flex items-center gap-2.5 hover:text-bronze-300">
                  <Phone className="h-4 w-4 text-bronze-400" aria-hidden="true" /> {site.phone.display}
                </a>
              </li>
              <li>
                <a href={site.landline.href} className="flex items-center gap-2.5 hover:text-bronze-300">
                  <Phone className="h-4 w-4 text-bronze-400" aria-hidden="true" /> {site.landline.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-bronze-300">
                  <Mail className="h-4 w-4 text-bronze-400" aria-hidden="true" /> {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="AapKaLoan on Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-bronze-300 hover:text-bronze-300">
                <FacebookIcon />
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="AapKaLoan on Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-bronze-300 hover:text-bronze-300">
                <InstagramIcon />
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat with AapKaLoan on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-bronze-300 hover:text-bronze-300">
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterCol title="Loans" links={[{ label: "All loans", href: "/loans" }, ...loans]} />
          <FooterCol title="Funding solutions" links={funding} />
          <FooterCol
            title="Company & tools"
            links={[{ label: "About us", href: "/about" }, { label: "Leadership", href: "/about#leadership" }, ...tools, { label: "Contact us", href: "/contact" }]}
          />
        </div>

        <div className="grid gap-6 border-t border-white/10 py-10 md:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="flex gap-3 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400" aria-hidden="true" />
              <div>
                <p className="font-bold text-ivory">{b.name}</p>
                <p className="mt-1 leading-relaxed text-ink-400">{b.address}</p>
                <Link href="/contact#branches" className="mt-2 inline-flex items-center gap-1 text-bronze-300 hover:text-bronze-200">
                  View on map <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-8 text-xs leading-relaxed text-ink-400">
          <p>
            AapKaLoan is a financial advisory and loan facilitation service. We are not a lender. All loans and funding are
            subject to the credit policies, eligibility criteria and final approval of the respective bank, NBFC or investor.
            Rates, tenures and amounts shown on this site are indicative. CIBIL is a trademark of TransUnion CIBIL Ltd.;
            AapKaLoan is not affiliated with it.
          </p>
          <p className="mt-4">© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-bronze-300">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
