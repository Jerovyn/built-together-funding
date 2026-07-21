"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  /** Filenames already attached to any draft/published article */
  usedImages: string[];
};

function imageSrc(name: string) {
  return `/api/content-images/${encodeURIComponent(name)}/`;
}

export function ContentGeneratePanel({ images, usedImages }: Props) {
  const router = useRouter();
  const used = new Set(usedImages);
  const [image, setImage] = useState(images[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image && images[0]) setImage(images[0]);
  }, [images, image]);

  const generate = async () => {
    if (!image) {
      setError("Select an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredImagePath: image }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        id?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.id) {
        setError(json.message ?? "Could not create draft.");
        return;
      }
      router.push(`/admin/content/${json.id}/`);
      router.refresh();
    } catch {
      setError("Could not create draft.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-btf-border bg-btf-card p-4">
      <div>
        <h2 className="text-sm font-semibold text-btf-text">
          Generate from infographic
        </h2>
        <p className="mt-1 text-xs text-btf-text-muted">
          AI reads the selected image and drafts the article. You only proofread,
          edit, then Post. Images marked Used are already on a draft or live post.
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
          {images.map((name) => {
            const selected = image === name;
            const isUsed = used.has(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => setImage(name)}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-btf-bg text-left transition",
                  selected
                    ? "border-btf-accent ring-2 ring-btf-accent/30"
                    : "border-btf-border hover:border-btf-accent/40",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc(name)}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="block truncate px-2 py-1.5 text-[10px] text-btf-text-muted">
                  {name}
                </span>
                {isUsed ? (
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Used
                  </span>
                ) : null}
                {selected ? (
                  <span className="absolute right-1.5 top-1.5 rounded bg-btf-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Selected
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-btf-text-muted">
          No images found in content/blog-images/.
        </p>
      )}

      {image ? (
        <div className="overflow-hidden rounded-lg border border-btf-border">
          <p className="border-b border-btf-border bg-btf-secondary px-3 py-2 text-xs font-medium text-btf-text">
            Preview — {image}
            {used.has(image) ? " (already used)" : ""}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc(image)}
            alt=""
            className="max-h-64 w-full object-contain bg-white"
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="primary"
        disabled={busy || !image}
        onClick={() => void generate()}
      >
        {busy ? "Reading image & drafting…" : "Generate draft from image"}
      </Button>
    </div>
  );
}
