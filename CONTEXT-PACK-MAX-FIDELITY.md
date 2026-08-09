# Built Together Funding — MAX-FIDELITY CONTEXT PACK

**Generated:** August 9, 2026  
**Purpose:** Paste this (or open this file) in a new Cursor chat so work continues without loss.  
**Supersedes:** July 21, 2026 pack in the same path (outdated on funnel steps, CTAs, theme accent, homepage).  
**Repo:** `C:\Users\Asus\BTF CORP`  
**GitHub:** https://github.com/Jerovyn/built-together-funding  
**Live domain:** https://builttogetherfunding.com  
**Vercel:** project `built-together-funding`  
**Git HEAD:** `058f8e7` on `main` (synced with `origin/main` as of Aug 6–9, 2026)

### Related docs (do not ignore; prefer THIS pack over stale sections)

- `CONTEXT-INDEX.md` — original brand/funnel brain (**dark theme + old CTAs + 5-step funnel outdated**)
- Prior pack dated July 21 in git history — CRM/Meet/content/SMS still mostly valid; funnel/home/CTA/theme sections are NOT
- `docs/LAUNCH_CHECKLIST.md`
- SQL chain: `supabase-leads.sql` → v3 → `supabase-bookings-v4-migration.sql` → v5 CRM/articles → `supabase-v6-products-migration.sql` → **`supabase-v7-monthly-revenue.sql` (OWNER CONFIRMED RAN Aug 2026)**
- `.env.local.example` — env contract
- Brand kit: `context/01-brand/` (PDF + logo-usage notes)
- Agent UI rules: `.agents/skills/userinterface-wiki/` (animation/UX — use when reviewing UI)

---

## 0. One-sentence project truth

Built Together Funding is a Next.js marketing + Stage-A/Stage-B pre-qualification system for trades & service businesses: capacity-first philosophy, 8-product catalog + calculator, human review + Google Meet booking, Supabase leads/statements/CRM/content desk, Resend/Twilio, Vercel deploy — with a field GTM of merch + owner interviews → content → site → convert → fund.

---

## 1. Owner / operator identity & related businesses

- **Operator:** Jeremiah Batista (also CEO of Staten Island Wash Kings LLC — pressure/soft washing). Wash Kings site: https://statenislandwashkings.com (separate repo/brand). Do not bleed Wash Kings identity into BTF unless owner intentionally tells origin story later.
- **BTF physical merch (brand DNA — site should be merch-adjacent, NOT a clone):**
  - Black backpack, electric cyan tools mark (crossed wrench+hammer), white “BUILT TOGETHER” / cyan “FUNDING”, subtle grid detail
  - Blue t-shirt multi-tool keychains (“BTF”)
  - Dark holographic cards: tools mark; back: “SEE IF YOU QUALIFY”, phone **718-285-2368**, builttogetherfunding.com, “Equipment, trucks, crews…”, “Real numbers. Straight answers.”, tagline **“FUNDING IS A COMMITMENT TO GROWTH.”**
- **Owner constraint:** Site does **not** need to match merch exactly (no full holographic UI, no all-black site). Echo: black/ink + cyan/sky accent + tools mark + tagline + trade practicality.
- **Seem bigger than you are** without lying: system, craft, partner-network honesty — not fake headcount/volume/reviews.
- **Founder face / personal brand push:** DEFERRED until look is ready (~**Aug 31 – Sept 1, 2026**). About page may stay philosophy-first / soft-pedal anonymous founder until then.
- **In-person owner interviews / field:** start ~**Aug 24, 2026**. Content: success/capacity conversations, branded backpack + cards + keychains, then photos/interviews → site + blog + social → convert.
- **Google Business verification:** pending (as of early Aug). No fake stars. Reviews component stays gated until verified + real reviews.
- **Proof:** no fake testimonials/approval rates. Process proof + later real stories. `OPERATOR_STORIES` in `lib/stories.ts` is **empty array** — `HomeStories` renders nothing until filled.

---

## 2. Brand, positioning, voice (current source of truth = live code)

### Core lines (`lib/constants.ts`)

