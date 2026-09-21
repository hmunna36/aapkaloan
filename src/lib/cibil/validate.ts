import { createHash } from "crypto";
import { CibilError } from "./types";

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function normalisePan(raw: string): string {
  const pan = raw.replace(/\s/g, "").toUpperCase();
  if (!PAN_RE.test(pan)) throw new CibilError("Enter a valid PAN, e.g. ABCDE1234F.", "invalid_input", 422);
  return pan;
}

export function normaliseMobile10(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (!/^[6-9]\d{9}$/.test(d)) throw new CibilError("Enter a valid 10-digit mobile number.", "invalid_input", 422);
  return d;
}

/** Bureau checks need an adult applicant and a sane date. */
export function normaliseDob(raw: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new CibilError("Enter your date of birth.", "invalid_input", 422);
  const dob = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) throw new CibilError("Enter a valid date of birth.", "invalid_input", 422);
  const now = new Date();
  const age = (now.getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 18) throw new CibilError("You must be 18 or older to check a credit score.", "invalid_input", 422);
  if (age > 100) throw new CibilError("Enter a valid date of birth.", "invalid_input", 422);
  return raw;
}

export function normaliseName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 80) throw new CibilError("Enter your full name as on your PAN.", "invalid_input", 422);
  return name;
}

/** ABC****34F — enough for the visitor to recognise, not enough to reuse. */
export function maskPan(pan: string): string {
  return `${pan.slice(0, 3)}****${pan.slice(-3)}`;
}

export function maskMobile(mobile: string): string {
  return `XXXXXX${mobile.slice(-4)}`;
}

/**
 * One-way hash for rate limiting and audit records, so raw PANs and IPs are
 * never stored or logged anywhere in this app.
 */
export function hashId(value: string): string {
  const salt = process.env.CIBIL_HASH_SALT ?? "aapkaloan-dev-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}
