import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { slugifyTitle } from "@/lib/articles-db";
import { generateArticleFromImage, isOpenAiConfigured } from "@/lib/openai-article";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  featuredImagePath?: string;
};

/**
 * Reads one infographic with OpenAI vision and creates a draft for proofreading.
 * Does not publish.
 */
export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  if (!isOpenAiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Add OPENAI_API_KEY in Vercel (Production), redeploy, then generate again.",
      },
      { status: 503 },
    );
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

  const image = body.featuredImagePath?.trim();
  if (!image || image.includes("..") || image.includes("/") || image.includes("\\")) {
    return NextResponse.json(
      { ok: false, message: "Pick an infographic image first." },
      { status: 400 },
    );
  }

  const generated = await generateArticleFromImage(image);
  if (!generated.ok) {
    return NextResponse.json(
      { ok: false, message: generated.message },
      { status: 502 },
    );
  }

  const { draft } = generated;
  const slugBase = slugifyTitle(draft.title) || `draft-${Date.now()}`;
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const row = {
    title: draft.title,
    slug,
    description: draft.description,
    read_minutes: draft.readMinutes,
    intro: draft.intro,
    sections: draft.sections,
    takeaway: draft.takeaway,
    featured_image_path: image,
    status: "draft" as const,
    published_at: null,
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(row)
    .select("id, slug")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, message: "Could not save draft." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