| Constant | Value |
|----------|--------|
| `SITE_NAME` | Built Together Funding |
| `SITE_TAGLINE` | Business Financing for Trades & Service Businesses |
| `BRAND_LINE` | Funding is a commitment to growth. |
| `HERO_BRAND_LINE` | Where funding is a commitment to growth. (defined; homepage now uses brand line on ink panel) |
| `HOME_PULL_LINE` | Booked out and turning work away? We fund the next truck, crew, or machine. |
| `CTA_PREQUAL_LABEL` | **See your options** (NOT “Get pre-qualified”, NOT card’s “See if you qualify”) |
| `CTA_CALC_LABEL` | Use these numbers |
| `CTA_MICRO_LINE` | About 2 minutes · Won't affect your credit score |
| `APPLY_TIME_ESTIMATE` | About 2 minutes to see if we should talk · full file optional after |

**CTA ladder:** See your options → Use these numbers → Pick a call time.  
**Card vs site CTA:** Card says “SEE IF YOU QUALIFY”; site uses softer “See your options.” Dual language accepted for now; landing should still feel continuous (phone, domain, tagline, capacity).

### Philosophy (non-negotiable)

- Fund **capacity** when demand already exists; capacity is the ceiling — not rescue capital, not beginners, not “get cash fast.”
- Broker / partner network — **not a direct lender, not the SBA.**
- Prequal ≠ approval; estimates only; no guarantees.
- Soft not-fit language only.
- No fake social proof.

### Compliance constants (preserve)

- `DISCLAIMER_PREQUAL_LINE`, `LEGAL_NO_GUARANTEE_LINE`, `BROKER_DISCLOSURE`, `DISCLAIMER_ESTIMATE_LINE`, `CREDIT_CHECK_LINE`, `LEGAL_CAPACITY_PHILOSOPHY_LINE`
- Legal pages = **draft** until attorney; **no paid ads** until counsel signs off (`docs/LAUNCH_CHECKLIST.md`)
- SMS only with consent + STOP
- Tracking: no PII in events (`lib/tracking.ts`)
- Underwriting PDF omits email/phone/lead id/score/UTM (anti lead-theft)

### Voice

Operator-led, direct, short, practical. Willingness to say “not a fit yet” / “where we’ll say no.” Same person reviews file and calls.

---

## 3. Design system (CURRENT — Aug 2026)

### Theme (CRITICAL)

- **Light workspace** for forms/marketing (do NOT revert full dark industrial unless owner asks).
- **Ink bands** for brand authority (home hero media panel, footer, some CTAs).
- Accents updated to **merch-adjacent sky/cyan** (commit `058f8e7`):
  - `accent` `#0284C7`, `accent-mid` `#0EA5E9`, `accent-soft` `#38BDF8`
  - Also in `app/globals.css` CSS vars
  - Ink: `#081123` family
- Font: **Inter Tight** (`next/font`)
- Tailwind comment previously said “OnDeck-like” — **outdated**; now “merch-adjacent”
- Ambient: quiet static wash (`BrandAmbientBackground`) — ripples largely retired; excluded on task paths
- **Do not** force holographic foil as UI theme

### Chrome (`components/site-chrome.tsx`)

| Path type | Behavior |
|-----------|----------|
| Task: `/apply`, `/book`, `/upload`, `/admin` | Compact header (logo + Exit), **no** footer, Bolt, sticky CTA, ambient |
| Marketing | Full header, footer, ambient, sticky mobile CTA (after ~2 viewports) |
| Bolt FAQ | **Only** `/contact` and `/how-it-works` |

Footer: slim — logo, `BRAND_LINE`, phone/email, key links, short disclaimer → `/disclosures/`. **ISO filtered out of owner footer chrome** (route `/iso/` still exists).

Header: tools mark `public/brand/btf-logo-tools.png` + Built Together / Funding wordmark; phone from env at larger breakpoints; primary CTA.

### Logo asset debt (known)

Brand notes prescribe horizontal header lockup + stacked hero lockups in `public/brand/` — **chrome still uses `btf-logo-tools.png`**. Decide once when polishing brand further; don’t half-swap without owner.

### Homepage (`components/home/home-content.tsx` + `app/page.tsx`)

Beats:

