# Built Together Funding — MAX-FIDELITY CONTEXT PACK

**Generated:** July 21, 2026 (evening, post-CRM/Meet/content/SMS session)  
**Purpose:** Paste this (or open this file) in a new Cursor chat so work continues without loss.  
**Repo:** `C:\Users\Asus\BTF CORP`  
**GitHub:** https://github.com/Jerovyn/built-together-funding  
**Live domain:** https://builttogetherfunding.com  
**Vercel:** project `built-together-funding` (also `*.vercel.app`)  
**Git HEAD:** `13745aa` on `main` (synced with `origin/main`)

### Related docs (do not ignore)

- `CONTEXT-INDEX.md` — original brand/funnel/compliance brain (**dark theme sections outdated**; prefer this pack + light theme)
- `docs/LAUNCH_CHECKLIST.md`, `docs/SUPABASE_SETUP.md`
- `docs/GOOGLE_CALENDAR_SETUP.md`, `docs/GOOGLE_MAPS_PLACES_SETUP.md`, `docs/OPENAI_SETUP.md`
- SQL: `docs/supabase-leads.sql` → `docs/supabase-leads-v3-migration.sql` → `docs/supabase-bookings-v4-migration.sql` → `docs/supabase-v5-crm-calendar-articles.sql` → `docs/supabase-v5-seed-articles.sql`
- `.env.local.example` — current env contract

---

## 0. One-sentence project truth

Built Together Funding is a Next.js marketing + pre-qualification lead system for service/trade businesses: capacity-first funding philosophy, 5-step apply funnel, Supabase leads + statement storage, Wash Kings–style funding-review booking with Google Meet, password admin CRM (leads detail + underwriting ZIP, content desk, Google connect), Resend/Twilio notifications, SEO resources with AI-from-infographic drafts — deployed on Vercel, domain DNS at SiteGround, email via Resend + Google Workspace.

---

## 1. Owner / operator decisions (explicit)

### Brand & positioning

- **Brand:** Built Together Funding Corp / Built Together Funding
- **Brand line:** “Funding is a commitment to growth.”
- **Hero line:** “Where funding is a commitment to growth.”
- **Philosophy:** Fund capacity only when demand already exists; not rescue capital, not beginners, not “get cash fast.”
- **Primary CTA:** “Get pre-qualified” (`CTA_PREQUAL_LABEL`)
- **Voice:** Operator-led, direct, short, practical. No fake testimonials, fake logos, fake approval rates.
- **Social proof / testimonials:** Explicitly skipped — owner filming at Florida convention later.
- **Legal pages:** draft until attorney review; do not run paid ads until counsel signs off.
- **Local SEO:** Home base Staten Island / NYC metro; serve trades nationwide. Content AI may lightly mention SI/NYC ~1 in 3 drafts when natural — never keyword-stuff every post.

### Design evolution (CRITICAL — CONTEXT-INDEX dark theme is outdated)

