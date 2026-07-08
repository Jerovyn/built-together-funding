/** Shared config for bank-statement uploads (funnel + API + follow-up link). */

export const STATEMENTS_BUCKET = "statements";

/** Per-file cap. Kept under Vercel's ~4.5MB serverless body limit. */
export const STATEMENT_MAX_FILE_BYTES = 4 * 1024 * 1024;

export const STATEMENT_MAX_FILES = 6;

export const STATEMENT_ACCEPTED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
] as const;

export const STATEMENT_ACCEPT_ATTR = ".pdf,.png,.jpg,.jpeg";

/** Client-generated grouping id for files uploaded before the lead exists. */
export const UPLOAD_SESSION_RE = /^[a-z0-9-]{8,64}$/i;

/** Works on LAN HTTP where `crypto.randomUUID` is unavailable (non-secure context). */
export function createUploadSessionId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Storage prefix for pre-submit uploads; server verifies paths on submit. */
export const PRESUBMIT_PREFIX = "presubmit/";

export function sanitizeStatementFileName(name: string): string {
  const trimmed = name.slice(-120);
  return trimmed.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

export function isAcceptedStatementType(file: {
  type?: string;
  name: string;
}): boolean {
  if (
    file.type &&
    (STATEMENT_ACCEPTED_MIME as readonly string[]).includes(file.type)
  ) {
    return true;
  }
  return /\.(pdf|png|jpe?g)$/i.test(file.name);
}