1. Capacity H1 (`HOME_PULL_LINE`) + supporting line + **See your options** + optional **Or call {phone}**
2. Ink panel: tools logo + `BRAND_LINE` (replaced stock roofers-in-a-card as primary brand plane)
3. Shortened trades marquee (first 14 of `HOME_TRADES_MARQUEE`)
4. Desire signals (3 checks)
5. **“We removed the hard parts on purpose”** (2 min, no SSN yet, credit, same person, statements optional)
6. Paths: apply (~2 min) + calculator reward path + products link
7. `HomeStories` gated — empty until `OPERATOR_STORIES` filled

Opening splash video: **removed / not mounted** (orphaned components may remain — do not re-enable without ask).

### Calculator

- Route: `/calculator/` (+ embed on `/funding-uses/`)
- Simple-first UI; CTA `Use these numbers`
- Snapshot → session → seeds apply (`lib/calculator-preset.ts`)
- Product system: `lib/products.ts` (8 products) — not the old `growth-calculator` as primary

### Products (8)

Slugs: `working-capital`, `term-loans`, `line-of-credit`, `equipment-financing`, `sba-loans`, `mca-consolidation`, `acquisitions`, `commercial-real-estate`  
Interest keys snake_case + `not_sure`.  
Detail pages: tagline-led hero, truncated benefits, CTAs.

### How it works

3 owner-facing steps (not old 7): tell us → we review statements → you pick on a call. Aligns with Stage A messaging (statements may be later).

---

## 4. Apply funnel — Stage A / Stage B (CURRENT — CRITICAL)

**Shipped in `058f8e7`.** Owner felt 9-step full packet was overwhelming for trades; industry pattern = short prequal then docs.

### Stage A (indices 0–4) — ~2 minutes → soft result + booking

| Step | Fields | UI intent |
|------|--------|-----------|
| 0 | `useOfFunds` (multi) | “What’s the money for?” — **NOT** 8-product taxonomy |
| 1 | `fundingAmount` | Range |
| 2 | `monthlyRevenue` | **NEW** cash-flow signal (MCA-critical) |
| 3 | `timeInBusiness`, optional `industry` | |
| 4 | name, email, phone, emailConsent, smsConsent | “See my options” submits Stage A |

- `productInterest` defaults to **`not_sure`** (seeded from `?product=` or calc snapshot if present)
- **No SSN, EIN, statements required** for Stage A
- API: **`POST /api/apply/stage-a/`** → score, set `lead_status`, return `{ status, bookingToken, leadId }`
- Notifications: **`sendStageANotifications`** (no SSN/EIN in internal email)
- Ads conversion can fire on Stage A tier (same `trackApplyAdsConversion`)
- Result UI: `ApplyResult` with `stageA` + **“Finish file (optional)”** + booking modal

### Stage B (indices 5–8) — optional continue

| Step | Fields |
|------|--------|
| 5 | statements upload OR skip |
| 6 | DOB, home address, SSN |
| 7 | business name, EIN, entity, business address |
| 8 | Confirm → **`POST /api/apply/`** full finalize with `partialLeadId` |

Progress UI: “Quick check · x of 5” then “Finish file · x of 4”.

### Scoring (`lib/apply-scoring.ts`)

Uses: TIB, useOfFunds (growth set), **monthlyRevenue**, statements (+30 upload / +5 skip), fundingAmount (+5), concrete product (+5).  
**Does NOT use** SSN/EIN/addresses/business name.  
Tiers: ≥70 `prequalified`, ≥40 `needs_review`, else `not_fit_yet` → DB `not_fit`.  
Stage A scores with `statementsSkipped: true` (+5).

### `monthly_revenue` column

- Migration: `docs/supabase-v7-monthly-revenue.sql`
- **Owner confirmed SQL applied (Aug 2026)**
- Values: `under_10k` | `10k_25k` | `25k_50k` | `50k_100k` | `100k_250k` | `250k_plus`

### Partial route

`POST /api/apply/partial/` still exists; Stage A path is primary for contact→result. Partial schema includes `monthlyRevenue`.

### Booking

- Token: DB `booking_token` default UUID on lead insert (also on Stage A insert)
- Returned when tier ≠ `not_fit_yet`
- Modal auto-open once; Meet soft-fail pattern still applies (see § Booking infra)

