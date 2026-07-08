import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_FROM_EMAIL?.trim(),
  );
}

export function createResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function getResendFromEmail(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  return from || null;
}
