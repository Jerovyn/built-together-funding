import { NextResponse } from "next/server";
import {
  applyApiBodySchema,
  ownerFullName,
  splitApplyApiPayload,
  type ApplyFormValues,
  type ApplySubmissionMeta,
} from "@/lib/apply-schema";
import {
  computeApplyScore,
  getApplyApiUserMessage,
  getApplyResultTier,
  mapTierToLeadStatus,
} from "@/lib/apply-scoring";
import {
  compactSubmissionMeta,
  sendApplyNotifications,
} from "@/lib/notifications";
import { PRESUBMIT_PREFIX } from "@/lib/statements";
import { DEV_BOOKING_TOKEN } from "@/lib/booking/dev";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import type { LeadDbStatus, StatementsStatus } from "@/types/apply";

export const runtime = "nodejs";

const GENERIC_FAIL =
  "We could not submit your application right now. Please try again or contact us directly.";

const CONFIG_FAIL =
  "We're unable to complete your request right now. Please try again later or contact us directly.";

const VALIDATION_FAIL = "Please review your answers and try again.";

function statementsStatusFor(form: ApplyFormValues): StatementsStatus {
  if (form.statementPaths.length > 0) return "received";
  return form.statementsSkipped ? "pending" : "skipped";
}

function buildLeadInsert(
  form: ApplyFormValues,
  meta: ApplySubmissionMeta,
  leadScore: number,
  leadStatus: LeadDbStatus,
) {
  const m = compactSubmissionMeta(meta);

  return {
    name: ownerFullName(form),
    business_name: form.businessName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    dob: form.dob,
    ssn: form.ssn.replace(/\D/g, ""),
    federal_id: form.federalId.replace(/\D/g, ""),
    home_address: form.homeAddress.trim(),
    home_state: form.homeState,
    home_zip: form.homeZip.trim(),
    legal_entity: form.legalEntity,
    business_address: form.businessAddress.trim(),
    business_city: form.businessCity.trim(),
    business_state: form.businessState,
    business_zip: form.businessZip.trim(),
    time_in_business: form.timeInBusiness,
    funding_amount: form.fundingAmount,
    use_of_funds: form.useOfFunds,
    statement_paths: form.statementPaths,
    statements_status: statementsStatusFor(form),
    sms_consent: form.smsConsent,
    email_consent: form.emailConsent,
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
    raw_answers: { form, meta: m },
    notes: null,
  };
}

function buildUploadUrl(token: string | null): string | null {
  if (!token) return null;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!base) return null;
  return `${base}/upload/${token}/`;
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = applyApiBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: VALIDATION_FAIL },
      { status: 400 },
    );
  }

  const { form, meta, partialLeadId } = splitApplyApiPayload(parsed.data);

  // Only accept storage paths issued by POST /api/statements for this flow.
  if (form.statementPaths.some((p) => !p.startsWith(PRESUBMIT_PREFIX))) {
    return NextResponse.json(
      { ok: false, message: VALIDATION_FAIL },
      { status: 400 },
    );
  }

  const leadScore = computeApplyScore(form);
  const tier = getApplyResultTier(leadScore);
  const leadStatus = mapTierToLeadStatus(tier);

  const isProd = process.env.NODE_ENV === "production";
  const supabaseOk = isSupabaseServiceConfigured();

  if (isProd && !supabaseOk) {
    return NextResponse.json({ ok: false, message: CONFIG_FAIL }, { status: 503 });
  }

  let uploadToken: string | null = null;
  let bookingToken: string | null = null;
  let leadId: string | null = null;

  if (supabaseOk) {
    const supabase = createServiceRoleClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, message: CONFIG_FAIL }, { status: 503 });
    }
    const row = buildLeadInsert(form, meta, leadScore, leadStatus);

    if (partialLeadId) {
      const { data, error } = await supabase
        .from("leads")
        .update(row)
        .eq("id", partialLeadId)
        .select("upload_token, booking_token, id")
        .maybeSingle();

      if (error || !data) {
        if (process.env.NODE_ENV === "development") {
          console.error("[apply] Supabase update failed:", error?.message);
        }
        return NextResponse.json({ ok: false, message: GENERIC_FAIL }, { status: 500 });
      }
      uploadToken =
        data && typeof data.upload_token === "string" ? data.upload_token : null;
      bookingToken =
        data && typeof data.booking_token === "string" ? data.booking_token : null;
      leadId = data && typeof data.id === "string" ? data.id : null;
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert(row)
        .select("upload_token, booking_token, id")
        .single();
      if (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("[apply] Supabase insert failed:", error.message);
        }
        return NextResponse.json({ ok: false, message: GENERIC_FAIL }, { status: 500 });
      }
      uploadToken =
        data && typeof data.upload_token === "string" ? data.upload_token : null;
      bookingToken =
        data && typeof data.booking_token === "string" ? data.booking_token : null;
      leadId = data && typeof data.id === "string" ? data.id : null;
    }
  }

  const wantsUploadLink =
    form.statementsSkipped && form.statementPaths.length === 0;

  await sendApplyNotifications({
    form,
    meta,
    leadScore,
    leadStatus,
    tier,
    uploadUrl: wantsUploadLink ? buildUploadUrl(uploadToken) : null,
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
