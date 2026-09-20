import { fundingSolutions } from "./funding";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc?: string }[];
};

// Kept deliberately short, per the brief: Home | About Us | Loans | Funding Solutions | Resources | Contact Us
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Loans",
    href: "/loans",
    children: [
      { label: "Secured Loans", href: "/loans/secured", desc: "Home Loan, Loan Against Property & more" },
      { label: "Unsecured Loans", href: "/loans/unsecured", desc: "MSME Loan, Business Loan & more" },
    ],
  },
  {
    label: "Funding Solutions",
    href: "/funding-solutions",
    children: fundingSolutions.map((f) => ({
      label: f.name,
      href: f.id === "school-funding" ? "/funding-solutions/school-funding" : `/funding-solutions#${f.id}`,
      desc: f.tagline,
    })),
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Check your CIBIL score", href: "/resources#cibil-check", desc: "Know where you stand before you apply" },
      { label: "CIBIL rectification", href: "/resources#cibil-rectification", desc: "Errors in your report? WhatsApp us" },
      { label: "EMI calculator", href: "/resources#emi-calculator", desc: "Monthly EMI, interest & total payable" },
      { label: "Funding requirement finder", href: "/resources#requirement-finder", desc: "Tell us what you need in 30 seconds" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];
