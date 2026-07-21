"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
};

export function ContentGeneratePanel({ images }: Props) {
  const router = useRouter();
  const [image, setImage] = useState(images[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image && images[0]) setImage(images[0]);
  }, [images, image]);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featuredImagePath: image || null,
        }),
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
    <div className="space-y-3 rounded-xl border border-btf-border bg-btf-card p-4">
      <h2 className="text-sm font-semibold text-btf-text">Generate draft</h2>
      <p className="text-xs text-btf-text-muted">
        Creates a draft from an infographic. Proofread and edit, then click Post
        — the live site updates immediately.
      </p>
      {images.length > 0 ? (
        <select
          className="w-full rounded-lg border border-btf-border bg-btf-bg px-3 py-2 text-sm"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        >
          {images.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-xs text-btf-text-muted">
          No images found in content/blog-images/.
        </p>
      )}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="primary"
        disabled={busy}
        onClick={() => void generate()}
      >
        {busy ? "Generating…" : "Generate draft"}
      </Button>
    </div>
  );
}
