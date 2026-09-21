import { createHash, randomUUID } from "crypto";
import { bandFor, CibilError, type CibilProvider, type ProviderScore, type ScoreFactor } from "../types";
import { maskMobile } from "../validate";

// Sample-data provider for development and client demos.
// It performs NO bureau call. Results are derived from the PAN so a given PAN
// always returns the same score, which makes demos repeatable. Every result is
// flagged `isSample: true` and the UI labels it clearly.

const DEMO_OTP = "123456";

function scoreFor(seed: string): number {
  const h = createHash("sha256").update(seed).digest();
  // Averaging two uniform draws gives a triangular spread: the whole 300–900
  // range stays reachable (so every band can be demoed) while clustering in the
  // middle like a real population.
  const u1 = ((h[0] << 8) | h[1]) / 65535;
  const u2 = ((h[2] << 8) | h[3]) / 65535;
  return Math.round(300 + ((u1 + u2) / 2) * 600);
}

function factorsFor(score: number): ScoreFactor[] {
  if (score >= 750)
    return [
      { label: "Repayment history", impact: "positive", detail: "No missed payments recorded in the last 36 months." },
      { label: "Credit utilisation", impact: "positive", detail: "Using well under a third of your available limits." },
      { label: "Credit age", impact: "positive", detail: "A long, consistent credit history works in your favour." },
      { label: "Recent enquiries", impact: "neutral", detail: "Few recent applications — keep it that way before a big loan." },
    ];
  if (score >= 650)
    return [
      { label: "Repayment history", impact: "positive", detail: "Mostly on-time payments, with an occasional delay." },
      { label: "Credit utilisation", impact: "negative", detail: "Balances are high relative to your limits. Bringing this down lifts the score fastest." },
      { label: "Credit mix", impact: "neutral", detail: "A mix of secured and unsecured credit would strengthen the profile." },
      { label: "Recent enquiries", impact: "negative", detail: "Several recent applications. Avoid applying widely before a large loan." },
    ];
  if (score >= 550)
    return [
      { label: "Repayment history", impact: "negative", detail: "Late payments are recorded. Clearing dues and staying current is the priority." },
      { label: "Credit utilisation", impact: "negative", detail: "Limits are close to fully drawn." },
      { label: "Overdue accounts", impact: "negative", detail: "One or more accounts show an outstanding overdue amount." },
      { label: "Credit age", impact: "neutral", detail: "History is still relatively short." },
    ];
  return [
    { label: "Overdue accounts", impact: "negative", detail: "Accounts are reported overdue or settled. These need addressing first." },
    { label: "Repayment history", impact: "negative", detail: "A pattern of missed payments is weighing the score down." },
    { label: "Report accuracy", impact: "neutral", detail: "Worth checking for errors — incorrect entries are common and can be disputed." },
  ];
}

export const mockProvider: CibilProvider = {
  id: "mock",
  bureau: "Sample data",
  isSample: true,

  async initiate({ mobile }) {
    const providerRef = randomUUID();
    return {
      providerRef,
      otpRequired: true,
      maskedMobile: maskMobile(mobile),
      // Never leak this in production, even in sample mode.
      demoOtp: process.env.NODE_ENV === "production" ? undefined : DEMO_OTP,
    };
  },

  async verifyOtp({ otp, panHash }): Promise<ProviderScore> {
    if (otp !== DEMO_OTP) throw new CibilError("That OTP doesn't match. Please try again.", "otp_invalid", 422);

    const score = scoreFor(panHash);
    return {
      score,
      band: bandFor(score),
      scoreDate: new Date().toISOString().slice(0, 10),
      factors: factorsFor(score),
      summary: {
        openAccounts: 3 + (score % 4),
        overdueAccounts: score < 650 ? 1 : 0,
        enquiriesLast6Months: score >= 750 ? 1 : 4,
        oldestAccountYears: 2 + (score % 9),
        creditUtilisationPct: score >= 750 ? 24 : score >= 650 ? 58 : 87,
      },
      bureau: "Sample data",
      isSample: true,
    };
  },
};
