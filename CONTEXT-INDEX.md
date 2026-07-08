# Built Together Funding Corp � CONTEXT-INDEX

**Purpose:** Single project brain synthesized from `C:\Users\Asus\BTF CORP\context`. Treat `/context` as source of truth; this file is the implementation checklist for Cursor and humans.

**Last indexed:** May 7, 2026 (from context PDFs and notes in `/context`).

---

## 1. Project summary

**Built Together Funding Corp** is a premium, operator-led funding and growth brand for **service and trade businesses**. The deliverable is not only a marketing site: it is a **pre-qualification and lead-generation system**�mobile-first site, interactive `/apply` funnel, lead scoring, Supabase storage, notifications (Resend/Twilio), UTM/analytics hooks, and compliance-safe copy.

**Core positioning:** Help service businesses **scale capacity using capital�only when it actually increases profit.**

**Core philosophy:** Funding should only be used when **demand already exists** and **capacity is the constraint**�not as rescue money or for unproven operators.

---

## 2. Source files used for this index

| Path | Role |
|------|------|
| `context/00-read-this-first/BTF_Master_Project_Summary_Read_This_First.pdf` | Master map: brand, pages, funnel, backend, tracking, compliance, build phases |
| `context/08-missing-context/BTF_Missing_Context_Pack_for_Cursor.pdf` | Scoring weights, 7-step question flow, API contract, templates, analytics events, QA/deploy |
| `context/04-stack/BUILD-HANDOFF-FOR-CHATGPT.pdf` | Next.js 15 App Router, Tailwind 3, trailing slash, Vercel, env patterns, security headers |
| `context/01-brand/built_together_brand_kit_handoff.pdf` | Brand personality, colors, typography, logo direction, audience |
| `context/01-brand/logo-reference-images/logo-usage-notes.md` | Which logo file for header, hero, favicon; concept board rules |
| `context/01-brand/logo-reference-images/*.png` | Production logo assets (stacked, horizontal, icon) |
| `context/02-strategy/*.pdf` | Positioning, system strategy (cross-check copy claims) |
| `context/03-site-references/btf_cursor_prompt.pdf` | Reference-site *principles* only�do not copy text/layout/code |
| `context/05-compliance/compliance-notes.md` | Pointer to master + missing-context PDFs |
| `context/06-funnel/funnel-notes.md` | Pointer to master + missing-context PDFs |
| `context/07-content/content-notes.md` | Pointer to master + missing-context PDFs |

**Note:** `btf-logo-concept-board-winner.png` and `btf-old-logo-reference.jpeg` are not listed in the current folder listing; if added later, use per brand rules: concept board = reference only; old logo = historical reference only.

---

## 3. Brand rules (non-negotiable)

- **Personality:** Operator-led, selective, premium, rugged but refined, contractor-focused, high-trust, high-conviction�not a generic MCA or �get cash fast� shop.
- **Promise:** Capital for **capacity** (equipment, crews, trucks, proven marketing), not desperation; business must already have demand or a clear growth path.
- **Voice:** Direct, confident, short, practical�built by an operator. Avoid generic finance fluff, fake urgency, fake testimonials, fake partner logos, fake approval rates.
- **Filter out:** Startups, beginners, no revenue, funding to �just survive,� no proven demand, unqualified operators.
- **Visual metaphor:** �Apple � Blue Collar � Modern Fintech�; **industrial luxury**�dark, sharp, smooth, fast, mobile-first.
- **Color:** Keep **electric blue/cyan** direction�do not replace with generic finance navy/green. **Do not** overuse gradients or spammy money imagery.

---

## 4. Design rules

**Backgrounds**

- Main: `#0A0A0A`
- Secondary: `#121212`
- Card: `#1A1A1A`
- Support: `#2B2B2B`, `#3A3A3A`, `#444444`

**Accent blues** (CTAs, hovers, glows, highlights, icons, progress, funnel states, loading)

- `#35C2FF`, `#4FBFFF`, `#6FD3FF`

**Typography direction**