- Original CONTEXT-INDEX specified dark industrial luxury (#0A0A0A, electric cyan).
- **CURRENT LIVE DESIGN** is light / OnDeck-like fintech:
  - `btf-bg` #FFFFFF, `btf-secondary` #F7F8FA, accent `#1D4ED8`
  - Ink family for dark sections: `#081123` etc.
  - Font: Inter Tight via `next/font`
  - Media kit accents: `#082D54`, `#007ABE`, `#36D8F6`, `#F5F9FC`
- Site-wide ambient SVG ripple (`components/brand/brand-ambient-background.tsx`)
  - **Excluded on:** `/apply`, `/admin`, `/upload`, `/book`
  - Soft CSS animations (`btf-ripple-1/2/3`); respects `prefers-reduced-motion`
- Homepage trades strip: light frosted pills, neon/royal blue text, 38 services in `HOME_TRADES_MARQUEE`, marquee 55s loop — NOT dark navy bar
- Hero trust chips: “Underwritten on bank statements”, credit chip, “Review within 1 business day”
- Owner rejected “Real bank statements, not forms” as misleading (site still has a form)

### Funnel (owner-simplified, then elevated) — 5 steps

1. **Your answers** — time in business, funding amount, use of funds  
2. **Bank statements** — upload or send later  
3. **About you** — name, email, phone, DOB, home address, SSN  
4. **Your business** — business name, EIN/federal ID, legal entity, business address  
5. **Confirm** — email/SMS consent + summary  

Additional UX (shipped):

- Contact captured early enough for mid-funnel partial saves (`POST /api/apply/partial/`)
- SSN via `SensitiveInput`; service-role only in DB
- Apply loading overlay; scroll on validation; formatters for phone/SSN/EIN/DOB
- Result page auto-opens booking modal once (`useRef` guard — avoid mobile reopen loop)
- **Address suggestions:** Google Places on home + business street fields (`AddressSuggestInput`); fills street/city/state/ZIP when key set
- **“Same as home address”** button on business step (copies address/state/ZIP; business city filled via Places when used)
- Browser autofill tokens on name/email/phone/DOB

### Booking (Wash Kings pattern — owner priority)

- After apply (if not `not_fit_yet`), return `bookingToken`; schedule funding review call
- Slots: Mon–Fri 9am–5pm `America/New_York`, 30 min
- Modal: full-screen on mobile (Option B), centered on desktop
- Modal flow: 2-step day → time; 5 days in modal, 10 on `/book/[token]/`
- Sticky Confirm footer; iOS body scroll lock (`lib/use-body-scroll-lock.ts`)
- Confirmation stays in modal with Done; result page shows `BookingConfirmed`
- APIs: `/api/booking/availability/`, `/api/booking/book/`
- Dev fallback token: `lib/booking/dev.ts` → `DEV_BOOKING_TOKEN` when no Supabase in development
- **Google Calendar + Meet:** on successful book, create Calendar event with Meet, invite applicant, store `meet_link` / `google_event_id` / `calendar_html_link` on `bookings`
  - Connect UI: `/admin/settings/` → Connect Google Calendar (OAuth)
  - Tokens in `public.app_integrations` id `google_calendar`
  - Soft-fail: booking always saves even if Meet fails; email may say “Meet: not created (connect Google in admin)”
  - **Order of operations (critical):** insert booking **first**, then attach Meet, then notifications — Meet hang must not block reservation
- **Known open issue (Jul 21 evening):** Admin Settings shows “Connected.” but booking emails still say Meet not created; SMS not received despite Vercel env claimed correct. Diagnose via Vercel logs (`[google-calendar] create event failed:`) and Twilio Messaging logs. Likely: Calendar API not enabled, OAuth External testing refresh issues, Meet create failing silently, Twilio A2P/trial/from-number/E.164, or env not on Production + redeploy. Fresh book after Connect is required for Meet on that booking.

### Underwriting package (CRM)

- Lead list → `/admin/leads/[id]/` detail
- Statement view via short-lived signed URLs (`POST /api/admin/leads/[id]/statement-url/`)
- **Download package ZIP** (`GET /api/admin/leads/[id]/package/`):
  - Branded `BTF-…-application.pdf` (logo, BTF colors, confidential banner)
  - `statements/*.pdf` (PDF passthrough; PNG/JPEG wrapped to PDF pages)
- **PDF intentionally OMITs** (anti lead-theft for partners): email, phone, lead ID, generated timestamp, pre-screen score/status/consents, attribution/UTM
- **PDF KEEPS:** owner name, DOB, SSN, home address; business name/entity/EIN/address/TIB; funding amount + use of funds; BTF branding + compliance footer
- SSN on detail page: masked with Reveal button (`SsnReveal`)

### Content desk (SEO blog)

- Admin nav: **Content** → `/admin/content/`
- Flow: pick infographic thumbnail → **Generate draft from image** (OpenAI vision) → proofread/edit → **Post to site** (instant via Supabase + `revalidatePath`)
- Images: `content/blog-images/` (~88 PNGs in git); served via `/api/content-images/[name]/`
- UI: thumbnail grid, large preview, **Used** badge if `featured_image_path` already on a draft/published article
- Single image per generate for now (multi-image deferred — owner OK)
- AI prompt defaults: ~4 min read; light SI/NYC SEO when natural; YMYL compliance; human proofreads only
- Cadence owner decision: **2–4 posts/week**, NOT 1–3/day
- Fallback static articles still in `lib/articles.ts` if DB empty; production prefers `public.articles`
- Env: `OPENAI_API_KEY` (required for generate); optional `OPENAI_ARTICLE_MODEL` (default `gpt-4o-mini`)
- OpenAI billing required; large ~2.5MB PNGs use `detail: "low"` to reduce failures

### Calculator

- `components/growth-calculator.tsx`: unbounded cost/revenue inputs; dynamic chart timeline; max render ~480 months

### Email architecture (owner decision July 2026)

| Address | Role |
|---------|------|
| `contact@builttogetherfunding.com` | Public site contact, Resend from, Reply-To default |
| `subs@builttogetherfunding.com` | All internal alerts — apply, booking, ISO (`INTERNAL_NOTIFY_EMAIL`) |

- Separate Resend account from Wash Kings (shared pattern OK, separate domain verified)
- Twilio: can share Wash Kings account; prefer separate number long-term
- Google Workspace: `contact@` and `subs@` exist
- Cold email from primary domain: discouraged — use separate domain later
- Internal phones for SMS alerts (owner): `+17182852368` and `+13473034705` via comma-separated `INTERNAL_NOTIFY_PHONE`

### Admin CRM

- **NOT email login.** Password field only = `ADMIN_DASHBOARD_SECRET`
- Cookie session HMAC (`btf_admin_session`), 7 days; middleware protects `/admin/*` except `/admin/login`
- Routes: `/admin/login/`, `/admin/leads/`, `/admin/leads/[id]/`, `/admin/appointments/`, `/admin/content/`, `/admin/content/[id]/`, `/admin/settings/`, `/admin/` dashboard
- **Login page de-identified:** no `subs@`, no `ADMIN_DASHBOARD_SECRET`, no “Vercel” copy — just brand + “Sign in” + Password
- Login API errors generic (“Incorrect password.” / “Sign in is unavailable.”) — do not leak config
- Security: rotate `ADMIN_DASHBOARD_SECRET` if ever typed in chat; never store passwords in repo

### Hosting / domain

- Vercel = permanent app host; cancel SiteGround hosting after DNS stable; keep domain renewal
- SiteGround DNS: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
- Resend DNS (DKIM/SPF/MX for send) also in SiteGround, not Vercel DNS

### Explicit non-goals / skipped

- Social proof testimonials for now
- Full multi-user auth for admin (password secret enough for small team)
- Heavy cold email infrastructure
- Running `npm run build` while `npm run dev` is running (corrupts `.next`)
- Daily mass SEO posting

---

## 2. Stack & architecture

### Stack

- Next.js 15 App Router, React 18, TypeScript
- Tailwind CSS 3
- react-hook-form + Zod 4
- `@supabase/supabase-js` (service role server-only)
- Resend, Twilio (optional)
- `googleapis` (Calendar + Meet OAuth)
- `jszip` + `pdf-lib` (underwriting packages)
- OpenAI Chat Completions vision (content generate)
- `trailingSlash: true` in `next.config.mjs`
- `outputFileTracingIncludes` for `content/blog-images/**` and `public/brand/**` on relevant routes
- Deploy: Vercel (`vercel.json` → `next build`)
- Dev: `npm run dev -- -H 0.0.0.0` when testing network/mobile

### Key directories

```
app/                    # routes + API
components/apply/       # funnel UI + AddressSuggestInput
components/booking/     # scheduler + modal
components/brand/       # ambient background
components/admin/       # CRM shell, login, content editor, Google connect, statements
components/home/        # homepage
lib/                    # scoring, schema, notifications, booking, supabase, google-calendar, openai-article, underwriting-pdf
docs/                   # SQL + launch + Google/OpenAI setup
content/blog-images/    # SEO infographic source (~88 PNGs)
public/                 # brand, images, opening splash videos
```

### Important routes

| Path | Role |
|------|------|
| `/` | Homepage + opening splash + calculator + marquee |
| `/apply/` | 5-step funnel |
| `/book/[token]/` | Standalone booking page |
| `/upload/[token]/` | Statement follow-up upload |
| `/admin/login/` | Password CRM login (de-identified copy) |
| `/admin/leads/`, `/admin/leads/[id]/` | CRM list + detail/package |
| `/admin/appointments/` | Calls (Meet link column when present) |
| `/admin/content/`, `/admin/content/[id]/` | Content desk |
| `/admin/settings/` | Google Calendar connect |
| `/resources/`, `/resources/[slug]/` | Articles (DB-backed + static fallback) |
| `/iso/` | Partner signup |
| `/api/apply/`, `/api/apply/partial/` | Lead submit + partial |
| `/api/statements/` | Multipart uploads (4MB/file) |
| `/api/booking/availability/`, `/api/booking/book/` | Calendar |
| `/api/admin/login/`, `/api/admin/logout/` | Session |
| `/api/admin/leads/[id]/package/`, `.../statement-url/` | Underwriting |
| `/api/admin/articles/`, `.../generate/`, `.../[id]/` | CMS |
| `/api/admin/google/connect|callback|disconnect/` | OAuth |
| `/api/content-images/[name]/` | Serve blog PNGs |
| `/api/iso/` | ISO email notify |

### Data flow (apply → book)

1. Client validates steps; may `POST /api/apply/partial/` after contact fields  
2. Statements → `POST /api/statements/` → paths under `statements/presubmit/{session}/`  
3. Final `POST /api/apply/` → Zod → score → insert/update leads → notifications → `{ ok, status, bookingToken }`  
4. Result UI → booking modal → `POST /api/booking/book/` → insert `bookings` → optional Meet → emails/SMS → `{ ok, slotLabel, meetLink }`  

### Scoring (`lib/apply-scoring.ts`) — pre-screen only, not underwriting

- Time in business: +35 / +25 / +12 / −30  
- Use of funds: growth uses +25; other +12; only “other” −10  
- Statements uploaded +30; skipped +5; funding amount selected +5  
- Tiers: ≥70 `prequalified`, ≥40 `needs_review`, else `not_fit_yet` → DB `not_fit`

---

## 3. Supabase

### Project

- Named Built Together Funding (FREE tier)
- Owner reported earlier SQL editors run (leads + v3 + v4); **v5 must be confirmed run** for Meet columns, `app_integrations`, `articles`

### Migrations order

1. `docs/supabase-leads.sql` — leads + private `statements` bucket  
2. `docs/supabase-leads-v3-migration.sql` — owner/business fields  
3. `docs/supabase-bookings-v4-migration.sql` — partial status, `booking_token`, `bookings`  
4. `docs/supabase-v5-crm-calendar-articles.sql` — Meet fields, `app_integrations`, `articles`  
5. `docs/supabase-v5-seed-articles.sql` — seed 3 original resources  

### Critical tables

- `public.leads` — full application + UTM + `statement_paths` + `upload_token` + `booking_token` + statuses including `partial` + `sms_consent`
- `public.bookings` — appointment + optional Meet fields; unique `(date, start_time)`; RLS on; service role bypasses
- `public.app_integrations` — Google OAuth refresh payload
- `public.articles` — draft/published resources CMS

### Production behavior

- Missing Supabase in production → apply returns controlled 503  
- Dev can soft-skip insert and still return `DEV_BOOKING_TOKEN` for booking UI testing  

---

## 4. Environment variables (production contract)

See `.env.local.example`. Set on Vercel **Production** then **Redeploy** (`NEXT_PUBLIC_*` baked at build).

```
NEXT_PUBLIC_SITE_URL=https://builttogetherfunding.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@builttogetherfunding.com
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_PHONE_DISPLAY=
NEXT_PUBLIC_BUSINESS_ADDRESS=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@builttogetherfunding.com
RESEND_REPLY_TO_EMAIL=contact@builttogetherfunding.com
INTERNAL_NOTIFY_EMAIL=subs@builttogetherfunding.com

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=          # E.164 from-number
INTERNAL_NOTIFY_PHONE=        # +17182852368,+13473034705

ADMIN_DASHBOARD_SECRET=

OPENAI_API_KEY=
OPENAI_ARTICLE_MODEL=gpt-4o-mini

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # Places suggestions on /apply/

GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_CALENDAR_ID=primary

NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=
```

### Email / SMS behavior (code)

- Applicant emails: from `contact@`, Reply-To `contact@` (`withReplyTo`)
- Internal alerts: to `subs@`; Reply-To often applicant email
- Apply SMS: internal → both notify phones; applicant only if `smsConsent`
- Booking SMS: internal → both phones (+ Meet if present); applicant booking SMS if `sms_consent` on lead (E.164 normalize via `toE164Phone`)
- Implemented in `lib/resend.ts`, `lib/notifications.ts`, `lib/twilio.ts`, `app/api/iso/route.ts`

---

## 5. Recent git history (what shipped this session + prior)

| Commit | Summary |
|--------|---------|
| `7a4504d` | Initial site: funnel, booking CRM, admin |
| `6dd6632` | Site-wide ambient ripple background |
| `6555b9b` | Trades marquee light pills + expanded services |
| `1c61465` | Hero trust chip → underwritten on bank statements |
| `9d90ff8` | contact@ / subs@ email roles, reply-to, clearer admin login (+ blog-images) |
| `6a5c692` | CRM lead packages, Google Meet bookings, content desk |
| `ea7d27a` | Multiple `INTERNAL_NOTIFY_PHONE` numbers |
| `450a79c` | Branded underwriting PDFs + OpenAI article-from-image |
| `0a7c746` | 4-min/local SEO prompt; strip contact from underwriting PDFs |
| `3639312` | Booking 500 harden + Places address suggestions |
| `13745aa` | Applicant booking SMS + E.164 normalize |

---

## 6. Known bugs / ops pitfalls

- `.next` corruption if `npm run build` while `npm run dev` — delete `.next`, kill port 3000, restart dev only
- Env vars without Redeploy — especially `NEXT_PUBLIC_*` and Supabase — appear connected but APIs stay offline/dev
- Admin login — password only; if secret unset → generic unavailable message (no env leak)
- Sitemap fallback defaults to `builttogetherfunding.com` if `NEXT_PUBLIC_SITE_URL` missing
- Opening splash posters may 404 — videos under `public/opening screen/`
- README may still mention older admin `?secret=` pattern — current auth is cookie + `/admin/login/`
- CONTEXT-INDEX dark palette is historical; do not revert unless owner asks
- Large `content/blog-images/` in git may slow clones/deploys
- Google OAuth **External + Testing**: refresh tokens expire ~7 days; Publish app for long-lived connect (owner-only use)
- Google “Connected” ≠ Meet works — token present but Calendar API / Meet create can still fail
- Booking UI used to show “Booking failed” when server returned non-JSON 500 after emails already sent — mitigated by try/catch + book-first architecture; still verify on live
- Twilio US A2P 10DLC / trial geo limits can block SMS even when env is “correct”
- Address suggestions need Maps JS + Places enabled and domain-restricted key + redeploy

---

## 7. Unfinished / next work (priority order)

### A. Ops / live verification (owner — partially incomplete as of pack time)

1. Confirm Vercel Production env matches `.env.local.example` (emails, Supabase, admin, Twilio, Google OAuth, Maps, OpenAI)  
2. Redeploy after any env change  
3. Run/confirm Supabase **v5** SQL + seed if not already  
4. **Diagnose Meet soft-fail** while Settings says Connected — Vercel logs + enable Google Calendar API; reconnect; Publish OAuth app if Testing; book **new** test after fix  
5. **Diagnose SMS** — Twilio Monitor → Messaging logs; verify Production env + E.164 from-number; A2P if needed  
6. E2E: apply → Supabase row → email/SMS to subs phones → book → Meet link + emails/SMS  
7. Confirm Resend domain verified; Workspace receives `subs@` / `contact@`  
8. Cancel SiteGround hosting only after domain stably serves Vercel  

### B. Product / content (agent-capable)

- Continue blog cadence 2–4/week from `content/blog-images/` via Content desk  
- Optional: multi-image generate (deferred)  
- Optional: rename/clean blob filenames in blog-images  
- Analytics IDs when ready  
- Phone/display/address public env for footer/contact  
- Attorney review of legal pages before paid ads  
- Social proof when video ready  

### C. Hardening / ports (later)

- Stronger admin auth if team grows  
- Cleanup job for orphan `statements/presubmit/` objects  
- Align outdated README/CONTEXT-INDEX dark-theme / admin `?secret=` docs  
- **Wash Kings:** owner wants same CRM/Meet/package/content pattern ported — do that in Wash Kings repo/chat with a handoff pack; do not edit Wash Kings from BTF workspace by default  

---

## 8. Compliance constraints (never violate)

**Never say:** approved, guaranteed, you are funded, instant approval, no docs, bad credit OK, get cash fast, fake social proof.

**Always allow / prefer:**

- “Your business may be a fit for a funding review.”  
- “This is not a funding approval. Final options are subject to review, underwriting, and partner availability.”  
- “Built Together Funding does not guarantee approval, terms, rates, savings, profit increases, or funding availability.”  
- Soft not-fit: “This may not be the right fit yet.”  

Constants: `DISCLAIMER_PREQUAL_LINE`, `LEGAL_NO_GUARANTEE_LINE`, `DISCLAIMER_SHORT`, `CREDIT_CHECK_LINE` in `lib/constants.ts`.

SMS only if consent; include STOP language.

---

## 9. UX / frontend design rules (owner + Cursor rules)

- Brand-first heroes; avoid generic purple/cream AI looks  
- Ambient background intentional on marketing pages  
- Cards only when interaction requires; avoid clutter in hero  
- Match existing light BTF design system (`btf-*` tokens)  
- Mobile booking: full-screen sheet; do not reintroduce cramped 58dvh bottom sheet  
- Prefer matching existing patterns when editing  

---

## 10. How to continue in a new chat (agent prompt)

Paste this file or say:

> Continue Built Together Funding from CONTEXT-PACK-MAX-FIDELITY.md. Repo at `C:\Users\Asus\BTF CORP`, GitHub Jerovyn/built-together-funding, live builttogetherfunding.com. Latest commit `13745aa`.  
> Immediate priorities: (1) diagnose Google Meet soft-fail despite Connected + fix SMS delivery, (2) confirm v5 SQL + Production env + E2E book with Meet, (3) keep content cadence 2–4/week.  
> Do not revert to dark theme. Do not use email as admin username. Preserve compliance language. Underwriting PDF must not include email/phone/lead-theft fields. Ask before committing unless I request a commit/push.

---

## 11. Implicit reasoning (why decisions were made)

- **Capacity capital + statements-first:** Real bank data beats self-reported revenue; short funnel increases completion.  
- **Wash Kings booking:** Owner already runs Wash Kings on Vercel; wanted same schedule-after-submit CRM pattern.  
- **Full-screen mobile modal:** Bottom sheet felt stuck; Option B chosen.  
- **Light ambient site-wide:** Media kit is light blue/white; dark navy trades bar conflicted.  
- **subs@ vs contact@:** Separates high-volume submission alerts from human client communication.  
- **Password-only admin:** Fast launch; full auth deferred.  
- **Slow SEO cadence:** Funding is YMYL; mass AI posting risks domain trust.  
- **SiteGround → Vercel:** Cost + Next.js fit; keep DNS at SiteGround.  
- **Underwriting PDF without contact:** Partners/lenders get underwriting data without ability to steal lead contact.  
- **Book-before-Meet:** Meet/API failures previously caused 500 UX while emails still sent; reservation must succeed first.  
- **Places autocomplete:** Prevents bad state/ZIP mismatches (e.g. 10314 with IL/LA).  
- **OpenAI vision + proof desk:** Owner wants generate → human edit → Post, not hand-write every article.  

---

## 12. File quick-reference for agents

| Concern | Start here |
|---------|------------|
| Apply steps/schema | `lib/apply-schema.ts`, `components/apply/apply-funnel.tsx` |
| Address autocomplete | `components/apply/address-suggest-input.tsx` |
| Scoring | `lib/apply-scoring.ts` |
| Booking UI | `components/booking/*`, `lib/booking/availability.ts` |
| Book API / Meet attach | `app/api/booking/book/route.ts`, `lib/google-calendar.ts` |
| Apply result + modal | `components/apply/apply-result.tsx` |
| Notifications / SMS | `lib/notifications.ts`, `lib/resend.ts`, `lib/twilio.ts` |
| Admin auth | `lib/admin-session.ts`, `middleware.ts`, `app/admin/login/` |
| Lead detail / package | `app/admin/(dashboard)/leads/[id]/`, `lib/underwriting-pdf.ts`, `lib/admin-leads.ts` |
| Content desk | `app/admin/(dashboard)/content/`, `lib/openai-article.ts`, `lib/articles-db.ts` |
| Ambient BG | `components/brand/brand-ambient-background.tsx` |
| Trades marquee | `lib/constants.ts` (`HOME_TRADES_MARQUEE`), `components/home/home-content.tsx` |
| Articles public | `lib/articles.ts` (fallback), `lib/articles-db.ts`, `app/resources/` |
| Blog assets | `content/blog-images/` |
| SQL | `docs/supabase-*.sql` |

---

## 13. Google Cloud checklist (owner state as of Jul 21)

- OAuth Web client created; redirect: `https://builttogetherfunding.com/api/admin/google/callback/`  
- Consent screen was **External** (Internal greyed out for project not under org) — add `contact@` as test user  
- `invalid_client` previously hit from bad/mismatched Vercel Client ID/secret — fixed by re-pasting + redeploy  
- Admin Settings UI shows Connected after OAuth success  
- Still need: Calendar API enabled, Meet create succeeding on **new** bookings, consider Publish app for non-expiring refresh  
- Maps/Places: separate `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with Maps JS + Places enabled, domain-restricted  

---

**End of max-fidelity pack.** Prefer this file over older dark-theme sections of `CONTEXT-INDEX.md` when they conflict. Prefer this pack’s unfinished §7 over older “ops complete” assumptions until Meet + SMS are verified on a fresh booking.
