# Google Calendar + Meet — finish setup (owner checklist)

You already created the OAuth client. After this code is deployed:

## 1. Run SQL in Supabase (SQL Editor)

1. Paste and run `docs/supabase-v5-crm-calendar-articles.sql`
2. Paste and run `docs/supabase-v5-seed-articles.sql` (loads the 3 existing resources)

## 2. Add env vars in Vercel → Project → Settings → Environment Variables (Production)

| Name | Value |
|------|--------|
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID you copied |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Client secret you copied |
| `GOOGLE_CALENDAR_ID` | `primary` (optional) |

Redeploy after saving.

## 3. Confirm Google OAuth redirect URI

In Google Cloud → Credentials → your Web client → Authorized redirect URIs must include exactly:

`https://builttogetherfunding.com/api/admin/google/callback/`

## 4. Confirm test user (External consent)

OAuth consent screen → Audience / Test users → add `contact@builttogetherfunding.com`

## 5. Connect once in admin

1. Sign in at `/admin/login/`
2. Open **Settings**
3. Click **Connect Google Calendar**
4. Sign in as `contact@builttogetherfunding.com` → Allow

Done. New bookings create a Meet event, invite the applicant, and email the Meet link.

## If Connect fails

- `missing_config` → env vars missing or no redeploy
- `no_refresh` → Disconnect, then Connect again (Google only sends refresh token with consent)
- `denied` → you clicked Cancel on Google’s screen
