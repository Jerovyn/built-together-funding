/**
 * Funding review call availability — simplified Wash Kings–style calendar.
 * Mon–Fri, 9:00 AM–5:00 PM Eastern, 30-minute slots.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export const REVIEW_DURATION_MINUTES = 30;
export const REVIEW_TIMEZONE = "America/New_York";
export const REVIEW_DAYS_AHEAD = 10;

export type ReviewSlot = {
  time: string;
  available: boolean;
  startTimeHms: string;
};

export type ReviewDayAvailability = {
  date: string;
  slots: ReviewSlot[];
  message?: string;
};

const ACTIVE_BOOKING_STATUSES = ["scheduled"] as const;

function parseYmd(date: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const parsed = new Date(y, mo - 1, d);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== mo - 1 ||
    parsed.getDate() !== d
  ) {
    return null;
  }
  return parsed;
}

function format12Hour(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

function minutesToHms(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
}

function getEtNowParts(): { ymd: string; hour: number; minute: number; dow: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: REVIEW_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const ymd = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const dowMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dow = dowMap[get("weekday")] ?? 0;
  return { ymd, hour, minute, dow };
}

function isWeekday(date: Date): boolean {
  const d = date.getDay();
  return d >= 1 && d <= 5;
}

function generateSlotsForDate(
  date: string,
  bookedStarts: Set<string>,
): ReviewSlot[] {
  const dateObj = parseYmd(date);
  if (!dateObj || !isWeekday(dateObj)) return [];

  const etNow = getEtNowParts();
  const isToday = date === etNow.ymd;
  const slots: ReviewSlot[] = [];

  for (let hour = 9; hour < 17; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 16 && minute === 30) continue;
      const startTimeHms = minutesToHms(hour, minute);
      let available = !bookedStarts.has(startTimeHms);

      if (isToday && available) {
        if (hour < etNow.hour || (hour === etNow.hour && minute <= etNow.minute)) {
          available = false;
        }
      }

      slots.push({
        time: format12Hour(hour, minute),
        available,
        startTimeHms,
      });
    }
  }

  return slots;
}

/** Next N weekdays (starting tomorrow ET) as YYYY-MM-DD. */
export function getReviewDateOptions(count = REVIEW_DAYS_AHEAD): string[] {
  const dates: string[] = [];
  const etNow = getEtNowParts();
  const cursor = parseYmd(etNow.ymd);
  if (!cursor) return dates;

  while (dates.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${d}`;
    if (isWeekday(cursor)) dates.push(ymd);
  }
  return dates;
}

/** Availability without DB — for local dev preview. */
export function getOfflineReviewAvailability(date: string): ReviewDayAvailability {
  const dateObj = parseYmd(date);
  if (!dateObj) {
    return { date, slots: [], message: "Invalid date." };
  }
  if (!isWeekday(dateObj)) {
    return { date, slots: [], message: "No availability on weekends." };
  }
  const slots = generateSlotsForDate(date, new Set());
  if (!slots.some((s) => s.available)) {
    return { date, slots, message: "Fully booked — try another day." };
  }
  return { date, slots };
}

export async function getReviewAvailability(
  supabase: SupabaseClient,
  date: string,
): Promise<ReviewDayAvailability> {
  const dateObj = parseYmd(date);
  if (!dateObj) {
    return { date, slots: [], message: "Invalid date." };
  }
  if (!isWeekday(dateObj)) {
    return { date, slots: [], message: "No availability on weekends." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("start_time")
    .eq("appointment_date", date)
    .in("status", [...ACTIVE_BOOKING_STATUSES]);

  if (error) {
    return { date, slots: [], message: "Could not load availability." };
  }

  const booked = new Set(
    (data ?? []).map((row) => {
      const t = String(row.start_time ?? "");
      return t.slice(0, 8);
    }),
  );

  const slots = generateSlotsForDate(date, booked);
  if (slots.length === 0) {
    return { date, slots: [], message: "No availability on this day." };
  }
  if (!slots.some((s) => s.available)) {
    return { date, slots, message: "Fully booked — try another day." };
  }

  return { date, slots };
}

export function normalizeStartTimeToHms(input: string): string | null {
  const twelve = /^(\d{1,2}):(\d{2})\s*([AP]M)$/i.exec(input.trim());
  if (twelve) {
    let hour = Number(twelve[1]);
    const minute = Number(twelve[2]);
    const period = twelve[3].toUpperCase();
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return minutesToHms(hour, minute);
  }

  const hms = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(input.trim());
  if (hms) {
    const hour = Number(hms[1]);
    const minute = Number(hms[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return minutesToHms(hour, minute);
  }

  return null;
}

export function formatReviewSlotLabel(
  appointmentDate: string,
  startTimeHms: string,
): string {
  const dateObj = parseYmd(appointmentDate);
  const timeLabel = format12Hour(
    Number(startTimeHms.slice(0, 2)),
    Number(startTimeHms.slice(3, 5)),
  );
  if (!dateObj) return `${appointmentDate} at ${timeLabel} ET`;
  const dayLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return `${dayLabel} at ${timeLabel} ET`;
}
