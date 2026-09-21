import { NextResponse } from "next/server";
import { CibilError, CONSENT_PURPOSE, getProvider } from "@/lib/cibil";
import { rateLimit } from "@/lib/cibil/sessions";
import { sealCheck } from "@/lib/cibil/token";
import { hashId, maskPan, normaliseDob, normaliseMobile10, normaliseName, normalisePan } from "@/lib/cibil/validate";

// Step 1 of the credit check: identity + consent go to the bureau, which sends
// an OTP to the mobile registered against the PAN.
//
// PAN, date of birth and OTP are never logged and never returned to the browser.

const HOUR = 60 * 60 * 1000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  const noStore = { "Cache-Control": "no-store" };
  try {
    const provider = getProvider();
    const body = await req.json().catch(() => ({}));

    if (body?.website) throw new CibilError("Invalid request.", "invalid_input", 400);
    if (body?.consent !== true) {
      throw new CibilError("Please give consent for the credit bureau check.", "invalid_input", 422);
    }

    const name = normaliseName(String(body.name ?? ""));
    const pan = normalisePan(String(body.pan ?? ""));
    const dob = normaliseDob(String(body.dob ?? ""));
    const mobile = normaliseMobile10(String(body.mobile ?? ""));

    // Abuse limits: a real bureau pull costs money, and PAN enumeration must be
    // hard. Demo mode calls nothing and costs nothing, so it gets a loose cap —
    // otherwise running a few sample PANs in front of a client hits the limit.
    const ipKey = hashId(clientIp(req));
    if (provider.isSample) {
      rateLimit(`ip:${ipKey}`, 100, HOUR, "Too many checks from this connection. Please try again later.");
    } else {
      rateLimit(`ip:${ipKey}`, 10, HOUR, "Too many checks from this connection. Please try again later.");
      rateLimit(`mob:${hashId(mobile)}`, 3, HOUR, "You've requested several checks recently. Please try again later.");
      rateLimit(`pan:${hashId(pan)}`, 3, HOUR, "You've requested several checks recently. Please try again later.");
    }

    const result = await provider.initiate({
      name,
      pan,
      dob,
      mobile,
      consent: { accepted: true, acceptedAt: new Date().toISOString(), purpose: CONSENT_PURPOSE, ipHash: ipKey },
    });

    const panHash = hashId(pan);
    // Everything the verify step needs, sealed and expiring. No server session,
    // and the raw PAN stops here.
    const checkId = sealCheck({
      providerRef: result.providerRef,
      providerId: provider.id,
      panHash,
      maskedPan: maskPan(pan),
      mobile,
      name,
    });

    // Audit trail without personal data: hashes only.
    console.info("[cibil] check initiated", { provider: provider.id, panHash, consentAt: new Date().toISOString() });

    return NextResponse.json(
      {
        ok: true,
        checkId,
        otpRequired: result.otpRequired,
        maskedMobile: result.maskedMobile,
        bureau: provider.bureau,
        isSample: provider.isSample,
        demoOtp: result.demoOtp,
      },
      { headers: noStore },
    );
  } catch (err) {
    if (err instanceof CibilError) {
      return NextResponse.json({ ok: false, error: err.message, code: err.code }, { status: err.status, headers: noStore });
    }
    console.error("[cibil] initiate failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't start the credit check. Please try again or talk to an advisor.", code: "provider_error" },
      { status: 502, headers: noStore },
    );
  }
}
