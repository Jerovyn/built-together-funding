import { NextResponse } from "next/server";
import {
  formatReviewSlotLabel,
  getOfflineReviewAvailability,
  getReviewAvailability,
  normalizeStartTimeToHms,
  REVIEW_DURATION_MINUTES,
} from "@/lib/booking/availability";
import { isDevBookingToken } from "@/lib/booking/dev";
import { sendBookingNotifications } from "@/lib/notifications";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type BookBody = {
  bookingToken?: string;
  appointmentDate?: string;
  startTime?: string;
};

export function GET() {
  return new NextResponse(null, { status: 405 });
}

export async function POST(req: Request) {
  let body: BookBody;
  try {
    body = (await req.json()) as BookBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const bookingToken = body.bookingToken?.trim();
  const appointmentDate = body.appointmentDate?.trim();
  const startTimeRaw = body.startTime?.trim();

  if (!bookingToken || !appointmentDate || !startTimeRaw) {
    return NextResponse.json({ ok: false, message: "Missing booking fields." }, { status: 400 });
  }

  const startTimeHms = normalizeStartTimeToHms(startTimeRaw);
  if (!startTimeHms) {
    return NextResponse.json({ ok: false, message: "Invalid start time." }, { status: 400 });
  }

  if (!isSupabaseServiceConfigured()) {
    if (isDevBookingToken(bookingToken)) {
      const offline = getOfflineReviewAvailability(appointmentDate);
      const slot = offline.slots.find(
        (s) => s.startTimeHms === startTimeHms || s.time === startTimeRaw,
      );
      if (!slot?.available) {
        return NextResponse.json(
          { ok: false, message: "That time is not available." },
          { status: 409 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "Call booked (local preview).",
        slotLabel: formatReviewSlotLabel(appointmentDate, startTimeHms),
        dev: true,
      });
    }
    return NextResponse.json({ ok: false, message: "Booking unavailable." }, { status: 503 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Unavailable." }, { status: 503 });
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select(
      "id, first_name, last_name, business_name, email, phone, lead_status, booking_token",
    )
    .eq("booking_token", bookingToken)
    .maybeSingle();

  if (leadError || !lead) {
    return NextResponse.json({ ok: false, message: "Invalid booking link." }, { status: 404 });
  }

  if (lead.lead_status === "not_fit") {
    return NextResponse.json(
      { ok: false, message: "Scheduling is not available for this file." },
      { status: 403 },
    );
  }

  const availability = await getReviewAvailability(supabase, appointmentDate);
  const slot = availability.slots.find(
    (s) => s.startTimeHms === startTimeHms || s.time === startTimeRaw,
  );

  if (!slot?.available) {
    return NextResponse.json(
      { ok: false, message: slot ? "That time is no longer available." : "Invalid time slot." },
      { status: 409 },
    );
  }

  const { data: booking, error: bookError } = await supabase
    .from("bookings")
    .insert({
      lead_id: lead.id,
      appointment_date: appointmentDate,
      start_time: startTimeHms,
      duration_minutes: REVIEW_DURATION_MINUTES,
      status: "scheduled",
    })
    .select("id, appointment_date, start_time")
    .single();

  if (bookError || !booking) {
    if (bookError?.code === "23505") {
      return NextResponse.json(
        { ok: false, message: "That time was just booked. Pick another slot." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, message: "Could not book call." }, { status: 500 });
  }

  await supabase
    .from("leads")
    .update({ lead_status: "call_booked" })
    .eq("id", lead.id);

  const slotLabel = formatReviewSlotLabel(
    String(booking.appointment_date),
    String(booking.start_time).slice(0, 8),
  );

  await sendBookingNotifications({
    firstName: String(lead.first_name ?? ""),
    businessName: String(lead.business_name ?? ""),
    email: String(lead.email ?? ""),
    phone: String(lead.phone ?? ""),
    slotLabel,
  });

  return NextResponse.json({
    ok: true,
    message: "Call booked.",
    slotLabel,
    bookingId: booking.id,
  });
}
