import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import {
  exchangeGoogleCode,
  loadGoogleTokens,
  saveGoogleTokens,
} from "@/lib/google-calendar";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://builttogetherfunding.com"
  );
}

async function verifyState(state: string | null): Promise<boolean> {
  if (!state || !state.startsWith("gcal:")) return false;
  const secret = process.env.ADMIN_DASHBOARD_SECRET?.trim();
  if (!secret) return false;
  const lastDot = state.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = state.slice(0, lastDot);
  const sig = state.slice(lastDot + 1);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expectedBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const bytes = new Uint8Array(expectedBuf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const expected = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");

  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(
      new URL("/admin/login/?next=/admin/settings/", siteBase()),
    );
  }

  if (err || !code) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=denied", siteBase()),
    );
  }

  if (!(await verifyState(state))) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=bad_state", siteBase()),
    );
  }

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=no_db", siteBase()),
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=no_db", siteBase()),
    );
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    if (!tokens?.refresh_token) {
      const previous = await loadGoogleTokens(supabase);
      if (!previous?.refresh_token) {
        return NextResponse.redirect(
          new URL("/admin/settings/?google=no_refresh", siteBase()),
        );
      }
      await saveGoogleTokens(supabase, tokens ?? {}, previous);
    } else {
      const previous = await loadGoogleTokens(supabase);
      await saveGoogleTokens(supabase, tokens, previous);
    }
  } catch {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=error", siteBase()),
    );
  }

  return NextResponse.redirect(
    new URL("/admin/settings/?google=connected", siteBase()),
  );
}
