import { NextResponse } from "next/server";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Hydrate Stage A fields for finishing the secure file via ?finish=bookingToken.
 * Never returns SSN/EIN (those weren't collected yet on Stage A).
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ ok: false, message: "Missing token." }, { status: 400 });
  }

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, booking_token, first_name, last_name, email, phone, product_interest, industry, time_in_business, funding_amount, monthly_revenue, use_of_funds, email_consent, sms_consent, lead_status",
    )
    .eq("booking_token", token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ ok: false, message: "Invalid link." }, { status: 404 });
  }

  if (data.lead_status === "not_fit") {
    return NextResponse.json(
      { ok: false, message: "This file is not available to continue." },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId: data.id,
    bookingToken: data.booking_token,
    firstName: data.first_name ?? "",
    lastName: data.last_name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    productInterest: data.product_interest ?? "not_sure",
    industry: data.industry ?? "",
    timeInBusiness: data.time_in_business ?? "",
    fundingAmount: data.funding_amount ?? "",
    monthlyRevenue: data.monthly_revenue ?? "",
    useOfFunds: Array.isArray(data.use_of_funds) ? data.use_of_funds : [],
    emailConsent: Boolean(data.email_consent),
    smsConsent: Boolean(data.sms_consent),
  });
}
