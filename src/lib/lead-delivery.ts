// Server-side only — imported from route handlers, never from a client component.
// Single place where a lead leaves the app, used by /api/lead and by a
// completed credit check. Two destinations, used together when both are set:
//
//   Email   — SMTP_HOST, SMTP_USER, SMTP_PASS and LEAD_EMAIL_TO (SMTP_PORT and
//             LEAD_EMAIL_FROM optional). AapKaLoan's mail is on GoDaddy, whose SPF
//             record only allows GoDaddy to send as @aapkaloan.com, so send through
//             GoDaddy's own SMTP as the info@ mailbox (see .env.example).
//   Webhook — LEAD_WEBHOOK_URL (+ LEAD_WEBHOOK_SECRET), e.g. a CRM.
//
// A lead counts as delivered if at least one destination accepts it; if every one
// fails the visitor is asked to call or WhatsApp instead, and the full lead is
// logged so it can still be recovered. With nothing configured (local dev), leads
// are only logged.

import nodemailer from "nodemailer";

export type DeliverableLead = {
  id: string;
  type: string;
  receivedAt: string;
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
  organisation?: string;
  partnerType?: string;
  message?: string;
  consent: true;
};

export function newLeadId(): string {
  return `AKL-${Date.now().toString(36).toUpperCase()}`;
}

/** Returns false only when a destination is configured and every one of them failed. */
export async function deliverLead(lead: DeliverableLead): Promise<boolean> {
  const mail = emailConfig();
  const webhook = process.env.LEAD_WEBHOOK_URL?.trim();

  const sends: { name: string; run: () => Promise<void> }[] = [];
  if (mail) sends.push({ name: "email", run: () => sendLeadEmail(lead, mail) });
  if (webhook) sends.push({ name: "webhook", run: () => postWebhook(lead, webhook) });

  if (!sends.length) {
    console.info("[lead] (no email or webhook configured — logging only)", lead);
    return true;
  }

  const results = await Promise.allSettled(sends.map((s) => s.run()));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[lead] ${sends[i].name} delivery failed`, r.reason, { id: lead.id, type: lead.type });
  });
  const delivered = results.some((r) => r.status === "fulfilled");
  // Keep the whole lead in the logs if nothing got through, so it isn't lost.
  if (!delivered) console.error("[lead] NOT DELIVERED — full lead follows", lead);
  return delivered;
}

async function postWebhook(lead: DeliverableLead, url: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

// ---------------------------------------------------------------------------
// Email

type EmailConfig = { host: string; port: number; user: string; pass: string; to: string[]; from: string };

function emailConfig(): EmailConfig | null {
  const env = (k: string) => process.env[k]?.trim() || "";
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = process.env.SMTP_PASS ?? ""; // passwords can legitimately start or end with spaces
  const to = env("LEAD_EMAIL_TO").split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  if (!host || !user || !pass || !to.length) return null;
  return {
    host,
    port: Number(env("SMTP_PORT")) || 465,
    user,
    pass,
    to,
    from: env("LEAD_EMAIL_FROM") || `AapKaLoan Website <${user}>`,
  };
}

const TYPE_LABELS: Record<string, string> = {
  consultation: "Consultation request",
  partner: "Partner enquiry",
  "product-enquiry": "Product enquiry",
  "requirement-finder": "Requirement finder",
  "cibil-check": "CIBIL score check",
  "cibil-rectification": "CIBIL rectification",
  "emi-calculator": "EMI calculator enquiry",
  "school-funding": "School funding enquiry",
  contact: "Contact form",
};

async function sendLeadEmail(lead: DeliverableLead, cfg: EmailConfig) {
  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465, // 465 is implicit TLS; 587/25/80 upgrade with STARTTLS
    auth: { user: cfg.user, pass: cfg.pass },
    // Stay well inside the serverless function's time limit.
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
  });
  const label = TYPE_LABELS[lead.type] ?? "Website enquiry";
  await transport.sendMail({
    from: cfg.from,
    to: cfg.to,
    // Hitting Reply in the inbox answers the customer directly when they left an email.
    // Structured address, so nodemailer quotes the name: a name like "A <b@c>" can't redirect replies.
    ...(lead.email ? { replyTo: { name: lead.name, address: lead.email } } : {}),
    subject: `New ${label.toLowerCase()} — ${lead.name}, ${displayPhone(lead.phone)} (${lead.id})`,
    text: leadText(lead, label),
    html: leadHtml(lead, label),
  });
}

function leadRows(lead: DeliverableLead): [string, string][] {
  const received = new Date(lead.receivedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Mobile", displayPhone(lead.phone)],
    ["Email", lead.email],
    ["City", lead.city],
    ["Requirement", lead.requirement],
    ["Amount", lead.amount],
    ["Timeline", lead.timeline],
    ["Preferred date", displayDate(lead.preferredDate)],
    ["Preferred time", lead.preferredTime],
    ["School / trust", lead.institution],
    ["Firm / organisation", lead.organisation],
    ["Partnership type", lead.partnerType],
    ["Message", lead.message],
    ["Received", `${received} IST`],
    ["Page", lead.source],
    ["Reference", lead.id],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

function leadText(lead: DeliverableLead, label: string) {
  const lines = leadRows(lead).map(([k, v]) => `${k}: ${v}`);
  return `${label} from the AapKaLoan website\n\n${lines.join("\n")}\n\nCall: ${displayPhone(lead.phone)}\nWhatsApp: ${waLink(lead.phone)}\n`;
}

function leadHtml(lead: DeliverableLead, label: string) {
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const cell = (k: string, v: string) => {
    let value = esc(v).replace(/\n/g, "<br>");
    if (k === "Mobile") value = `<a href="tel:${esc(v.replace(/\s/g, ""))}" style="color:#6f461c">${value}</a>`;
    if (k === "Email") value = `<a href="mailto:${esc(v)}" style="color:#6f461c">${value}</a>`;
    return `<tr><td style="padding:8px 14px 8px 0;color:#6f6358;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;color:#1f1510;vertical-align:top">${value}</td></tr>`;
  };
  const button = (href: string, text: string, bg: string, fg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:999px;background:${bg};color:${fg};font-weight:700;text-decoration:none">${text}</a>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;max-width:560px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6f461c">AapKaLoan website</p>
  <h2 style="margin:0 0 16px;font-size:20px;color:#1f1510">${esc(label)}</h2>
  <table style="border-collapse:collapse;border-top:1px solid #e6dac7;width:100%">${leadRows(lead).map(([k, v]) => cell(k, v)).join("")}</table>
  <p style="margin:20px 0 0">${button(`tel:${lead.phone.replace(/\s/g, "")}`, "Call now", "#6f461c", "#ffffff")}${button(waLink(lead.phone), "WhatsApp", "#25d366", "#073b1f")}</p>
</div>`;
}

/** 2026-10-01 → 1 Oct 2026 (the form's date input sends ISO dates) */
function displayDate(d?: string) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
}

/** +919876543210 → +91 98765 43210 */
function displayPhone(phone: string) {
  return phone.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");
}

/** wa.me needs the full international number with digits only. */
function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
