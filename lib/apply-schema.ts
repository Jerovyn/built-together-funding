import { z } from "zod";
import { STATEMENT_MAX_FILES } from "@/lib/statements";

export const TIME_IN_BUSINESS_VALUES = [
  "under_6mo",
  "6_12mo",
  "12_24mo",
  "2yr_plus",
] as const;

export const FUNDING_AMOUNT_VALUES = [
  "under_25k",
  "25k_75k",
  "75k_150k",
  "150k_300k",
  "300k_750k",
  "750k_2m",
  "2m_plus",
] as const;

/** Approximate monthly business revenue — primary MCA/cash-flow signal. */
export const MONTHLY_REVENUE_VALUES = [
  "under_10k",
  "10k_25k",
  "25k_50k",
  "50k_100k",
  "100k_250k",
  "250k_plus",
] as const;

/** Financing product the applicant is interested in (see lib/products.ts). */
export const PRODUCT_INTEREST_VALUES = [
  "working_capital",
  "term_loan",
  "line_of_credit",
  "equipment_financing",
  "sba_loan",
  "mca_consolidation",
  "acquisition",
  "commercial_real_estate",
  "not_sure",
] as const;

export const USE_OF_FUND_VALUES = [
  "equipment",
  "trucks",
  "hiring_crews",
  "marketing_ads",
  "wc_growth",
  "debt_consolidation",
  "acquisition_expansion",
  "property_project",
  "other",
] as const;

export const LEGAL_ENTITY_VALUES = [
  "sole_prop",
  "llc",
  "s_corp",
  "c_corp",
  "partnership",
  "other",
] as const;

/** 50 states + DC + PR. Keeps junk like "XX" out of the leads table. */
export const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
  "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
  "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY",
] as const;

const DIGITS_ONLY = /\D/g;

function digitsOnly(value: string): string {
  return value.replace(DIGITS_ONLY, "");
}

/**
 * Parses "MM/DD/YYYY" or ISO "YYYY-MM-DD" strictly (no JS date rollover,
 * so 02/30/1990 is rejected). Returns null when invalid.
 */
export function parseDobString(value: string): Date | null {
  const v = value.trim();
  let year: number, month: number, day: number;

  const us = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (us) {
    month = Number(us[1]);
    day = Number(us[2]);
    year = Number(us[3]);
  } else if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    return null;
  }

  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

