import twilio from "twilio";

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_PHONE_NUMBER?.trim(),
  );
}

/**
 * Twilio Account SIDs always start with AC. Bad values throw inside the SDK
 * constructor — catch so API routes return JSON instead of a hard 500.
 */
export function createTwilioClient(): ReturnType<typeof twilio> | null {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!sid || !token) return null;
  if (!sid.startsWith("AC")) {
    console.error(
      "[twilio] TWILIO_ACCOUNT_SID must start with AC (got length",
      sid.length,
      ")",
    );
    return null;
  }
  try {
    return twilio(sid, token);
  } catch (err) {
    console.error("[twilio] client create failed:", err);
    return null;
  }
}

export function getTwilioFromNumber(): string | null {
  const raw = process.env.TWILIO_PHONE_NUMBER?.trim() || null;
  if (!raw) return null;
  return toE164Phone(raw) || raw;
}

/**
 * Normalize US-ish numbers to E.164 for Twilio (+1…).
 * Leaves already-international (+…) numbers alone when digits look valid.
 */
export function toE164Phone(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length >= 10 ? `+${digits}` : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/**
 * Internal alert recipients. Supports one number or comma/semicolon-separated list.
 * Example: +17182852368,+13473034705
 */
export function getInternalNotifyPhones(): string[] {
  const raw = process.env.INTERNAL_NOTIFY_PHONE?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;]+/)
    .map((p) => toE164Phone(p.trim()) || p.trim())
    .filter(Boolean);
}
