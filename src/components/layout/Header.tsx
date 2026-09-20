"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

export function Header() {
  const pathname = usePathname();
  const { open } = useConsultation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || mobileOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* utility bar */}
      <div
        className={`hidden overflow-hidden bg-ink-950 text-[0.78rem] text-ink-300 transition-all duration-300 lg:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="container-x flex h-9 items-center justify-between border-b border-white/5">
          <p>
            Financial advisory & funding partner since {site.since} <span className="mx-2 text-ink-600">·</span> Bengaluru{" "}
            <span className="mx-1 text-ink-600">·</span> Chennai
          </p>
          <div className="flex items-center gap-5">
            <a href={site.phone.href} className="flex items-center gap-1.5 hover:text-bronze-300">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-bronze-300">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {site.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-bronze-300">
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div
        className={`transition-colors duration-300 ${
          solid ? "border-b border-sand-200 bg-ivory/92 shadow-[0_8px_30px_-20px_rgb(20_16_13/0.35)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Logo tone={solid ? "dark" : "light"} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors ${
                      solid ? "text-ink-700 hover:text-ink-950" : "text-ink-300 hover:text-ivory"
                    } ${isActive(item.href) ? (solid ? "!text-ink-950" : "!text-ivory") : ""}`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" aria-hidden="true" />}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-bronze-500" aria-hidden="true" />
                    )}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute left-1/2 top-full z-10 w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="card overflow-hidden p-2 shadow-[var(--shadow-lift)]">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-xl px-4 py-3 transition hover:bg-sand-50 focus-visible:bg-sand-50">
                              <span className="block text-sm font-bold text-ink-900">{c.label}</span>
                              {c.desc && <span className="mt-0.5 block text-xs text-ink-500">{c.desc}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => open()} className="btn btn-primary btn-sm hidden sm:inline-flex">
              Schedule a Consultation
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${
                solid ? "border-sand-300 text-ink-900" : "border-white/20 text-ivory"
              }`}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-ivory transition-all duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="divide-y divide-sand-200 border-y border-sand-200">
            {mainNav.map((item) => (
              <li key={item.href}>
                <div className="flex items-center justify-between">
                  <Link href={item.href} className="flex-1 py-4 text-lg font-bold text-ink-900">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center text-ink-600"
                      aria-expanded={expanded === item.href}
                      aria-label={`Show ${item.label} links`}
                      onClick={() => setExpanded((e) => (e === item.href ? null : item.href))}
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform ${expanded === item.href ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.href && (
                  <ul className="-mt-1 pb-4 pl-3">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={() => setMobileOpen(false)} className="block border-l border-sand-300 py-2 pl-4 text-[0.95rem] text-ink-600">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                setMobileOpen(false);
                open();
              }}
            >
              Schedule a Consultation
            </button>
            <div className="grid grid-cols-2 gap-3">
              <a href={site.phone.href} className="btn btn-outline">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
