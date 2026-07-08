import type { ApplySubmissionMeta } from "@/lib/apply-schema";

const STORAGE_KEY = "btf.tracking.v1";

const PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

type ParamKey = (typeof PARAM_KEYS)[number];

export type SessionAttribution = Partial<Record<ParamKey, string>> & {
  /** First path + search in the session (max length enforced on write). */
  landing_page?: string;
  /** `document.referrer` when first captured. */
  referrer?: string;
};

function readRaw(): SessionAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SessionAttribution;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRaw(data: SessionAttribution): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

function clamp(v: string, max: number): string {
  const t = v.trim();
  if (t.length <= max) return t;
  return t.slice(0, max);
}

/**
 * Reads URL params and merges into session attribution. Sets first-touch
 * `landing_page` and `referrer` once per session. Safe to call on every navigation.
 */
export function captureAttributionFromWindow(): void {
  if (typeof window === "undefined") return;

  const existing = readRaw();
  const params = new URLSearchParams(window.location.search);
  const next: SessionAttribution = { ...existing };

  for (const key of PARAM_KEYS) {
    const v = params.get(key);
    if (v) next[key] = clamp(v, 500);
  }

  if (!next.landing_page) {
    const path = `${window.location.pathname}${window.location.search}`;
    next.landing_page = clamp(path, 2000);
  }

  if (!next.referrer && typeof document !== "undefined" && document.referrer) {
    try {
      const r = new URL(document.referrer);
      next.referrer = clamp(`${r.origin}${r.pathname}`, 2000);
    } catch {
      next.referrer = clamp(document.referrer, 2000);
    }
  }

  writeRaw(next);
}

function deriveSource(s: SessionAttribution): string | undefined {
  if (s.gclid) return "google_ads";
  if (s.fbclid) return "meta_ads";
  if (s.utm_source) return clamp(s.utm_source, 200);
  if (s.referrer) return "referral";
  return "direct";
}

/** Payload merged into POST /api/apply (snake_case meta fields). */
export function getTrackingPayloadForApply(): ApplySubmissionMeta {
  const s = readRaw();
  return {
    utm_source: s.utm_source,
    utm_medium: s.utm_medium,
    utm_campaign: s.utm_campaign,
    utm_content: s.utm_content,
    utm_term: s.utm_term,
    gclid: s.gclid,
    fbclid: s.fbclid,
    landing_page: s.landing_page,
    source: deriveSource(s),
  };
}

/**
 * Non-PII attribution fields for analytics events (utm + landing + source).
 */
export function getAttributionEventProps(): Record<string, string> {
  const s = readRaw();
  const out: Record<string, string> = {};
  if (s.utm_source) out.utm_source = s.utm_source;
  if (s.utm_medium) out.utm_medium = s.utm_medium;
  if (s.utm_campaign) out.utm_campaign = s.utm_campaign;
  if (s.utm_content) out.utm_content = s.utm_content;
  if (s.utm_term) out.utm_term = s.utm_term;
  if (s.gclid) out.gclid = s.gclid;
  if (s.fbclid) out.fbclid = s.fbclid;
  if (s.landing_page) out.landing_page = s.landing_page;
  const src = deriveSource(s);
  if (src) out.source = src;
  return out;
}

/** True when session has paid-traffic click IDs or UTM medium typical of ads. */
export function isPaidTrafficSession(): boolean {
  const s = readRaw();
  if (s.gclid || s.fbclid) return true;
  const medium = s.utm_medium?.toLowerCase() ?? "";
  return medium === "cpc" || medium === "ppc" || medium === "paid";
}

/** Current path for event context (not persisted as PII). */
export function getCurrentPagePath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}
