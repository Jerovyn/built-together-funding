# Supabase setup — Built Together Funding

This app writes apply-funnel leads to Postgres and bank-statement files to Storage via the **Supabase service role** from the Next.js **`POST /api/apply/`** and **`POST /api/statements/`** routes only. Browser code must never receive `SUPABASE_SERVICE_ROLE_KEY`.

## 1. Create a project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Wait for the database to finish provisioning.
3. In **Project Settings > API**, note:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for future client use; optional today)
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only; treat as a secret)

## 2. Create the `leads` table and `statements` bucket

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the full contents of [`docs/supabase-leads.sql`](./supabase-leads.sql).
3. Run the script. It creates `public.leads` **and** the private `statements` storage bucket.

Confirm **Table Editor** shows `public.leads` and **Storage** shows a private `statements` bucket.

> Upgrading from the 12-question funnel? Run the commented `MIGRATION from v1`
> block at the bottom of the SQL file instead of recreating the table.

### Bank statement files

- Funnel uploads land under `statements/presubmit/{session}/` before the lead exists; the paths are saved on the lead row at submit.
- "Send later" leads get a secure link (`/upload/{upload_token}/`) in their confirmation email/SMS; those files land under `statements/leads/{lead_id}/` and flip `statements_status` to `received`.
- The bucket is private. Only the service role reads it. Add a periodic cleanup for `presubmit/` orphans older than ~30 days.
- `NEXT_PUBLIC_SITE_URL` must be set in production for the secure upload links in notifications to be generated.

## 3. Environment variables (deployment)

Set in `.env.local` (development) and in Vercel **Environment Variables** (production):

| Variable | Required for saving leads in production |
|----------|----------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is optional for the current codebase but should be set if you later use Supabase from the browser.

**Production behavior:** If Supabase URL or service role is missing in production, `POST /api/apply/` returns a controlled error and does not claim the lead was stored.

**Development:** Missing Supabase env skips the insert but does not crash the dev server (notifications may still run if Resend/Twilio are set).

## 4. Row Level Security (RLS)

The SQL enables RLS on `public.leads` with **no policies** for `anon` / `authenticated`. That means:

- The **service role** (used by your API route) **bypasses RLS** and can read/write as needed.
- If you expose this table to PostgREST for logged-in users, you must add explicit policies. Do not rely on “open by default.”

## 5. How leads flow from `/apply/` to Supabase

1. User answers 3 questions (time in business, amount, use of funds), uploads statements or picks "send later," then adds contact + consent.
2. Statement files upload one-per-request to `POST /api/statements/` (4MB/file cap keeps requests under Vercel's body limit); the API returns storage paths.
3. Browser `POST`s JSON to `/api/apply/` (form fields + statement paths + optional UTM / attribution metadata from session).
4. Server validates with Zod, computes **lead score** and **tier** (`prequalified`, `needs_review`, `not_fit_yet`). Uploaded statements are the strongest scoring signal.
5. Server maps tier to **`lead_status`** stored in the database:
   - `prequalified` → `prequalified`
   - `needs_review` → `needs_review`
   - `not_fit_yet` → `not_fit`
6. Server inserts one row into `public.leads` (including `statement_paths`, `statements_status`, and a unique `upload_token`).
7. Resend/Twilio run after a successful insert (if configured). "Send later" leads get the secure upload link in email/SMS.

## 6. `lead_status` values

The check constraint allows:

| Status | Typical meaning |
|--------|------------------|
| `new` | Default on insert if you ever insert without overriding (API sets explicit status from tier) |
| `prequalified` | Pre-screen tier met the “prequalified” band |
| `needs_review` | Manual review band |
| `not_fit` | Client tier `not_fit_yet` |
| `contacted` | Ops follow-up (update manually or via future tooling) |
| `call_booked` | Strategy call scheduled |
| `submitted_to_partner` | Sent to a funding partner |
| `funded` | Closed-won (use only if accurate) |
| `lost` | Closed-lost / disqualified |

Internal workflow statuses after insert are your process; the app only sets the first three from the funnel.

## 7. Troubleshooting

- **Insert fails:** Confirm the SQL ran without errors, RLS is as shipped, and the service role key matches the project.
- **Trigger errors:** `docs/supabase-leads.sql` uses `execute function` (PostgreSQL 14+). Supabase uses a current Postgres version; if your environment differs, adjust per Postgres docs.
