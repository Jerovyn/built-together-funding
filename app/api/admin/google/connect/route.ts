import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { isAdminConfigured } from "@/lib/admin-session";
import {
  buildGoogleAuthUrl,
  isGoogleOAuthConfigured,
} from "@/lib/google-calendar";

export const runtime = "nodejs";

async function signState(payload: string): Promise<string> {
  const secret = process.env.ADMIN_DASHBOARD_SECRET?.trim();
  if (!secret) return payload;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const bytes = new Uint8Array(sig);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${payload}.${b64}`;
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isAdminConfigured() || !isGoogleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=missing_config", getSite()),
    );
  }

  const state = await signState(`gcal:${Date.now()}`);
  const url = buildGoogleAuthUrl(state);
  if (!url) {
    return NextResponse.redirect(
      new URL("/admin/settings/?google=missing_config", getSite()),
    );
  }

  return NextResponse.redirect(url);
}

function getSite(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://builttogetherfunding.com"
  );
}
