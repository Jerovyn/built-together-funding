import { REVIEW_TIMEZONE } from "@/lib/booking/availability";

/**
 * Convert an America/New_York wall-clock date+time to a UTC Date.
 * Iterative correction handles DST without a timezone library.
 */
export function etWallTimeToUtc(ymd: string, hms: string): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(hms);
  if (!dateMatch || !timeMatch) return null;

  const y = Number(dateMatch[1]);
  const mo = Number(dateMatch[2]);
  const d = Number(dateMatch[3]);
  const hh = Number(timeMatch[1]);
  const mm = Number(timeMatch[2]);
  const ss = Number(timeMatch[3] ?? "0");

  if (
    mo < 1 ||
    mo > 12 ||
    d < 1 ||
    d > 31 ||
    hh > 23 ||
    mm > 59 ||
    ss > 59
  ) {
    return null;
  }

  const desiredAsUtcMs = Date.UTC(y, mo - 1, d, hh, mm, ss);
  let guess = new Date(desiredAsUtcMs);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: REVIEW_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(
      formatter.formatToParts(guess).map((p) => [p.type, p.value]),
    ) as Record<string, string>;
    const hour = Number(parts.hour === "24" ? "0" : parts.hour);
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      hour,
      Number(parts.minute),
      Number(parts.second),
    );
    guess = new Date(guess.getTime() + (desiredAsUtcMs - asUtc));
  }

  return guess;
}

export type ReminderKind = "24h" | "12h" | "1h";

export const REMINDER_WINDOWS: {
  kind: ReminderKind;
  column: "reminder_24h_sent_at" | "reminder_12h_sent_at" | "reminder_1h_sent_at";
  targetMs: number;
  /** Half-width of the send window (cron may run every 15 min). */
  toleranceMs: number;
}[] = [
  {
    kind: "24h",
    column: "reminder_24h_sent_at",
    targetMs: 24 * 60 * 60 * 1000,
    toleranceMs: 20 * 60 * 1000,
  },
  {
    kind: "12h",
    column: "reminder_12h_sent_at",
    targetMs: 12 * 60 * 60 * 1000,
    toleranceMs: 20 * 60 * 1000,
  },
  {
    kind: "1h",
    column: "reminder_1h_sent_at",
    targetMs: 60 * 60 * 1000,
    toleranceMs: 20 * 60 * 1000,
  },
];
