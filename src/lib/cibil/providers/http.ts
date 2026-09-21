import { bandFor, CibilError, type CibilProvider, type ProviderScore, type ScoreFactor } from "../types";
import { maskMobile } from "../validate";

/**
 * Adapter template for a real bureau or aggregator API.
 *
 * ⚠️ The request and response shapes below are GENERIC PLACEHOLDERS. Every
 * provider differs. Once your account is live, open their API reference and
 * edit the three marked sections to match it exactly — endpoints, field names,
 * auth header and the response mapping. Nothing else in the app needs to change.
 *
 * Configure with:
 *   CIBIL_PROVIDER=http
 *   CIBIL_API_BASE_URL=https://api.yourprovider.com
 *   CIBIL_API_KEY=...                (and/or CIBIL_API_CLIENT_ID / _CLIENT_SECRET)
 *   CIBIL_BUREAU_NAME=CIBIL          (shown to the visitor)
 *
 * Providers that require mutual TLS (common for direct bureau membership) need
 * a client certificate on the outbound request — see docs/CIBIL-INTEGRATION.md.
 */

function config() {
  const baseUrl = process.env.CIBIL_API_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.CIBIL_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new CibilError("Credit check isn't configured on the server.", "not_configured", 503);
  }
  return { baseUrl, apiKey, bureau: process.env.CIBIL_BUREAU_NAME ?? "CIBIL" };
}

async function call(path: string, body: unknown) {
  const { baseUrl, apiKey } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ---- EDIT 1: auth header as your provider requires ----
      Authorization: `Bearer ${apiKey}`,
      ...(process.env.CIBIL_API_CLIENT_ID ? { "x-client-id": process.env.CIBIL_API_CLIENT_ID } : {}),
    },
    body: JSON.stringify(body),
    // Bureau pulls are slow; fail before the platform's own timeout.
    signal: AbortSignal.timeout(20_000),
  });

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new CibilError("The credit bureau returned an unreadable response.", "provider_error", 502);
  }

  if (!res.ok) {
    // Deliberately generic: never surface a provider's raw message to visitors.
    console.error(`[cibil] ${path} failed`, res.status, typeof data.message === "string" ? data.message : "");
    if (res.status === 401 || res.status === 403) {
      throw new CibilError("Credit check isn't available right now.", "not_configured", 503);
    }
    throw new CibilError("The credit bureau couldn't complete this check.", "provider_error", 502);
  }
  return data;
}

export const httpProvider: CibilProvider = {
  id: "http",
  get bureau() {
    return process.env.CIBIL_BUREAU_NAME ?? "CIBIL";
  },
  isSample: false,

  async initiate({ name, pan, dob, mobile, consent }) {
    // ---- EDIT 2: request shape for "start a consumer score pull" ----
    const data = await call("/credit-score/initiate", {
      name,
      pan,
      dateOfBirth: dob,
      mobile,
      consent: true,
      consentTimestamp: consent.acceptedAt,
      consentPurpose: consent.purpose,
    });

    const providerRef = (data.requestId ?? data.reference ?? data.id) as string | undefined;
    if (!providerRef) throw new CibilError("The credit bureau didn't start this check.", "provider_error", 502);

    return {
      providerRef,
      otpRequired: data.otpRequired !== false,
      maskedMobile: (data.maskedMobile as string) ?? maskMobile(mobile),
    };
  },

  async verifyOtp({ providerRef, otp }): Promise<ProviderScore> {
    // ---- EDIT 3: OTP submit + response mapping ----
    const data = await call("/credit-score/verify", { requestId: providerRef, otp });

    const score = Number(data.score ?? (data.creditScore as number));
    if (!Number.isFinite(score) || score < 300 || score > 900) {
      throw new CibilError("The credit bureau returned an unexpected score.", "provider_error", 502);
    }

    const rawFactors = Array.isArray(data.factors) ? data.factors : [];
    const factors: ScoreFactor[] = rawFactors.slice(0, 6).map((f) => {
      const item = f as Record<string, unknown>;
      const impact = String(item.impact ?? "neutral").toLowerCase();
      return {
        label: String(item.label ?? item.name ?? "Factor"),
        impact: impact === "positive" || impact === "negative" ? impact : "neutral",
        detail: String(item.detail ?? item.description ?? ""),
      };
    });

    const summary = (data.summary ?? {}) as Record<string, unknown>;
    const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

    return {
      score,
      band: bandFor(score),
      scoreDate: String(data.scoreDate ?? new Date().toISOString().slice(0, 10)).slice(0, 10),
      factors,
      summary: {
        openAccounts: num(summary.openAccounts),
        overdueAccounts: num(summary.overdueAccounts),
        enquiriesLast6Months: num(summary.enquiries ?? summary.enquiriesLast6Months),
        oldestAccountYears: num(summary.oldestAccountYears),
        creditUtilisationPct: num(summary.creditUtilisation ?? summary.creditUtilisationPct),
      },
      bureau: this.bureau,
      isSample: false,
    };
  },
};
