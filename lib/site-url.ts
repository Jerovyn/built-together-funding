/** Absolute site origin for email/SMS links (no trailing slash). */
export function getSiteOrigin(): string | null {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return base || null;
}

export function buildUploadUrl(token: string | null | undefined): string | null {
  if (!token) return null;
  const base = getSiteOrigin();
  if (!base) return null;
  return `${base}/upload/${token}/`;
}

/** Resume Stage B (secure file) using booking token. */
export function buildFinishFileUrl(
  bookingToken: string | null | undefined,
): string | null {
  if (!bookingToken) return null;
  const base = getSiteOrigin();
  if (!base) return null;
  return `${base}/apply/?finish=${encodeURIComponent(bookingToken)}`;
}
