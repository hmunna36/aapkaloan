// Funding & financial services — the "beyond loans" capabilities the brief asks us to lead with.

export type FundingSolution = {
  id: string;
  name: string;
  icon: "landmark" | "building" | "rocket" | "handshake" | "school" | "layers";
  tagline: string;
  description: string;
  forWhom: string[];
  howWeHelp: string[];
  featured?: boolean;
};

export const fundingSolutions: FundingSolution[] = [
  {
    id: "banking",
    name: "Banking",
    icon: "landmark",
    tagline: "Bank finance, structured right.",
    description:
      "Term loans, working-capital limits, cash credit, overdraft and project finance from public, private and foreign banks. We know how each bank's credit team thinks — and present your case accordingly.",
    forWhom: ["Established businesses", "Salaried & self-employed individuals", "Projects needing long tenure"],
    howWeHelp: ["Choose the right bank for your profile", "Prepare CMA data & projections", "Negotiate rates and terms"],
  },
  {
    id: "nbfc",
    name: "NBFC Financing",
    icon: "building",
    tagline: "Flexibility when banks say not yet.",
    description:
      "Non-banking finance companies offer more flexible eligibility and faster decisions. Ideal for newer businesses, non-standard income or time-critical requirements.",
    forWhom: ["Businesses with short vintage", "Non-standard income profiles", "Urgent requirements"],
    howWeHelp: ["Shortlist NBFCs that fit your case", "Compare true cost, not just rate", "Plan a path back to bank rates"],
  },
  {
    id: "vc-funding",
    name: "VC Funding",
    icon: "rocket",
    tagline: "Equity capital for high-growth ventures.",
    description:
      "For startups and scale-ups ready to raise equity. We help sharpen your pitch, financial model and data room, and open conversations with relevant venture investors.",
    forWhom: ["Startups with traction", "Growth-stage companies", "Founders preparing a first institutional round"],
    howWeHelp: ["Investment readiness review", "Pitch deck & model feedback", "Introductions to relevant investors"],
  },
  {
    id: "private-placement",
    name: "Private Placement",
    icon: "handshake",
    tagline: "Capital from private investors, discreetly.",
    description:
      "Raise debt or equity from HNIs, family offices and institutional investors through private placement — without a public issue. Suited to companies needing tailored terms or larger tickets.",
    forWhom: ["Mid-sized companies", "Real-estate & infrastructure projects", "Promoters seeking structured capital"],
    howWeHelp: ["Structure the instrument", "Identify and approach investors", "Coordinate diligence to closing"],
  },
  {
    id: "school-funding",
    name: "School Funding",
    icon: "school",
    tagline: "Dedicated funding for educational institutions.",
    description:
      "Specialised finance for schools, educational trusts and societies — campus expansion, new infrastructure, transport, working capital and refinancing — with repayments aligned to the academic fee cycle.",
    forWhom: ["K-12 schools", "Educational trusts & societies", "Pre-school chains"],
    howWeHelp: ["Sector-aware lender selection", "Trust-structure documentation", "Fee-cycle-aligned repayment"],
    featured: true,
  },
  {
    id: "other",
    name: "Other Funding Solutions",
    icon: "layers",
    tagline: "Whatever the requirement, a structured answer.",
    description:
      "Working-capital and supply-chain finance, lease rental discounting, debt restructuring and refinancing, and project finance. If it involves raising or restructuring capital, talk to us.",
    forWhom: ["Businesses with complex needs", "Companies refinancing expensive debt", "Project developers"],
    howWeHelp: ["Diagnose the real requirement", "Design the capital structure", "Execute across lenders"],
  },
];

// Options for "What kind of funding are you looking for?" — exactly as listed in the brief.
export const requirementOptions = [
  { id: "home-loan", label: "Home Loan", icon: "house" },
  { id: "msme-loan", label: "MSME Loan", icon: "factory" },
  { id: "loan-against-property", label: "Loan Against Property", icon: "key" },
  { id: "business-funding", label: "Business Funding", icon: "briefcase" },
  { id: "school-funding", label: "School Funding", icon: "school" },
  { id: "unsecured-business-loan", label: "Unsecured Business Loan", icon: "wallet" },
  { id: "vc-funding", label: "VC Funding", icon: "rocket" },
  { id: "private-placement", label: "Private Placement", icon: "handshake" },
  { id: "other", label: "Other", icon: "sparkles" },
] as const;

// Every requirement a lead form can carry (the dropdown in the consultation form).
export const requirementLabels: string[] = [
  ...requirementOptions.filter((o) => o.id !== "other").map((o) => o.label),
  "Banking / Working Capital",
  "NBFC Financing",
  "Personal / Other Loan",
  "CIBIL Score Enquiry",
  "CIBIL Rectification",
  "Other",
];
