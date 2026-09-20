// Shared lead model — used by every form on the site and by /api/lead.

export const leadTypes = [
  "consultation",
  "product-enquiry",
  "requirement-finder",
  "cibil-check",
  "cibil-rectification",
  "emi-calculator",
  "school-funding",
  "contact",
] as const;

export type LeadType = (typeof leadTypes)[number];

export type LeadPayload = {
  type: LeadType;
  source?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  requirement?: string;
  amount?: string;
  timeline?: string;
  preferredDate?: string;
  preferredTime?: string;
  institution?: string;
  message?: string;
  consent: boolean;
  /** Honeypot — real users never fill this. */
  website?: string;
};

export const amountRanges = [
  "Under ₹25 Lakh",
  "₹25 Lakh – ₹1 Crore",
  "₹1 – 5 Crore",
  "₹5 – 25 Crore",
  "Above ₹25 Crore",
  "Not sure yet",
];

export const timeSlots = ["10 AM – 12 PM", "12 PM – 3 PM", "3 PM – 6 PM"];

/** Normalises Indian mobile numbers to 10 digits; returns null if invalid. */
export function normaliseMobile(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) return { ok: false, error: data.error ?? "Something went wrong. Please try again." };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false, error: "We couldn't reach our server. Please check your connection or WhatsApp us." };
  }
}
