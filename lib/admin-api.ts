import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

/** Returns a 401 JSON response if the admin session cookie is missing/invalid. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
}
