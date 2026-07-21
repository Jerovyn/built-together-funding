import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { testGoogleCalendarMeet } from "@/lib/google-calendar";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Database unavailable." },
      { status: 503 },
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Database unavailable." },
      { status: 503 },
    );
  }

  const result = await testGoogleCalendarMeet(supabase);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
