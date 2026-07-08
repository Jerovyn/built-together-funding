/** Fixed token returned by POST /api/apply/ in local dev when Supabase is not configured. */
export const DEV_BOOKING_TOKEN = "00000000-0000-4000-8000-000000000001";

export function isDevBookingToken(token: string | null | undefined): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    Boolean(token?.trim()) &&
    token!.trim() === DEV_BOOKING_TOKEN
  );
}

export function devBookingEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
