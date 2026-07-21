# Built Together Funding — MAX-FIDELITY CONTEXT PACK

**Generated:** July 21, 2026  
**Purpose:** Paste this (or open this file) in a new Cursor chat so work continues without loss.  
**Repo:** `C:\Users\Asus\BTF CORP`  
**GitHub:** `https://github.com/Jerovyn/built-together-funding`  
**Live domain:** `https://builttogetherfunding.com`  
**Vercel:** project `built-together-funding` (also `*.vercel.app`)  
**Git HEAD:** `9d90ff8` on `main` (synced with `origin/main`)

**Related docs (do not ignore):**
- `CONTEXT-INDEX.md` — original brand/funnel/compliance brain (partially superseded by light theme + expanded funnel below)
- `docs/LAUNCH_CHECKLIST.md`, `docs/SUPABASE_SETUP.md`
- SQL: `docs/supabase-leads.sql` → `docs/supabase-leads-v3-migration.sql` → `docs/supabase-bookings-v4-migration.sql`
- `.env.local.example` — current env contract

---

## 0. One-sentence project truth

Built Together Funding is a **Next.js marketing + pre-qualification lead system** for service/trade businesses: capacity-first funding philosophy, 5-step apply funnel, Supabase leads + statement storage, Wash Kings–style funding-review booking calendar, password admin CRM, Resend/Twilio notifications, and SEO resources — deployed on **Vercel**, domain DNS at **SiteGround**, email via **Resend + Google Workspace**.

---

## 1. Owner / operator decisions (explicit)

