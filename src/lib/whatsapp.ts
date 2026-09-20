import { site } from "@/content/site";

export function whatsappUrl(message = "Hi AapKaLoan, I'd like to discuss a funding requirement.") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
