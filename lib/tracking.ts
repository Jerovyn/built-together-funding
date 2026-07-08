import type { ApplyResultTier } from "@/types/apply";

export type TrackEventName =
  | "cta_click"
  | "phone_click"
  | "apply_start"
  | "apply_step_complete"
  | "apply_field_error"
  | "apply_partial_saved"
  | "apply_submit"
  | "apply_result_prequalified"
  | "apply_result_needs_review"
  | "apply_result_not_fit_yet"
  | "booking_view"
  | "booking_confirmed"
  | "calc_interacted"
  | "splash_skip"
  | "splash_complete"
  | "splash_sound_on"
  | "guide_open";

/** Only non-PII primitives for vendor callbacks. */
export type TrackEventProps = Partial<{
  step: number;
  field: string;
  result_tier: ApplyResultTier;
  time_in_business: string;
  funding_amount: string;
  use_of_funds: string[];
  statements_provided: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  fbclid: string;
  landing_page: string;
  source: string;
  label: string;
  location: string;
  destination_path: string;
  page_path: string;
}>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function toGtagParams(props: TrackEventProps): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined) continue;
    out[k] = v;
  }
  return out;
}

function getGoogleAdsSendTo(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
  if (!id || !label) return null;
  return `${id}/${label}`;
}

/**
 * Pushes a safe event to dataLayer, gtag (GA4 / Ads config), and Meta Pixel.
 * Never throws.
 */
export function trackEvent(
  event: TrackEventName,
  props: TrackEventProps = {},
): void {
  if (typeof window === "undefined") return;
  try {
    const payload = toGtagParams(props);
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });

    if (typeof window.gtag === "function") {
      window.gtag("event", event, payload);
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", event, payload);
    }
  } catch {
    /* fail silently */
  }
}

/**
 * Fires the Google Ads conversion tag after a successful apply API response.
 * Gated to qualified tiers so Ads never optimizes toward leads we decline.
 * Optional: requires both Ads ID and conversion label in env.
 */
export function trackApplyAdsConversion(tier: ApplyResultTier): void {
  if (typeof window === "undefined") return;
  if (tier === "not_fit_yet") return;
  const sendTo = getGoogleAdsSendTo();
  if (!sendTo || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", { send_to: sendTo });
  } catch {
    /* silent */
  }
}

export function resultTierToEventName(
  tier: ApplyResultTier,
): TrackEventName {
  switch (tier) {
    case "prequalified":
      return "apply_result_prequalified";
    case "needs_review":
      return "apply_result_needs_review";
    case "not_fit_yet":
      return "apply_result_not_fit_yet";
  }
}
