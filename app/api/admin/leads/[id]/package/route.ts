import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireAdminApi } from "@/lib/admin-api";
import {
  buildApplicationText,
  downloadStatementBytes,
  fetchLeadById,
  safePackageBaseName,
} from "@/lib/admin-leads";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const lead = await fetchLeadById(supabase, id);
  if (!lead) {
    return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  }

  const zip = new JSZip();
  const base = safePackageBaseName(lead);
  zip.file(
    `${base}-application.txt`,
    buildApplicationText(lead, { revealSsn: true }),
  );

  const paths = lead.statement_paths ?? [];
  for (let i = 0; i < paths.length; i++) {
    const downloaded = await downloadStatementBytes(supabase, paths[i]);
    if (!downloaded) continue;
    zip.file(
      `statements/${String(i + 1).padStart(2, "0")}-${downloaded.fileName}`,
      downloaded.bytes,
    );
  }

  const bytes = await zip.generateAsync({ type: "uint8array" });
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${base}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
