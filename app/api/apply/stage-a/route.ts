import { NextResponse } from "next/server";
import {
  applyStageABodySchema,
  ownerFullName,
  type ApplyStageABody,
  type ApplySubmissionMeta,
  type CalcSnapshot,
} from "@/lib/apply-schema";
import {
  computeApplyScore,
  getApplyApiUserMessage,
  getApplyResultTier,
  mapTierToLeadStatus,
} from "@/lib/apply-scoring";
import { DEV_BOOKING_TOKEN } from "@/lib/booking/dev";
import { sendStageANotifications } from "@/lib/notifications";
import { buildFinishFileUrl, buildUploadUrl } from "@/lib/site-url";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { LeadDbStatus } from "@/types/apply";

export const runtime = "nodejs";

const GENERIC_FAIL =
  "We could not submit your application right now. Please try again or contact us directly.";

const CONFIG_FAIL =
  "We're unable to complete your request right now. Please try again later or contact us directly.";

const VALIDATION_FAIL = "Please review your answers and try again.";

function buildStageARow(
  body: Omit<ApplyStageABody, "partialLeadId">,
  meta: ApplySubmissionMeta,
  leadScore: number,
  leadStatus: LeadDbStatus,
  calculator: CalcSnapshot | null,
) {
  const m: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === "string" && v.trim()) m[k] = v.trim();
  }

  return {
    name: ownerFullName(body),
    business_name: `${body.firstName.trim()} ${body.lastName.trim()}`.trim(),
    phone: body.phone.trim(),
    email: body.email.trim().toLowerCase(),
    first_name: body.firstName.trim(),
    last_name: body.lastName.trim(),
    product_interest: body.productInterest,
    industry: body.industry?.trim() || null,
    time_in_business: body.timeInBusiness,
    funding_amount: body.fundingAmount,
    monthly_revenue: body.monthlyRevenue,
    use_of_funds: body.useOfFunds,
    calculator_snapshot: calculator,
    statement_paths: [] as string[],
    statements_status: "pending" as const,
    email_consent: body.emailConsent === true,
    sms_consent: body.smsConsent === true,
    lead_score: leadScore,
    lead_status: leadStatus,
    source: m.source ?? null,
    landing_page: m.landing_page ?? null,
    utm_source: m.utm_source ?? null,
    utm_medium: m.utm_medium ?? null,
    utm_campaign: m.utm_campaign ?? null,
    utm_content: m.utm_content ?? null,
    utm_term: m.utm_term ?? null,
    gclid: m.gclid ?? null,
    fbclid: m.fbclid ?? null,
    raw_answers: { stage: "a", form: body, meta: m, calculator },
    notes: "Stage A prequal — contact captured; full file optional next.",
  };
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = applyStageABodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: VALIDATION_FAIL }, { status: 400 });
  }

  const captcha = await verifyTurnstileToken(
    parsed.data.turnstileToken,
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { ok: false, message: captcha.message ?? VALIDATION_FAIL },
      { status: 400 },
    );
  }

  const {
    partialLeadId,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    landing_page,
    source,
    calculator,
    turnstileToken: _turnstileToken,
    ...formFields
  } = parsed.data;

  const meta: ApplySubmissionMeta = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    fbclid,
    landing_page,
    source,
  };

  const leadScore = computeApplyScore({
    timeInBusiness: formFields.timeInBusiness,
    useOfFunds: formFields.useOfFunds,
    statementPaths: [],
    statementsSkipped: true,
    fundingAmount: formFields.fundingAmount,
    productInterest: formFields.productInterest,
    monthlyRevenue: formFields.monthlyRevenue,
  });
  const tier = getApplyResultTier(leadScore);
  const leadStatus = mapTierToLeadStatus(tier);

  const isProd = process.env.NODE_ENV === "production";
  const supabaseOk = isSupabaseServiceConfigured();

  if (isProd && !supabaseOk) {
    return NextResponse.json({ ok: false, message: CONFIG_FAIL }, { status: 503 });
  }

  let bookingToken: string | null = null;
  let uploadToken: string | null = null;
  let leadId: string | null = null;

  if (supabaseOk) {
    const supabase = createServiceRoleClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, message: CONFIG_FAIL }, { status: 503 });
    }

    const row = buildStageARow(
      {
        ...formFields,
        statementPaths: [],
        statementsSkipped: true,
        calculator,
        ...meta,
      },
      meta,
      leadScore,
      leadStatus,
      calculator ?? null,
    );

    if (partialLeadId) {
      const { data, error } = await supabase
        .from("leads")
        .update(row)
        .eq("id", partialLeadId)
        .select("id, booking_token, upload_token")
        .maybeSingle();

      if (error || !data) {
        if (process.env.NODE_ENV === "development") {
          console.error("[apply/stage-a] update failed:", error?.message);
        }
        return NextResponse.json({ ok: false, message: GENERIC_FAIL }, { status: 500 });
      }
      bookingToken =
        typeof data.booking_token === "string" ? data.booking_token : null;
      uploadToken =
        typeof data.upload_token === "string" ? data.upload_token : null;
      leadId = typeof data.id === "string" ? data.id : null;
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert(row)
        .select("id, booking_token, upload_token")
        .single();

      if (error || !data) {
        if (process.env.NODE_ENV === "development") {
          console.error("[apply/stage-a] insert failed:", error?.message);
        }
        return NextResponse.json({ ok: false, message: GENERIC_FAIL }, { status: 500 });
      }
      bookingToken =
        typeof data.booking_token === "string" ? data.booking_token : null;
      uploadToken =
        typeof data.upload_token === "string" ? data.upload_token : null;
      leadId = typeof data.id === "string" ? data.id : null;
    }
  }

  const fitForLinks = tier !== "not_fit_yet";

  await sendStageANotifications({
    firstName: formFields.firstName,
    lastName: formFields.lastName,
    email: formFields.email,
    phone: formFields.phone,
    timeInBusiness: formFields.timeInBusiness,
    fundingAmount: formFields.fundingAmount,
    monthlyRevenue: formFields.monthlyRevenue,
    useOfFunds: formFields.useOfFunds,
    productInterest: formFields.productInterest,
    industry: formFields.industry,
    leadScore,
    leadStatus,
    tier,
    smsConsent: formFields.smsConsent === true,
    meta,
    calculator: calculator ?? null,
    uploadUrl: fitForLinks ? buildUploadUrl(uploadToken) : null,
    finishFileUrl: fitForLinks ? buildFinishFileUrl(bookingToken) : null,
  });

  const devBookingToken =
    process.env.NODE_ENV === "development" && !supabaseOk && tier !== "not_fit_yet"
      ? DEV_BOOKING_TOKEN
      : null;

  return NextResponse.json({
    ok: true,
    status: tier,
    message: getApplyApiUserMessage(tier),
    bookingToken:
      tier !== "not_fit_yet" ? (bookingToken ?? devBookingToken) : null,
    leadId,
  });
}
