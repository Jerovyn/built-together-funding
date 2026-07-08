import { NextResponse } from "next/server";
import {
  applyPartialBodySchema,
  ownerFullName,
  type ApplyPartialBody,
  type ApplySubmissionMeta,
} from "@/lib/apply-schema";
import { compactSubmissionMeta } from "@/lib/notifications";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

function buildPartialRow(body: ApplyPartialBody, meta: ApplySubmissionMeta) {
  const m = compactSubmissionMeta(meta);
  return {
    name: ownerFullName(body),
    business_name: `${body.firstName.trim()} ${body.lastName.trim()}`.trim(),
    phone: body.phone.trim(),
    email: body.email.trim().toLowerCase(),
    first_name: body.firstName.trim(),
    last_name: body.lastName.trim(),
    time_in_business: body.timeInBusiness,
    funding_amount: body.fundingAmount,
    use_of_funds: body.useOfFunds,
    statement_paths: body.statementPaths,
    statements_status:
      body.statementPaths.length > 0
        ? "received"
        : body.statementsSkipped
          ? "pending"
          : "skipped",
    email_consent: false,
    sms_consent: false,
    lead_score: 0,
    lead_status: "partial",
    source: m.source ?? null,
    landing_page: m.landing_page ?? null,
    utm_source: m.utm_source ?? null,
    utm_medium: m.utm_medium ?? null,
    utm_campaign: m.utm_campaign ?? null,
    utm_content: m.utm_content ?? null,
    utm_term: m.utm_term ?? null,
    gclid: m.gclid ?? null,
    fbclid: m.fbclid ?? null,
    raw_answers: { partial: true, step: "contact" },
    notes: "Partial funnel — contact captured before full file.",
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

  const parsed = applyPartialBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid partial payload." }, { status: 400 });
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
    ...form
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

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: true, partialLeadId: null, dev: true });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Storage unavailable." }, { status: 503 });
  }

  const row = buildPartialRow(form as ApplyPartialBody, meta);

  if (partialLeadId) {
    const { data, error } = await supabase
      .from("leads")
      .update(row)
      .eq("id", partialLeadId)
      .eq("lead_status", "partial")
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ ok: false, message: "Could not update partial lead." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, partialLeadId: data.id as string });
  }

  const { data, error } = await supabase.from("leads").insert(row).select("id").single();
  if (error || !data) {
    return NextResponse.json({ ok: false, message: "Could not save partial lead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, partialLeadId: data.id as string });
}
