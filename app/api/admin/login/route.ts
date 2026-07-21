import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const password = body.password?.trim() ?? "";

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Sign in is unavailable." },
      { status: 503 },
    );
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json(
      { ok: false, message: "Incorrect password." },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Sign in is unavailable." },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminSessionCookieOptions(token));
  return res;
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
