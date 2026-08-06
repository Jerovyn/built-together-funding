export const SITE_NAME = "Built Together Funding";

/**
 * Category descriptor — leads link previews, header, hero eyebrow, and OG
 * titles so shares say what we are, not just who we are (trade-first, but
 * "service businesses" keeps it broad enough to expand).
 */
export const SITE_TAGLINE =
  "Business Financing for Trades & Service Businesses";

export const SITE_DESCRIPTION =
  "Compare working capital, term loans, equipment financing, SBA options and more — built for trades and service businesses. Pre-qualify in minutes, underwritten on real bank statements. Pre-qualification is not funding approval.";

/** Core brand message. Use at key moments: footer, brand band, funnel intro, final CTA. */
export const BRAND_LINE = "Funding is a commitment to growth.";

/** Homepage hero only — reads after header logo: "Built Together Funding where…" */
export const HERO_BRAND_LINE = "Where funding is a commitment to growth.";

/**
 * Primary funding CTA — reads as getting information, not submitting to judgment.
 */
export const CTA_PREQUAL_LABEL = "See your options";

/** After the calculator — earned, specific ask. */
export const CTA_CALC_LABEL = "Use these numbers";

/** One quiet line under the primary CTA. */
export const CTA_MICRO_LINE = "About 2 minutes · Won't affect your credit score";

/** Homepage pull line — capacity constraint, not generic growth. */
export const HOME_PULL_LINE =
  "Booked out and turning work away? We fund the next truck, crew, or machine.";

export const HOME_DESIRE_SIGNALS = [
  "The work is already there — capacity is the ceiling",
  "You can name the truck, crew, or machine you'd buy",
  "Bank statements show steady revenue",
] as const;

/**
 * Credit-impact line (verified against MCA industry standard: pre-qual uses no
 * pull; partner underwriting typically starts with a soft pull).
 */
export const CREDIT_CHECK_LINE =
  "Pre-qualifying here does not affect your credit score. If a funding partner needs a credit check during final underwriting, you will know before anything runs.";

/** Short trust-chip version of the credit line. */
export const CREDIT_CHECK_SHORT = "Won't affect your credit score";

/**
 * Top-nav links that aren't Products (dropdown) or Calculator (standalone).
 * Kept short on purpose (Hick's law) — About and Resources live in the footer.
 */
export const NAV_LINKS = [
  { href: "/how-it-works/", label: "How It Works" },
  { href: "/who-we-help/", label: "Who We Help" },
  { href: "/contact/", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Use" },
  { href: "/disclosures/", label: "Funding Disclosures" },
  { href: "/iso/", label: "ISO / Partner Signup" },
] as const;

export const ROUTES = {
  home: "/",
  apply: "/apply/",
  products: "/products/",
  calculator: "/calculator/",
  howItWorks: "/how-it-works/",
  whoWeHelp: "/who-we-help/",
  fundingUses: "/funding-uses/",
  about: "/about/",
  resources: "/resources/",
  contact: "/contact/",
  iso: "/iso/",
  /** Standalone funding review booking (token appended). */
  bookReview: "/book/",
} as const;

/** Shown on apply page and FAQ — Stage A is the quick path; full file is optional. */
export const APPLY_TIME_ESTIMATE =
  "About 2 minutes to see if we should talk · full file optional after";

export const HOME_MIN_REQUIREMENTS = [
  "6+ months in business (most files)",
  "Steady revenue on bank statements",
  "U.S.-based service or trade business",
  "Owner can provide EIN and last 3 months of statements",
] as const;

/** Homepage trades marquee — add any U.S. service/trade vertical. */
export const HOME_TRADES_MARQUEE = [
  "Roofing",
  "Landscaping",
  "Pressure washing",
  "Exterior cleaning",
  "Window cleaning",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Construction",
  "General contractors",
  "Concrete & masonry",
  "Painting",
  "Flooring",
  "Fencing",
  "Tree service",
  "Pool service",
  "Pest control",
  "Junk removal",
  "Mobile detailing",
  "Auto repair",
  "Towing & recovery",
  "Commercial cleaning",
  "Janitorial",
  "Catering & events",
  "Food trucks",
  "Salons & barbers",
  "Fitness studios",
  "Property maintenance",
  "Restoration",
  "Solar installation",
  "Garage doors",
  "Irrigation",
  "Paving & asphalt",
  "Demolition",
  "Welding & fabrication",
  "Sign installation",
  "Security systems",
  "Moving & logistics",
] as const;

export const HOME_FAQS = [
  {
    q: "Is this approval?",
    a: "No. Pre-qual tells us you may be a fit. Final options depend on review, underwriting, and partner availability.",
  },
  {
    q: "Will this hit my credit?",
    a: CREDIT_CHECK_LINE,
  },
  {
    q: "What funding products can you place?",
    a: "Working capital, term loans, lines of credit, equipment financing, SBA loans, MCA consolidation, acquisition financing, and commercial real estate / major projects — one application compares your options across our partner network.",
  },
  {
    q: "What do you need?",
    a: "About 2 minutes first: what the money is for, how much, rough monthly revenue, time in business, and how to reach you. Bank statements, SSN, and EIN only if you choose to finish the full file — or we can collect them after you talk with us.",
  },
  {
    q: "What are the minimum requirements?",
    a: HOME_MIN_REQUIREMENTS.join(" · "),
  },
  {
    q: "Are the calculator numbers a quote?",
    a: "No — the calculator shows estimate ranges so you can model payments honestly before you apply. Actual rates and terms come from partner underwriting of your real file.",
  },
] as const;

/** Visible compliance line for key conversion moments (homepage FAQ + final CTA). */
export const DISCLAIMER_PREQUAL_LINE =
  "Pre-qualification is not funding approval. Final options are subject to review, underwriting, and partner availability.";

/** Use on legal pages and anywhere a stronger no-guarantee line is needed. */
export const LEGAL_NO_GUARANTEE_LINE =
  "Built Together Funding does not guarantee approval, terms, rates, savings, profit increases, or funding availability.";

/** Footer and compact disclaimer blocks: prequal line + no-guarantee line. */
export const DISCLAIMER_SHORT = `${DISCLAIMER_PREQUAL_LINE} ${LEGAL_NO_GUARANTEE_LINE}`;

/** Aligns with site positioning; use in legal and disclosure contexts. */
export const LEGAL_CAPACITY_PHILOSOPHY_LINE =
  "Funding should only be used when demand already exists and capacity is the constraint.";

/**
 * Footer / product-page broker disclosure (VersaFi-style block, honest
 * version). Pairs with DISCLAIMER_SHORT.
 */
export const BROKER_DISCLOSURE =
  "Built Together Funding Corp works with a network of funding partners and is not a direct lender or the SBA. All financing is subject to partner review, underwriting, and approval. Rates, terms, and amounts shown on this site are estimates only, vary by qualifications, and are not an offer or commitment to lend. Not all applicants will qualify.";

/** Calculator + product-page estimate stamp. */
export const DISCLAIMER_ESTIMATE_LINE =
  "Estimates only — not an offer, quote, or commitment to lend. Actual terms depend on review, underwriting, and partner availability.";

/** Honest, operational proof points (no fabricated volume or approval stats). */
export const HOME_STATS = [
  { value: 1, suffix: "", label: "Business day to a review answer" },
  { value: 5, suffix: " min", label: "Pre-qualification, start to finish" },
  { value: 38, suffix: "+", label: "Trades & service verticals served" },
  { value: 8, suffix: "", label: "Financing products compared" },
] as const;
