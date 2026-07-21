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
};

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
  };

  try {
    const calendar = await getAuthedCalendar(supabase);
    if (!calendar) return empty;

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

    return {
      meetLink,
      eventId: event.id ?? null,
      htmlLink: event.htmlLink ?? null,
    };
  } catch (err) {
    console.error("[google-calendar] create event failed:", err);
    return empty;
  }
}
