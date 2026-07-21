# Google Calendar + Meet — finish setup (owner checklist)

You already created the OAuth client. After this code is deployed:

## 1. Run SQL in Supabase (SQL Editor)

1. Paste and run `docs/supabase-v5-crm-calendar-articles.sql`
2. Paste and run `docs/supabase-v5-seed-articles.sql` (loads the 3 existing resources)

## 2. Enable Google Calendar API (required — OAuth alone is not enough)

In [Google Cloud Console](https://console.cloud.google.com/) → the same project as your OAuth client:

1. **APIs & Services → Library**
2. Search **Google Calendar API** → **Enable**
3. Wait ~1 minute after enabling

If Calendar API is off, Admin Settings may still show **Connected**, but bookings will soft-fail with no Meet link. Use **Test Meet** in Settings to confirm.

## 3. Add env vars in Vercel → Project → Settings → Environment Variables (Production)

| Name | Value |
|------|--------|
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID you copied |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Client secret you copied |
| `GOOGLE_CALENDAR_ID` | `primary` (optional) |

Redeploy after saving.

## 4. Confirm Google OAuth redirect URI

In Google Cloud → Credentials → your Web client → Authorized redirect URIs must include exactly:

`https://builttogetherfunding.com/api/admin/google/callback/`

## 5. Confirm test user (External consent)

OAuth consent screen → Audience / Test users → add `contact@builttogetherfunding.com`

For long-lived refresh tokens (Testing mode expires ~7 days), consider **Publish** the app (owner-only use is fine).

## 6. Connect + Test in admin

1. Sign in at `/admin/login/`
2. Open **Settings**
3. Click **Connect Google Calendar**
4. Sign in as `contact@builttogetherfunding.com` → Allow
5. Click **Test Meet** — must say Calendar + Meet OK
6. Book a **new** funding review (old bookings will not backfill Meet)

Done. New bookings create a Meet event, invite the applicant, and email the Meet link.

## If Connect fails

- `missing_config` → env vars missing or no redeploy
- `no_refresh` → Disconnect, then Connect again (Google only sends refresh token with consent)
- `denied` → you clicked Cancel on Google’s screen

## If Connected but Meet fails

| Symptom / Test Meet message | Fix |
|-----------------------------|-----|
| Calendar API not enabled / Access Not Configured | Enable **Google Calendar API** (§2), wait, Test again |
| invalid_grant / refresh token expired | Disconnect → Connect; Publish OAuth app if in Testing |
| Event created but no Meet link | Confirm Meet is available on that Google / Workspace account |
| Soft-fail email: “Meet: not created — …” | Internal booking email now includes the real reason after deploy |

## SMS (separate from Google)

In Settings, use **Test SMS** after Twilio env vars are set on Production + Redeploy:

- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (E.164)
- `INTERNAL_NOTIFY_PHONE=+17182852368,+13473034705`

If Test SMS fails, check Twilio Console → Monitor → Messaging logs (trial geo limits, A2P 10DLC, wrong from-number).
