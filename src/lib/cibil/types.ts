// Credit-bureau integration: provider-agnostic contract.
//
// CIBIL (TransUnion) has no public self-serve API. Access comes either from a
// direct member agreement with a bureau, or from a licensed aggregator that
// resells bureau access. Either way the flow is the same, so the site talks to
// this interface and a single adapter file maps it to whichever provider is
// signed. See docs/CIBIL-INTEGRATION.md.

/** Declared purpose recorded with every consent, for the CIC Act audit trail. */
export const CONSENT_PURPOSE =
  "Consumer credit score enquiry requested by the individual through aapkaloan.com";

export type CibilBand = "poor" | "fair" | "good" | "excellent";

export type ScoreFactor = {
  label: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
};

export type CreditSummary = {
  openAccounts?: number;
  overdueAccounts?: number;
  enquiriesLast6Months?: number;
  oldestAccountYears?: number;
  creditUtilisationPct?: number;
};

export type ScoreResult = {
  score: number; // 300–900
  band: CibilBand;
  /** ISO date the bureau generated the score. */
  scoreDate: string;
  factors: ScoreFactor[];
  summary?: CreditSummary;
  /** Never return the full PAN to the browser. */
  maskedPan: string;
  bureau: string;
  /** True when the numbers are sample data, so the UI can say so plainly. */
  isSample: boolean;
};

export type InitiateInput = {
  name: string;
  /** Uppercase PAN, e.g. ABCDE1234F. Never logged, never sent to the browser. */
  pan: string;
  /** ISO date (YYYY-MM-DD). */
  dob: string;
  /** 10-digit Indian mobile, as registered with the bureau. */
  mobile: string;
  consent: {
    accepted: true;
    /** Recorded for the CIC Act audit trail. */
    acceptedAt: string;
    purpose: string;
    ipHash?: string;
  };
};

export type InitiateResult = {
  /** Opaque handle the browser sends back with the OTP. */
  providerRef: string;
  otpRequired: boolean;
  maskedMobile: string;
  /** Only ever populated by the mock provider outside production. */
  demoOtp?: string;
};

/** What a provider returns; the route adds the masked PAN from the check token. */
export type ProviderScore = Omit<ScoreResult, "maskedPan">;

export interface CibilProvider {
  /** Identifier shown in logs and in the lead record. */
  id: string;
  /** Bureau whose score this is (CIBIL, Experian, …). */
  bureau: string;
  /** Sample data rather than a real bureau pull. */
  isSample: boolean;
  /** Step 1: identity + consent go to the bureau, which sends an OTP. */
  initiate(input: InitiateInput): Promise<InitiateResult>;
  /**
   * Step 2: exchange the OTP for the score. Receives a salted hash of the PAN
   * rather than the PAN itself — the raw value never leaves the initiate call.
   */
  verifyOtp(input: { providerRef: string; otp: string; panHash: string }): Promise<ProviderScore>;
}

export class CibilError extends Error {
  constructor(
    message: string,
    readonly code:
      | "invalid_input"
      | "otp_invalid"
      | "otp_expired"
      | "not_found"
      | "rate_limited"
      | "provider_error"
      | "not_configured",
    readonly status = 400,
  ) {
    super(message);
    this.name = "CibilError";
  }
}

export function bandFor(score: number): CibilBand {
  if (score >= 750) return "excellent";
  if (score >= 650) return "good";
  if (score >= 550) return "fair";
  return "poor";
}
