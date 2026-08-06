import type { ApplyFormValues } from "@/lib/apply-schema";
import type { ApplyResultTier, LeadDbStatus } from "@/types/apply";

type ScoreInput = Pick<
  ApplyFormValues,
  | "timeInBusiness"
  | "useOfFunds"
  | "statementPaths"
  | "statementsSkipped"
  | "fundingAmount"
  | "productInterest"
  | "monthlyRevenue"
>;

/**
 * Pre-screen routing score (not underwriting). Stage A soft-skips statements
 * (+5). Uploading in Stage B adds the full +30. Backend POST /api/apply and
 * Stage A reuses this for parity.
 */
export function computeApplyScore(values: ScoreInput): number {
  let score = 0;

  switch (values.timeInBusiness) {
    case "2yr_plus":
      score += 35;
      break;
    case "12_24mo":
      score += 25;
      break;
    case "6_12mo":
      score += 12;
      break;
    case "under_6mo":
      score -= 30;
      break;
    default:
      break;
  }

  const selected = new Set(values.useOfFunds);
  const hasGrowthUse = values.useOfFunds.some(
    (u) =>
      u === "equipment" ||
      u === "trucks" ||
      u === "hiring_crews" ||
      u === "marketing_ads" ||
      u === "acquisition_expansion" ||
      u === "property_project",
  );
  const onlyOther = selected.size === 1 && selected.has("other");

  if (onlyOther) {
    score -= 10;
  } else if (hasGrowthUse) {
    score += 25;
  } else if (selected.size > 0) {
    score += 12;
  }

  switch (values.monthlyRevenue) {
    case "250k_plus":
      score += 25;
      break;
    case "100k_250k":
      score += 22;
      break;
    case "50k_100k":
      score += 18;
      break;
    case "25k_50k":
      score += 12;
      break;
    case "10k_25k":
      score += 5;
      break;
    case "under_10k":
      score -= 15;
      break;
    default:
      break;
  }

  // Statements provided up front are the strongest intent + review signal.
  if (values.statementPaths.length > 0) {
    score += 30;
  } else if (values.statementsSkipped) {
    score += 5;
  }

  if (values.fundingAmount) score += 5;

  // Picking a concrete product signals researched intent; "not sure" is neutral.
  if (values.productInterest && values.productInterest !== "not_sure") {
    score += 5;
  }

  return score;
}

export function getApplyResultTier(score: number): ApplyResultTier {
  if (score >= 70) return "prequalified";
  if (score >= 40) return "needs_review";
  return "not_fit_yet";
}

/** Maps pre-screen tier to the row value persisted in `leads.lead_status`. */
export function mapTierToLeadStatus(tier: ApplyResultTier): LeadDbStatus {
  if (tier === "not_fit_yet") return "not_fit";
  return tier;
}

/** Safe user-facing line returned from POST /api/apply (no score, no internals). */
export function getApplyApiUserMessage(tier: ApplyResultTier): string {
  switch (tier) {
    case "prequalified":
      return "Your business may be a fit for a funding review.";
    case "needs_review":
      return "Your application needs manual review.";
    case "not_fit_yet":
      return "This may not be the right fit yet.";
  }
}
