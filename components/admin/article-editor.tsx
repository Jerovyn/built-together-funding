"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ArticleSection } from "@/lib/articles";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  initial: {
    title: string;
    slug: string;
    description: string;
    readMinutes: number;
    intro: string;
    sections: ArticleSection[];
    takeaway: string;
    featuredImagePath: string | null;
    status: "draft" | "published";
  };
  images: string[];
};

function sectionsToText(sections: ArticleSection[]): string {
  return sections
    .map((s) => {
      const paras = s.paragraphs.join("\n\n");
      const bullets = s.bullets?.length
        ? "\n" + s.bullets.map((b) => `- ${b}`).join("\n")
        : "";
      return `## ${s.heading}\n\n${paras}${bullets}`;
    })
    .join("\n\n");
}

function textToSections(text: string): ArticleSection[] {
  const blocks = text.split(/\n(?=## )/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length === 0) {
    return [{ heading: "Section", paragraphs: [text.trim() || ""] }];
  }
  return blocks.map((block) => {
    const lines = block.split("\n");
    const heading = lines[0].replace(/^##\s*/, "").trim() || "Section";
    const bodyLines = lines.slice(1);
    const bullets: string[] = [];
    const paraParts: string[] = [];
    let current: string[] = [];
    for (const line of bodyLines) {
      if (/^\s*-\s+/.test(line)) {
        if (current.length) {
          paraParts.push(current.join(" ").trim());
          current = [];
        }
        bullets.push(line.replace(/^\s*-\s+/, "").trim());
      } else if (line.trim() === "") {
        if (current.length) {
          paraParts.push(current.join(" ").trim());
          current = [];
        }
      } else {
        current.push(line.trim());
      }
    }
    if (current.length) paraParts.push(current.join(" ").trim());
    return {
      heading,
      paragraphs: paraParts.filter(Boolean).length
        ? paraParts.filter(Boolean)
        : [""],
      ...(bullets.length ? { bullets } : {}),
    };
  });
}

export function ArticleEditor({ id, initial, images }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState(initial.description);
  const [readMinutes, setReadMinutes] = useState(initial.readMinutes);
  const [intro, setIntro] = useState(initial.intro);
  const [body, setBody] = useState(() => sectionsToText(initial.sections));
  const [takeaway, setTakeaway] = useState(initial.takeaway);
  const [featuredImagePath, setFeaturedImagePath] = useState(
    initial.featuredImagePath ?? "",
  );
  const [status, setStatus] = useState(initial.status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      title,
      slug,
      description,
      readMinutes,
      intro,
      sections: textToSections(body),
      takeaway,
      featuredImagePath: featuredImagePath || null,
    }),
    [
      title,
      slug,
      description,
      readMinutes,
      intro,
      body,
      takeaway,
      featuredImagePath,
    ],
  );

  const save = async (action: "save" | "publish" | "unpublish") => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/articles/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, action }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        status?: "draft" | "published";
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.message ?? "Save failed.");
        return;
      }
      if (json.status) setStatus(json.status);
      setMessage(
        action === "publish"
          ? "Published — live on /resources/ now."
          : action === "unpublish"
            ? "Unpublished (draft)."
            : "Draft saved.",
      );
      router.refresh();
    } catch {
      setError("Save failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            status === "published"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-btf-secondary text-btf-text-muted"
          }`}
        >
          {status}
        </span>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => void save("save")}
        >
          Save draft
        </Button>
        {status === "published" ? (
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void save("unpublish")}
          >
            Unpublish
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            disabled={busy}
            onClick={() => void save("publish")}
          >
            Post to site
          </Button>
        )}
      </div>

      {message ? (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Title
        </span>
        <input
          className="w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Slug
        </span>
        <input
          className="w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 font-mono text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Short description
        </span>
        <textarea
          className="min-h-[72px] w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Read minutes
        </span>
        <input
          type="number"
          min={1}
          className="w-24 rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={readMinutes}
          onChange={(e) => setReadMinutes(Number(e.target.value) || 4)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Featured image
        </span>
        <select
          className="w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={featuredImagePath}
          onChange={(e) => setFeaturedImagePath(e.target.value)}
        >
          <option value="">None</option>
          {images.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Intro
        </span>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Body (use ## for headings, - for bullets)
        </span>
        <textarea
          className="min-h-[320px] w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 font-mono text-sm leading-relaxed"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-btf-text-muted">
          Takeaway
        </span>
        <textarea
          className="min-h-[96px] w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={takeaway}
          onChange={(e) => setTakeaway(e.target.value)}
        />
      </label>
    </div>
  );
}
