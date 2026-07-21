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
 * Internal alert recipients. Supports one number or comma/semicolon-separated list.
 * Example: +17182852368,+13473034705
 */
export function getInternalNotifyPhones(): string[] {
  const raw = process.env.INTERNAL_NOTIFY_PHONE?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
