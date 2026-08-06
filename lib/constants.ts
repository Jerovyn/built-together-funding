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
 * Primary funding CTA on conversion paths (hero, header, sticky bar).
 * Deliberately reads as "get information", not "submit to judgment" —
 * pre-qual language stays inside the funnel where compliance needs it.
 */
export const CTA_PREQUAL_LABEL = "See your options";

/** One quiet line under the primary CTA — replaces stacked trust chips. */
export const CTA_MICRO_LINE = "5 minutes · Won't affect your credit score";

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

/** Shown on apply page and FAQ — sets honest time expectations. */
export const APPLY_TIME_ESTIMATE =
  "About 5 minutes · one question at a time · EIN handy";

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
    a: "A few quick screens, about 5 minutes: what you need, contact, bank statements (now or later), then owner and business details. Have your EIN handy.",
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
