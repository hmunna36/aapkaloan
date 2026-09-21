import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { CibilError } from "./types";

// The handle the browser holds between "send OTP" and "verify OTP".
//
// It is stateless on purpose: route handlers are bundled separately and, on
// serverless platforms, run on different instances, so an in-memory session
// started by one request is not visible to the next. Everything needed is
// sealed into an encrypted, expiring token instead — so no server-side session
// store (or Redis) is required.
//
// The raw PAN is never put in the token: only a masked form for display and a
// salted hash for the provider. Nothing readable leaves the server.

const TTL_MS = 10 * 60 * 1000;

export type CheckToken = {
  providerRef: string;
  providerId: string;
  panHash: string;
  maskedPan: string;
  mobile: string;
  name: string;
  exp: number;
};

function key(): Buffer {
  const secret = process.env.CIBIL_SESSION_SECRET || process.env.CIBIL_HASH_SALT || "aapkaloan-dev-secret";
  if (process.env.NODE_ENV === "production" && !process.env.CIBIL_SESSION_SECRET && !process.env.CIBIL_HASH_SALT) {
    console.warn("[cibil] CIBIL_SESSION_SECRET is not set — using an insecure default.");
  }
  return createHash("sha256").update(secret).digest();
}

export function sealCheck(payload: Omit<CheckToken, "exp">): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body: CheckToken = { ...payload, exp: Date.now() + TTL_MS };
  const enc = Buffer.concat([cipher.update(JSON.stringify(body), "utf8"), cipher.final()]);
  return [iv, enc, cipher.getAuthTag()].map((b) => b.toString("base64url")).join(".");
}

export function openCheck(token: string): CheckToken {
  const expired = () => new CibilError("This check has expired. Please start again.", "otp_expired", 410);
  const parts = token.split(".");
  if (parts.length !== 3) throw expired();
  try {
    const [iv, enc, tag] = parts.map((p) => Buffer.from(p, "base64url"));
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
    const data = JSON.parse(json) as CheckToken;
    if (!data.exp || data.exp < Date.now()) throw expired();
    return data;
  } catch (err) {
    if (err instanceof CibilError) throw err;
    throw expired();
  }
}
