import { NextResponse } from "next/server";
import {
  getOfflineReviewAvailability,
  getReviewAvailability,
  REVIEW_DURATION_MINUTES,
} from "@/lib/booking/availability";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date")?.trim();

  if (!date) {
    return NextResponse.json({ ok: false, message: "Date is required." }, { status: 400 });
  }

  if (!isSupabaseServiceConfigured()) {
    const offline = getOfflineReviewAvailability(date);
    return NextResponse.json({
      ok: true,
      date,
      durationMinutes: REVIEW_DURATION_MINUTES,
      slots: offline.slots,
      message: offline.message,
      dev: true,
    });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const availability = await getReviewAvailability(supabase, date);
  return NextResponse.json({
    ok: true,
    durationMinutes: REVIEW_DURATION_MINUTES,
    ...availability,
  });
}

export function POST() {
  return new NextResponse(null, { status: 405 });
}
