# Built Together Funding ? Web

Marketing site and **pre-qualification / lead capture** funnel for **Built Together Funding Corp**: multi-section homepage, a five-step `/apply/` flow (3 questions + bank-statement upload + contact), `POST /api/apply/` with server-side scoring, `POST /api/statements/` file uploads to Supabase Storage, secure `/upload/{token}/` follow-up links, Resend/Twilio notifications, env-gated analytics, and draft legal pages.

**Brand line:** *Funding is a commitment to growth.*

> **Compliance:** On-site legal copy is a **working draft**. Do not run paid advertising or regulated outbound campaigns until a qualified attorney reviews Privacy Policy, Terms, Disclosures, and claims. The site avoids guaranteed-funding language; keep it that way.

**More context:** [CONTEXT-INDEX.md](./CONTEXT-INDEX.md), [CONTEXT-PACK-MAX-FIDELITY.md](./CONTEXT-PACK-MAX-FIDELITY.md).

## Stack

- **Next.js 15** (App Router), **React 18**, **TypeScript**
- **Tailwind CSS** 3
- **react-hook-form** + **Zod** 4 (apply funnel)
- **Supabase** (Postgres via `supabase-js` + service role on server)
- **Resend**, **Twilio** (optional notifications)
- **Trailing slashes:** `next.config.mjs` sets `trailingSlash: true` ? internal links should use paths like `/about/`.

## Requirements

- Node.js **18.18+** (recommended: **20 LTS**)

## Setup

```bash
npm install
copy .env.local.example .env.local
```

(macOS/Linux: `cp .env.local.example .env.local`.)

Fill `.env.local` using the template and sections below.

## Routes (marketing and legal)

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/apply/` | Pre-screen funnel |
| `/how-it-works/` | Process |
| `/who-we-help/` | Audience |
| `/funding-uses/` | Use cases |
| `/about/` | About |
| `/resources/` | Resource library (articles in `lib/articles.ts`) |
| `/resources/[slug]/` | Individual articles (SSG) |
| `/contact/` | Contact |
| `/privacy-policy/` | Privacy (draft) |
| `/terms/` | Terms of use (draft) |
| `/disclosures/` | Funding disclosures (draft) |
| `/api/apply/` | Apply submission API (POST) |
| `/api/statements/` | Bank-statement upload API (POST, multipart) |
| `/upload/[token]/` | Secure follow-up statement upload for "send later" leads |
| `/admin/leads/` | Optional lead table (env + secret; see below) |

## Environment variables

Copy from [`.env.local.example`](./.env.local.example). Summary:

### Site / contact (public)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata |
| `NEXT_PUBLIC_PHONE` | `tel:` value (E.164-friendly) |
| `NEXT_PUBLIC_PHONE_DISPLAY` | Display label for phone |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Mailto on contact page + footer |
| `NEXT_PUBLIC_BUSINESS_ADDRESS` | Footer business address (recommended before paid ads) |

### Supabase

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (optional until client-side Supabase is used) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Full access; never expose in frontend code or public env in the browser. |

**Production:** Without URL + service role, apply submissions return a controlled error (leads are not stored).

### Resend (email)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key |
| `RESEND_FROM_EMAIL` | Verified from address |
| `INTERNAL_NOTIFY_EMAIL` | Internal lead notifications |

If unset, email is skipped; the API still succeeds when Supabase save works.

### Twilio (SMS)

| Variable | Purpose |
|----------|---------|
| `TWILIO_ACCOUNT_SID` | Account SID |
| `TWILIO_AUTH_TOKEN` | Auth token |
| `TWILIO_PHONE_NUMBER` | From number |
| `INTERNAL_NOTIFY_PHONE` | Internal SMS (optional) |

Applicant SMS only sends when the user opts in. If Twilio is unset, SMS is skipped.

### Analytics (optional)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads (gtag) |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Conversion label (with Ads ID) |

Scripts load **only** when the corresponding IDs are set at build time. UTM / click IDs are stored in **sessionStorage** as attribution metadata only (not form answers).

### Temporary admin viewer (optional)

| Variable | Purpose |
|----------|---------|
| `ADMIN_DASHBOARD_SECRET` | If set, `/admin/leads/?secret=THIS_VALUE` shows a minimal lead table (server-side). **Not** production authentication. |

If unset, the admin route explains that the dashboard is not configured.

## Supabase

1. Run [`docs/supabase-leads.sql`](./docs/supabase-leads.sql) in the Supabase SQL editor (creates the `leads` table **and** the private `statements` storage bucket; a migration block for v1 deployments is at the bottom).
2. See [`docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md) for project creation, env vars, RLS, statement-upload flow, and `lead_status` meanings.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint (`next lint`) |

## Deployment (Vercel)

1. Connect the repository; framework **Next.js** (`vercel.json` uses `next build`).
2. Add all required secrets in **Project Settings ? Environment Variables** (especially `SUPABASE_SERVICE_ROLE_KEY`, Resend/Twilio if used).
3. Redeploy after changing env vars.
4. Follow [`docs/LAUNCH_CHECKLIST.md`](./docs/LAUNCH_CHECKLIST.md) before paid launch.

## Legal / compliance notes

- Required disclaimer themes live in `lib/constants.ts` (`DISCLAIMER_PREQUAL_LINE`, `LEGAL_NO_GUARANTEE_LINE`, `DISCLAIMER_SHORT`).
- Do not add ?guaranteed approval,? ?instant approval,? ?you are funded,? bad-credit/no-docs bait, or fake social proof.

## Phase status (high level)

Scaffold through **Phase 9** (tracking) are implemented in this repo; **Phase 10** adds launch docs, env polish, and the optional admin scaffold. See CONTEXT-INDEX for full phase history.
