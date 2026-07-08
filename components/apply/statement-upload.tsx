"use client";

import { useRef, useState } from "react";
import {
  STATEMENT_ACCEPT_ATTR,
  STATEMENT_MAX_FILE_BYTES,
  STATEMENT_MAX_FILES,
  isAcceptedStatementType,
} from "@/lib/statements";
import { cn } from "@/lib/utils";

type UploadedFile = { path: string; name: string };

type StatementUploadProps = {
  /** Pre-submit funnel uploads (grouped by session) or post-submit token link. */
  mode: "presubmit" | "token";
  session?: string;
  token?: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  /** Called when the server reports uploads are not configured/available. */
  onUnavailable?: () => void;
  className?: string;
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export function StatementUpload({
  mode,
  session,
  token,
  files,
  onFilesChange,
  onUnavailable,
  className,
}: StatementUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = STATEMENT_MAX_FILES - files.length;

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0 || uploading) return;
    setError(null);

    const picked = [...list].slice(0, Math.max(0, remaining));
    if (picked.length === 0) {
      setError(`You can upload up to ${STATEMENT_MAX_FILES} files.`);
      return;
    }

    for (const file of picked) {
      if (!isAcceptedStatementType(file)) {
        setError("Use PDF, PNG, or JPG files.");
        return;
      }
      if (file.size > STATEMENT_MAX_FILE_BYTES) {
        setError("Files must be under 4MB each. Most bank PDFs are well under that.");
        return;
      }
    }

    setUploading(true);
    try {
      const next = [...files];
      for (const file of picked) {
        const body = new FormData();
        body.append("file", file);
        if (mode === "presubmit" && session) body.append("session", session);
        if (mode === "token" && token) body.append("token", token);

        const res = await fetch("/api/statements/", { method: "POST", body });
        const json: unknown = await res.json().catch(() => null);
        const payload =
          json && typeof json === "object"
            ? (json as { ok?: unknown; path?: unknown; reason?: unknown; message?: unknown })
            : null;

        if (payload?.reason === "not_configured") {
          onUnavailable?.();
          setError(
            "Uploads aren't available right now. Choose \"I'll send them later\" and we'll text you a secure link.",
          );
          return;
        }
        if (!res.ok || payload?.ok !== true || typeof payload.path !== "string") {
          setError(
            typeof payload?.message === "string"
              ? payload.message
              : "Upload failed. Please try again.",
          );
          return;
        }
        next.push({ path: payload.path, name: file.name });
        onFilesChange([...next]);
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        disabled={uploading || remaining <= 0}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-btf-accent/40 bg-btf-accent/[0.04] px-4 py-8 text-center transition-colors",
          "hover:border-btf-accent/70 hover:bg-btf-accent/[0.07]",
          (uploading || remaining <= 0) && "pointer-events-none opacity-60",
        )}
      >
        <FileIcon className="h-7 w-7 text-btf-accent" />
        <span className="text-sm font-semibold text-btf-text">
          {uploading
            ? "Uploading..."
            : files.length > 0
              ? "Add another file"
              : "Tap to upload your statements"}
        </span>
        <span className="text-xs text-btf-text-muted">
          PDF, PNG, or JPG - up to {STATEMENT_MAX_FILES} files, 4MB each
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={STATEMENT_ACCEPT_ATTR}
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
        aria-label="Upload bank statements"
      />

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.path}
              className="flex items-center justify-between gap-3 rounded-lg border border-btf-border bg-btf-card px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm text-btf-text">
                <FileIcon className="h-4 w-4 shrink-0 text-btf-accent" />
                <span className="truncate">{file.name}</span>
              </span>
              <button
                type="button"
                className="shrink-0 text-xs font-medium text-btf-text-muted hover:text-red-500"
                onClick={() =>
                  onFilesChange(files.filter((f) => f.path !== file.path))
                }
                aria-label={`Remove ${file.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <p className="flex items-start gap-2 text-xs leading-snug text-btf-text-muted">
        <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-btf-accent" />
        Your statements are stored encrypted, used only to review your
        application, and never shared outside the review process.
      </p>
    </div>
  );
}
