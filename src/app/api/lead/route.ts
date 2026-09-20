import { NextResponse } from "next/server";
import { isEmail, leadTypes, normaliseMobile, type LeadPayload } from "@/lib/leads";

// Receives every enquiry on the site and forwards it to the CRM / lead system.
// Configure LEAD_WEBHOOK_URL (see .env.example); without it, leads are logged.

const clip = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = `AKL-${Date.now().toString(36).toUpperCase()}`;

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

  const lead = {
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
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] delivery failed", err, lead);
      return NextResponse.json(
        { ok: false, error: "We couldn't submit your request right now. Please call or WhatsApp us." },
        { status: 502 },
      );
    }
  } else {
    console.info("[lead] (no LEAD_WEBHOOK_URL set — logging only)", lead);
  }

  return NextResponse.json({ ok: true, id });
}
