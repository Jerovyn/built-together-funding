import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { slugifyTitle } from "@/lib/articles-db";
import type { ArticleSection } from "@/lib/articles";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  title?: string;
  slug?: string;
  description?: string;
  readMinutes?: number;
  intro?: string;
  sections?: ArticleSection[];
  takeaway?: string;
  featuredImagePath?: string | null;
  status?: "draft" | "published";
};

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim() || "Untitled draft";
  const slug = (body.slug?.trim() || slugifyTitle(title) || `draft-${Date.now()}`).toLowerCase();
  const status = body.status === "published" ? "published" : "draft";

  const row = {
    title,
    slug,
    description: body.description?.trim() || "",
    read_minutes: body.readMinutes && body.readMinutes > 0 ? body.readMinutes : 4,
    intro: body.intro?.trim() || "",
    sections: Array.isArray(body.sections) ? body.sections : [],
    takeaway: body.takeaway?.trim() || "",
    featured_image_path: body.featuredImagePath?.trim() || null,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(row)
    .select("id, slug, status")
    .single();

  if (error || !data) {
    const msg =
      error?.code === "23505"
        ? "That slug is already used. Change the slug and try again."
        : "Could not create article.";
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }

  if (status === "published") {
    revalidatePath("/resources/");
    revalidatePath(`/resources/${data.slug}/`);
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
