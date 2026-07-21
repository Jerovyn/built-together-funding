import { NextResponse } from "next/server";
import {
  formatReviewSlotLabel,
  getOfflineReviewAvailability,
  getReviewAvailability,
  normalizeStartTimeToHms,
  REVIEW_DURATION_MINUTES,
} from "@/lib/booking/availability";
import { isDevBookingToken } from "@/lib/booking/dev";
import { createFundingReviewMeetEvent } from "@/lib/google-calendar";
import { sendBookingNotifications } from "@/lib/notifications";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type BookBody = {
  bookingToken?: string;
  appointmentDate?: string;
  startTime?: string;
};

export function GET() {
  return new NextResponse(null, { status: 405 });
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  try {
    let body: BookBody;
    try {
      body = (await req.json()) as BookBody;
    } catch {
      return jsonError("Invalid request.", 400);
    }

    const bookingToken = body.bookingToken?.trim();
    const appointmentDate = body.appointmentDate?.trim();
    const startTimeRaw = body.startTime?.trim();

    if (!bookingToken || !appointmentDate || !startTimeRaw) {
      return jsonError("Missing booking fields.", 400);
    }

    const startTimeHms = normalizeStartTimeToHms(startTimeRaw);
    if (!startTimeHms) {
      return jsonError("Invalid start time.", 400);
    }

    if (!isSupabaseServiceConfigured()) {
      if (isDevBookingToken(bookingToken)) {
        const offline = getOfflineReviewAvailability(appointmentDate);
        const slot = offline.slots.find(
          (s) => s.startTimeHms === startTimeHms || s.time === startTimeRaw,
        );
        if (!slot?.available) {
          return jsonError("That time is not available.", 409);
        }
        return NextResponse.json({
          ok: true,
          message: "Call booked (local preview).",
          slotLabel: formatReviewSlotLabel(appointmentDate, startTimeHms),
          dev: true,
        });
      }
      return jsonError("Booking unavailable.", 503);
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return jsonError("Unavailable.", 503);
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select(
        "id, first_name, last_name, business_name, email, phone, lead_status, booking_token, sms_consent",
      )
      .eq("booking_token", bookingToken)
      .maybeSingle();

    if (leadError || !lead) {
      return jsonError("Invalid booking link.", 404);
    }

    if (lead.lead_status === "not_fit") {
      return jsonError("Scheduling is not available for this file.", 403);
    }

    const availability = await getReviewAvailability(supabase, appointmentDate);
    const slot = availability.slots.find(
      (s) => s.startTimeHms === startTimeHms || s.time === startTimeRaw,
    );

    if (!slot?.available) {
      return jsonError(
        slot ? "That time is no longer available." : "Invalid time slot.",
        409,
      );
    }

    // Book first — never block the reservation on Google Meet.
    let booking: {
      id: string;
      appointment_date: string;
      start_time: string;
      meet_link?: string | null;
    } | null = null;

    const baseRow = {
      lead_id: lead.id,
      appointment_date: appointmentDate,
      start_time: startTimeHms,
      duration_minutes: REVIEW_DURATION_MINUTES,
      status: "scheduled",
    };

    const withMeetCols = await supabase
      .from("bookings")
      .insert({
        ...baseRow,
        meet_link: null,
        google_event_id: null,
        calendar_html_link: null,
      })
      .select("id, appointment_date, start_time, meet_link")
      .single();

    if (withMeetCols.data) {
      booking = withMeetCols.data;
    } else if (withMeetCols.error?.code === "23505") {
      return jsonError("That time was just booked. Pick another slot.", 409);
    } else {
      const fallback = await supabase
        .from("bookings")
        .insert(baseRow)
        .select("id, appointment_date, start_time")
        .single();

      if (fallback.error?.code === "23505") {
        return jsonError("That time was just booked. Pick another slot.", 409);
      }
      if (fallback.error || !fallback.data) {
        console.error("[booking] insert failed:", fallback.error ?? withMeetCols.error);
        return jsonError("Could not book call.", 500);
      }
      booking = { ...fallback.data, meet_link: null };
    }

    await supabase
      .from("leads")
      .update({ lead_status: "call_booked" })
      .eq("id", lead.id);

    // Soft-fail Meet: booking already saved.
    let meetLink: string | null = null;
    let calendarHtmlLink: string | null = null;
    try {
      const meet = await createFundingReviewMeetEvent(supabase, {
        appointmentDate,
        startTimeHms,
        applicantEmail: String(lead.email ?? ""),
        applicantName:
          [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
          String(lead.business_name ?? ""),
        businessName: String(lead.business_name ?? ""),
      });
      meetLink = meet.meetLink;
      calendarHtmlLink = meet.htmlLink;
      if (meet.meetLink || meet.eventId || meet.htmlLink) {
        await supabase
          .from("bookings")
          .update({
            meet_link: meet.meetLink,
            google_event_id: meet.eventId,
            calendar_html_link: meet.htmlLink,
          })
          .eq("id", booking.id);
      }
    } catch (err) {
      console.error("[booking] Meet attach failed:", err);
    }

    const slotLabel = formatReviewSlotLabel(
      String(booking.appointment_date),
      String(booking.start_time).slice(0, 8),
    );

    try {
      await sendBookingNotifications({
        firstName: String(lead.first_name ?? ""),
        businessName: String(lead.business_name ?? ""),
        email: String(lead.email ?? ""),
        phone: String(lead.phone ?? ""),
        slotLabel,
        meetLink,
        calendarHtmlLink,
        smsConsent: Boolean(lead.sms_consent),
      });
    } catch (err) {
      console.error("[booking] notifications failed:", err);
    }

    return NextResponse.json({
      ok: true,
      message: "Call booked.",
      slotLabel,
      bookingId: booking.id,
      meetLink,
    });
  } catch (err) {
    console.error("[booking] unhandled:", err);
    return jsonError("Could not book call. Please try again.", 500);
  }
}
