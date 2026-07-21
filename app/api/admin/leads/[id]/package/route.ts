import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireAdminApi } from "@/lib/admin-api";
import {
  downloadStatementBytes,
  fetchLeadById,
  safePackageBaseName,
} from "@/lib/admin-leads";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import {
  buildApplicationPdf,
  toStatementPdfFile,
} from "@/lib/underwriting-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const applicationPdf = await buildApplicationPdf(lead);
  zip.file(`${base}-application.pdf`, applicationPdf);

  const paths = lead.statement_paths ?? [];
  for (let i = 0; i < paths.length; i++) {
    const downloaded = await downloadStatementBytes(supabase, paths[i]);
    if (!downloaded) continue;
    const asPdf = await toStatementPdfFile(
      downloaded.bytes,
      downloaded.fileName,
    );
    zip.file(
      `statements/${String(i + 1).padStart(2, "0")}-${asPdf.fileName}`,
      asPdf.bytes,
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
