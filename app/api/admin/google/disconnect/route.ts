import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { clearGoogleTokens } from "@/lib/google-calendar";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  await clearGoogleTokens(supabase);
  return NextResponse.json({ ok: true });
}
