import type {
  FUNDING_AMOUNT_VALUES,
  PRODUCT_INTEREST_VALUES,
  USE_OF_FUND_VALUES,
} from "@/lib/apply-schema";

export type ProductInterestKey = (typeof PRODUCT_INTEREST_VALUES)[number];
export type UseOfFund = (typeof USE_OF_FUND_VALUES)[number];
export type FundingAmountTier = (typeof FUNDING_AMOUNT_VALUES)[number];

export type ProductSlug =
  | "working-capital"
  | "term-loans"
  | "line-of-credit"
  | "equipment-financing"
  | "sba-loans"
  | "mca-consolidation"
  | "acquisitions"
  | "commercial-real-estate";

/** How the calculator prices a product. */
export type CalcMode = "factor" | "amortized";

export type PaymentFrequency = "daily" | "weekly" | "monthly";

export type ProductCalcConfig = {
  mode: CalcMode;
  /** Slider bounds — estimates only, tune to what partners actually place. */
  amountMin: number;
  amountMax: number;
  amountDefault: number;
  amountStep: number;
  termMinMonths: number;
  termMaxMonths: number;
  termDefault: number;
  termStep: number;
  /** Factor rate (e.g. 1.15–1.49) or estimated APR % (e.g. 8–30). */
  rateMin: number;
  rateMax: number;
  rateDefault: number;
  rateStep: number;
  frequencies: PaymentFrequency[];
  defaultFrequency: PaymentFrequency;
  /** Label next to the amount input (e.g. "Draw amount" for LOC). */
  amountLabel: string;
  rateNote: string;
};