- Bold, clean, premium�**Inter Tight** (or Satoshi / General Sans / Neue Montreal class). Strong headings, clear body; modern fintech feel without looking like a generic bank site.

**UX**

- Mobile-first, thumb-friendly CTAs, generous spacing, smooth **Framer Motion** transitions (premium, not gimmicky).
- Application UI: interactive progress, clear selected states, loading and result cards.

---

## 5. Logo usage rules

**Asset source:** `context/01-brand/logo-reference-images/`

| File | Use |
|------|-----|
| `btf-logo-main-stacked-lockup.png` | Large brand moments: homepage hero, about, major brand sections |
| `btf-logo-horizontal-header-lockup.png` | Header/nav, email header, footer, proposal-style layouts |
| `btf-logo-icon-mark.png` | Favicon, loading animation, app icon, social avatar, small UI badge, **apply module / loading** |
| `btf-logo-concept-board-winner.png` | **Reference only**�not a live site asset |
| `btf-old-logo-reference.jpeg` | Historical reference only (crossed wrench + hammer identity) |

**When the Next.js app exists:** copy usable PNGs to:

- `public/brand/btf-logo-main-stacked-lockup.png`
- `public/brand/btf-logo-horizontal-header-lockup.png`
- `public/brand/btf-logo-icon-mark.png`

**Do not** redesign the logo unless instructed. **Do not** replace the electric blue brand direction.

---

## 6. Funnel / application rules

**Route:** `/apply/` (interactive multi-step; trailing slash per stack handoff).

**Feel:** Smooth, premium, slightly gamified, **serious operator pre-screening**�not a boring bank form. Subtle build / hammer / blueprint language OK; icon mark during loading.

**Primary CTA sitewide:** �See If You Qualify� ? `/apply/`  
**Secondary CTA:** �How It Works� ? `/how-it-works/`

### 6.1 Loading copy examples (rotate / sequence)

- �Reviewing your information��
- �Checking if your business fits our funding criteria��
- �Looking for demand, capacity constraints, and growth use cases��
- �Preparing your funding review result��

### 6.2 Result language � NEVER

- �Approved,� �Guaranteed,� �You are funded,� �Instant approval,� or any implication that pre-qual = funding approval.

### 6.3 Result language � ALLOWED

- �Your business may be a fit for a funding review.�
- �Based on your answers, you may qualify for a funding strategy call.�
- �This is not a funding approval. Final options are subject to review, underwriting, and partner availability.�
- Softer �not fit� tone: �This may not be the right fit yet.� / �We may need more information before determining fit.� / �Your application needs manual review.� � **do not** harshly reject.

### 6.4 API-facing result tiers (safe for frontend)

Map UI to three outcomes (missing-context pack):

- `prequalified`
- `needs_review`
- `not_fit_yet` (user-facing �not fit yet�; DB status may be `not_fit`�see �9)

### 6.5 Step flow — CURRENT (owner decision, supersedes original recommendation)

> Owner simplified the funnel to the three things that matter for MCA pre-qual.
> Implemented in `lib/apply-schema.ts` / `components/apply/apply-funnel.tsx`.

1. **Time in business** (single select)
2. **Funding amount** (single select)
3. **Use of funds** ("What's the money for?" — single select)
4. **Bank statements:** upload last 3 months (drag-and-drop, PDF/CSV/images) **or** "send later" → secure `/upload/{token}/` link in confirmation email/SMS
5. **Contact:** name, business name, phone, email, **SMS consent** (optional), submit

<details>
<summary>Original recommended flow (superseded, kept for reference)</summary>

1. **Business identity:** owner name, business name, industry, website/social link  
2. **Maturity:** time in business, monthly revenue, annual revenue range (if collected)  
3. **Growth pressure:** booked out, turning down work, waiting list, seasonal demand, capacity bottleneck  
4. **Capital use:** equipment, trucks, crew, marketing, working capital, materials, other (multi-select)  
5. **Funding need:** amount, timeline/urgency, existing advances/funding  
6. **Verification:** bank statements available, business bank account (if asked), best time to contact  
7. **Contact:** phone, email, **SMS consent** (optional checkbox), **email consent** as required by implementation, submit  

