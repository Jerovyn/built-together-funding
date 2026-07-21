import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  createTwilioClient,
  getInternalNotifyPhones,
  getTwilioFromNumber,
  isTwilioConfigured,
} from "@/lib/twilio";

export const runtime = "nodejs";

/**
 * Sends a short test SMS to INTERNAL_NOTIFY_PHONE list.
 * Surfaces Twilio errors in the admin UI (no booking required).
 */
export async function POST() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isTwilioConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Twilio is not configured on this deployment. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER on Vercel Production, then Redeploy.",
      },
      { status: 400 },
    );
  }

  const phones = getInternalNotifyPhones();
  if (!phones.length) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "INTERNAL_NOTIFY_PHONE is empty. Set +17182852368,+13473034705 (or your numbers) on Vercel Production, then Redeploy.",
      },
      { status: 400 },
    );
  }

  const client = createTwilioClient();
  const from = getTwilioFromNumber();
  if (!client || !from) {
    return NextResponse.json(
      { ok: false, message: "Twilio client unavailable." },
      { status: 500 },
    );
  }

  const body = `BTF SMS test OK — ${new Date().toISOString().slice(0, 19)}Z. Reply STOP to opt out.`;
  const results: { to: string; ok: boolean; error?: string; sid?: string }[] =
    [];

  for (const to of phones) {
    try {
      const msg = await client.messages.create({ from, to, body });
      results.push({ to, ok: true, sid: msg.sid });
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Twilio send failed.";
      console.error("[sms-test] failed:", to, err);
      results.push({ to, ok: false, error: message });
    }
  }

  const allOk = results.every((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    {
      ok: allOk,
      message: allOk
        ? `Test SMS sent to ${results.length} number(s).`
        : `SMS failed for ${failed.length}/${results.length}: ${failed.map((f) => `${f.to}: ${f.error}`).join("; ")}`,
      from,
      results,
    },
    { status: allOk ? 200 : 400 },
  );
}
