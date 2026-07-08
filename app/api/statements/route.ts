import { NextResponse } from "next/server";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import {
  isAcceptedStatementType,
  PRESUBMIT_PREFIX,
  sanitizeStatementFileName,
  STATEMENT_MAX_FILE_BYTES,
  STATEMENT_MAX_FILES,
  STATEMENTS_BUCKET,
  UPLOAD_SESSION_RE,
} from "@/lib/statements";

export const runtime = "nodejs";

const GENERIC_FAIL = "Upload failed. Please try again.";

type UploadTarget =
  | { kind: "presubmit"; prefix: string }
  | { kind: "lead"; leadId: string; prefix: string };

export function GET() {
  return new NextResponse(null, { status: 405 });
}

/**
 * Accepts one statement file per request (multipart/form-data).
 * - Pre-submit (funnel): field `session` groups files before the lead exists.
 * - Post-submit (secure link): field `token` resolves the lead by upload_token.
 */
export async function POST(req: Request) {
  if (!isSupabaseServiceConfigured()) {
    // Callers treat this as "uploads unavailable" and fall back to skip/later.
    return NextResponse.json(
      { ok: false, reason: "not_configured" },
      { status: process.env.NODE_ENV === "production" ? 503 : 200 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "No file received." },
      { status: 400 },
    );
  }
  if (file.size === 0 || file.size > STATEMENT_MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, message: "Files must be under 4MB each." },
      { status: 400 },
    );
  }
  if (!isAcceptedStatementType(file)) {
    return NextResponse.json(
      { ok: false, message: "Use PDF, PNG, or JPG files." },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const session = form.get("session");
  const token = form.get("token");

  let target: UploadTarget;

  if (typeof token === "string" && token.trim()) {
    const { data: lead, error } = await supabase
      .from("leads")
      .select("id, statement_paths")
      .eq("upload_token", token.trim())
      .maybeSingle();
    if (error || !lead) {
      return NextResponse.json(
        { ok: false, message: "This upload link is not valid." },
        { status: 404 },
      );
    }
    const existing = Array.isArray(lead.statement_paths)
      ? lead.statement_paths.length
      : 0;
    if (existing >= STATEMENT_MAX_FILES) {
      return NextResponse.json(
        { ok: false, message: "File limit reached for this application." },
        { status: 400 },
      );
    }
    target = { kind: "lead", leadId: lead.id as string, prefix: `leads/${lead.id}` };
  } else if (typeof session === "string" && UPLOAD_SESSION_RE.test(session)) {
    target = { kind: "presubmit", prefix: `${PRESUBMIT_PREFIX}${session}`.replace(/\/$/, "") };
  } else {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const safeName = sanitizeStatementFileName(file.name || "statement.pdf");
  const path = `${target.prefix}/${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(STATEMENTS_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    if (process.env.NODE_ENV === "development") {
      console.error("[statements] upload failed:", uploadError.message);
    }
    return NextResponse.json({ ok: false, message: GENERIC_FAIL }, { status: 500 });
  }

  if (target.kind === "lead") {
    const { data: lead } = await supabase
      .from("leads")
      .select("statement_paths")
      .eq("id", target.leadId)
      .maybeSingle();
    const paths = Array.isArray(lead?.statement_paths)
      ? [...(lead.statement_paths as string[]), path]
      : [path];
    const { error: updateError } = await supabase
      .from("leads")
      .update({ statement_paths: paths, statements_status: "received" })
      .eq("id", target.leadId);
    if (updateError && process.env.NODE_ENV === "development") {
      console.error("[statements] lead update failed:", updateError.message);
    }
  }

  return NextResponse.json({ ok: true, path });
}
