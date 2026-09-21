import { NextResponse } from "next/server";
import { CibilError, getProvider, type ScoreResult } from "@/lib/cibil";
import { rateLimit } from "@/lib/cibil/sessions";
import { openCheck } from "@/lib/cibil/token";
import { hashId } from "@/lib/cibil/validate";
import { deliverLead, newLeadId } from "@/lib/lead-delivery";

// Step 2: exchange the OTP for the score, then raise a lead so an advisor can
// follow up. The lead carries the score and band — never the PAN or date of birth.

export async function POST(req: Request) {
  const noStore = { "Cache-Control": "no-store" };
  try {
    const provider = getProvider();
    const body = await req.json().catch(() => ({}));

    const checkId = String(body.checkId ?? "");
    const otp = String(body.otp ?? "").replace(/\D/g, "");
    if (!checkId) throw new CibilError("This check has expired. Please start again.", "not_found", 410);
    if (otp.length < 4) throw new CibilError("Enter the OTP sent to your mobile.", "invalid_input", 422);

    // Sealed, expiring handle from /initiate — no server-side session needed.
    const check = openCheck(checkId);

    // Cap OTP guesses per check, on top of whatever the bureau enforces.
    rateLimit(`otp:${hashId(checkId)}`, 5, 10 * 60 * 1000, "Too many attempts. Please start the check again.");

    const score = await provider.verifyOtp({ providerRef: check.providerRef, otp, panHash: check.panHash });
    const result: ScoreResult = { ...score, maskedPan: check.maskedPan };

    await deliverLead({
      id: newLeadId(),
      type: "cibil-check",
      receivedAt: new Date().toISOString(),
      source: "/api/cibil/verify",
      name: check.name,
      phone: `+91${check.mobile}`,
      city: typeof body.city === "string" ? body.city.trim().slice(0, 80) : undefined,
      requirement: "CIBIL Score Enquiry",
      message: `Score ${result.score} (${result.band}) via ${result.bureau}${result.isSample ? " — SAMPLE DATA, not a real bureau pull" : ""}. Checked on site.`,
      consent: true,
    });

    return NextResponse.json({ ok: true, result }, { headers: noStore });
  } catch (err) {
    if (err instanceof CibilError) {
      return NextResponse.json({ ok: false, error: err.message, code: err.code }, { status: err.status, headers: noStore });
    }
    console.error("[cibil] verify failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't complete the credit check. Please try again or talk to an advisor.", code: "provider_error" },
      { status: 502, headers: noStore },
    );
  }
}
