import { readFile } from "fs/promises";
import path from "path";
import type { ArticleSection } from "@/lib/articles";
import {
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_NO_GUARANTEE_LINE,
} from "@/lib/constants";

export type GeneratedArticleDraft = {
  title: string;
  description: string;
  readMinutes: number;
  intro: string;
  sections: ArticleSection[];
  takeaway: string;
};

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function mimeForImage(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

const SYSTEM = `You write short educational articles for Built Together Funding, a capacity-first funding brand for US trades/service businesses.

Voice: operator-led, direct, practical, human. No hype. No fake stats or testimonials.

Compliance — NEVER say: approved, guaranteed, you are funded, instant approval, no docs, bad credit OK, get cash fast.
Prefer: may be a fit for a funding review; pre-qualification is not funding approval; subject to review/underwriting/partner availability.

Write from the infographic image. Expand into a clear article; do not invent numbers not on the image. If the image is sparse, write a useful related piece still grounded in capacity-first funding philosophy.

Return ONLY valid JSON with this shape:
{
  "title": string,
  "description": string (1-2 sentences for SEO card),
  "readMinutes": number (3-6),
  "intro": string,
  "sections": [
    {
      "heading": string,
      "paragraphs": string[],
      "bullets": string[] (optional)
    }
  ],
  "takeaway": string
}

Use 2-4 sections. Keep paragraphs short.`;

function fallbackDraft(imageName: string): GeneratedArticleDraft {
  return {
    title: "Capacity first: when funding helps a trades business grow",
    description:
      "A practical read on using capital only when demand already exists — and capacity is the bottleneck.",
    readMinutes: 4,
    intro:
      "Funding is a commitment to growth. That only works when the work is already there and you need capacity to take it. Here's the operator frame we use when reviewing files.",
    sections: [
      {
        heading: "What the image is pointing at",
        paragraphs: [
          `We generated this draft from your infographic (${imageName}). Proofread every line — AI can miss nuance on charts and fine print.`,
          "Keep the piece educational. Do not promise approval, rates, or funding availability.",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Name the bottleneck. If it's capacity against booked demand, capital may have a job. If it's demand, fix marketing and close-rate first.",
        ],
        bullets: [
          "Confirm work is already on the books or clearly in pipeline",
          "Name the exact capacity purchase (truck, crew, equipment, materials)",
          "Only then run a funding review",
        ],
      },
    ],
    takeaway: `${DISCLAIMER_PREQUAL_LINE} ${LEGAL_NO_GUARANTEE_LINE}`,
  };
}

function parseDraft(raw: string, imageName: string): GeneratedArticleDraft {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedArticleDraft>;
    const sections = Array.isArray(parsed.sections)
      ? parsed.sections
          .filter((s) => s && typeof s.heading === "string")
          .map((s) => ({
            heading: String(s.heading),
            paragraphs: Array.isArray(s.paragraphs)
              ? s.paragraphs.map(String)
              : [""],
            ...(Array.isArray(s.bullets) && s.bullets.length
              ? { bullets: s.bullets.map(String) }
              : {}),
          }))
      : fallbackDraft(imageName).sections;

    return {
      title: String(parsed.title || fallbackDraft(imageName).title).slice(0, 160),
      description: String(
        parsed.description || fallbackDraft(imageName).description,
      ).slice(0, 300),
      readMinutes:
        typeof parsed.readMinutes === "number" && parsed.readMinutes > 0
          ? Math.min(12, Math.round(parsed.readMinutes))
          : 4,
      intro: String(parsed.intro || fallbackDraft(imageName).intro),
      sections: sections.length ? sections : fallbackDraft(imageName).sections,
      takeaway: String(
        parsed.takeaway ||
          `${DISCLAIMER_PREQUAL_LINE} ${LEGAL_NO_GUARANTEE_LINE}`,
      ),
    };
  } catch {
    return fallbackDraft(imageName);
  }
}

/**
 * Reads one infographic and returns a draft article for human proofreading.
 */
export async function generateArticleFromImage(
  imageFileName: string,
): Promise<{ ok: true; draft: GeneratedArticleDraft } | { ok: false; message: string }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      message:
        "OPENAI_API_KEY is not set. Add it in Vercel, redeploy, then try again.",
    };
  }

  let bytes: Buffer;
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "blog-images",
      imageFileName,
    );
    bytes = await readFile(filePath);
  } catch {
    return { ok: false, message: "Could not read that image file." };
  }

  const b64 = bytes.toString("base64");
  const mime = mimeForImage(imageFileName);
  const model = process.env.OPENAI_ARTICLE_MODEL?.trim() || "gpt-4o-mini";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Write the article JSON from this Built Together Funding infographic.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mime};base64,${b64}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[openai-article]", res.status, errText.slice(0, 400));
      return {
        ok: false,
        message:
          res.status === 401
            ? "OpenAI rejected the API key. Check OPENAI_API_KEY in Vercel."
            : "OpenAI could not generate from this image. Try again or pick another image.",
      };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, message: "Empty response from OpenAI." };
    }

    return { ok: true, draft: parseDraft(content, imageFileName) };
  } catch (err) {
    console.error("[openai-article]", err);
    return { ok: false, message: "Network error talking to OpenAI." };
  }
}
