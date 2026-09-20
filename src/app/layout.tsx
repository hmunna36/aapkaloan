import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { branches } from "@/content/branches";
import { ConsultationProvider } from "@/components/consultation/ConsultationProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuickActions } from "@/components/layout/QuickActions";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AapKaLoan — Financial Advisory & Funding Partner | Bengaluru · Chennai",
    template: "%s | AapKaLoan",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "AapKaLoan — Your financial advisory & funding partner",
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#150e0a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo-full.png`,
  slogan: "Gain economic growth",
  email: site.email,
  telephone: site.phone.display,
  description: site.description,
  foundingDate: String(site.since),
  sameAs: [site.social.facebook, site.social.instagram],
  location: branches.map((b) => ({
    "@type": "Place",
    name: b.name,
    address: b.address,
    geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-ivory">
          Skip to content
        </a>
        <ConsultationProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <QuickActions />
        </ConsultationProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
