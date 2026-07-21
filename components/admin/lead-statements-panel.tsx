"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  leadId: string;
  paths: string[];
};

export function LeadStatementsPanel({ leadId, paths }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const openFile = async (path: string) => {
    setError(null);
    setLoadingPath(path);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/statement-url/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; message?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.message ?? "Could not open file.");
        return;
      }
      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Could not open file.");
    } finally {
      setLoadingPath(null);
    }
  };

  if (paths.length === 0) {
    return (
      <p className="text-sm text-btf-text-muted">No statement files uploaded yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {paths.map((path) => {
          const name = path.split("/").pop() ?? path;
          return (
            <li
              key={path}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-btf-border bg-btf-bg px-3 py-2"
            >
              <span className="truncate text-sm text-btf-text" title={path}>
                {name}
              </span>
              <Button
                type="button"
                variant="secondary"
                className="shrink-0"
                disabled={loadingPath === path}
                onClick={() => void openFile(path)}
              >
                {loadingPath === path ? "Opening…" : "View / download"}
              </Button>
            </li>
          );
        })}
      </ul>
      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