</details>

**Fields collected — CURRENT**

- Time in business  
- Funding amount needed  
- Use of funds (single select)  
- Bank statements (uploaded files or "send later")  
- Business owner name, business name, phone, email  
- SMS consent checkbox (optional)  

The bank statements replace the old self-reported revenue/capacity/stacking
questions — real numbers beat checkboxes, and underwriting needs them anyway.

---

## 7. Lead scoring rules (pre-screen only�not underwriting)

**Model — CURRENT** (implemented in `lib/apply-scoring.ts`; rewritten for the
3-question funnel; original signal pack below for reference):

**Time in business**

- +35: 2+ years  
- +25: 1�2 years  
- +12: 6�12 months  
- ?30: under 6 months  

**Use of funds**

- +25: equipment or vehicles  
- +20: crew/hiring, materials for booked jobs  
- +12: marketing with proven lead flow, working capital  

**Funding amount**

- +5: any selection (signals a concrete plan)  

**Bank statements**

- +30: uploaded during the funnel (strongest signal � real numbers)  
- +5: chose "send later" (still cooperative; follow-up link sent)  

**Routing thresholds**

- **70+** ? `prequalified`  
- **40�69** ? `needs_review`  
- **below 40** ? `not_fit_yet` (stored as `not_fit` in DB)

<details>
<summary>Original signal pack (superseded — fields no longer collected)</summary>

Industry fit (+15 trades / +8 other local service / ?15 startup-ecom-consumer),
monthly revenue (+25 to ?20), demand/capacity (+20 to ?15), readiness (+10
statements available / +8 contact time / ?10 unwilling), existing funding (0 to
?25). These relied on self-reported answers; actual statements replace them.

</details>

---

## 8. Compliance rules

**Disclaimer:** This index is not legal advice. **Attorney review** before paid ads and scale.

**Visible disclaimers (site + funnel)**

- Pre-qualification is **not** funding approval.  
- Options subject to **review, underwriting, verification, partner availability**, final approval.  
- BTF does **not** guarantee approval, rates, terms, savings, revenue growth, or profit increases.  
- Submitted information may be used to **contact the applicant** about funding options.  
- **SMS consent optional**; not required to submit; message/data rates may apply; **Reply STOP to opt out**; clear opt-out on contact page where relevant.  

**Words to avoid**

- Instant approval, guaranteed funding, everyone qualifies, no docs, bad credit okay, get cash fast, free money, guaranteed profit/savings, etc.

**Legal routes (placeholders OK; substantive sections required)**

- `/privacy-policy/`  
- `/terms/`  
- `/disclosures/`  

**Contact page:** real business contact info when available; preference/opt-out language.

---

## 9. Backend / Supabase rules

**POST** ` /api/apply/` (or `/api/apply`�match Next.js trailing-slash config consistently).

**Pipeline**

1. Validate body with **Zod**; normalize phone/email.  
2. Compute `lead_score` and `lead_status` / result tier.  
3. Attach **UTM**, **landing page path**, **source**, **gclid/fbclid** if captured client-side.  
4. **Insert** lead into Supabase (server: **service role**�never expose service key to client).  
5. **Resend:** internal notification email if configured; applicant confirmation email.  
6. **Twilio:** internal SMS if configured; applicant SMS **only if** `sms_consent === true`.  
7. Return **safe** JSON (no sensitive leakage): e.g. `{ status: 'prequalified' | 'needs_review' | 'not_fit_yet' }` plus generic messaging.

**Graceful degradation:** If Resend/Twilio/Supabase env vars missing, log and/or skip�**do not** crash the request without a clear error strategy (document behavior in Phase 7).

### 9.1 `leads` table — CURRENT (see `docs/supabase-leads.sql`)

