import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  createStatementSignedUrl,
  fetchLeadById,
} from "@/lib/admin-leads";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { path?: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const path = body.path?.trim();
  if (!path) {
    return NextResponse.json({ ok: false, message: "Missing path." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const lead = await fetchLeadById(supabase, id);
  if (!lead) {
    return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  }

  const allowed = (lead.statement_paths ?? []).includes(path);
  if (!allowed) {
    return NextResponse.json({ ok: false, message: "File not on this lead." }, { status: 403 });
  }

  const url = await createStatementSignedUrl(supabase, path, 180);
  if (!url) {
    return NextResponse.json({ ok: false, message: "Could not sign file." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url });
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
