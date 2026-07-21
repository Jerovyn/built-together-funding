import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { slugifyTitle } from "@/lib/articles-db";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";
import { DISCLAIMER_PREQUAL_LINE, LEGAL_NO_GUARANTEE_LINE } from "@/lib/constants";

export const runtime = "nodejs";

type Body = {
  featuredImagePath?: string;
  titleHint?: string;
};

/**
 * Creates a human-editable draft from an infographic path.
 * Does not auto-publish. Copy is a scaffold — always proofread before Post.
 */
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

  const image = body.featuredImagePath?.trim() || null;
  const hint =
    body.titleHint?.trim() ||
    (image
      ? image
          .replace(/\.[^.]+$/, "")
          .replace(/^Photo\s+/i, "")
          .slice(0, 80)
      : "New resource draft");

  const title = hint.length > 8 ? `Draft: ${hint}` : "New resource draft";
  const slugBase = slugifyTitle(hint) || `draft-${Date.now()}`;
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const row = {
    title,
    slug,
    description:
      "Edit this summary before publishing. Keep it accurate and free of approval promises.",
    read_minutes: 4,
    intro:
      "Rewrite this intro in your voice. Lead with the operator takeaway — what the reader should do differently after reading.",
    sections: [
      {
        heading: "The main point",
        paragraphs: [
          "Replace this with the idea from your infographic. Stay practical. Avoid hype.",
          "If you mention funding, remind readers this is education — not an approval or guarantee.",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Give one clear action a trades owner can take this week.",
        ],
        bullets: [
          "Name the capacity bottleneck",
          "Check whether demand already exists on the books",
          "Only then consider capital that buys that capacity",
        ],
      },
    ],
    takeaway: `${DISCLAIMER_PREQUAL_LINE} ${LEGAL_NO_GUARANTEE_LINE}`,
    featured_image_path: image,
    status: "draft",
    published_at: null,
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(row)
    .select("id, slug")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, message: "Could not create draft." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
