# Launch checklist — Built Together Funding

Use this before paid ads, high-volume outbound, or any compliance-sensitive go-live. Legal copy on the site is **draft** until counsel signs off.

## Local QA

- [ ] `npm install`
- [ ] `npm run lint` (no errors)
- [ ] `npm run build` (success)
- [ ] `npm run dev` — spot-check:
  - [ ] `/` (home)
  - [ ] `/apply/` (full funnel, validation)
  - [ ] `/how-it-works/`, `/who-we-help/`, `/funding-uses/`, `/about/`, `/resources/`, `/contact/`
  - [ ] `/privacy-policy/`, `/terms/`, `/disclosures/`
- [ ] Confirm internal links use **trailing slashes** (site uses `trailingSlash: true`)
- [ ] Resize to mobile width; primary CTAs and apply steps remain usable

## Supabase

- [ ] Create project; copy URL and **service_role** key (server-only)
- [ ] Run [`docs/supabase-leads.sql`](./supabase-leads.sql) in SQL Editor
- [ ] Confirm `public.leads` exists
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in production env
- [ ] Submit a **test** application on deployed or local API-backed environment
- [ ] Confirm a new row appears with expected `lead_status` and score

## Resend

- [ ] Verify sender domain / from-address in Resend
- [ ] Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `INTERNAL_NOTIFY_EMAIL`
- [ ] Submit test application
- [ ] Confirm internal notification email and applicant confirmation (if applicable)

## Twilio

- [ ] Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `INTERNAL_NOTIFY_PHONE`
- [ ] Test applicant SMS **only** with **SMS consent** checked; confirm **STOP** language in product copy
- [ ] Confirm internal SMS if desired (optional)

## Analytics (optional)

- [ ] Set `NEXT_PUBLIC_GA4_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID` and/or Google Ads IDs
- [ ] Submit test lead; verify events in GA4 / Meta / Ads (as applicable)
- [ ] Confirm no PII is sent in custom event payloads (see `lib/tracking.ts`)

## Compliance

- [ ] Attorney review of **Privacy Policy**, **Terms**, **Disclosures**, and on-page claims
- [ ] No “guaranteed approval,” “instant approval,” “you are funded,” bad-credit/no-docs bait
- [ ] Core lines present where appropriate:
  - “Pre-qualification is not funding approval. Final options are subject to review, underwriting, and partner availability.”
  - “Built Together Funding does not guarantee approval, terms, rates, savings, profit increases, or funding availability.”

## Deployment (Vercel example)

- [ ] Push to GitHub (or connect repo)
- [ ] Import project in Vercel; framework **Next.js**
- [ ] Add **all** required env vars (see `.env.local.example` and [README](../README.md))
- [ ] Deploy; smoke-test production URL
- [ ] Submit production test application end-to-end
- [ ] Verify trailing slashes and mobile layout on production

## Admin scaffold (optional)

- [ ] If using `/admin/leads/`: set `ADMIN_DASHBOARD_SECRET`; open only with `?secret=...`
- [ ] Replace with real authentication before treating as production tooling

## Still needed before paid launch

- Final **legal** sign-off
- Verified **sender** (email) and **phone** numbers for your brand
- Decision on whether **admin** or a CRM is the system of record after lead capture
