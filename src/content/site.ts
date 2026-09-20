// Central business details. Everything customer-facing that is likely to change
// (numbers, addresses, stats) lives here so it can be edited in one place.

export const site = {
  name: "AapKaLoan",
  legalName: "AapKaLoan",
  tagline: "Your financial advisory & funding partner",
  description:
    "AapKaLoan is a financial advisory and funding partner that helps individuals, MSMEs, schools and growing businesses raise the right capital — across 100+ banks, NBFCs and private funding channels.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aapkaloan.com",
  since: 2010,

  phone: {
    display: "+91 99000 92109",
    href: "tel:+919900092109",
  },
  landline: {
    display: "+91 80 4991 0994",
    href: "tel:+918049910994",
  },
  // wa.me requires the full international number without "+" or spaces.
  whatsappNumber: "919900092109",
  email: "info@aapkaloan.com",
  hours: "Mon – Sat · 9:30 AM – 6:30 PM", // TODO: confirm working hours

  social: {
    facebook: "https://www.facebook.com/share/1WEiQT93qV/?mibextid=wwXIfr",
    instagram: "https://instagram.com/aapkaloan",
  },
} as const;

// Headline trust numbers — carried over from the current aapkaloan.com.
// TODO: confirm these are current before launch.
export const stats = [
  { value: `${new Date().getFullYear() - site.since}+`, label: "Years advising clients", note: `Since ${site.since}` },
  { value: "100+", label: "Bank & NBFC channels", note: "Lender-neutral advice" },
  { value: "₹100 Cr+", label: "Funding facilitated", note: "Across loans & funding" },
  { value: "4.7★", label: "Google rating", note: "From our clients" },
] as const;

// Testimonials carried over from the current site.
export const testimonials = [
  {
    quote:
      "AapKaLoan's top-notch coordination made my loan process stress-free. Their professionalism and efficiency are commendable. Highly recommended for seamless funding.",
    name: "Reshma Marathi",
  },
  {
    quote:
      "Our loan consultant provided exceptional guidance with a clear, well-structured process and the best possible timeline.",
    name: "Roopa Devi",
  },
  {
    quote: "Very good service with complete satisfaction and a friendly environment. Thank you, AapKaLoan.",
    name: "Venkatesh C",
  },
] as const;

export const vision =
  "To raise the standard of how India accesses capital — through constant innovation and by responding to our clients' changing needs — so that every family and enterprise can reach reasonable, flexible financial solutions and realise its potential.";

export const mission =
  "To promote growth and prosperity in the communities we serve by providing ethical, transparent financial solutions that empower people and businesses. We keep lending clear, accessible and tailored to strengthen each client's long-term financial stability.";
