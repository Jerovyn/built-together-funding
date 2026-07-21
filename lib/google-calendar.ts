/**
 * Google Calendar OAuth + Meet event creation for funding review bookings.
 * Tokens live in public.app_integrations (service-role only).
 */

import { google } from "googleapis";
import type { SupabaseClient } from "@supabase/supabase-js";
import { REVIEW_DURATION_MINUTES, REVIEW_TIMEZONE } from "@/lib/booking/availability";
import { SITE_NAME } from "@/lib/constants";

const INTEGRATION_ID = "google_calendar";
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

type GoogleTokenPayload = {
  refresh_token?: string;
  access_token?: string;
  expiry_date?: number;
  email?: string;
  connected_at?: string;
};

function getClientId(): string | null {
  return process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() || null;
}

function getClientSecret(): string | null {
  return process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() || null;
}

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://builttogetherfunding.com"
  );
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(getClientId() && getClientSecret());
}

export function getGoogleOAuthRedirectUri(): string {
  return `${getSiteUrl()}/api/admin/google/callback/`;
}

function createOAuthClient() {
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  if (!clientId || !clientSecret) return null;
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    getGoogleOAuthRedirectUri(),
  );
}

export function buildGoogleAuthUrl(state: string): string | null {
  const client = createOAuthClient();
  if (!client) return null;
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeGoogleCode(
  code: string,
): Promise<GoogleTokenPayload | null> {
  const client = createOAuthClient();
  if (!client) return null;
  const { tokens } = await client.getToken(code);

  return {
    refresh_token: tokens.refresh_token ?? undefined,
    access_token: tokens.access_token ?? undefined,
    expiry_date: tokens.expiry_date ?? undefined,
    connected_at: new Date().toISOString(),
  };
}

export async function loadGoogleTokens(
  supabase: SupabaseClient,
): Promise<GoogleTokenPayload | null> {
  const { data } = await supabase
    .from("app_integrations")
    .select("payload")
    .eq("id", INTEGRATION_ID)
    .maybeSingle();
  if (!data?.payload || typeof data.payload !== "object") return null;
  return data.payload as GoogleTokenPayload;
}

export async function saveGoogleTokens(
  supabase: SupabaseClient,
  payload: GoogleTokenPayload,
  previous?: GoogleTokenPayload | null,
): Promise<void> {
  const merged: GoogleTokenPayload = {
    ...previous,
    ...payload,
    // Keep old refresh token if Google did not return a new one
    refresh_token: payload.refresh_token || previous?.refresh_token,
  };
  await supabase.from("app_integrations").upsert({
    id: INTEGRATION_ID,
    payload: merged,
    updated_at: new Date().toISOString(),
  });
}

export async function clearGoogleTokens(supabase: SupabaseClient): Promise<void> {
  await supabase.from("app_integrations").delete().eq("id", INTEGRATION_ID);
}

export async function getGoogleConnectionStatus(
  supabase: SupabaseClient,
): Promise<{ connected: boolean; email?: string; configured: boolean }> {
  const configured = isGoogleOAuthConfigured();
  if (!configured) return { connected: false, configured: false };
  const tokens = await loadGoogleTokens(supabase);
  return {
    configured: true,
    connected: Boolean(tokens?.refresh_token),
    email: tokens?.email,
  };
}

async function getAuthedCalendar(supabase: SupabaseClient) {
  const client = createOAuthClient();
  if (!client) return null;
  const tokens = await loadGoogleTokens(supabase);
  if (!tokens?.refresh_token) return null;

  client.setCredentials({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
    expiry_date: tokens.expiry_date,
  });

  client.on("tokens", (fresh) => {
    void saveGoogleTokens(
      supabase,
      {
        access_token: fresh.access_token ?? undefined,
        expiry_date: fresh.expiry_date ?? undefined,
        refresh_token: fresh.refresh_token ?? undefined,
      },
      tokens,
    );
  });

  return google.calendar({ version: "v3", auth: client });
}

function buildEventDateTimes(appointmentDate: string, startTimeHms: string) {
  const start = startTimeHms.length === 5 ? `${startTimeHms}:00` : startTimeHms;
  const [hh, mm] = start.split(":").map(Number);
  const startMinutes = hh * 60 + mm;
  const endMinutes = startMinutes + REVIEW_DURATION_MINUTES;
  const endH = Math.floor(endMinutes / 60)
    .toString()
    .padStart(2, "0");
  const endM = (endMinutes % 60).toString().padStart(2, "0");
  const endTime = `${endH}:${endM}:00`;

  return {
    start: {
      dateTime: `${appointmentDate}T${start}`,
      timeZone: REVIEW_TIMEZONE,
    },
    end: {
      dateTime: `${appointmentDate}T${endTime}`,
      timeZone: REVIEW_TIMEZONE,
    },
  };
}

export type CreateMeetResult = {
  meetLink: string | null;
  eventId: string | null;
  htmlLink: string | null;
  /** Short reason when Meet was not created (safe for internal email / admin UI). */
  error?: string | null;
};

/** Extract a short, actionable message from googleapis / OAuth errors. */
export function formatGoogleApiError(err: unknown): string {
  if (!err || typeof err !== "object") return "Unknown Google Calendar error.";
  const anyErr = err as {
    message?: string;
    code?: number | string;
    response?: { data?: { error?: { message?: string; status?: string } } };
  };
  const apiMsg = anyErr.response?.data?.error?.message?.trim();
  const status = anyErr.response?.data?.error?.status?.trim();
  const base = apiMsg || anyErr.message?.trim() || "Google Calendar request failed.";
  const lower = base.toLowerCase();

  if (
    lower.includes("access not configured") ||
    lower.includes("has not been used") ||
    lower.includes("is disabled") ||
    lower.includes("calendar api")
  ) {
    return "Google Calendar API is not enabled on this Google Cloud project. Enable it, wait a minute, then Test again.";
  }
  if (lower.includes("invalid_grant") || lower.includes("token has been expired")) {
    return "Google refresh token expired or revoked. Disconnect, reconnect, then Test again. Publish the OAuth app if still in Testing.";
  }
  if (lower.includes("insufficient") || lower.includes("permission")) {
    return "Google OAuth lacks Calendar permission. Disconnect and reconnect, then allow Calendar access.";
  }
  if (status) return `${base} (${status})`;
  return base.length > 220 ? `${base.slice(0, 217)}…` : base;
}

/**
 * Creates a Calendar event with Google Meet and invites the applicant.
 * Soft-fails (returns nulls) when Google is not connected — booking still succeeds.
 */
export async function createFundingReviewMeetEvent(
  supabase: SupabaseClient,
  input: {
    appointmentDate: string;
    startTimeHms: string;
    applicantEmail: string;
    applicantName: string;
    businessName: string;
  },
): Promise<CreateMeetResult> {
  const empty: CreateMeetResult = {
    meetLink: null,
    eventId: null,
    htmlLink: null,
    error: null,
  };

  try {
    const calendar = await getAuthedCalendar(supabase);
    if (!calendar) {
      return {
        ...empty,
        error: "Google Calendar not connected in admin Settings.",
      };
    }

    const calendarId =
      process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
    const times = buildEventDateTimes(
      input.appointmentDate,
      input.startTimeHms,
    );

    const summary = `Funding review — ${input.businessName || SITE_NAME}`;
    const description = [
      `Funding review call with ${SITE_NAME}.`,
      `Applicant: ${input.applicantName}`,
      `Business: ${input.businessName}`,
      "",
      "This is a review call, not a funding approval.",
    ].join("\n");

    const res = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary,
        description,
        start: times.start,
        end: times.end,
        attendees: input.applicantEmail
          ? [{ email: input.applicantEmail, displayName: input.applicantName }]
          : [],
        conferenceData: {
          createRequest: {
            requestId: `btf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const event = res.data;
    const meetLink =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
        ?.uri ||
      null;

    if (!meetLink && event.id) {
      console.error(
        "[google-calendar] event created without Meet link; conferenceData:",
        JSON.stringify(event.conferenceData ?? null),
      );
      return {
        meetLink: null,
        eventId: event.id,
        htmlLink: event.htmlLink ?? null,
        error:
          "Calendar event created but no Meet link returned. Confirm Google Meet is available on this Workspace account.",
      };
    }

    return {
      meetLink,
      eventId: event.id ?? null,
      htmlLink: event.htmlLink ?? null,
      error: null,
    };
  } catch (err) {
    const message = formatGoogleApiError(err);
    console.error("[google-calendar] create event failed:", message, err);
    return { ...empty, error: message };
  }
}

export type GoogleCalendarTestResult = {
  ok: boolean;
  message: string;
  meetLink?: string | null;
  htmlLink?: string | null;
  eventId?: string | null;
};

/**
 * Creates a short throwaway Meet event to verify OAuth + Calendar API + Meet,
 * then deletes it. Safe for admin Settings “Test” button.
 */
export async function testGoogleCalendarMeet(
  supabase: SupabaseClient,
): Promise<GoogleCalendarTestResult> {
  const calendar = await getAuthedCalendar(supabase);
  if (!calendar) {
    return {
      ok: false,
      message: "Not connected. Connect Google Calendar first.",
    };
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const start = new Date(Date.now() + 60 * 60 * 1000);
  const end = new Date(start.getTime() + REVIEW_DURATION_MINUTES * 60 * 1000);

  const toLocalParts = (d: Date) => {
    // Format in REVIEW_TIMEZONE via Intl so Test matches booking timezone.
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: REVIEW_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = Object.fromEntries(
      fmt.formatToParts(d).map((p) => [p.type, p.value]),
    );
    const hour = parts.hour === "24" ? "00" : parts.hour;
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      time: `${hour}:${parts.minute}:${parts.second}`,
    };
  };

  const startParts = toLocalParts(start);
  const endParts = toLocalParts(end);

  let eventId: string | null = null;

  try {
    const res = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: `[BTF test] Meet check — delete me`,
        description: `Temporary ${SITE_NAME} admin test. Safe to delete.`,
        start: {
          dateTime: `${startParts.date}T${startParts.time}`,
          timeZone: REVIEW_TIMEZONE,
        },
        end: {
          dateTime: `${endParts.date}T${endParts.time}`,
          timeZone: REVIEW_TIMEZONE,
        },
        conferenceData: {
          createRequest: {
            requestId: `btf-test-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    eventId = res.data.id ?? null;
    const meetLink =
      res.data.hangoutLink ||
      res.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video",
      )?.uri ||
      null;

    if (eventId) {
      try {
        await calendar.events.delete({ calendarId, eventId });
      } catch (delErr) {
        console.warn(
          "[google-calendar] test event cleanup failed:",
          formatGoogleApiError(delErr),
        );
      }
    }

    if (!meetLink) {
      return {
        ok: false,
        message:
          "Calendar API worked, but no Meet link came back. Check that this Google account can create Meet links (Workspace / Meet enabled).",
        eventId,
        htmlLink: res.data.htmlLink ?? null,
      };
    }

    return {
      ok: true,
      message: "Calendar + Meet OK. Test event was created and removed.",
      meetLink,
      eventId,
      htmlLink: res.data.htmlLink ?? null,
    };
  } catch (err) {
    const message = formatGoogleApiError(err);
    console.error("[google-calendar] test failed:", message, err);
    if (eventId) {
      try {
        await calendar.events.delete({ calendarId, eventId });
      } catch {
        /* ignore */
      }
    }
    return { ok: false, message };
  }
}
