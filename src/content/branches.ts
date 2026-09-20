import { site } from "./site";

export type Branch = {
  id: string;
  city: string;
  name: string;
  kind: "Head Office" | "Regional Office" | "Branch";
  address: string;
  phone: { display: string; href: string };
  email: string;
  hours: string;
  // Approximate pin position for the map. Directions use the full address.
  lat: number;
  lng: number;
};

export const branches: Branch[] = [
  {
    id: "bengaluru",
    city: "Bengaluru",
    name: "Bengaluru Head Office",
    kind: "Head Office",
    address: "#820, RNS Reddy Complex, 14th Cross, JSS Circle, Jayanagar 7th Block, Bengaluru – 560082",
    phone: site.phone,
    email: site.email,
    hours: site.hours,
    lat: 12.9235,
    lng: 77.5763,
  },
  {
    id: "chennai",
    city: "Chennai",
    name: "Chennai Regional Office",
    kind: "Regional Office",
    address: "Gemini PARSN Commercial Complex, #600, Flat 4 & 4A, 3rd Floor, Anna Salai, Chennai – 600006",
    phone: site.landline,
    email: site.email,
    hours: site.hours,
    lat: 13.054,
    lng: 80.2525,
  },
];

export function directionsUrl(b: Branch) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`AapKaLoan, ${b.address}`)}`;
}
