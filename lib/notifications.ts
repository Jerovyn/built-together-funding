import { DISCLAIMER_PREQUAL_LINE, SITE_NAME } from "@/lib/constants";
import { REVIEW_DURATION_MINUTES } from "@/lib/booking/availability";
import type {
  ApplyFormValues,
  ApplySubmissionMeta,
  CalcSnapshot,
} from "@/lib/apply-schema";
import { ownerFullName } from "@/lib/apply-schema";
import { PRODUCT_INTEREST_LABELS } from "@/lib/products";
import { createResendClient, getResendFromEmail, getInternalNotifyEmail, isResendConfigured, withReplyTo } from "@/lib/resend";
import {
  createTwilioClient,
  getInternalNotifyPhones,
  getTwilioFromNumber,
  isTwilioConfigured,
  toE164Phone,
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
  /** Calculator numbers the applicant modeled before applying, if any. */
  calculator?: CalcSnapshot | null;
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

function calculatorLine(calc: CalcSnapshot | null | undefined): string | null {
  if (!calc) return null;
  const rate =
    calc.rateType === "factor" ? `${calc.rate.toFixed(2)}x` : `${calc.rate}% APR`;
  return `Calculator: modeled $${Math.round(calc.amount).toLocaleString("en-US")} over ${calc.termMonths} mo at ${rate} (~$${Math.round(calc.estPayment).toLocaleString("en-US")}/${calc.frequency})`;
}

function buildInternalEmailText(ctx: ApplyNotificationContext): string {
  const { form, meta, leadScore, leadStatus, calculator } = ctx;
  const m = compactSubmissionMeta(meta);
  const calcLine = calculatorLine(calculator);
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
    `Product interest: ${PRODUCT_INTEREST_LABELS[form.productInterest] ?? form.productInterest}`,
    ...(form.industry?.trim() ? [`Industry: ${form.industry.trim()}`] : []),
    `Time in business: ${form.timeInBusiness}`,
    `Monthly revenue: ${form.monthlyRevenue}`,
    `Funding amount: ${form.fundingAmount}`,
    `Use of funds: ${formatList(form.useOfFunds)}`,
    ...(calcLine ? [calcLine] : []),
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

function applicantEmailSubject(tier: ApplyResultTier): string {
  switch (tier) {
    case "prequalified":
      return `You may be a fit - next steps from ${SITE_NAME}`;
    case "needs_review":
      return `We're on it - your ${SITE_NAME} pre-screen is in review`;
    case "not_fit_yet":
      return `About your ${SITE_NAME} pre-screen`;
  }
}

function applicantConfirmationEmailBody(
  tier: ApplyResultTier,
  firstName: string,
  uploadUrl?: string | null,
): string {
  const greeting = `Hi ${firstName.trim() || "there"},`;
  const uploadBlock = uploadUrl
    ? [
        "",
        "Fastest next step: upload your last 3 months of bank statements with this secure link:",
        uploadUrl,
        "Your review moves to the front of the line once we have them.",
      ]
    : [];

  switch (tier) {
    case "prequalified":
      return [
        greeting,
        "",
        "Good news - based on your responses, your business may be a fit for a funding review.",
        "",
        "Here's what happens next: a real person on our team (not an algorithm) reviews your file, then reaches out to walk through your options together. No pressure, no obligation - just straight numbers so you can decide what's right for your business.",
        ...uploadBlock,
        "",
        "One honest note: this is not a funding approval. Final options depend on review, underwriting, and partner availability - we'd rather be upfront about that now than surprise you later.",
        "",
        "Talk soon,",
        `The ${SITE_NAME} team`,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
    case "needs_review":
      return [
        greeting,
        "",
        "Thanks for completing your pre-screen - your information is in and a real person is taking a closer look before we map out next steps.",
        "",
        "If anything needs clarifying, we'll reach out with a quick question or two.",
        ...uploadBlock,
        "",
        "One honest note: this is not a funding approval. Final options depend on review, underwriting, and partner availability.",
        "",
        "Talk soon,",
        `The ${SITE_NAME} team`,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
    case "not_fit_yet":
      return [
        greeting,
        "",
        "Thanks for taking the time to check your fit. Based on your responses, this may not be the right match just yet - and we'd rather tell you that straight than waste your time.",
        "",
        "Businesses change fast, though. If your revenue, time in business, or plans shift, you're always welcome back - we'll gladly take another look.",
        "",
        "Rooting for you,",
        `The ${SITE_NAME} team`,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");
  }
}

function applicantConfirmationSmsBody(
  tier: ApplyResultTier,
  firstName: string,
  uploadUrl?: string | null,
): string {
  const stop = "Reply STOP to opt out.";
  const name = firstName.trim() ? `, ${firstName.trim()}` : "";
  const uploadPart = uploadUrl
    ? ` Fastest next step: upload your bank statements securely here: ${uploadUrl}`
    : "";
  switch (tier) {
    case "prequalified":
      return `${SITE_NAME}: Good news${name} - your business may be a fit for a funding review. A real person is on your file and we'll reach out soon to walk through your options.${uploadPart} Not a funding approval yet. ${stop}`;
    case "needs_review":
      return `${SITE_NAME}: Thanks${name} - your pre-screen is in and a real person is taking a closer look. We may reach out with a quick question.${uploadPart} Not a funding approval yet. ${stop}`;
    case "not_fit_yet":
      return `${SITE_NAME}: Thanks for checking your fit${name}. It may not be the right timing yet, but things change fast - you're welcome back anytime. ${stop}`;
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
      subject: applicantEmailSubject(ctx.tier),
      text: applicantConfirmationEmailBody(ctx.tier, ctx.form.firstName, ctx.uploadUrl),
    }),
  );
  if (error && process.env.NODE_ENV === "development") {
    console.warn("[apply] Resend applicant email error (dev only):", error.message);
  }
}

async function sendInternalSms(ctx: ApplyNotificationContext): Promise<void> {
  const phones = getInternalNotifyPhones();
  if (!phones.length || !isTwilioConfigured()) {
    if (process.env.NODE_ENV === "development" && !isTwilioConfigured()) {
      console.warn("[apply] Twilio not configured; skipping SMS.");
    }
    return;
  }
  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  if (!client || !from) return;

  const product =
    PRODUCT_INTEREST_LABELS[ctx.form.productInterest] ?? ctx.form.productInterest;
  const body = `New BTF lead: ${ctx.form.businessName} (${product}). Pre-screen score ${ctx.leadScore}. Status ${ctx.leadStatus}. Check email for full details.`;
  await Promise.allSettled(
    phones.map(async (to) => {
      try {
        await client.messages.create({ from, to, body });
      } catch (err) {
        console.error("[apply] Twilio internal SMS failed:", to, err);
      }
    }),
  );
}

async function sendApplicantSms(ctx: ApplyNotificationContext): Promise<void> {
  const { form, tier, uploadUrl } = ctx;
  if (!form.smsConsent || !isTwilioConfigured()) return;
  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  const to = toE164Phone(form.phone);
  if (!client || !from || !to) {
    if (!to) console.error("[apply] Applicant phone not E.164-compatible:", form.phone);
    return;
  }
  try {
    await client.messages.create({
      from,
      to,
      body: applicantConfirmationSmsBody(tier, form.firstName, uploadUrl),
    });
  } catch (err) {
    console.error("[apply] Twilio applicant SMS failed:", err);
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

export type StageANotificationContext = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timeInBusiness: string;
  fundingAmount: string;
  monthlyRevenue: string;
  useOfFunds: string[];
  productInterest: string;
  industry?: string;
  leadScore: number;
  leadStatus: LeadDbStatus;
  tier: ApplyResultTier;
  smsConsent: boolean;
  meta: ApplySubmissionMeta;
  calculator?: CalcSnapshot | null;
};

/** Stage A prequal — no SSN/EIN/business packet yet. */
export async function sendStageANotifications(
  ctx: StageANotificationContext,
): Promise<void> {
  const name = `${ctx.firstName.trim()} ${ctx.lastName.trim()}`.trim();
  const m = compactSubmissionMeta(ctx.meta);
  const calcLine = calculatorLine(ctx.calculator);
  const product =
    PRODUCT_INTEREST_LABELS[
      ctx.productInterest as keyof typeof PRODUCT_INTEREST_LABELS
    ] ?? ctx.productInterest;

  await Promise.allSettled([
    (async () => {
      const to = getInternalNotifyEmail();
      if (!to || !isResendConfigured()) return;
      const resend = createResendClient();
      const from = getResendFromEmail();
      if (!resend || !from) return;
      const lines = [
        `New ${SITE_NAME} Stage A prequal`,
        "",
        `Owner: ${name}`,
        `Phone: ${ctx.phone}`,
        `Email: ${ctx.email}`,
        `Product interest: ${product}`,
        ...(ctx.industry?.trim() ? [`Industry: ${ctx.industry.trim()}`] : []),
        `Time in business: ${ctx.timeInBusiness}`,
        `Monthly revenue: ${ctx.monthlyRevenue}`,
        `Funding amount: ${ctx.fundingAmount}`,
        `Use of funds: ${formatList(ctx.useOfFunds)}`,
        ...(calcLine ? [calcLine] : []),
        "",
        `Lead score (pre-screen routing): ${ctx.leadScore}`,
        `Lead status: ${ctx.leadStatus}`,
        "File: Stage A only — statements / SSN / EIN not collected yet.",
      ];
      if (m.utm_source) lines.push(`UTM source: ${m.utm_source}`);
      if (m.landing_page) lines.push(`Landing page: ${m.landing_page}`);
      lines.push("", DISCLAIMER_PREQUAL_LINE);
      try {
        await resend.emails.send(
          withReplyTo({
            from,
            to: [to],
            subject: `Stage A prequal - ${name} - Score ${ctx.leadScore}`,
            text: lines.join("\n"),
          }),
        );
      } catch (e) {
        console.error("[apply/stage-a] Internal email failed:", e);
      }
    })(),
    (async () => {
      if (!isResendConfigured()) return;
      const resend = createResendClient();
      const from = getResendFromEmail();
      if (!resend || !from) return;
      try {
        await resend.emails.send(
          withReplyTo({
            from,
            to: [ctx.email.trim()],
            subject: applicantEmailSubject(ctx.tier),
            text: applicantConfirmationEmailBody(ctx.tier, ctx.firstName, null),
          }),
        );
      } catch (e) {
        console.error("[apply/stage-a] Applicant email failed:", e);
      }
    })(),
    (async () => {
      if (!isTwilioConfigured()) return;
      const from = getTwilioFromNumber();
      const client = createTwilioClient();
      if (!from || !client) return;
      for (const to of getInternalNotifyPhones()) {
        try {
          await client.messages.create({
            from,
            to,
            body: `BTF Stage A: ${name} (${product}). Score ${ctx.leadScore}. Status ${ctx.leadStatus}. Full file not yet.`,
          });
        } catch (e) {
          console.error("[apply/stage-a] Internal SMS failed:", e);
        }
      }
    })(),
    (async () => {
      if (!ctx.smsConsent || !isTwilioConfigured()) return;
      const from = getTwilioFromNumber();
      const client = createTwilioClient();
      const to = toE164Phone(ctx.phone);
      if (!from || !client || !to) return;
      try {
        await client.messages.create({
          from,
          to,
          body: applicantConfirmationSmsBody(ctx.tier, ctx.firstName, null),
        });
      } catch (e) {
        console.error("[apply/stage-a] Applicant SMS failed:", e);
      }
    })(),
  ]);
}

export type BookingNotificationContext = {
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
  slotLabel: string;
  meetLink?: string | null;
  calendarHtmlLink?: string | null;
  /** Internal-only reason when Meet was not attached (never shown to applicant). */
  meetError?: string | null;
  /** Only text the applicant when they opted in on the apply form. */
  smsConsent?: boolean;
};

export async function sendBookingNotifications(
  ctx: BookingNotificationContext,
): Promise<void> {
  const {
    firstName,
    businessName,
    email,
    phone,
    slotLabel,
    meetLink,
    calendarHtmlLink,
    meetError,
    smsConsent,
  } = ctx;

  if (isResendConfigured()) {
    const resend = createResendClient();
    const from = getResendFromEmail();
    if (resend && from) {
      const meetLines = meetLink
        ? ["", `Join with Google Meet:`, meetLink]
        : [];
      const calendarLines = calendarHtmlLink
        ? ["", `Add / open in Google Calendar:`, calendarHtmlLink]
        : [];

      const applicantText = [
        `Hi ${firstName || "there"},`,
        "",
        "You're all set - your funding review call is on the calendar:",
        "",
        slotLabel,
        ...meetLines,
        ...calendarLines,
        "",
        `What to expect: about ${REVIEW_DURATION_MINUTES} minutes with a real person (not a call center). We'll go over your file and your numbers, then walk through the options that actually make sense for your business. Bring any questions - and if you haven't sent your bank statements yet, uploading them before the call speeds everything up.`,
        "",
        meetLink
          ? "You'll also receive a Google Calendar invite. Need a different time? Just reply to this email and we'll find one that works."
          : "Need a different time? Just reply to this email and we'll find one that works.",
        "",
        "Talk soon,",
        `The ${SITE_NAME} team`,
        "",
        DISCLAIMER_PREQUAL_LINE,
      ].join("\n");

      try {
        await resend.emails.send(
          withReplyTo({
            from,
            to: [email],
            subject: `You're booked: ${slotLabel} - ${SITE_NAME}`,
            text: applicantText,
          }),
        );
      } catch (err) {
        console.error("[booking] applicant email failed:", err);
      }

      const internalTo = getInternalNotifyEmail();
      if (internalTo) {
        try {
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
                  meetLink
                    ? `Meet: ${meetLink}`
                    : meetError
                      ? `Meet: not created — ${meetError}`
                      : "Meet: not created (connect Google in admin Settings, then run Test Meet)",
                ].join("\n"),
              },
              email,
            ),
          );
        } catch (err) {
          console.error("[booking] internal email failed:", err);
        }
      }
    }
  }

  if (!isTwilioConfigured()) return;

  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  if (!client || !from) return;

  const phones = getInternalNotifyPhones();
  if (phones.length) {
    const body = `BTF call booked: ${businessName} — ${slotLabel}${meetLink ? ` Meet: ${meetLink}` : ""}`;
    await Promise.allSettled(
      phones.map(async (to) => {
        try {
          await client.messages.create({ from, to, body });
        } catch (err) {
          console.error("[booking] Twilio internal SMS failed:", to, err);
        }
      }),
    );
  }

  if (smsConsent) {
    const to = toE164Phone(phone);
    if (!to) {
      console.error("[booking] Applicant phone not E.164-compatible:", phone);
      return;
    }
    const namePart = firstName.trim() ? `, ${firstName.trim()}` : "";
    const meetPart = meetLink ? ` Join here: ${meetLink}` : "";
    const body = `${SITE_NAME}: You're all set${namePart}! Your funding review call is booked for ${slotLabel}.${meetPart} You'll be talking with a real person - bring any questions. Talk soon! Reply STOP to opt out.`;
    try {
      await client.messages.create({ from, to, body });
    } catch (err) {
      console.error("[booking] Twilio applicant SMS failed:", err);
    }
  }
}
