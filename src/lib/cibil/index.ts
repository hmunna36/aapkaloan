import { CibilError, type CibilProvider } from "./types";
import { mockProvider } from "./providers/mock";
import { httpProvider } from "./providers/http";

export * from "./types";

/**
 * Which provider serves the credit check, from CIBIL_PROVIDER:
 *   unset / "off" → the live check is disabled and the site falls back to the
 *                   enquiry form (the safe default, so a real visitor can never
 *                   be shown sample numbers by accident)
 *   "mock"        → sample data for demos, labelled as such in the UI
 *   "http"        → a real bureau/aggregator via src/lib/cibil/providers/http.ts
 */
export function getProvider(): CibilProvider {
  const id = (process.env.CIBIL_PROVIDER ?? "off").trim().toLowerCase();
  switch (id) {
    case "mock":
      return mockProvider;
    case "http":
      return httpProvider;
    default:
      throw new CibilError("The live credit check isn't enabled.", "not_configured", 503);
  }
}

export function isCibilEnabled(): boolean {
  const id = (process.env.CIBIL_PROVIDER ?? "off").trim().toLowerCase();
  return id === "mock" || id === "http";
}
