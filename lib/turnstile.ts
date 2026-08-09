/**
 * Cloudflare Turnstile verification (server). When env keys are missing,
 * verification is skipped so local/dev still works — production should set keys.
 */

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<{ ok: boolean; message?: string }> {
  if (!isTurnstileConfigured()) {
    return { ok: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true };

  const trimmed = typeof token === "string" ? token.trim() : "";
  if (!trimmed) {
    return { ok: false, message: "Please complete the security check." };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", trimmed);
    if (remoteIp?.trim()) body.set("remoteip", remoteIp.trim());

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    const json = (await res.json()) as { success?: boolean };
    if (!json.success) {
      return { ok: false, message: "Security check failed. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Security check unavailable. Please try again." };
  }
}