| Column | Notes |
|--------|--------|
| `id` | `uuid` PK, default `gen_random_uuid()` |
| `created_at` | `timestamptz`, default `now()` |
| `updated_at` | `timestamptz`, default `now()`, update on change |
| `name` | text |
| `business_name` | text |
| `phone` | text |
| `email` | text |
| `time_in_business` | text |
| `funding_amount` | text |
| `use_of_funds` | `text[]` |
| `statement_paths` | `text[]` — Supabase Storage paths in the `statements` bucket |
| `statements_status` | text: `pending` / `received` / `skipped` |
| `upload_token` | `uuid`, unique — powers the secure `/upload/{token}/` follow-up link |
| `sms_consent` | boolean, default false |
| `lead_score` | integer |
| `lead_status` | text�see lifecycle below |
| `source` | text |
| `landing_page` | text (landing path) |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | text |
| `raw_answers` | `jsonb` |
| `notes` | text (admin) |

Dropped from v1 (self-reported fields replaced by real statements): `website`,
`industry`, `monthly_revenue`, `annual_revenue`, `capacity_constraint`,
`booked_out`, `turning_down_work`, `adding_equipment`, `hiring_crew`,
`increasing_ads`, `active_funding`, `can_provide_statements`,
`best_time_to_contact`, `email_consent`.

**Lead status values (CRM-ready)**

- `new`  
- `prequalified`  
- `needs_review`  
- `not_fit`  
- `contacted`  
- `call_booked`  
- `submitted_to_partner`  
- `funded`  
- `lost`  

**Lifecycle (conceptual)**  

- `new` ? `prequalified` ? `contacted` ? `call_booked` ? `submitted_to_partner` ? `funded`  
- `new` ? `needs_review` ? �  
- `new` ? `not_fit` ? nurture or `lost`  
- Any ? `lost`  

**Admin (later):** filters by status/score/date/source/industry; detail view; notes; CSV export; optional `/admin/leads` scaffold with simple secret gate�no overbuilt auth in v1 unless requested.

---

## 10. Automation / message templates

**Applicant SMS (if consent)** � short, compliant; include STOP language where appropriate:

> Built Together Funding: Thanks for applying. Based on your responses, your business may be a fit for a funding review. Our team will reach out to go over details. This is not a funding approval. Reply STOP to opt out.

**Applicant email** � subject e.g. �We received your Built Together Funding application�; body must include **not approval** and **underwriting/partner** language (see missing-context pack for full default).

**Internal email** � subject e.g. `New BTF application - {{business_name}} - Score {{lead_score}}`; include name, business, phone, email, time in business, funding amount, use of funds, bank-statement status (files attached paths or "send later"), score, status, UTM source/campaign.

**User-specified applicant confirmation (align with site):**

> Based on your responses, it looks like your business may be a fit for a funding review. Our team will reach out to go over your options. This is not a funding approval. Final options are subject to review, underwriting, and partner availability.

---

## 11. Tracking / analytics rules

**Persist from first landing** (localStorage/session): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, **`gclid`**, **`fbclid`**, **landing path**. Attach all to submission payload.

**Events to implement (hooks placeholders until IDs exist)**

- CTA click (�See If You Qualify� / Apply)  
- Phone click  
- Email click (if tracked)  
- Application start (`/apply` first interaction)  
- Application step complete  
- Application submit  
- Result: prequalified / needs review / not fit yet  

**Integrations (env-gated, no real IDs required for MVP)**

- GA4 � `NEXT_PUBLIC_GA4_ID`  
- Meta Pixel � `NEXT_PUBLIC_META_PIXEL_ID`  
- Google Ads � `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` (align naming in `.env.local.example` with implementation)

---

## 12. Stack rules (Phase 2+)

From stack handoff + project requirements:

- **Next.js 15** App Router  
- **React 18**  
- **TypeScript**  
- **Tailwind CSS 3**  
- **ESLint** via `next lint`  
- **Vercel** deployment  
- **Supabase** � lead storage; service role on server  
- **Resend** � email  
- **Twilio** � SMS  
- **Framer Motion** � transitions  
- **Zod** � validation  
- **React Hook Form** (+ `@hookform/resolvers`) � if helpful for forms  

**Do not** use Vite or CRA.

**Config conventions (from stack PDF)**