export type Product = {
  slug: ProductSlug;
  interestKey: Exclude<ProductInterestKey, "not_sure">;
  name: string;
  /** Short label for nav, chips, funnel cards. */
  shortName: string;
  /** One-liner shown on cards and product hero. */
  tagline: string;
  description: string;
  amountRangeLabel: string;
  termRangeLabel: string;
  rateRangeLabel: string;
  bestFor: string;
  quickFacts: { label: string; value: string }[];
  uses: { title: string; body: string }[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  calc: ProductCalcConfig;
  useOfFundsSeed: UseOfFund[];
};

const REVIEW_FACT = { label: "Review", value: "Within 1 business day" };
const UNDERWRITING_FACT = {
  label: "Underwriting",
  value: "Bank statements first — reviewed by a person",
};

export const PRODUCTS: Product[] = [
  {
    slug: "working-capital",
    interestKey: "working_capital",
    name: "Working Capital",
    shortName: "Working Capital",
    tagline: "Short-term capital priced on your revenue, not just your credit.",
    description:
      "Revenue-based working capital for businesses with steady deposits that need to move on materials, payroll, or a busy season. Priced with a factor rate, repaid on a fixed schedule, underwritten on your bank statements.",
    amountRangeLabel: "$10K – $500K",
    termRangeLabel: "3 – 24 months",
    rateRangeLabel: "Factor rates est. 1.15 – 1.49",
    bestFor: "Fast-moving jobs, payroll, materials, seasonal ramp-ups",
    quickFacts: [
      { label: "Amounts", value: "$10K – $500K" },
      { label: "Terms", value: "3 – 24 months" },
      { label: "Pricing", value: "Factor rate, est. 1.15 – 1.49" },
      { label: "Payments", value: "Daily, weekly, or monthly" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Materials & supplies", body: "Stock up before a booked-out stretch instead of floating it on cards." },
      { title: "Payroll & crews", body: "Carry a bigger crew through the gap between work done and invoices paid." },
      { title: "Seasonal ramp", body: "Get ahead of your busy season while cash flow is still catching up." },
      { title: "Quick opportunities", body: "Take the job or the discount that won't wait for a bank timeline." },
    ],
    benefits: [
      "Decisions driven by real deposits, not just a credit score",
      "Fixed total payback — you know the full cost up front",
      "Daily, weekly, or monthly payment schedules",
      "Early payoff options with many partners",
      "No collateral requirement on most files",
      "Statements-first review, done by a person",
    ],
    faqs: [
      {
        q: "What is a factor rate?",
        a: "A factor rate is a multiplier on the amount you receive. At a 1.30 factor, $50,000 costs $65,000 in total repayment. Unlike APR it doesn't compound — the total cost is fixed at the start.",
      },
      {
        q: "How fast can this move?",
        a: "We review within 1 business day. Once a partner approves, working capital often funds in a few business days — exact timing varies by partner and file.",
      },
      {
        q: "Do I need perfect credit?",
        a: "Files are underwritten primarily on bank statements and revenue consistency. Credit is one input, not the whole picture. Pre-qualifying here does not affect your credit score.",
      },
    ],
    calc: {
      mode: "factor",
      amountMin: 10_000,
      amountMax: 500_000,
      amountDefault: 75_000,
      amountStep: 5_000,
      termMinMonths: 3,
      termMaxMonths: 24,
      termDefault: 12,
      termStep: 1,
      rateMin: 1.15,
      rateMax: 1.49,
      rateDefault: 1.28,
      rateStep: 0.01,
      frequencies: ["daily", "weekly", "monthly"],
      defaultFrequency: "weekly",
      amountLabel: "Funding amount",
      rateNote: "Factor rate — total repayment is amount × factor.",
    },
    useOfFundsSeed: ["wc_growth"],
  },
  {
    slug: "term-loans",
    interestKey: "term_loan",
    name: "Business Term Loans",
    shortName: "Term Loans",
    tagline: "Predictable monthly payments for planned, larger moves.",
    description:
      "Structured loans with fixed payments over 6 to 60 months. The right fit when you know exactly what you're buying and want the cost spread out at a rate that rewards a solid file.",
    amountRangeLabel: "$25K – $5M",
    termRangeLabel: "6 – 60 months",
    rateRangeLabel: "Est. APR from ~8%",
    bestFor: "Expansion, buildouts, large equipment, refinancing short-term debt",
    quickFacts: [
      { label: "Amounts", value: "$25K – $5M" },
      { label: "Terms", value: "6 – 60 months" },
      { label: "Pricing", value: "Est. APR from ~8% (varies by file)" },
      { label: "Payments", value: "Fixed monthly" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Expansion", body: "Open the second location or add the service line demand is asking for." },
      { title: "Buildouts & renovations", body: "Shop, warehouse, or office upgrades that unlock more volume." },
      { title: "Large purchases", body: "Big-ticket buys where a fixed monthly payment beats draining reserves." },
      { title: "Restructuring", body: "Replace expensive short-term positions with one predictable payment." },
    ],
    benefits: [
      "Fixed monthly payments that are easy to budget around",
      "Larger amounts than most short-term products",
      "Longer terms keep monthly payments manageable",
      "On-time payments help build business credit",
      "Early payoff options with many partners",
      "One application, multiple partner options",
    ],
    faqs: [
      {
        q: "What rate should I expect?",
        a: "Estimated APRs start around 8% for the strongest files and rise with risk, term, and amount. Your actual rate comes from partner underwriting — the calculator lets you model the range honestly.",
      },
      {
        q: "How long does approval take?",
        a: "Our review happens within 1 business day. Term loan partner decisions typically take a few business days depending on documentation.",
      },
      {
        q: "What do partners look for?",
        a: "Consistent revenue on statements, time in business, and a clear use of funds. Stronger files get better terms — that's the whole point of comparing options.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 25_000,
      amountMax: 5_000_000,
      amountDefault: 150_000,
      amountStep: 5_000,
      termMinMonths: 6,
      termMaxMonths: 60,
      termDefault: 36,
      termStep: 6,
      rateMin: 8,
      rateMax: 30,
      rateDefault: 14,
      rateStep: 0.5,
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Loan amount",
      rateNote: "Estimated APR — amortized like a standard loan.",
    },
    useOfFundsSeed: ["wc_growth"],
  },
  {
    slug: "line-of-credit",
    interestKey: "line_of_credit",
    name: "Business Line of Credit",
    shortName: "Line of Credit",
    tagline: "Draw what you need, when you need it — pay for what you use.",
    description:
      "A revolving credit line you can draw against as jobs come in. Interest applies to what you draw, not the full limit, which makes it the right safety net for uneven cash flow.",
    amountRangeLabel: "$10K – $500K",
    termRangeLabel: "Revolving · 6 – 24 mo draws",
    rateRangeLabel: "Est. APR from ~8%",
    bestFor: "Cash-flow gaps, standby capacity, recurring material buys",
    quickFacts: [
      { label: "Limits", value: "$10K – $500K" },
      { label: "Structure", value: "Revolving — draw, repay, redraw" },
      { label: "Pricing", value: "Est. APR from ~8% on drawn funds" },
      { label: "Payments", value: "Weekly or monthly on balances" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Cash-flow smoothing", body: "Bridge the gap between finishing work and getting paid." },
      { title: "Standby capacity", body: "Have funds ready for the job you haven't won yet." },
      { title: "Recurring purchases", body: "Draw for materials each cycle and repay as invoices clear." },
      { title: "Emergencies", body: "Truck down, equipment failure — draw same-week instead of scrambling." },
    ],
    benefits: [
      "Pay interest only on what you draw",
      "Redraw as you repay — no reapplying every time",
      "Faster than reapplying for a new loan each job",
      "Good complement to a term loan or equipment financing",
      "Limits can grow as your deposits grow",
      "Statements-first review, done by a person",
    ],
    faqs: [
      {
        q: "How is this different from a term loan?",
        a: "A term loan is one lump sum with fixed payments. A line of credit is a limit you draw against repeatedly — you're only charged on outstanding balances.",
      },
      {
        q: "Does an unused line cost anything?",
        a: "Many partners charge nothing while the line sits unused; some have small maintenance fees. We flag the difference before you pick an option.",
      },
      {
        q: "Can I have a line and a loan?",
        a: "Often, yes — many businesses run a term loan for a big purchase and keep a line for day-to-day swings. Partner stacking rules apply; we'll walk through it on your review call.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 10_000,
      amountMax: 500_000,
      amountDefault: 50_000,
      amountStep: 5_000,
      termMinMonths: 6,
      termMaxMonths: 24,
      termDefault: 12,
      termStep: 1,
      rateMin: 8,
      rateMax: 28,
      rateDefault: 16,
      rateStep: 0.5,
      frequencies: ["weekly", "monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Draw amount",
      rateNote: "Estimated APR on the amount you draw.",
    },
    useOfFundsSeed: ["wc_growth"],
  },
  {
    slug: "equipment-financing",
    interestKey: "equipment_financing",
    name: "Equipment Financing",
    shortName: "Equipment",
    tagline: "The machine pays for itself while you pay it off.",
    description:
      "Financing secured by the equipment itself — trucks, machines, trailers, tools. Because the asset backs the deal, rates run lower and approvals reach further than unsecured options.",
    amountRangeLabel: "$10K – $2M",
    termRangeLabel: "12 – 72 months",
    rateRangeLabel: "Est. APR from ~7%",
    bestFor: "Trucks, heavy equipment, machines, trailers, tools of the trade",
    quickFacts: [
      { label: "Amounts", value: "$10K – $2M" },
      { label: "Terms", value: "12 – 72 months" },
      { label: "Pricing", value: "Est. APR from ~7% — asset-secured" },
      { label: "Collateral", value: "The equipment itself" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Trucks & vehicles", body: "Add the truck that lets you run a second crew." },
      { title: "Heavy equipment", body: "Excavators, lifts, mowers, pressure rigs — new or used." },
      { title: "Shop machinery", body: "The machine that turns turned-down work into booked work." },
      { title: "Upgrades", body: "Replace aging equipment before downtime costs you contracts." },
    ],
    benefits: [
      "Equipment serves as collateral — often the lowest rates here",
      "New and used equipment both financeable",
      "Terms matched to the working life of the asset",
      "Preserves cash and credit lines for operations",
      "Potential tax advantages (ask your accountant about Section 179)",
      "Fixed payments you can price into every job",
    ],
    faqs: [
      {
        q: "New or used equipment?",
        a: "Both. Used equipment from dealers and private sellers is financeable with most partners — age and condition affect the term offered.",
      },
      {
        q: "Do I need a down payment?",
        a: "Many deals fund at or near 100% of the equipment cost; stronger files may need nothing down. Some partners ask for first-and-last payment up front.",
      },
      {
        q: "Lease or finance?",
        a: "Financing builds equity in the asset; leases can lower payments and simplify upgrades. We'll compare both on your review call if it's relevant.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 10_000,
      amountMax: 2_000_000,
      amountDefault: 100_000,
      amountStep: 5_000,
      termMinMonths: 12,
      termMaxMonths: 72,
      termDefault: 48,
      termStep: 6,
      rateMin: 7,
      rateMax: 24,
      rateDefault: 12,
      rateStep: 0.5,
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Equipment cost",
      rateNote: "Estimated APR — asset-secured, amortized.",
    },
    useOfFundsSeed: ["equipment"],
  },
  {
    slug: "sba-loans",
    interestKey: "sba_loan",
    name: "SBA Loans",
    shortName: "SBA Loans",
    tagline: "The lowest-cost capital most small businesses can access.",
    description:
      "Government-guaranteed loans arranged through SBA-approved partner lenders. The strongest rates and longest terms available — in exchange for more paperwork and a longer timeline. Built Together Funding is not the SBA and is not a direct lender.",
    amountRangeLabel: "$50K – $5M",
    termRangeLabel: "5 – 25 years",
    rateRangeLabel: "Est. Prime + 2.75–4.75%",
    bestFor: "Established businesses making long-term moves at the lowest cost",
    quickFacts: [
      { label: "Amounts", value: "$50K – $5M" },
      { label: "Terms", value: "5 – 25 years" },
      { label: "Pricing", value: "Est. Prime + 2.75% – 4.75%" },
      { label: "Timeline", value: "Weeks, not days — plan ahead" },
      REVIEW_FACT,
      { label: "Note", value: "Arranged through SBA-approved partner lenders" },
    ],
    uses: [
      { title: "Major expansion", body: "Long-payback projects where a 10-year term keeps payments light." },
      { title: "Real estate", body: "Buy the shop or yard you've been renting (SBA 504/7a)." },
      { title: "Acquisitions", body: "Buy a competitor or a book of business with structured debt." },
      { title: "Debt refinancing", body: "Replace expensive positions with the cheapest money available." },
    ],
    benefits: [
      "Lowest rates available to most small businesses",
      "Terms up to 25 years keep monthly payments low",
      "Large amounts without giving up equity",
      "Partial government guarantee widens approvals",
      "Can combine with faster products while you wait",
      "We prep your file so the paperwork doesn't stall it",
    ],
    faqs: [
      {
        q: "How long does an SBA loan take?",
        a: "Typically several weeks from complete file to funding. Many owners pair a faster product for the immediate need and refinance into SBA later — we can model both.",
      },
      {
        q: "Am I eligible?",
        a: "Generally: U.S. for-profit business, reasonable owner credit, and demonstrated ability to repay. 2+ years in business helps significantly. Eligibility is determined by partner lenders and SBA rules, not by us.",
      },
      {
        q: "Is Built Together Funding an SBA lender?",
        a: "No. We are not the SBA and not a direct lender. We connect you with SBA-approved partner lenders and help you prepare a complete file.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 50_000,
      amountMax: 5_000_000,
      amountDefault: 350_000,
      amountStep: 25_000,
      termMinMonths: 60,
      termMaxMonths: 300,
      termDefault: 120,
      termStep: 12,
      rateMin: 10,
      rateMax: 14,
      rateDefault: 11.5,
      rateStep: 0.25,
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Loan amount",
      rateNote: "Estimated APR — SBA rates track WSJ Prime + margin.",
    },
    useOfFundsSeed: ["wc_growth"],
  },
  {
    slug: "mca-consolidation",
    interestKey: "mca_consolidation",
    name: "MCA Consolidation",
    shortName: "MCA Consolidation",
    tagline: "Turn multiple daily payments into one you can breathe under.",
    description:
      "If stacked merchant cash advances are eating your deposits, consolidation replaces multiple positions with a single structured payment — often longer term and lower total daily pull. No guarantees on savings; every restructure is underwritten on your real statements.",
    amountRangeLabel: "$25K – $2M",
    termRangeLabel: "6 – 36 months",
    rateRangeLabel: "Factor rates est. 1.20 – 1.45",
    bestFor: "Businesses with 2+ advance positions squeezing daily cash flow",
    quickFacts: [
      { label: "Amounts", value: "$25K – $2M" },
      { label: "Terms", value: "6 – 36 months" },
      { label: "Pricing", value: "Factor rate, est. 1.20 – 1.45" },
      { label: "Goal", value: "One payment, longer runway" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Consolidate positions", body: "Roll multiple daily-debit advances into one structured payment." },
      { title: "Extend the runway", body: "Longer terms can shrink the daily pull on your account." },
      { title: "Stop the stack", body: "Replace the cycle of stacking a new advance to cover the last one." },
      { title: "Rebuild headroom", body: "Free up daily cash so payroll and materials stop being a squeeze." },
    ],
    benefits: [
      "One payment instead of several competing daily debits",
      "Longer terms can reduce total daily outflow",
      "A clear payoff date instead of a rolling stack",
      "Underwritten on statements — we see what you're actually paying",
      "A path back to cheaper products once positions clear",
      "Straight answers: if the math doesn't work, we say so",
    ],
    faqs: [
      {
        q: "Will consolidation lower my payments?",
        a: "Often the daily or weekly outflow drops because the term is longer — but total cost depends on your positions and the new terms. We model it honestly before you commit, and we don't guarantee savings.",
      },
      {
        q: "How many positions can be consolidated?",
        a: "Partners commonly consolidate two to five positions. Bring statements and payoff letters; the review call is where we map it.",
      },
      {
        q: "Will this hurt my credit?",
        a: "Pre-qualifying doesn't touch your credit. Consolidation itself typically pays off existing advances, which are usually not credit-reported anyway.",
      },
    ],
    calc: {
      mode: "factor",
      amountMin: 25_000,
      amountMax: 2_000_000,
      amountDefault: 150_000,
      amountStep: 5_000,
      termMinMonths: 6,
      termMaxMonths: 36,
      termDefault: 18,
      termStep: 1,
      rateMin: 1.2,
      rateMax: 1.45,
      rateDefault: 1.32,
      rateStep: 0.01,
      frequencies: ["daily", "weekly", "monthly"],
      defaultFrequency: "weekly",
      amountLabel: "Consolidation amount",
      rateNote: "Factor rate on the consolidated balance.",
    },
    useOfFundsSeed: ["debt_consolidation"],
  },
  {
    slug: "acquisitions",
    interestKey: "acquisition",
    name: "Business Acquisition Financing",
    shortName: "Acquisitions",
    tagline: "Buy the business, the book, or the competitor — with structure.",
    description:
      "Financing for buying an existing business, a customer book, or a competitor's routes and contracts. Structured around the cash flow of what you're buying plus the strength of what you already run.",
    amountRangeLabel: "$100K – $5M",
    termRangeLabel: "1 – 10 years",
    rateRangeLabel: "Est. APR from ~9%",
    bestFor: "Operators buying revenue instead of building it from scratch",
    quickFacts: [
      { label: "Amounts", value: "$100K – $5M" },
      { label: "Terms", value: "1 – 10 years" },
      { label: "Pricing", value: "Est. APR from ~9% (deal-dependent)" },
      { label: "Structures", value: "Term, SBA, or seller-note hybrid" },
      REVIEW_FACT,
      UNDERWRITING_FACT,
    ],
    uses: [
      { title: "Full acquisitions", body: "Buy an operating business with existing crews and contracts." },
      { title: "Customer books", body: "Acquire routes, maintenance books, or recurring contracts." },
      { title: "Competitor buyouts", body: "Consolidate your market when a rival exits." },
      { title: "Partner buyouts", body: "Buy out a partner and keep the business moving." },
    ],
    benefits: [
      "Buy proven revenue instead of building from zero",
      "Deals underwritten on the target's cash flow too",
      "SBA and conventional structures compared side by side",
      "Seller financing can be blended into the structure",
      "Terms long enough for the deal to pay for itself",
      "One review call to map the whole structure",
    ],
    faqs: [
      {
        q: "How much do I need down?",
        a: "Commonly 10–20% of the purchase price, sometimes less when seller financing is part of the structure. Every deal is different — the review call maps yours.",
      },
      {
        q: "What will lenders want to see?",
        a: "The target's financials (P&L, tax returns), your statements, and a purchase agreement or LOI. Deals move faster when the target's books are clean.",
      },
      {
        q: "Can SBA money buy a business?",
        a: "Yes — SBA 7(a) is one of the most common acquisition structures. We compare it against conventional options for speed vs. cost.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 100_000,
      amountMax: 5_000_000,
      amountDefault: 750_000,
      amountStep: 25_000,
      termMinMonths: 12,
      termMaxMonths: 120,
      termDefault: 84,
      termStep: 12,
      rateMin: 9,
      rateMax: 20,
      rateDefault: 13,
      rateStep: 0.5,
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Acquisition amount",
      rateNote: "Estimated APR — final structure depends on the deal.",
    },
    useOfFundsSeed: ["acquisition_expansion"],
  },
  {
    slug: "commercial-real-estate",
    interestKey: "commercial_real_estate",
    name: "Commercial Real Estate & Major Projects",
    shortName: "Real Estate / Projects",
    tagline: "Own the shop, the yard, or the building your business runs from.",
    description:
      "Financing for buying, building, or renovating commercial property — shops, warehouses, yards, mixed-use — plus bridge capital for major projects. Longer diligence than working capital, structured for deals measured in years.",
    amountRangeLabel: "$250K – $10M",
    termRangeLabel: "1 – 30 years",
    rateRangeLabel: "Est. APR from ~8%",
    bestFor: "Owners tired of paying rent, and operators taking on major projects",
    quickFacts: [
      { label: "Amounts", value: "$250K – $10M" },
      { label: "Terms", value: "1 – 30 years (bridge to permanent)" },
      { label: "Pricing", value: "Est. APR from ~8% (property-dependent)" },
      { label: "Structures", value: "Purchase, refi, bridge, construction" },
      REVIEW_FACT,
      { label: "Timeline", value: "Weeks — appraisal and diligence apply" },
    ],
    uses: [
      { title: "Buy your building", body: "Turn rent into equity in the shop or yard you already operate from." },
      { title: "Warehouse & yard space", body: "Room for more trucks, more inventory, more crews." },
      { title: "Construction & renovation", body: "Build out or upgrade property to unlock capacity." },
      { title: "Bridge capital", body: "Move on a property now, refinance into permanent debt later." },
    ],
    benefits: [
      "Build equity instead of paying a landlord",
      "Long amortizations keep payments workable",
      "Bridge options for deals that can't wait",
      "SBA 504 compared where owner-occupied rules fit",
      "The property anchors the deal — rates reflect it",
      "One review call to scope feasibility before you commit",
    ],
    faqs: [
      {
        q: "How much down for commercial property?",
        a: "Commonly 10–25% depending on structure — SBA 504 owner-occupied deals sit at the low end, conventional and bridge at the higher end.",
      },
      {
        q: "How long does closing take?",
        a: "Plan on weeks: appraisal, title, and environmental checks are standard. Bridge products can move faster when timing is critical.",
      },
      {
        q: "Does my business need to occupy the property?",
        a: "SBA structures require majority owner-occupancy. Investment and mixed-use properties route to conventional or bridge partners instead.",
      },
    ],
    calc: {
      mode: "amortized",
      amountMin: 250_000,
      amountMax: 10_000_000,
      amountDefault: 1_500_000,
      amountStep: 50_000,
      termMinMonths: 12,
      termMaxMonths: 360,
      termDefault: 120,
      termStep: 12,
      rateMin: 8,
      rateMax: 15,
      rateDefault: 10.5,
      rateStep: 0.25,
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      amountLabel: "Project amount",
      rateNote: "Estimated APR — property and structure drive pricing.",
    },
    useOfFundsSeed: ["property_project"],
  },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

export function getProduct(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductByInterestKey(
  key: string,
): Product | null {
  return PRODUCTS.find((p) => p.interestKey === key) ?? null;
}

/** Funnel option labels — product cards in step 1 plus a "not sure" escape hatch. */
export const PRODUCT_INTEREST_OPTIONS: {
  value: ProductInterestKey;
  label: string;
  hint?: string;
}[] = [
  ...PRODUCTS.map((p) => ({
    value: p.interestKey as ProductInterestKey,
    label: p.shortName,
    hint: p.amountRangeLabel,
  })),
  { value: "not_sure", label: "Not sure yet", hint: "We'll route you" },
];

export const PRODUCT_INTEREST_LABELS: Record<string, string> = {
  ...Object.fromEntries(PRODUCTS.map((p) => [p.interestKey, p.name])),
  not_sure: "Not sure yet",
};

/** Maps a raw dollar amount to the nearest funnel funding tier. */
export function fundingTierForAmount(amount: number): FundingAmountTier {
  if (amount < 25_000) return "under_25k";
  if (amount < 75_000) return "25k_75k";
  if (amount < 150_000) return "75k_150k";
  if (amount < 300_000) return "150k_300k";
  if (amount < 750_000) return "300k_750k";
  if (amount < 2_000_000) return "750k_2m";
  return "2m_plus";
}
