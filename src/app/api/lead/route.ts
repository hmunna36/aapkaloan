import { NextResponse } from "next/server";
import { isEmail, leadTypes, normaliseMobile, type LeadPayload } from "@/lib/leads";
import { deliverLead, newLeadId } from "@/lib/lead-delivery";

// Receives every enquiry on the site and forwards it to the CRM / lead system.

const clip = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = newLeadId();

  // Bots fill every field; quietly accept and drop.
  if (body.website) return NextResponse.json({ ok: true, id });

  const type = leadTypes.includes(body.type as never) ? body.type! : "consultation";
  const name = clip(body.name, 80);
  const phone = normaliseMobile(String(body.phone ?? ""));
  const email = clip(body.email, 120);

  if (!name || name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  if (!phone) return NextResponse.json({ ok: false, error: "Please enter a valid 10-digit mobile number." }, { status: 422 });
  if (email && !isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 422 });
  if (body.consent !== true) return NextResponse.json({ ok: false, error: "Please agree to be contacted." }, { status: 422 });

  const delivered = await deliverLead({
    id,
    type,
    receivedAt: new Date().toISOString(),
    source: clip(body.source, 200),
    name,
    phone: `+91${phone}`,
    email,
    city: clip(body.city, 80),
    requirement: clip(body.requirement, 120),
    amount: clip(body.amount, 60),
    timeline: clip(body.timeline, 60),
    preferredDate: clip(body.preferredDate, 20),
    preferredTime: clip(body.preferredTime, 40),
    institution: clip(body.institution, 160),
    message: clip(body.message, 2000),
    consent: true,
  });

  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your request right now. Please call or WhatsApp us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id });
}
