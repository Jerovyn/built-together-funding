import type { ApplyFormValues } from "@/lib/apply-schema";

export type ApplyResultTier = "prequalified" | "needs_review" | "not_fit_yet";

/** Stored in `public.leads.statements_status`. */
export type StatementsStatus = "pending" | "received" | "skipped";

/** Stored in `public.leads.lead_status` (client tier `not_fit_yet` maps to `not_fit`). */
export type LeadDbStatus =
  | "new"
  | "partial"
  | "prequalified"
  | "needs_review"
  | "not_fit"
  | "contacted"
  | "call_booked"
  | "submitted_to_partner"
  | "funded"
  | "lost";

export type { ApplyFormValues };
