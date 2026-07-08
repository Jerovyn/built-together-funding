import type { ApplyFormValues } from "@/lib/apply-schema";
import type { ApplyResultTier, LeadDbStatus } from "@/types/apply";

/**
 * Pre-screen routing score (not underwriting). With the short funnel, bank
 * statements are the real signal; this score only routes follow-up priority.
 * Backend POST /api/apply reuses this function for parity.
 */
export function computeApplyScore(values: ApplyFormValues): number {
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
      u === "marketing_ads",
  );
  const onlyOther = selected.size === 1 && selected.has("other");

  if (onlyOther) {
    score -= 10;
  } else if (hasGrowthUse) {
    score += 25;
  } else if (selected.size > 0) {
    score += 12;
  }

  // Statements provided up front are the strongest intent + review signal.
  if (values.statementPaths.length > 0) {
    score += 30;
  } else if (values.statementsSkipped) {
    score += 5;
  }

  if (values.fundingAmount) score += 5;

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
