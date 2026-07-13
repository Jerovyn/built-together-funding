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

/** Replies from applicants/partners go to your public inbox (contact@). */
export function getResendReplyToEmail(): string | null {
  return (
    process.env.RESEND_REPLY_TO_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    null
  );
}

export function getInternalNotifyEmail(): string | null {
  return process.env.INTERNAL_NOTIFY_EMAIL?.trim() || null;
}

type OutboundEmail = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  replyTo?: string[];
};

/** Applies default reply-to; optional override (e.g. applicant email on internal alerts). */
export function withReplyTo(
  email: OutboundEmail,
  replyToOverride?: string | null,
): OutboundEmail {
  const reply =
    replyToOverride?.trim() ||
    getResendReplyToEmail() ||
    undefined;
  return reply ? { ...email, replyTo: [reply] } : email;
}
