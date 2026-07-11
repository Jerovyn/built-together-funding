export const SITE_NAME = "Built Together Funding";

export const SITE_DESCRIPTION =
  "We fund service businesses that have more work than they can handle. Pre-qualification is not funding approval.";

/** Core brand message. Use at key moments: footer, brand band, funnel intro, final CTA. */
export const BRAND_LINE = "Funding is a commitment to growth.";

/** Homepage hero only — reads after header logo: "Built Together Funding where…" */
export const HERO_BRAND_LINE = "Where funding is a commitment to growth.";

/** Primary funding CTA on conversion paths (hero, header, sticky bar). */
export const CTA_PREQUAL_LABEL = "Get pre-qualified";

/** Homepage opening splash — mobile and desktop cuts. */
export const OPENING_SPLASH_VIDEO_MOBILE =
  "/opening%20screen/opening%20scene%20mobile.mp4?v=1";
export const OPENING_SPLASH_VIDEO_DESKTOP =
  "/opening%20screen/opening%20scene%20desktop.mp4?v=1";
/** @deprecated Use OPENING_SPLASH_VIDEO_MOBILE */
export const OPENING_SPLASH_VIDEO_PORTRAIT = OPENING_SPLASH_VIDEO_MOBILE;
/** @deprecated Use OPENING_SPLASH_VIDEO_DESKTOP */
export const OPENING_SPLASH_VIDEO_LANDSCAPE = OPENING_SPLASH_VIDEO_DESKTOP;
/** Optional still shown while the clip buffers. */
export const OPENING_SPLASH_POSTER_PORTRAIT =
  "/opening%20screen/opening-scene-9x16-poster.jpg?v=1";
export const OPENING_SPLASH_POSTER_LANDSCAPE =
  "/opening%20screen/opening-scene-16x9-poster.jpg?v=1";

/**
 * Credit-impact line (verified against MCA industry standard: pre-qual uses no
 * pull; partner underwriting typically starts with a soft pull).
 */
export const CREDIT_CHECK_LINE =
  "Pre-qualifying here does not affect your credit score. If a funding partner needs a credit check during final underwriting, you will know before anything runs.";

/** Short trust-chip version of the credit line. */
export const CREDIT_CHECK_SHORT = "Won't affect your credit score";

export const NAV_LINKS = [
  { href: "/how-it-works/", label: "How It Works" },
  { href: "/who-we-help/", label: "Who We Help" },
  { href: "/funding-uses/", label: "Funding Uses" },
  { href: "/about/", label: "About" },
  { href: "/resources/", label: "Resources" },
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
  "About 4–5 minutes · 5 steps · EIN handy";

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
    q: "What do you need?",
    a: "Five steps, about 4–5 minutes: three funding questions, bank statements (upload now or secure link later), owner and business details, then confirm. Have your EIN handy.",
  },
  {
    q: "What are the minimum requirements?",
    a: HOME_MIN_REQUIREMENTS.join(" · "),
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