### Brand & positioning
- Brand: **Built Together Funding Corp** / **Built Together Funding**
- Brand line: **“Funding is a commitment to growth.”**
- Hero line: **“Where funding is a commitment to growth.”**
- Philosophy: Fund **capacity** only when **demand already exists**; not rescue capital, not beginners, not “get cash fast.”
- Primary CTA label: **“Get pre-qualified”** (not the older “See If You Qualify” everywhere — CTA_PREQUAL_LABEL is current).
- Voice: Operator-led, direct, short, practical. No fake testimonials, fake logos, fake approval rates.
- **Social proof / testimonials (#12 from UX audit):** Explicitly **skipped** — owner filming at Florida convention later.
- Legal pages are **draft** until attorney review; do not run paid ads until counsel signs off.

### Design evolution (CRITICAL — CONTEXT-INDEX dark theme is outdated)
- **Original CONTEXT-INDEX** specified dark industrial luxury (`#0A0A0A`, electric cyan).
- **CURRENT LIVE DESIGN** is **light / OnDeck-like fintech**:
  - `btf-bg` `#FFFFFF`, `btf-secondary` `#F7F8FA`, accent `#1D4ED8`
  - Ink family for dark sections: `#081123` etc.
  - Font: **Inter Tight** via `next/font`
- **Media kit colors** used in ambient background / marquee accents: `#082D54`, `#007ABE`, `#36D8F6`, `#F5F9FC`
- Site-wide **ambient SVG ripple background** on marketing pages (`components/brand/brand-ambient-background.tsx`)
  - Excluded on: `/apply`, `/admin`, `/upload`, `/book`
  - Soft CSS animations (`btf-ripple-1/2/3`); respects `prefers-reduced-motion`
- Homepage trades strip: **light frosted pills**, neon/royal blue text, **38 services** in `HOME_TRADES_MARQUEE`, marquee 55s loop — NOT dark navy bar anymore
- Hero trust chips: **“Underwritten on bank statements”**, credit chip, “Review within 1 business day”
  - Owner rejected “Real bank statements, not forms” as misleading (site still has a form)

### Funnel (owner-simplified, then elevated)
- **5 steps** (not original 7-question pack):
  1. Your answers — time in business, funding amount, use of funds
  2. Bank statements — upload or send later
  3. About you — name, email, phone, DOB, home address, **SSN**
  4. Your business — business name, EIN/federal ID, legal entity, business address
  5. Confirm — email/SMS consent + summary
- Contact captured early enough that **partial leads** can be saved mid-funnel
- Partial save API: `POST /api/apply/partial/`
- SSN treated as sensitive (service-role only; SensitiveInput UI)
- Apply UX: loading overlay (not full form replace), scroll on validation, formatters for phone/SSN/EIN/DOB
- Result page auto-opens booking modal **once** (`useRef` guard — avoid mobile reopen loop)

### Booking (Wash Kings pattern — owner priority)
- After apply (if not `not_fit_yet`), return `bookingToken`; schedule funding review call
- Slots: **Mon–Fri 9am–5pm America/New_York**, **30 min**
- Modal: **full-screen on mobile** (Option B), centered on desktop
- Modal flow: **2-step** day → time; 5 days in modal, 10 on `/book/[token]/`
- Sticky Confirm footer; iOS body scroll lock (`lib/use-body-scroll-lock.ts`)
- Confirmation stays in modal with Done; result page shows BookingConfirmed
- APIs: `/api/booking/availability/`, `/api/booking/book/`
- Dev fallback token: `lib/booking/dev.ts` → `DEV_BOOKING_TOKEN` when no Supabase in development

### Calculator
- `components/growth-calculator.tsx`: **unbounded** cost/revenue inputs; dynamic chart timeline; max render ~480 months

### Email architecture (owner decision July 2026)
| Address | Role |
|---------|------|
| `contact@builttogetherfunding.com` | Public site contact, Resend **from**, Reply-To default |
| `subs@builttogetherfunding.com` | **All internal alerts** — apply, booking, ISO (`INTERNAL_NOTIFY_EMAIL`) |

- Separate Resend account from Wash Kings (shared pattern OK, separate domain verified)
- Twilio: can share Wash Kings account; prefer separate number long-term
- Google Workspace: `contact@` and `subs@` exist (trial/promo pricing)
- Cold email from primary domain: **discouraged** (deliverability risk) — use separate domain later

### Admin CRM
- **NOT email login.** Password field only = `ADMIN_DASHBOARD_SECRET`
- Cookie session HMAC (`btf_admin_session`), 7 days, middleware protects `/admin/*` except `/admin/login`
- Routes: `/admin/login/`, `/admin/leads/`, `/admin/appointments/`, `/admin/` dashboard
- Owner previously could not log in — usually missing env and/or no redeploy after setting secret
- **Security:** Owner previously typed a password in chat; advise rotate `ADMIN_DASHBOARD_SECRET` after setup. Do **not** store passwords in repo or this pack.

### Hosting / domain
- **Vercel** = permanent app host; cancel SiteGround **hosting** after DNS stable; keep domain renewal
- SiteGround DNS: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
- Resend DNS records (DKIM/SPF/MX for `send` / `resend._domainkey`) also in **SiteGround**, not Vercel DNS
- Goal: stop paying SiteGround hosting; domain stay (~$15–20/yr)

### Blog / SEO (planned, not fully built)
- Folder exists: `content/blog-images/` (~**88** PNG infographics committed)
- Current articles: **3** in `lib/articles.ts` (SSG at `/resources/[slug]/`)
- Owner wants human-sounding, accurate SEO posts from infographics
- Agreed cadence: **2–4/week**, NOT 1–3/day (YMYL / spam risk)
- **Not done yet:** featured images on article pages, pipeline from `content/blog-images/`, batch drafting

### Explicit non-goals / skipped
- Social proof testimonials for now
- Full multi-user auth for admin (password secret is enough for small team)
- Heavy cold email infrastructure
- Running `npm run build` while `npm run dev` is running (corrupts `.next`)

---

## 2. Stack & architecture

### Stack
- Next.js **15** App Router, React **18**, TypeScript
- Tailwind CSS **3**
- react-hook-form + Zod **4**
- `@supabase/supabase-js` (service role server-only)
- Resend, Twilio (optional)
- `trailingSlash: true` in `next.config.mjs`
- Deploy: Vercel (`vercel.json` → `next build`)
- Dev: `npm run dev -- -H 0.0.0.0` when testing network/mobile

### Key directories
```
app/                    # routes + API
components/apply/       # funnel UI
components/booking/     # scheduler + modal
components/brand/       # ambient background
components/admin/       # CRM shell + login
components/home/        # homepage
lib/                    # scoring, schema, notifications, booking, supabase
docs/                   # SQL + launch docs
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
| `/admin/login/` | Password CRM login |
| `/admin/leads/`, `/admin/appointments/` | CRM |
| `/resources/`, `/resources/[slug]/` | Articles |
| `/iso/` | Partner signup |
| `/api/apply/`, `/api/apply/partial/` | Lead submit + partial |
| `/api/statements/` | Multipart uploads (4MB/file) |
| `/api/booking/availability/`, `/api/booking/book/` | Calendar |
| `/api/admin/login/`, `/api/admin/logout/` | Session |
| `/api/iso/` | ISO email notify |

### Data flow (apply)
1. Client validates steps; may `POST /api/apply/partial/` after contact fields
2. Statements → `POST /api/statements/` → paths under `statements/presubmit/{session}/`
3. Final `POST /api/apply/` → Zod → score → insert/update `leads` → notifications → `{ ok, status, bookingToken }`
4. Result UI → booking modal → `POST /api/booking/book/` → `bookings` row + emails

### Scoring (`lib/apply-scoring.ts`) — pre-screen only, not underwriting
- Time in business: +35 / +25 / +12 / −30
- Use of funds: growth uses +25; other +12; only “other” −10
- Statements uploaded +30; skipped +5; funding amount selected +5
- Tiers: ≥70 `prequalified`, ≥40 `needs_review`, else `not_fit_yet` → DB `not_fit`

---

## 3. Supabase

### Project
- Named **Built Together Funding** (FREE tier)
- Owner reported SQL editors **all run** (leads + v3 + v4)
- Vercel Supabase integration can auto-inject URL/keys (verify `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` after deploy)

### Migrations order (fresh or existing)
1. `docs/supabase-leads.sql` — `leads` + private `statements` bucket
2. `docs/supabase-leads-v3-migration.sql` — owner/business fields (SSN, EIN, addresses, etc.)
3. `docs/supabase-bookings-v4-migration.sql` — `partial` status, `booking_token`, `bookings` table

### Critical tables
- `public.leads` — full application + UTM + statement paths + `upload_token` + `booking_token` + statuses including `partial`
- `public.bookings` — appointment_date, start_time, duration_minutes, status; unique (date, start_time); RLS enabled, service role bypasses

### Production behavior
- Missing Supabase in **production** → apply returns controlled 503 / config fail (leads not claimed saved)
- Dev can soft-skip insert and still return `DEV_BOOKING_TOKEN` for booking UI testing

---

## 4. Environment variables (production contract)

See `.env.local.example`. Must set on Vercel **Production** then **Redeploy** (`NEXT_PUBLIC_*` baked at build).

```
NEXT_PUBLIC_SITE_URL=https://builttogetherfunding.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@builttogetherfunding.com
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_PHONE_DISPLAY=
NEXT_PUBLIC_BUSINESS_ADDRESS=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # optional today
SUPABASE_SERVICE_ROLE_KEY=             # required for live leads

RESEND_API_KEY=
RESEND_FROM_EMAIL=contact@builttogetherfunding.com
RESEND_REPLY_TO_EMAIL=contact@builttogetherfunding.com
INTERNAL_NOTIFY_EMAIL=subs@builttogetherfunding.com

TWILIO_ACCOUNT_SID=                    # optional
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
INTERNAL_NOTIFY_PHONE=

ADMIN_DASHBOARD_SECRET=                # admin password ONLY

NEXT_PUBLIC_GA4_ID=                    # optional
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=
```

### Email behavior (code)
- Applicant emails: from `contact@`, Reply-To `contact@` (via `withReplyTo`)
- Internal alerts (apply/booking/ISO): to `subs@`; Reply-To often applicant email so ops can reply
- Implemented in `lib/resend.ts`, `lib/notifications.ts`, `app/api/iso/route.ts`

---

## 5. Recent git history (what shipped)

1. `7a4504d` — Initial site: funnel, booking CRM, admin
2. `6dd6632` — Site-wide ambient ripple background from media kit
3. `6555b9b` — Trades marquee light pills + expanded services
4. `1c61465` — Hero trust chip → “Underwritten on bank statements”
5. `9d90ff8` — contact@ / subs@ email roles, reply-to, clearer admin login (+ committed blog-images)

---

## 6. Known bugs / ops pitfalls

1. **`.next` corruption** if `npm run build` runs while `npm run dev` — delete `.next`, kill port 3000, restart dev only
2. **Env vars without Redeploy** — especially `NEXT_PUBLIC_*` and Supabase — appear “connected” but APIs stay in offline/dev mode (`"dev": true` on availability)
3. **Admin login** — password only; if secret unset → “Admin CRM is not configured…”
4. **Sitemap fallback** defaults to `builttogetherfunding.com` if `NEXT_PUBLIC_SITE_URL` missing
5. Opening splash posters may 404 (`opening-scene-*-poster.jpg`) — videos exist under `public/opening screen/`
6. README still mentions older admin `?secret=` query pattern in places — **current auth is cookie + `/admin/login/`**
7. CONTEXT-INDEX dark palette is **historical**; do not revert to dark site unless owner asks
8. Large `content/blog-images/` in git may slow clones/deploys

---

## 7. Unfinished / next work (priority order)

### A. Ops verification (owner browser — may still be incomplete)
- [ ] Confirm Vercel env vars match `.env.local.example` (emails, Supabase, admin secret)
- [ ] Redeploy after any env change
- [ ] Login `/admin/login/` with `ADMIN_DASHBOARD_SECRET`
- [ ] E2E: apply → row in Supabase → email to `subs@` → book call → booking email to `subs@` + applicant
- [ ] Confirm Resend domain verified; Google Workspace receives `subs@` / `contact@`
- [ ] Cancel SiteGround **hosting** only after domain stably serves Vercel (keep domain renew)

### B. Product / content (agent-capable)
- [ ] Blog pipeline: featured images + articles from `content/blog-images/` at **2–4/week**, human voice, YMYL-safe
- [ ] Optional: rename/clean blob filenames in blog-images
- [ ] Twilio setup when SMS wanted
- [ ] Analytics IDs when ready
- [ ] Phone/display/address public env for footer/contact
- [ ] Attorney review of legal pages before paid ads
- [ ] Social proof when video ready

### C. Hardening (later)
- [ ] Stronger admin auth if team grows
- [ ] Cleanup job for orphan `statements/presubmit/` objects
- [ ] Align outdated README/CONTEXT-INDEX dark-theme / admin `?secret=` docs with code

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

When doing frontend design:
- Brand-first heroes; avoid generic purple/cream AI looks
- Ambient background is intentional site-wide branding on marketing pages
- Cards only when interaction requires; avoid clutter in hero
- Prefer matching existing light BTF design system (`btf-*` tokens)
- Mobile booking: full-screen sheet; do not reintroduce cramped 58dvh bottom sheet

---

## 10. How to continue in a new chat (agent prompt)

Paste this file or say:

> Continue Built Together Funding from `CONTEXT-PACK-MAX-FIDELITY.md`. Repo at `C:\Users\Asus\BTF CORP`, GitHub `Jerovyn/built-together-funding`, live `builttogetherfunding.com`. Latest commit `9d90ff8`. Next priorities: (1) verify Vercel env + admin login + E2E notifications to `subs@`, (2) blog pipeline from `content/blog-images/` at 2–4 posts/week. Do not revert to dark theme. Do not use email as admin username. Preserve compliance language. Ask before committing unless I request a commit/push.

---

## 11. Implicit reasoning (why decisions were made)

- **Capacity capital + statements-first funnel:** Owner belief that real bank data beats self-reported revenue checkboxes; short funnel increases completion.
- **Wash Kings booking:** Owner already runs Wash Kings on Vercel; wanted same CRM-style schedule-after-submit, not a third-party calendar only.
- **Full-screen mobile modal:** Bottom sheet felt stuck/hard to use; Option B chosen over centered taller sheet.
- **Light ambient site-wide:** Media kit is light blue/white; dark navy trades bar conflicted; ambient + frosted marquee unify brand.
- **`subs@` vs `contact@`:** Separates spammy/high-volume submission alerts from human client communication (Wash Kings pattern).
- **Password-only admin:** Fast launch; full auth deferred.
- **Slow SEO cadence:** Funding content is YMYL; mass AI posting risks ranking/domain trust.
- **SiteGround → Vercel:** Cost (stop hosting fees) + Next.js fit; keep DNS at SiteGround until/unless nameservers move.

---

## 12. File quick-reference for agents

| Concern | Start here |
|---------|------------|
| Apply steps/schema | `lib/apply-schema.ts`, `components/apply/apply-funnel.tsx` |
| Scoring | `lib/apply-scoring.ts` |
| Booking UI | `components/booking/*`, `lib/booking/availability.ts` |
| Apply result + modal open | `components/apply/apply-result.tsx` |
| Notifications | `lib/notifications.ts`, `lib/resend.ts` |
| Admin auth | `lib/admin-session.ts`, `middleware.ts`, `app/admin/login/` |
| Ambient BG | `components/brand/brand-ambient-background.tsx`, `app/layout.tsx` |
| Trades marquee | `lib/constants.ts` (`HOME_TRADES_MARQUEE`), `components/home/home-content.tsx` |
| Articles | `lib/articles.ts`, `app/resources/` |
| Blog assets | `content/blog-images/` |
| SQL | `docs/supabase-*.sql` |

---

*End of max-fidelity pack. Prefer this file over older dark-theme sections of CONTEXT-INDEX when they conflict.*