---

## 5. Stack & architecture

### Stack

- Next.js 15 App Router, React, TypeScript, Tailwind 3
- RHF + Zod, Supabase service role server-only
- Resend, Twilio, googleapis (Calendar/Meet), jszip + pdf-lib, OpenAI vision (content)
- `@vercel/analytics` + `lib/tracking.ts` funnel events
- `trailingSlash: true`
- Deploy: Vercel

### Key paths

```
app/api/apply/           # full submit
app/api/apply/stage-a/   # Stage A prequal (NEW)
app/api/apply/partial/   # mid-funnel partial (legacy/support)
components/site-chrome.tsx
components/apply/*
components/home/home-content.tsx, home-stories.tsx
lib/apply-schema.ts, apply-scoring.ts, products.ts, stories.ts, constants.ts
```

### Important routes

| Path | Role |
|------|------|
| `/` | Capacity home + ease + paths + gated stories |
| `/apply/` | Stage A → result → optional Stage B |
| `/calculator/` | Payment estimator |
| `/products/`, `/products/[slug]/` | 8 products |
| `/book/[token]/`, `/upload/[token]/` | Booking / statements follow-up |
| `/admin/*` | Password CRM, content, settings/Google |
| `/resources/` | Blog (DB articles + content desk) |
| `/iso/` | Partner signup (not in owner footer) |
| `/how-it-works/`, `/who-we-help/`, `/funding-uses/`, `/about/`, `/contact/` | Marketing rooms |
| Legal: privacy, terms, disclosures | Draft until counsel |

### Email architecture

| Address | Role |
|---------|------|
| `contact@builttogetherfunding.com` | Public, Resend from, Reply-To |
| `subs@builttogetherfunding.com` | Internal alerts (`INTERNAL_NOTIFY_EMAIL`) |

Internal SMS phones (example in `.env.local.example`): `+17182852368`, `+13473034705` via `INTERNAL_NOTIFY_PHONE`.

### Admin

- Password = `ADMIN_DASHBOARD_SECRET` only (not email login)
- Cookie HMAC session; middleware on `/admin/*` except login
- Underwriting ZIP omits contact/attribution; keeps identity/business/funding for partners
- Content desk: infographic → OpenAI draft → publish; cadence **2–4 posts/week**

### Booking / Meet

- Mon–Fri 9–5 America/New_York, 30 min
- Insert booking first, then Meet attach, then notify (Meet hang must not block)
- OAuth tokens in `app_integrations`; connect via `/admin/settings/`
- Historical issue (Jul): Connected but Meet missing — diagnose Vercel `[google-calendar]` logs; may be resolved — re-verify if booking emails lack Meet

---

## 6. Recent commit history (relevant)

| Commit | Meaning |
|--------|---------|
| `058f8e7` | Stage A/B split, monthly revenue, merch-adjacent accent, home brand/ease, gated stories, brand line footer |
| `46adb09` | Capacity pull, quiet chrome, CTA ladder, slim footer, Bolt gating |
| `4db82c3` | Structural cut: short home, simple calc, one-question screens |
| `a185f49` / `60ea9c9` | Light theme return, clarity |
| `45bbe53` | Vercel Analytics |
| `0c2c607` | 8 products + calculator 2.0 (then evolved) |

---

## 7. Explicit decisions & reasoning (Aug 2026 conversation thread)

1. Site felt “generic stock SaaS” vs Wash Kings trust/love → root cause: OnDeck palette + stock metaphor + anonymous founder + form-first; **words strong, surface rented.**
2. No proof yet → build **shell + gated slots**, not fake reviews.
3. Defer face until look week; keep colors; seem bigger via system not lies.
4. Merch: family not clone; card CTA dual-OK.
5. Outside research: winners use short cash-flow prequal, delay SSN/docs, early reward (calc), phone escape, speed-to-lead — BTF funnel was careful but overwhelming (8 products first, 9 steps, statements before identity, no revenue).
6. **Funnel first + brand shell** shipped together in `058f8e7`.
7. Content hub: prefer extending **`/resources/` + `OPERATOR_STORIES`**, don’t invent a second empty blog.
8. Interview editorial filter: only capacity stories (“work was there, capacity was the ceiling”).
9. Do not surface ambiguous `HOME_STATS` “38+ verticals served” as volume proof.
10. Guardrails: light+ink+cyan, marketing shell OK, don’t casually rewrite Stage B packet or compliance copy, don’t reopen dark theme.