- `trailingSlash: true` � **all internal `Link` hrefs and canonical URLs must use trailing slashes**  
- `next.config`: expose `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` if used; security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.); image formats `avif`, `webp`  
- `vercel.json`: `framework: "nextjs"`, `buildCommand: "next build"`  
- **Omit** Wash Kings blog cron unless product requires it later  

**Windows:** prefer `;` over `&&` in PowerShell for chained commands when documenting.

---

## 13. Pages to build

| Route | Purpose |
|-------|---------|
| `/` | Homepage (full section order in �14) |
| `/apply/` | Interactive application funnel |
| `/how-it-works/` | Process to review call and options |
| `/who-we-help/` | Industries + maturity filter |
| `/funding-uses/` | Equipment, crews, trucks, marketing, WC |
| `/about/` | Founder / philosophy |
| `/resources/` | SEO hub (stubs/real posts later) |
| `/contact/` | Contact + opt-out / preference language |
| `/privacy-policy/` | Privacy |
| `/terms/` | Terms of use |
| `/disclosures/` | Funding disclosures |

---

## 14. Homepage section order (marketing)

1. Hero � headline, subhead, primary/secondary CTA; stacked logo or icon tastefully; trust points  
2. Operator-led positioning  
3. Who we help (trades list)  
4. Who this is **not** for  
5. What funding is used for (capacity, not survival)  
6. Interactive application preview ? push to `/apply/`  
7. Process: Apply ? Pre-screen ? Funding review call ? Review options ? Deploy capital strategically  
8. Founder/operator story (only verified facts from context�no invented stats)  
9. Trust / authority  
10. FAQ (compliance-safe)  
11. Final CTA  

---

## 15. Reference sites (behavior only)

References: fundwithprime.com, primecapitalpartners.org/get-funded, statenislandwashkings.com � use for **funnel simplicity, CTA placement, conversion flow, trust structure, mobile UX** only.

**Do not** copy text, branding, images, layouts, or code.

---

## 16. Content rules

- **No** lorem ipsum. **No** fake testimonials, partner logos, approval rates, or numbers not in context.  
- FAQ topics from missing-context pack (pre-qual vs approval, industries, uses, startups, speed, credit, docs, active funding, demand/capacity, differentiation).  
- `/resources/` may launch with topic cards or minimal articles�expand SEO later.

---

## 17. Deployment notes

- Set all env vars in Vercel; **redeploy after env changes**.  
- Verify production `/apply/` submit, internal + applicant emails, SMS consent path.  
- Analytics scripts load only when public IDs are set.  
- Footer links to privacy, terms, disclosures visible on every page.  
- Run `npm run lint` and `npm run build` before ship; fix errors.

---

## 18. Build order (phases)

| Phase | Deliverable |
|-------|-------------|
| **1** | **This file � `CONTEXT-INDEX.md`** (complete) |
| **2** | Scaffold Next.js 15, configs, `vercel.json`, `.env.local.example`, `README.md` |
| **3** | Design system: layout, nav, footer, buttons, cards, sections, CTA, disclaimer; copy logos to `public/brand/` |
| **4** | Homepage `/` |
| **5** | Supporting pages: how-it-works, who-we-help, funding-uses, about, resources, contact |
| **6** | `/apply/` funnel |
| **7** | API route, Zod, scoring, Supabase, Resend, Twilio, fallbacks |
| **8** | Legal pages |
| **9** | Tracking + UTM/gclid/fbclid |
| **10** | QA: lint/build; optional admin scaffold; deployment checklist |

---

## 19. Phase 2 preview (next, after explicit go-ahead)

Phase 2 will **only** scaffold the codebase: `package.json`, `next.config` (trailing slash, headers, Supabase public env), Tailwind 3 + PostCSS, `tsconfig`, ESLint (`next lint`), `vercel.json` (no blog cron), `.env.local.example` with all agreed variables, `README.md` with install/build/lint/deploy�and **no** full `app/` pages until Phase 3+ unless a minimal `app/layout` stub is required for the scaffold to run (confirm in Phase 2 instructions).

---

*End of CONTEXT-INDEX.md*
