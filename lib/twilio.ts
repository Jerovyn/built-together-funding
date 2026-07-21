import twilio from "twilio";

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_PHONE_NUMBER?.trim(),
  );
}

export function createTwilioClient(): ReturnType<typeof twilio> | null {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export function getTwilioFromNumber(): string | null {
  return process.env.TWILIO_PHONE_NUMBER?.trim() || null;
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