---

## 8. Unfinished / deferred / manual (as of Aug 9, 2026)

### Done recently

- [x] Stage A/B code + push `058f8e7`
- [x] Owner ran `supabase-v7-monthly-revenue.sql`
- [x] Code on `origin/main`

### Owner / ops still todo

- [ ] Production smoke: Stage A → soft result → book; confirm `monthly_revenue` on lead; Stage A alerts
- [ ] Optional Stage B finish-file path on same lead
- [ ] Confirm `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_PHONE_DISPLAY` on Vercel so home “Or call” shows
- [ ] Field interviews ~Aug 24+ with capture kit (photo, quote, trade, permission, merch in frame)
- [ ] Fill `lib/stories.ts` → HomeStories appears
- [ ] Look/content week ~Aug 31–Sept 1: founder photos, merch-in-field, blog, social → site
- [ ] Google Business verified → wire reviews (no fake stars before)
- [ ] Attorney sign-off before paid ads
- [ ] Optional: unify card “Qualify” vs site “See your options”
- [ ] Optional: logo lockup swap (horizontal/stacked vs tools-only chrome)
- [ ] Optional: privacy policy refresh vs fields actually collected (SSN/EIN/DOB) — YMYL risk
- [ ] Re-verify Google Meet on new bookings if still flaky
- [ ] Bolt remains placeholder SVG — don’t feature on home; redesign or retire later

### Agent should NOT casually do

- Full dark-mode merch clone
- Fake testimonials / fake Google ratings / fake volume
- Revert Stage A to force SSN/product taxonomy first without owner ask
- Touch apply scoring/compliance constants without care
- Run `npm run build` while `npm run dev` is running (corrupts `.next`)
- Commit/push unless owner asks (this pack assumes owner may ask)

---

## 9. Env contract (see `.env.local.example`)

Public: `NEXT_PUBLIC_SITE_URL`, phone display/E.164, contact email, optional business address, GA4/Meta/Ads, Maps key.  
Server: Supabase URL + service role (+ anon if used), Resend, Twilio, `ADMIN_DASHBOARD_SECRET`, OpenAI, Google OAuth client id/secret, optional `GOOGLE_CALENDAR_ID=primary` (lowercase).

---

## 10. How to continue in a new chat (prompt stub)

```
Open CONTEXT-PACK-MAX-FIDELITY.md (Aug 9, 2026). Repo C:\Users\Asus\BTF CORP, main @ 058f8e7.

Priorities: [state what you want — e.g. smoke-test fixes / stories wiring / About after look week / Meet debug / card QR landing].

Respect: Stage A/B funnel, merch-adjacent light+ink+cyan, no fake proof, capacity philosophy, quiet task chrome, gated OPERATOR_STORIES.
```

---

## 11. File map for hottest surfaces

| Concern | Files |
|---------|--------|
| Stage A/B UI | `components/apply/apply-funnel.tsx`, `apply-result.tsx`, `apply-progress.tsx` |
| Schema / steps | `lib/apply-schema.ts` |
| Scoring | `lib/apply-scoring.ts` |
| Stage A API | `app/api/apply/stage-a/route.ts` |
| Full apply API | `app/api/apply/route.ts` |
| Stage A notify | `lib/notifications.ts` → `sendStageANotifications` |
| Home | `components/home/home-content.tsx`, `home-stories.tsx`, `app/page.tsx` |
| Stories data | `lib/stories.ts` |
| Chrome | `components/site-chrome.tsx`, `site-header.tsx`, `site-footer.tsx` |
| Copy/CTAs | `lib/constants.ts` |
| Products | `lib/products.ts` |
| Theme | `tailwind.config.ts`, `app/globals.css` |
| v7 SQL | `docs/supabase-v7-monthly-revenue.sql` |

---

**End of pack.** Prefer live code + this document over `CONTEXT-INDEX.md` dark-theme / 5-step / “Get pre-qualified” sections.
