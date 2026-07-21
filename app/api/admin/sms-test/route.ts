import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import {
  createTwilioClient,
  getInternalNotifyPhones,
  getTwilioFromNumber,
  isTwilioConfigured,
  toE164Phone,
} from "@/lib/twilio";

export const runtime = "nodejs";

/**
 * Sends a short test SMS to INTERNAL_NOTIFY_PHONE list.
 * Surfaces Twilio errors in the admin UI (no booking required).
 */
export async function POST() {
  try {
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

    const sid = process.env.TWILIO_ACCOUNT_SID?.trim() ?? "";
    if (!sid.startsWith("AC")) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "TWILIO_ACCOUNT_SID must start with AC. Fix the value on Vercel Production, then Redeploy.",
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
    const fromRaw = getTwilioFromNumber();
    const from = fromRaw ? toE164Phone(fromRaw) || fromRaw : null;
    if (!client || !from) {
      return NextResponse.json(
        {
          ok: false,
          message: !from
            ? "TWILIO_PHONE_NUMBER is missing or not E.164 (example: +15551234567)."
            : "Could not create Twilio client. Check ACCOUNT_SID and AUTH_TOKEN on Vercel.",
        },
        { status: 400 },
      );
    }

    if (!from.startsWith("+")) {
      return NextResponse.json(
        {
          ok: false,
          message: `TWILIO_PHONE_NUMBER must be E.164 (got "${from}"). Use +1… format.`,
        },
        { status: 400 },
      );
    }

    const body = `BTF SMS test OK - ${new Date().toISOString().slice(0, 19)}Z. Reply STOP to opt out.`;
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
  } catch (err) {
    console.error("[sms-test] unhandled:", err);
    const message =
      err instanceof Error ? err.message : "SMS test failed unexpectedly.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
