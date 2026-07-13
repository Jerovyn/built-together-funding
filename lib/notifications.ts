import { DISCLAIMER_PREQUAL_LINE, SITE_NAME } from "@/lib/constants";
import type { ApplyFormValues, ApplySubmissionMeta } from "@/lib/apply-schema";
import { ownerFullName } from "@/lib/apply-schema";
import { createResendClient, getResendFromEmail, getInternalNotifyEmail, isResendConfigured, withReplyTo } from "@/lib/resend";
import {
  createTwilioClient,
  getTwilioFromNumber,
  isTwilioConfigured,
} from "@/lib/twilio";
import type { ApplyResultTier } from "@/types/apply";
import type { LeadDbStatus } from "@/types/apply";

export type ApplyNotificationContext = {
  form: ApplyFormValues;
  meta: ApplySubmissionMeta;
  leadScore: number;
  leadStatus: LeadDbStatus;
  tier: ApplyResultTier;
  /** Secure statement-upload link; set when the applicant chose "send later". */
  uploadUrl?: string | null;
};

export function compactSubmissionMeta(
  meta: ApplySubmissionMeta,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

function formatList(values: string[]): string {
  return values.map((v) => v.replaceAll("_", " ")).join(", ");
}

function statementsLine(form: ApplyFormValues): string {
  if (form.statementPaths.length > 0) {
    return `Statements: ${form.statementPaths.length} file(s) uploaded`;
  }
  return form.statementsSkipped
    ? "Statements: will send later (secure link sent)"
    : "Statements: none";
}

function buildInternalEmailText(ctx: ApplyNotificationContext): string {
  const { form, meta, leadScore, leadStatus } = ctx;
  const m = compactSubmissionMeta(meta);
  const lines = [
    `New ${SITE_NAME} application`,
    "",
    `Owner: ${ownerFullName(form)}`,
    `DOB: ${form.dob}`,
    `SSN: ${form.ssn.replace(/\D/g, "")}`,
    `Home: ${form.homeAddress}, ${form.homeState} ${form.homeZip}`,
    `Business: ${form.businessName}`,
    `Legal entity: ${form.legalEntity}`,
    `Federal ID: ${form.federalId.replace(/\D/g, "")}`,
    `Business address: ${form.businessAddress}, ${form.businessCity}, ${form.businessState} ${form.businessZip}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email}`,
    `Time in business: ${form.timeInBusiness}`,
    `Funding amount: ${form.fundingAmount}`,
    `Use of funds: ${formatList(form.useOfFunds)}`,
    statementsLine(form),
    "",
    `Lead score (pre-screen routing): ${leadScore}`,
    `Lead status: ${leadStatus}`,
  ];
  if (m.utm_source) lines.push(`UTM source: ${m.utm_source}`);
  if (m.utm_campaign) lines.push(`UTM campaign: ${m.utm_campaign}`);
  if (m.landing_page) lines.push(`Landing page: ${m.landing_page}`);
  lines.push("", DISCLAIMER_PREQUAL_LINE);
  return lines.join("\n");
}

function applicantConfirmationEmailBody(
  tier: ApplyResultTier,
  uploadUrl?: string | null,
): string {
  const uploadBlock = uploadUrl
    ? [
        "",
        "Next step: upload your last 3 months of bank statements with this secure link:",
        uploadUrl,
        "Your review moves fastest once we have them.",
      ]
    : [];

  switch (tier) {
    case "prequalified":
      return [
        `Based on your responses, it looks like your business may be a fit for a funding review. Our team will reach out to go over your options. This is not a funding approval. Final options are subject to review, underwriting, and partner availability.`,
        ...uploadBlock,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
    case "needs_review":
      return [
        `Thanks for completing your pre-screen. Your information needs manual review before we can suggest next steps.`,
        `Our team may follow up with a few questions. This is not a funding approval. Final options are subject to review, underwriting, and partner availability.`,
        ...uploadBlock,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
    case "not_fit_yet":
      return [
        `Thanks for completing your pre-screen. Based on your responses, this may not be the right fit yet.`,
        `If your business situation changes, you are welcome to reach out again in the future.`,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
  }
}

function applicantConfirmationSmsBody(
  tier: ApplyResultTier,
  uploadUrl?: string | null,
): string {
  const stop = "Reply STOP to opt out.";
  const uploadPart = uploadUrl
    ? ` Upload your bank statements securely here: ${uploadUrl}`
    : "";
  switch (tier) {
    case "prequalified":
      return `${SITE_NAME}: Based on your responses, your business may be a fit for a funding review.${uploadPart} This is not a funding approval. ${stop}`;
    case "needs_review":
      return `${SITE_NAME}: Thanks for your pre-screen. Our team will review your information and may follow up.${uploadPart} This is not a funding approval. ${stop}`;
    case "not_fit_yet":
      return `${SITE_NAME}: Thanks for your pre-screen. This may not be the right fit yet. ${stop}`;
  }
}

async function sendInternalEmail(ctx: ApplyNotificationContext): Promise<void> {
  const to = getInternalNotifyEmail();
  if (!to || !isResendConfigured()) {
    if (process.env.NODE_ENV === "development" && !isResendConfigured()) {
      console.warn("[apply] Resend not fully configured; skipping internal email.");
    }
    return;
  }
  const resend = createResendClient();
  const from = getResendFromEmail();
  if (!resend || !from) return;

  const subject = `New BTF application - ${ctx.form.businessName} - Score ${ctx.leadScore}`;
  const text = buildInternalEmailText(ctx);
  const { error } = await resend.emails.send(
    withReplyTo(
      {
        from,
        to: [to],
        subject,
        text,
      },
      ctx.form.email.trim(),
    ),
  );
  if (error && process.env.NODE_ENV === "development") {
    console.warn("[apply] Resend internal email error (dev only):", error.message);
  }
}

async function sendApplicantEmail(ctx: ApplyNotificationContext): Promise<void> {
  if (!isResendConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[apply] Resend not fully configured; skipping applicant email.");
    }
    return;
  }
  const resend = createResendClient();
  const from = getResendFromEmail();
  if (!resend || !from) return;

  const { error } = await resend.emails.send(
    withReplyTo({
      from,
      to: [ctx.form.email.trim()],
      subject: `We received your pre-screen - ${SITE_NAME}`,
      text: applicantConfirmationEmailBody(ctx.tier, ctx.uploadUrl),
    }),
  );
  if (error && process.env.NODE_ENV === "development") {
    console.warn("[apply] Resend applicant email error (dev only):", error.message);
  }
}

async function sendInternalSms(ctx: ApplyNotificationContext): Promise<void> {
  const to = process.env.INTERNAL_NOTIFY_PHONE?.trim();
  if (!to || !isTwilioConfigured()) {
    if (process.env.NODE_ENV === "development" && !isTwilioConfigured()) {
      console.warn("[apply] Twilio not configured; skipping SMS.");
    }
    return;
  }
  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  if (!client || !from) return;

  const body = `New BTF lead: ${ctx.form.businessName}. Pre-screen score ${ctx.leadScore}. Status ${ctx.leadStatus}. Check email for full details.`;
  try {
    await client.messages.create({ from, to, body });
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[apply] Twilio internal SMS error (dev only)");
    }
  }
}

async function sendApplicantSms(ctx: ApplyNotificationContext): Promise<void> {
  const { form, tier, uploadUrl } = ctx;
  if (!form.smsConsent || !isTwilioConfigured()) return;
  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  const to = form.phone.trim();
  if (!client || !from || !to) return;
  try {
    await client.messages.create({
      from,
      to,
      body: applicantConfirmationSmsBody(tier, uploadUrl),
    });
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[apply] Twilio applicant SMS error (dev only)");
    }
  }
}

/**
 * Sends internal + applicant notifications. Failures are swallowed so the API can
 * still return a safe success response after persistence.
 */
export async function sendApplyNotifications(
  ctx: ApplyNotificationContext,
): Promise<void> {
  await Promise.allSettled([
    sendInternalEmail(ctx),
    sendApplicantEmail(ctx),
    sendInternalSms(ctx),
    sendApplicantSms(ctx),
  ]);
}

export type BookingNotificationContext = {
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
  slotLabel: string;
};

export async function sendBookingNotifications(
  ctx: BookingNotificationContext,
): Promise<void> {
  const { firstName, businessName, email, phone, slotLabel } = ctx;

  if (isResendConfigured()) {
    const resend = createResendClient();
    const from = getResendFromEmail();
    if (resend && from) {
      const applicantText = [
        `Hi ${firstName || "there"},`,
        "",
        `Your funding review call with ${SITE_NAME} is booked:`,
        slotLabel,
        "",
        "We'll call you at the number on your file. If you need to reschedule, reply to our email or call us.",
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");

      await resend.emails.send(
        withReplyTo({
          from,
          to: [email],
          subject: `Funding review call booked — ${SITE_NAME}`,
          text: applicantText,
        }),
      );

      const internalTo = getInternalNotifyEmail();
      if (internalTo) {
        await resend.emails.send(
          withReplyTo(
            {
              from,
              to: [internalTo],
              subject: `CALL BOOKED — ${businessName}`,
              text: [
                `Funding review call booked.`,
                `Business: ${businessName}`,
                `When: ${slotLabel}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
              ].join("\n"),
            },
            email,
          ),
        );
      }
    }
  }

  if (isTwilioConfigured()) {
    const client = createTwilioClient();
    const from = getTwilioFromNumber();
    const internalPhone = process.env.INTERNAL_NOTIFY_PHONE?.trim();
    if (client && from && internalPhone) {
      try {
        await client.messages.create({
          from,
          to: internalPhone,
          body: `BTF call booked: ${businessName} — ${slotLabel}`,
        });
      } catch {
        /* silent */
      }
    }
  }
}
