// Leadership profiles, from the client's leadership table and LinkedIn write-ups
// ("Aapka LoanWebsite POC" document, 2026-09-28). Order, names, designations,
// photos and LinkedIn links follow that table exactly; bios, highlights and
// expertise are condensed from each person's write-up.

export type Leader = {
  slug: string;
  name: string;
  designation: string;
  photo: string;
  experienceYears: string;
  bio: string;
  expertise: string[];
  linkedin: string;
  education?: string;
  /** Roles and institutions before AapKaLoan. */
  previously?: string;
  /** Headline numbers from the leader's track record. */
  highlights?: { value: string; label: string }[];
  message?: string;
};

// The five experience areas the brief asks us to highlight across the team.
export const expertiseAreas = ["Banking", "NBFC", "VC Funding", "Private Placement", "Financial Services"] as const;

export const team: Leader[] = [
  {
    slug: "sita-rama-raju-v",
    name: "Sita Rama Raju V",
    designation: "CEO & Founder",
    photo: "/team/sita-rama-raju-v.jpg",
    experienceYears: "15+",
    bio: "Under his stewardship, AapKaLoan operates with a customer-first mandate: to empower individuals and businesses by delivering reliable, fast, and best-in-class financial solutions. For him, financial intermediation is about economic enablement, not transaction volumes — institutionalising transparency, faster turnaround and customised advisory for every client segment.",
    education: "BA, MBA (LLB)",
    previously: "Senior Sales Manager at HDFC Bank, Axis Bank, IndusInd Bank and Kotak Mahindra Bank for nearly 10 years. CEO of AapKaLoan since 2018.",
    highlights: [
      { value: "₹4,000+ Cr", label: "Funding disbursed" },
      { value: "₹25 Cr", label: "Landmark LAP transaction" },
    ],
    expertise: ["Loan Against Property", "Working Capital & Business Loans", "Credit Structuring", "DSA Networks", "Lender Relationships"],
    linkedin: "https://www.linkedin.com/in/sita-rama-raju-v-80a27162",
    message: "My purpose is clear: bridge the gap between borrowers and smart capital, transforming access to credit into enduring success.",
  },
  {
    slug: "suresh-shetty",
    name: "Suresh Shetty",
    designation: "Leader",
    photo: "/team/suresh-shetty.jpg",
    experienceYears: "21+",
    bio: "Over 21 years in private banking leadership, Suresh has seen how the right credit structure can elevate an enterprise — and how the wrong one can stall it. At AapKaLoan he bridges borrowers and institutional capital, pairing institutional-grade debt syndication with hands-on strategic advisory.",
    education: "BCom",
    previously: "Vice President and Cluster Head at Yes Bank, HDFC Bank and Axis Bank.",
    highlights: [
      { value: "₹5,000+ Cr", label: "Overall funded" },
      { value: "₹1,250 Cr", label: "Property funding with insurance cover" },
    ],
    expertise: ["Debt Syndication", "Property Funding & LAP", "Credit Underwriting", "Banking Partnerships", "Risk Advisory"],
    linkedin: "https://www.linkedin.com/in/ss-shetty-8345411a",
    message:
      "My goal is to demystify credit products for every borrower, bringing sharper financial insight to the table so debt serves its true purpose: long-term wealth mobilization.",
  },
  {
    slug: "pradeep-s-r",
    name: "Pradeep S R",
    designation: "Leader",
    photo: "/team/pradeep-s-r.jpg",
    experienceYears: "16+",
    bio: "When a loan hits a roadblock — a technical snag, title complexity or a documentation mismatch — Pradeep steps in. Across 16 years in banking and housing finance he has built his name on untangling complex files fast and turning stalled cases into approved sanctions for home buyers, real estate investors and growing businesses.",
    education: "BA",
    previously: "Area Sales Manager and Business Developer at ICICI Bank, HDFC, Gruhashakthi and Vridhi Housing Finance.",
    highlights: [
      { value: "₹2,000+ Cr", label: "Overall funded" },
      { value: "₹13 Cr", label: "Villa purchase loan" },
    ],
    expertise: ["Home Loans & Villa Funding", "Housing Finance", "Title & Collateral Issues", "Channel Development"],
    linkedin: "https://www.linkedin.com/in/pradeep-sr-467b0a437",
    message:
      "We resolve complex account issues rapidly, proving to clients through speed, clarity, and precision that they are dealing with true banking professionals.",
  },
  {
    slug: "raghunath-y",
    name: "Raghunath Y",
    designation: "Leader",
    photo: "/team/raghunath-y.jpg",
    experienceYears: "20+",
    bio: "Raghunath brings 20 years of leadership in corporate and retail banking to private credit advisory, with a record of aligning debt obligations with the cash flows behind them to protect a business's balance sheet.",
    education: "MBA",
    previously: "Deputy Vice President at IDBI Bank, HSBC, Axis Bank, ICICI Bank and IndusInd Bank.",
    highlights: [
      { value: "₹500+ Cr", label: "Overall funded" },
      { value: "₹31 Cr", label: "Loan against property" },
    ],
    expertise: ["Loan Against Property", "Working Capital", "Structured Debt", "Corporate Banking", "Credit Risk Advisory"],
    linkedin: "https://www.linkedin.com/in/raghunath-yekbote-77a2065",
    message:
      "Your goals deserve more than just a loan—they deserve the right guidance and a trusted partner. We are committed to being by your side with solutions you can rely on, through every financial milestone.",
  },
  {
    slug: "nagarajan-v",
    name: "Nagarajan V",
    designation: "Key Advisor",
    photo: "/team/nagarajan-v.jpg",
    experienceYears: "20+",
    // TODO (content): the client's table gives no LinkedIn link, write-up or message for Nagarajan V.
    bio: "Nagarajan brings more than 20 years of banking experience to AapKaLoan as a Key Advisor, with deep expertise in loans, property loans and MSME lending.",
    expertise: ["Loans", "Property Loans", "MSME Loans"],
    linkedin: "",
  },
];
