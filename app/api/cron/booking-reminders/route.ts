import { NextResponse } from "next/server";
import {
  formatReviewSlotLabel,
  REVIEW_DURATION_MINUTES,
} from "@/lib/booking/availability";
import { etWallTimeToUtc, REMINDER_WINDOWS } from "@/lib/booking/et-time";
import { sendBookingReminderNotifications } from "@/lib/notifications";
import { buildUploadUrl } from "@/lib/site-url";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorize(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json({ ok: true, sent: 0, skipped: "no_supabase" });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, sent: 0, skipped: "no_client" });
  }

  const now = Date.now();
  const horizonMs = 26 * 60 * 60 * 1000;
  const fromDate = new Date(now - 2 * 60 * 60 * 1000);
  const toDate = new Date(now + horizonMs);
  const fromYmd = fromDate.toISOString().slice(0, 10);
  const toYmd = toDate.toISOString().slice(0, 10);

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, lead_id, appointment_date, start_time, meet_link, reminder_24h_sent_at, reminder_12h_sent_at, reminder_1h_sent_at",
    )
    .eq("status", "scheduled")
    .gte("appointment_date", fromYmd)
    .lte("appointment_date", toYmd);

  if (error) {
    console.error("[cron/reminders] query failed:", error.message);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Query failed. If reminder columns are missing, run docs/supabase-v8-booking-reminders.sql",
        detail: error.message,
      },
      { status: 500 },
    );
  }

  let sent = 0;
  const details: string[] = [];

  for (const row of bookings ?? []) {
    const startsAt = etWallTimeToUtc(
      String(row.appointment_date),
      String(row.start_time).slice(0, 8),
    );
    if (!startsAt) continue;

    const msUntil = startsAt.getTime() - now;
    if (msUntil < 0 || msUntil > horizonMs) continue;

    const dueWindows = REMINDER_WINDOWS.filter((window) => {
      if (row[window.column]) return false;
      return Math.abs(msUntil - window.targetMs) <= window.toleranceMs;
    });
    if (!dueWindows.length) continue;

    const { data: lead } = await supabase
      .from("leads")
      .select("first_name, email, phone, sms_consent, upload_token")
      .eq("id", row.lead_id)
      .maybeSingle();

    if (!lead?.email) continue;

    const slotLabel = formatReviewSlotLabel(
      String(row.appointment_date),
      String(row.start_time).slice(0, 8),
    );

    for (const window of dueWindows) {
      try {
        await sendBookingReminderNotifications({
          kind: window.kind,
          firstName: String(lead.first_name ?? ""),
          email: String(lead.email),
          phone: String(lead.phone ?? ""),
          slotLabel,
          meetLink:
            typeof row.meet_link === "string" ? row.meet_link : null,
          smsConsent: Boolean(lead.sms_consent),
          uploadUrl: buildUploadUrl(
            typeof lead.upload_token === "string" ? lead.upload_token : null,
          ),
        });

        const { error: markError } = await supabase
          .from("bookings")
          .update({ [window.column]: new Date().toISOString() })
          .eq("id", row.id);

        if (markError) {
          console.error(
            "[cron/reminders] mark failed (run supabase-v8-booking-reminders.sql?):",
            markError.message,
          );
        } else {
          sent += 1;
          details.push(`${row.id}:${window.kind}`);
        }
      } catch (err) {
        console.error("[cron/reminders] send failed:", err);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    durationMinutes: REVIEW_DURATION_MINUTES,
    details,
  });
}
