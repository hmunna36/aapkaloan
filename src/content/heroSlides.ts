// Home page hero slides — one per service, each with "trigger" questions that
// open the consultation form with the requirement already chosen.
//
// TODO (content): the client asked for these to follow the Leadership Posters,
// which we haven't received yet. The copy below is drawn from the existing site.
// When the posters arrive, replace the wording here and add each poster as
// `image` (the right-hand illustration is used until then). Every `requirement`
// must match an entry in `requirementLabels` (src/content/funding.ts) so the
// form's dropdown is pre-selected.

export type HeroTrigger = {
  question: string;
  requirement?: string;
  message?: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  /** Second line of the headline, set in italic gold. */
  accent: string;
  body: string;
  triggers: HeroTrigger[];
  link: { label: string; href: string };
  /** Optional poster artwork shown beside the copy, e.g. "/hero/loans.jpg". */
  image?: { src: string; alt: string };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "loans",
    eyebrow: "Loans · Secured & unsecured",
    title: "The right loan,",
    accent: "from the right lender.",
    body: "Home loans, loan against property, MSME and business loans — compared across 100+ banks and NBFCs before you apply anywhere.",
    triggers: [
      {
        question: "Loan rejected because of your CIBIL score?",
        requirement: "CIBIL Rectification",
        message: "My loan was rejected because of my CIBIL score.",
      },
      {
        question: "Paying too much EMI on your home loan?",
        requirement: "Home Loan",
        message: "I'd like to lower the EMI on my existing home loan.",
      },
      { question: "Need funds against your property?", requirement: "Loan Against Property" },
    ],
    link: { label: "Explore loans", href: "/loans" },
  },
  {
    id: "business",
    eyebrow: "Funding solutions",
    title: "Capital to grow,",
    accent: "structured your way.",
    body: "Working capital, NBFC facilities, venture capital and private placement — for MSMEs, startups and growing businesses.",
    triggers: [
      { question: "Need working capital for a big order?", requirement: "Banking / Working Capital" },
      { question: "Business loan without collateral?", requirement: "Unsecured Business Loan" },
      { question: "Raising capital to expand — debt or equity?", requirement: "Business Funding" },
    ],
    link: { label: "Explore funding solutions", href: "/funding-solutions" },
  },
  {
    id: "schools",
    eyebrow: "School funding",
    title: "Build the school",
    accent: "your students deserve.",
    body: "Campus expansion, buses, smart classrooms and working capital for schools and educational trusts.",
    triggers: [
      {
        question: "Planning a new building or campus?",
        requirement: "School Funding",
        message: "We're planning a new building / campus expansion.",
      },
      {
        question: "Need buses or smart classrooms?",
        requirement: "School Funding",
        message: "We need funding for school buses / smart classrooms.",
      },
      {
        question: "Refinancing an existing school loan?",
        requirement: "School Funding",
        message: "We'd like to refinance an existing school loan.",
      },
    ],
    link: { label: "Explore school funding", href: "/funding-solutions/school-funding" },
  },
];