function dobToIso(value: string): string {
  const d = parseDobString(value);
  if (!d) return value;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function isValidPastDate(value: string): boolean {
  const d = parseDobString(value);
  if (!d) return false;
  return d.getTime() <= Date.now();
}

function isAdult(value: string): boolean {
  const d = parseDobString(value);
  if (!d) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return d <= cutoff;
}

const stateSchema = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .refine(
    (v): v is (typeof US_STATE_CODES)[number] =>
      (US_STATE_CODES as readonly string[]).includes(v),
    { message: "Enter a 2-letter state code (e.g. NY)" },
  );

const zipSchema = z
  .string()
  .trim()
  .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code");

const ssnSchema = z
  .string()
  .trim()
  .refine((v) => digitsOnly(v).length === 9, {
    message: "Enter a 9-digit Social Security number",
  });

const federalIdSchema = z
  .string()
  .trim()
  .refine((v) => digitsOnly(v).length === 9, {
    message: "Enter a 9-digit Federal ID (EIN)",
  });

const phoneSchema = z
  .string()
  .trim()
  .max(32, "Phone number is too long")
  .refine(
    (v) => {
      let d = digitsOnly(v);
      if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
      return d.length === 10;
    },
    { message: "Enter a valid 10-digit phone number" },
  );

const dobSchema = z
  .string()
  .min(1, "Enter your date of birth")
  .refine(isValidPastDate, { message: "Enter a valid date of birth (MM/DD/YYYY)" })
  .refine(isAdult, { message: "You must be at least 18" })
  .transform(dobToIso);

/**
 * Apply funnel: Stage A (use / amount / revenue / time / contact) then
 * Stage B (statements / identity / business / confirm). Product defaults to
 * "not_sure" — we route; owners shouldn't pick a financing taxonomy first.
 */
const applyFormObject = z.object({
  productInterest: z.enum(PRODUCT_INTEREST_VALUES, {
    message: "Select a funding type (or \u201cNot sure yet\u201d)",
  }),
  timeInBusiness: z.enum(TIME_IN_BUSINESS_VALUES, {
    message: "Select time in business",
  }),
  fundingAmount: z.enum(FUNDING_AMOUNT_VALUES, {
    message: "Select a funding range",
  }),
  monthlyRevenue: z.enum(MONTHLY_REVENUE_VALUES, {
    message: "Select your approximate monthly revenue",
  }),
  useOfFunds: z
    .array(z.enum(USE_OF_FUND_VALUES))
    .min(1, "Select at least one use of funds"),
  /** Optional trade/industry — helps routing and the review call. */
  industry: z.string().trim().max(80).optional().default(""),

  statementPaths: z
    .array(z.string().min(1).max(600))
    .max(STATEMENT_MAX_FILES, "Too many files"),
  statementsSkipped: z.boolean(),

  firstName: z.string().trim().min(1, "Enter your first name"),
  lastName: z.string().trim().min(1, "Enter your last name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: phoneSchema,
  dob: dobSchema,
  ssn: ssnSchema,
  homeAddress: z.string().trim().min(3, "Enter your home address"),
  homeState: stateSchema,
  homeZip: zipSchema,

  businessName: z.string().trim().min(2, "Enter your business name"),
  federalId: federalIdSchema,
  legalEntity: z
    .string()
    .min(1, "Select your legal entity type")
    .refine(
      (v): v is (typeof LEGAL_ENTITY_VALUES)[number] =>
        (LEGAL_ENTITY_VALUES as readonly string[]).includes(v),
      { message: "Select your legal entity type" },
    ),
  businessAddress: z.string().trim().min(3, "Enter your company address"),
  businessCity: z.string().trim().min(2, "Enter city"),
  businessState: stateSchema,
  businessZip: zipSchema,

  emailConsent: z.boolean().refine((v) => v === true, {
    message: "Email consent is required to submit your pre-screen.",
  }),
  smsConsent: z.boolean(),
});

function statementsChosen(
  data: { statementPaths: string[]; statementsSkipped: boolean },
  ctx: z.RefinementCtx,
) {
  if (data.statementPaths.length === 0 && !data.statementsSkipped) {
    ctx.addIssue({
      code: "custom",
      path: ["statementsSkipped"],
      message: "Upload statements or choose to send them later.",
    });
  }
}

export const applyFormSchema = applyFormObject.superRefine(statementsChosen);

export type ApplyFormValues = z.infer<typeof applyFormObject>;

export function ownerFullName(
  form: Pick<ApplyFormValues, "firstName" | "lastName">,
): string {
  return `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
}

/**
 * Snapshot of the funding calculator state when the applicant clicked through.
 * Stored on the lead so the review call starts from what they modeled.
 */
export const calcSnapshotSchema = z.object({
  product: z.enum(PRODUCT_INTEREST_VALUES),
  amount: z.number().min(0).max(50_000_000),
  termMonths: z.number().min(1).max(600),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  rateType: z.enum(["factor", "apr"]),
  rate: z.number().min(0).max(100),
  estPayment: z.number().min(0).max(50_000_000),
  totalRepayment: z.number().min(0).max(100_000_000),
});

export type CalcSnapshot = z.infer<typeof calcSnapshotSchema>;

/** Optional attribution fields accepted by POST /api/apply. */
export const applySubmissionMetaFields = z.object({
  utm_source: z.string().max(500).optional(),
  utm_medium: z.string().max(500).optional(),
  utm_campaign: z.string().max(500).optional(),
  utm_content: z.string().max(500).optional(),
  utm_term: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
  fbclid: z.string().max(500).optional(),
  landing_page: z.string().max(2000).optional(),
  source: z.string().max(200).optional(),
});

export type ApplySubmissionMeta = z.infer<typeof applySubmissionMetaFields>;

export const applyApiBodySchema = applyFormObject
  .merge(applySubmissionMetaFields)
  .extend({
    /** Set when a partial lead row was created mid-funnel; server finalizes it. */
    partialLeadId: z.string().uuid().optional(),
    /** Calculator state carried into the funnel, when the visitor used it. */
    calculator: calcSnapshotSchema.optional(),
  })
  .superRefine(statementsChosen);

export type ApplyApiBody = z.infer<typeof applyApiBodySchema>;

export function splitApplyApiPayload(data: ApplyApiBody): {
  form: ApplyFormValues;
  meta: ApplySubmissionMeta;
  partialLeadId: string | null;
  calculator: CalcSnapshot | null;
} {
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    landing_page,
    source,
    partialLeadId,
    calculator,
    ...form
  } = data;
  return {
    form: form as ApplyFormValues,
    meta: {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      gclid,
      fbclid,
      landing_page,
      source,
    },
    partialLeadId: partialLeadId ?? null,
    calculator: calculator ?? null,
  };
}

/**
 * Partial / Stage A lead capture. Never SSN/EIN.
 * Statements are soft-skipped for Stage A scoring (+5 intent) until Stage B.
 */
export const applyPartialBodySchema = z
  .object({
    productInterest: z.enum(PRODUCT_INTEREST_VALUES),
    timeInBusiness: z.enum(TIME_IN_BUSINESS_VALUES),
    fundingAmount: z.enum(FUNDING_AMOUNT_VALUES),
    monthlyRevenue: z.enum(MONTHLY_REVENUE_VALUES),
    useOfFunds: z.array(z.enum(USE_OF_FUND_VALUES)).min(1),
    industry: z.string().trim().max(80).optional().default(""),
    statementPaths: z.array(z.string().min(1).max(600)).max(STATEMENT_MAX_FILES),
    statementsSkipped: z.boolean(),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: phoneSchema,
    emailConsent: z.boolean().optional(),
    smsConsent: z.boolean().optional(),
    partialLeadId: z.string().uuid().optional(),
    calculator: calcSnapshotSchema.optional(),
  })
  .merge(applySubmissionMetaFields);

export type ApplyPartialBody = z.infer<typeof applyPartialBodySchema>;

/** Stage A POST body — same shape as partial; server scores and returns tier. */
export const applyStageABodySchema = applyPartialBodySchema;

export type ApplyStageABody = z.infer<typeof applyStageABodySchema>;

/**
 * Stage A (0–4): use → amount → revenue → time → contact → soft result.
 * Stage B (5–8): statements → identity → business → confirm full file.
 */
export const APPLY_STEP_FIELDS = [
  ["useOfFunds"] as const,
  ["fundingAmount"] as const,
  ["monthlyRevenue"] as const,
  ["timeInBusiness", "industry"] as const,
  ["firstName", "lastName", "email", "phone", "emailConsent", "smsConsent"] as const,
  ["statementPaths", "statementsSkipped"] as const,
  ["dob", "homeAddress", "homeState", "homeZip", "ssn"] as const,
  [
    "businessName",
    "federalId",
    "legalEntity",
    "businessAddress",
    "businessCity",
    "businessState",
    "businessZip",
  ] as const,
  [] as const,
] as const;

export const APPLY_STEP_COUNT = APPLY_STEP_FIELDS.length;

/** Last index of Stage A (contact). Soft result fires after this step. */
export const STAGE_A_LAST_INDEX = 4;

/** First index of Stage B (statements). */
export const STAGE_B_FIRST_INDEX = 5;

export const STAGE_A_STEP_COUNT = STAGE_A_LAST_INDEX + 1;
export const STAGE_B_STEP_COUNT = APPLY_STEP_COUNT - STAGE_B_FIRST_INDEX;

export const APPLY_STEP_LABELS = [
  "What it's for",
  "Amount",
  "Revenue",
  "Time in business",
  "Contact",
  "Bank statements",
  "About you",
  "Your business",
  "Confirm",
] as const;
