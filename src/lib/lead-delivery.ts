// Server-side only — imported from route handlers, never from a client component.
// Single place where a lead leaves the app, used by /api/lead and by a
// completed credit check. Configure LEAD_WEBHOOK_URL (see .env.example);
// without it, leads are logged so local development still works.

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
  message?: string;
  consent: true;
};

export function newLeadId(): string {
  return `AKL-${Date.now().toString(36).toUpperCase()}`;
}

/** Returns false when the webhook is configured but rejected the lead. */
export async function deliverLead(lead: DeliverableLead): Promise<boolean> {
  const webhook = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!webhook) {
    console.info("[lead] (no LEAD_WEBHOOK_URL set — logging only)", lead);
    return true;
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return true;
  } catch (err) {
    console.error("[lead] delivery failed", err, { id: lead.id, type: lead.type });
    return false;
  }
}
