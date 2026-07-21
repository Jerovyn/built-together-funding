import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
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
  action?: "save" | "publish" | "unpublish";
};

export async function PATCH(
  req: Request,
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

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("articles")
    .select("id, slug, status, published_at")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  }

  let status = existing.status as "draft" | "published";
  let publishedAt = existing.published_at as string | null;

  if (body.action === "publish" || body.status === "published") {
    status = "published";
    publishedAt = publishedAt || new Date().toISOString();
  } else if (body.action === "unpublish" || body.status === "draft") {
    if (body.action === "unpublish" || body.status === "draft") {
      status = "draft";
    }
  }

  const patch: Record<string, unknown> = { status, published_at: publishedAt };
  if (typeof body.title === "string") patch.title = body.title.trim() || "Untitled";
  if (typeof body.slug === "string" && body.slug.trim()) {
    patch.slug = body.slug.trim().toLowerCase();
  }
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.readMinutes === "number" && body.readMinutes > 0) {
    patch.read_minutes = body.readMinutes;
  }
  if (typeof body.intro === "string") patch.intro = body.intro.trim();
  if (Array.isArray(body.sections)) patch.sections = body.sections;
  if (typeof body.takeaway === "string") patch.takeaway = body.takeaway.trim();
  if (body.featuredImagePath !== undefined) {
    patch.featured_image_path = body.featuredImagePath?.trim() || null;
  }

  const { data, error } = await supabase
    .from("articles")
    .update(patch)
    .eq("id", id)
    .select("id, slug, status")
    .single();

  if (error || !data) {
    const msg =
      error?.code === "23505"
        ? "That slug is already used."
        : "Could not save article.";
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }

  revalidatePath("/resources/");
  revalidatePath(`/resources/${data.slug}/`);
  if (existing.slug !== data.slug) {
    revalidatePath(`/resources/${existing.slug}/`);
  }
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug, status: data.status });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await ctx.params;
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, message: "Could not delete." }, { status: 500 });
  }

  if (existing?.slug) {
    revalidatePath("/resources/");
    revalidatePath(`/resources/${existing.slug}/`);
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({ ok: true });
}
