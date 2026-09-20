// Loan products, grouped Secured / Unsecured as the brief requires.
// Figures are indicative ranges only — actual terms depend on the lender and profile.

export type LoanCategory = "secured" | "unsecured";

export type LoanProduct = {
  slug: string;
  name: string;
  short: string;
  overview: string;
  highlights: { label: string; value: string }[];
  features: string[];
  eligibility: string[];
  documents: string[];
  useCases: string[];
  /** Sub-products shown as cards (used by the "Other products" tabs). */
  offerings?: { name: string; text: string }[];
};

export const loanCategories: Record<
  LoanCategory,
  { title: string; kicker: string; summary: string; bestFor: string; products: LoanProduct[] }
> = {
  secured: {
    title: "Secured Loans",
    kicker: "Backed by an asset",
    summary:
      "Borrow against property or other assets you own. Security lowers the lender's risk, so you typically get larger amounts, longer tenures and sharper rates.",
    bestFor: "Buying or building a home, unlocking value in property, large long-term needs.",
    products: [
      {
        slug: "home-loan",
        name: "Home Loan",
        short: "Buy, build or move your home loan to better terms.",
        overview:
          "Finance a ready or under-construction home, build on your own plot, or transfer an existing home loan to a lender offering better terms. We compare offers across banks and housing finance companies and structure the file so it's approved the first time.",
        highlights: [
          { label: "Tenure", value: "Up to 30 years" },
          { label: "Funding", value: "Up to 75–90% of value*" },
          { label: "Rate type", value: "Floating or fixed" },
        ],
        features: [
          "Purchase, construction, plot + construction and home-improvement loans",
          "Balance transfer with optional top-up to reduce your EMI",
          "Joint applications to increase eligibility",
          "Side-by-side comparison of offers from multiple lenders",
          "Support from sanction through legal, technical and disbursement",
        ],
        eligibility: [
          "Salaried or self-employed individuals, typically aged 21–65",
          "Stable, documented income (salary or business)",
          "Healthy credit history — a CIBIL score of 700+ helps get the best rates",
          "Property with clear title and approved plans",
        ],
        documents: [
          "KYC — PAN, Aadhaar, photographs",
          "Income proof — last 3 salary slips & Form 16, or 2–3 years' ITR with financials",
          "Bank statements for the last 6–12 months",
          "Property papers — sale agreement, title deed, approved plan, tax receipts",
        ],
        useCases: [
          "First-time home purchase",
          "Building on a plot you already own",
          "Moving a high-rate loan to a cheaper lender",
          "Renovation or extension using a top-up",
        ],
      },
      {
        slug: "loan-against-property",
        name: "Loan Against Property",
        short: "Unlock the value of property you already own.",
        overview:
          "Raise funds against residential, commercial or industrial property for business expansion, working capital, education or consolidating expensive debt. We match your property type and income profile to lenders that value it best.",
        highlights: [
          { label: "Tenure", value: "Up to 15 years" },
          { label: "Funding", value: "Up to 60–70% of value*" },
          { label: "Property", value: "Residential, commercial, industrial" },
        ],
        features: [
          "Large ticket sizes at lower rates than unsecured credit",
          "Use funds for business or personal needs",
          "Term loan or overdraft structures",
          "Balance transfer and top-up on existing LAP",
          "Continued use of the property while it is mortgaged",
        ],
        eligibility: [
          "Salaried, self-employed professionals and business owners",
          "Property in the applicant's (or co-applicant's) name with clear title",
          "Demonstrable income to service the EMI",
          "Satisfactory credit history",
        ],
        documents: [
          "KYC of all applicants",
          "2–3 years' ITR, financials and GST returns (for businesses)",
          "Bank statements for the last 12 months",
          "Complete property chain documents and tax receipts",
        ],
        useCases: [
          "Funding business expansion or new machinery",
          "Long-tenure working capital",
          "Consolidating high-interest loans into one EMI",
          "Children's higher education or medical needs",
        ],
      },
      {
        slug: "other-secured",
        name: "Other Secured Products",
        short: "Specialised asset-backed finance.",
        overview:
          "Beyond home loans and LAP, we arrange a range of asset-backed facilities. Tell us what you own and what you need — we'll suggest the most efficient structure.",
        highlights: [
          { label: "Security", value: "Property, rentals, vehicles, gold" },
          { label: "Tenure", value: "Varies by product" },
          { label: "Advice", value: "Structure-first" },
        ],
        offerings: [
          { name: "Lease Rental Discounting", text: "Borrow against future rent from leased commercial property." },
          { name: "Commercial Property Purchase", text: "Finance offices, shops and warehouses for your business." },
          { name: "Plot / Land Loan", text: "Purchase residential plots from approved layouts." },
          { name: "Car & Vehicle Loan", text: "New and used cars and commercial vehicles." },
          { name: "Machinery & Equipment Finance", text: "Fund plant and machinery against the asset itself." },
          { name: "Gold Loan", text: "Quick liquidity against gold ornaments." },
        ],
        features: [
          "Structures matched to the asset and cash flows",
          "Access to banks, NBFCs and specialised lenders",
          "Help with valuation, legal and technical process",
        ],
        eligibility: [
          "Ownership (or purchase) of the asset offered as security",
          "Income or rental cash flow to service repayments",
          "Satisfactory credit history",
        ],
        documents: [
          "KYC of applicants",
          "Income / business financials",
          "Asset documents — lease deeds, invoices, RC, ownership papers",
        ],
        useCases: [
          "Monetising a rented commercial property",
          "Buying premises for your business",
          "Adding vehicles or machinery to grow capacity",
        ],
      },
    ],
  },
  unsecured: {
    title: "Unsecured Loans",
    kicker: "No collateral needed",
    summary:
      "Borrow on the strength of your income, business performance and credit history — no asset pledged. Faster to process, ideal for working capital and shorter-term needs.",
    bestFor: "Growing an MSME, working capital, short-term business or personal needs.",
    products: [
      {
        slug: "msme-loan",
        name: "MSME Loan",
        short: "Working capital and term funding for small & medium enterprises.",
        overview:
          "Funding designed for micro, small and medium enterprises — from working-capital limits to term loans for expansion. Where eligible, we also explore collateral-free options under government credit-guarantee schemes such as CGTMSE.",
        highlights: [
          { label: "Tenure", value: "12 months – 7 years" },
          { label: "Structure", value: "Term loan, CC / OD" },
          { label: "Collateral", value: "Not required*" },
        ],
        features: [
          "Working capital, term loans and machinery funding",
          "Collateral-free options through credit-guarantee schemes, where eligible",
          "Limits sized on GST turnover and banking",
          "Lenders who understand your industry",
          "Help preparing financials, projections and the CMA report",
        ],
        eligibility: [
          "Udyam-registered micro, small or medium enterprise",
          "Business vintage of typically 2+ years",
          "Filed ITR and GST returns",
          "Healthy banking and credit record of the business and promoters",
        ],
        documents: [
          "Udyam certificate, GST registration, business KYC",
          "2–3 years' audited financials and ITR",
          "12 months' bank statements and GST returns",
          "Promoter KYC",
        ],
        useCases: [
          "Stocking up inventory ahead of a season",
          "Bridging payment cycles with large customers",
          "Buying new machinery to increase capacity",
          "Opening a new unit or outlet",
        ],
      },
      {
        slug: "business-loan",
        name: "Business Loan",
        short: "Quick, collateral-free funding for growing businesses.",
        overview:
          "Unsecured business loans for proprietorships, partnerships and companies that need funds quickly — without pledging property. We compare banks and NBFCs to find the best balance of amount, rate and speed.",
        highlights: [
          { label: "Tenure", value: "12 – 60 months" },
          { label: "Decision", value: "Fast turnaround*" },
          { label: "Collateral", value: "None" },
        ],
        features: [
          "No property or asset pledged",
          "Minimal documentation and quick processing",
          "Flexible end use — expansion, marketing, stock, hiring",
          "Option to combine offers from multiple lenders",
        ],
        eligibility: [
          "Proprietorships, partnerships, LLPs and private limited companies",
          "Business vintage of typically 2–3 years",
          "Stable turnover and profitability",
          "Good credit score of the business and promoters",
        ],
        documents: [
          "Business and promoter KYC",
          "Last 2 years' ITR and financials",
          "Last 12 months' bank statements",
          "GST registration and returns",
        ],
        useCases: [
          "Launching a new product line",
          "Marketing and expansion into new cities",
          "Hiring ahead of a large contract",
          "Short-term cash-flow gaps",
        ],
      },
      {
        slug: "other-unsecured",
        name: "Other Unsecured Products",
        short: "Credit for individuals and professionals.",
        overview:
          "We also arrange unsecured credit for salaried individuals and professionals. Share your requirement and we'll identify the lender and product that fit your profile.",
        highlights: [
          { label: "Collateral", value: "None" },
          { label: "For", value: "Individuals & professionals" },
          { label: "Advice", value: "Profile-matched" },
        ],
        offerings: [
          { name: "Personal Loan", text: "For weddings, travel, medical or any personal need." },
          { name: "Professional Loan", text: "For doctors, CAs, architects and other professionals." },
          { name: "Education Loan", text: "For higher studies in India and abroad." },
          { name: "Overdraft Facilities", text: "Flexible limits — pay interest only on what you use." },
          { name: "Credit Cards", text: "Cards matched to your spending and eligibility." },
        ],
        features: [
          "Quick processing with minimal paperwork",
          "Comparison across banks and NBFCs",
          "Guidance on improving eligibility",
        ],
        eligibility: [
          "Salaried individuals or practising professionals",
          "Stable income history",
          "Good credit score",
        ],
        documents: ["KYC", "Salary slips / ITR", "Bank statements", "Professional degree certificate (for professional loans)"],
        useCases: ["Planned personal expenses", "Setting up or upgrading a clinic or practice", "Funding education"],
      },
    ],
  },
};

export const allProducts = (Object.keys(loanCategories) as LoanCategory[]).flatMap((c) =>
  loanCategories[c].products.map((p) => ({ ...p, category: c })),
);
