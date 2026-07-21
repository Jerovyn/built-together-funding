import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";

export const runtime = "nodejs";

/** Lists committed infographic filenames for the content desk. */
export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const dir = path.join(process.cwd(), "content", "blog-images");
    const files = await readdir(dir);
    const images = files
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ ok: true, images });
  } catch {
    return NextResponse.json({ ok: true, images: [] });
  }
}
