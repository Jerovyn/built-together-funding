# BUILT TOGETHER FUNDING CORP — COMPLETE MAX-FIDELITY CONTEXT PACK

**Generated:** 2026-07-07 (post premium pass + UX polish + hero/calculator/CTA session)  
**Purpose:** Cold-start continuation in a new chat with zero casual loss. Paste this entire file.  
**Project root:** `C:\Users\Asus\BTF CORP`  
**Business PDFs (reference, do not delete):** `C:\Users\Asus\BTF CORP\context\`  
**Implementation checklist (partially stale):** `CONTEXT-INDEX.md` — this pack supersedes it for *current* app state.

---

## 0) NON-NEGOTIABLE PRODUCT FRAMING

| Item | Value |
|------|--------|
| **Legal entity** | Built Together Funding Corp |
| **Site copy name** | `SITE_NAME` = "Built Together Funding" (`lib/constants.ts`) |
| **Core brand line (sitewide)** | `BRAND_LINE` = "Funding is a commitment to growth." |
| **Homepage hero line only** | `HERO_BRAND_LINE` = "Where funding is a commitment to growth." — reads after header logo as "Built Together Funding where funding is a commitment to growth." |
| **Primary funding CTA label** | `CTA_PREQUAL_LABEL` = "Get pre-qualified" — conversion paths only (see §5.4) |
| **Product** | Pre-qual + lead-gen: marketing site, 3-step `/apply/` funnel, statement uploads, API, Supabase, Resend/Twilio, UTM, legal pages |
| **Audience** | Trades/services operators with demand > capacity (roofing, cleaning, landscaping, construction, general trades) |
| **Positioning** | Capacity capital when work exists; not survival borrowing |

### Hard bans

- Guaranteed approval, instant approval, "you are funded", bad credit OK, no docs, easy-money copy ("two minutes", "just three statements")
- Fake urgency, fake partners, fake testimonials, **inflated/fabricated stats**
- Positive "approval" language except explicit negated disclaimers

### Compliance strings (`lib/constants.ts`)

- `DISCLAIMER_PREQUAL_LINE`, `LEGAL_NO_GUARANTEE_LINE`, `DISCLAIMER_SHORT`
- `LEGAL_CAPACITY_PHILOSOPHY_LINE`
- `CREDIT_CHECK_LINE` / `CREDIT_CHECK_SHORT` — pre-qual won't affect score; partners may soft-pull with disclosure

### Credit-check decision (owner-approved, verified)

Safe: pre-qualifying here does not affect credit score. Do NOT claim zero credit involvement forever.

---

## 1) OWNER DECISION CHRONOLOGY (preserve reasoning)

### Phase A — Brand overhaul (2026-07-06)

- Bigger logos, less bland/white space, navy depth, **keep blue trust colors**
- Simplify funnel to MCA essentials: TIB, amount, use of funds, statements, contact
- Stock imagery OK; founder photos later
- Voice: operator-led; core message "Funding is a commitment to growth"
- Include use-of-funds question; statements upload or send-later via `/upload/{token}/`

### Phase B — Premium pass (2026-07-06 evening)

- Remove easy-money fluff and weak stats ($1.8M / 50+ removed from hero; user rejected inflating fake numbers)
- Interactive **GrowthCalculator** (homepage + funding-uses)
- **Natural-color photos** (not blue duotone) in `public/images/`
- Remove industry/revenue/demand questionnaire fields from funnel
- **BoltAssistant** floating scripted Q&A (not free chat)
- 3 real resource articles; SEO infra (OG, 404, sitemap, robots, JSON-LD)
- Funnel consolidated to **3 UI steps**
- Homepage rebuilt multi-section then **dieted** to ~5 sections (see §6)

### Phase C — Bug fixes (2026-07-06 late)

| Issue | Fix |
|-------|-----|
| Hydration on `<body>` | `suppressHydrationWarning` on `<html>` and `<body>` |
| Mobile apply buried Continue | Fixed bottom action bar; `pb-28` on apply page |
| `crypto.randomUUID` on LAN HTTP | `createUploadSessionId()` in `lib/statements.ts` |
| Stale `.next` / 500 errors | Stop dev, delete `.next`, restart |

### Phase D — Premium UX pass (2026-07-07)

- Removed all **texture grids** (`texture-grid`, `texture-grid-ink`, `texture-dots`)
- Calculator: **Inventory** preset, **utilization** slider, mobile chip scroll, custom sliders
- CTA interactions: hover lift, press scale, arrows on primary
- **Sticky mobile CTA** after scroll on marketing pages
- Mobile header Apply pill always visible
- Trimmed marketing pages copy/length
- Funding amounts extended: `$150k–$300k`, `$300k+`

### Phase E — Hero / calculator / CTA polish (2026-07-07, user audit feedback)

| Change | Detail |
|--------|--------|
| Hero tagline | `HERO_BRAND_LINE` hero-only; NOT sitewide |
| Hero image | Regenerated multi-person roofing crew → `public/images/hero-crew.png` (replaced duplicated-person `hero-crew.jpg`) |
| Slider styling | Full WebKit/Firefox track + thumb in `globals.css` `.btf-slider`; taller track, larger thumb, `touch-action: manipulation` |
| Calculator copy | "What it costs", "Revenue it adds / month", "Your margin", "How much you'll use it", "Profit / mo", "Covers cost in", "After payoff / yr" |
| Mobile calculator chips | `snap-x`, horizontal scroll, right-edge fade hint, taller chip tap targets |
| CTA split | **Get pre-qualified** on conversion paths; **Check your fit** kept on softer/secondary pages (intentional, user request) |

---

## 2) STACK & ARCHITECTURAL CONSTRAINTS

- **Next.js 15** App Router (`next@^15.1.6`, builds ~15.5.x)
- **React 18**, **TypeScript 5.7**, **Tailwind 3**, **Zod 4**, RHF
- **Supabase** (service role server-only), **Resend**, **Twilio**
- `trailingSlash: true` — all internal links use trailing slashes
- Vercel serverless ~4.5MB body → 4MB/file statement cap
- `allowedDevOrigins` NOT configured (LAN may warn on `/_next/*`)
- Never import `lib/supabase/server.ts` in client components

---

## 3) DESIGN SYSTEM (CURRENT)

### Palette (`tailwind.config.ts`)

Bright/clean + navy ink: `btf-accent` #1D4ED8, `btf-ink` #081123, white cards, `btf-text-muted` #475569. **Keep blue trust colors** — owner rejected wholesale palette swap.

### Textures

**REMOVED** — no blueprint/dot grids. Depth via photography, ink sections, subtle shadows.

### Animations

`fade-up`, `bolt-wiggle`, `bolt-breathe`, `marquee-x` (trades strip with `motion-reduce:animate-none`)

### Buttons (`components/ui/button.tsx`)

`motion-safe:hover:-translate-y-0.5`, `active:scale-[0.98]`, stronger shadow on primary. `ButtonArrow` + `showArrow` on `TrackedButtonLink`.

### Imagery

Natural golden-hour JPEGs/PNG in `public/images/`. Hero: **hero-crew.png** (multi-person crew).

---

## 4) ROUTE MAP

| Route | Purpose |
|-------|---------|
| `/` | Streamlined homepage (hero, trades strip, calculator, fit signals, 3 FAQs, final CTA) |
| `/apply/` | 3-step funnel |
| `/how-it-works/`, `/who-we-help/`, `/funding-uses/`, `/about/`, `/resources/`, `/contact/` | Trimmed marketing |
| `/resources/[slug]/` | 3 SSG articles |
| `/upload/[token]/` | Secure statement follow-up (noindex) |
| `/api/apply/`, `/api/statements/` | POST only |
| `/admin/leads/?secret=` | Env-gated scaffold |

---

## 5) APPLY FUNNEL (CRITICAL)

### 5.1 Three steps (indices 0–2)

| Step | Label | Fields |
|------|-------|--------|
| 0 | Your answers | `timeInBusiness`, `fundingAmount`, `useOfFunds` (one screen) |
| 1 | Bank statements | upload OR `statementsSkipped` |
| 2 | Contact | name, business, phone, email, `emailConsent` (required), `smsConsent` (optional) |

`APPLY_STEP_COUNT = 3` in `lib/apply-schema.ts`.

**Removed permanently:** industry, monthly/annual revenue, demand/capacity Y/N, 12 micro-steps, website, etc.

### 5.2 Funding amount options

`under_25k`, `25k_75k`, `75k_150k`, `150k_300k`, `300k_plus` — added upper tiers for larger operators.

### 5.3 Mobile UX

- Fixed bottom action bar; Continue always visible (disabled when incomplete)
- `createUploadSessionId()` on mount — **required for LAN HTTP** (`http://192.168.x.x:3000`)
- Natural document scroll (no nested scroll areas)
- `pb-28` on apply page shell

### 5.4 Disclaimer

One-time modal: `sessionStorage` key `btf_apply_disclaimer_ack`. Footer retains full `DISCLAIMER_SHORT`.

### 5.5 Statement upload flow

1. Pre-submit: `POST /api/statements/` with `session` → `presubmit/{session}/`
2. Send later: `upload_token` → `/upload/{token}/` in notifications
3. Max 6 files, 4MB each, PDF/PNG/JPG

### 5.6 Scoring (`lib/apply-scoring.ts`)

TIB (+35 to -30), growth uses (+25), statements uploaded (+30) / skipped (+5), amount (+5). Thresholds: 70+ prequalified, 40–69 needs_review, <40 not_fit_yet. Score never exposed to client.

### 5.7 Bolt

- **BoltCoach:** inline in apply sticky bar; 3 tips
- **BoltAssistant:** sitewide scripted Q&A; hidden on `/apply` and `/upload`; `bottom-20` on mobile (above sticky CTA)

---

## 6) HOMEPAGE (`components/home/home-content.tsx`)

**Sections (current):**
1. Hero — `HERO_BRAND_LINE`, headline, `CTA_PREQUAL_LABEL`, trust chips, `hero-crew.png`
2. Trades marquee strip (compact, ink background)
3. Growth calculator — "Run the math on what you'd buy."
4. Fit signals — 3 bullets + link to who-we-help
5. FAQ — 3 items only
6. Final CTA — `CTA_PREQUAL_LABEL`

**Removed from homepage:** long brand band, money-uses cards, dual straight-talk cards, process section, founder note, 6-FAQ block, duplicate disclaimers in hero.

**Trust chips:** "Real bank statements, not forms", "Won't affect your credit score", "Review within 1 business day"

---

## 7) GROWTH CALCULATOR (`components/growth-calculator.tsx`)

### Presets (horizontal scroll chips on mobile)

Equipment, Truck, Crew, Marketing, **Inventory** — maps to apply use-of-funds via `lib/calculator-preset.ts` (`sessionStorage` key `btf_calc_use`).

### Sliders

- What it costs ($5k–$250k)
- Revenue it adds / month
- Your margin (%)
- How much you'll use it (utilization 50–100%)

### Output

Profit/mo, Covers cost in (months), After payoff/yr, 36-month bar chart with cost line.

### Bridge CTA

After user interaction + viable break-even: `CTA_PREQUAL_LABEL` → `/apply/` with preset saved.

### Compliance

Footer: "Not a quote. Financing costs not included." — no rates/APR modeled.

### Mobile fixes

- Chip row: `snap-x snap-mandatory`, `overflow-x-auto`, hidden scrollbar, right fade gradient
- Sliders: `.btf-slider` with WebKit runnable-track + Mozilla range-track/progress; `py-2` touch padding

---

## 8) CTA STRATEGY (INTENTIONAL SPLIT)

### Uses `CTA_PREQUAL_LABEL` ("Get pre-qualified")

- Homepage hero + final CTA
- Site header (desktop: full label; mobile pill: "Pre-qual")
- Sticky mobile CTA (`components/sticky-mobile-cta.tsx`)
- Calculator bridge
- Contact primary button
- How-it-works CtaBlock: "Start pre-qual" (could align to constant later)

### Still uses "Check your fit" (softer / secondary — user chose NOT to change all buttons)

- `CtaBlock` default prop
- About, Who We Help, Resources, Contact footer
- Site footer link, Bolt assistant, 404
- Header mobile menu (hamburger) — still "Check your fit"

### Other labels

- Funding-uses: "Run my file"

**Reasoning:** User said "Check your fit" doesn't line up with funding on primary paths; secondary informational pages can keep softer fit language.

---

## 9) BOLT MASCOT

- **BoltCoach:** apply funnel sticky bar
- **BoltAssistant:** 6 scripted Q&As; compliance-safe; no free chat
- Hidden on apply/upload routes

---

## 10) RESOURCES

3 articles in `lib/articles.ts`:
- `when-should-a-contractor-use-funding`
- `equipment-financing-vs-working-capital`
- `why-funding-without-demand-is-dangerous`

---

## 11) SEO / INFRASTRUCTURE

- `app/opengraph-image.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`
- JSON-LD Organization + WebSite in `app/layout.tsx`
- `viewport` export; `suppressHydrationWarning` on html/body
- `StickyMobileCta` + `BoltAssistant` in root layout
- Footer entity: "Built Together Funding Corp"; optional `NEXT_PUBLIC_BUSINESS_ADDRESS`

---

## 12) SUPABASE

Run `docs/supabase-leads.sql`. Table v2: TIB, amount, use_of_funds[], statement_paths[], statements_status, upload_token, consents, score, status, UTM, raw_answers. Private `statements` bucket. Service role only from API.

---

## 13) ENVIRONMENT VARIABLES

See `.env.local.example`: `NEXT_PUBLIC_SITE_URL`, phone/email/address, Supabase URL + service role, Resend, Twilio, analytics IDs, `ADMIN_DASHBOARD_SECRET`.

---

## 14) DEV WORKFLOW (WINDOWS)

```powershell
cd "C:\Users\Asus\BTF CORP"
npm run dev -- -H 0.0.0.0   # LAN phone testing
npm run lint
npm run build
```

- **Desktop:** http://localhost:3000/
- **Phone:** http://192.168.1.173:3000/ (typical LAN IP)
- **Stale `.next`:** stop dev, delete `.next`, restart — do not run build + dev concurrently
- **LAN crypto:** `createUploadSessionId()` required on `/apply/` for non-HTTPS

---

## 15) PUBLIC ASSETS

### Images (`public/images/`)

| File | Use |
|------|-----|
| `hero-crew.png` | **Current homepage hero** (multi-person crew, regenerated 2026-07-07) |
| `hero-crew.jpg` | Legacy (duplicated person); superseded by .png |
| `equipment-excavator.jpg`, `work-trucks.jpg`, `action-washing.jpg`, `founder-plans.jpg` | Marketing |

### Brand (`public/brand/`)

| File | Use |
|------|-----|
| `btf-logo-tools.png` | Header/footer logo mark |
| `btf-logo-icon-mark.png` | Favicon |
| Other lockups | Available; large PNGs (~2MB) — performance backlog |

---

## 16) KEY FILES

| Area | Path |
|------|------|
| Constants/copy | `lib/constants.ts` |
| Funnel UI | `components/apply/apply-funnel.tsx` |
| Schema | `lib/apply-schema.ts` |
| Statements/crypto | `lib/statements.ts` |
| Calculator preset handoff | `lib/calculator-preset.ts` |
| Calculator | `components/growth-calculator.tsx` |
| Slider CSS | `app/globals.css` |
| Homepage | `components/home/home-content.tsx` |
| Sticky CTA | `components/sticky-mobile-cta.tsx` |
| Buttons/tracking | `components/ui/button.tsx`, `components/tracking/tracked-link.tsx` |
| Layout | `app/layout.tsx` |

---

## 17) UNFINISHED / BACKLOG

### Owner must provide

- [ ] Founder **name + photo** (replace `founder-plans.jpg`, about placeholder)
- [ ] Real **phone**, **email**, **business address** in env
- [ ] **Domain + Vercel deploy**; run `docs/supabase-leads.sql` on production
- [ ] **Attorney review** before paid ads (`docs/LAUNCH_CHECKLIST.md`)

### Code/product backlog

- [ ] Unify remaining CTAs if desired (header menu still "Check your fit")
- [ ] Compress brand PNGs (~2MB each) for LCP
- [ ] `allowedDevOrigins` in `next.config.mjs`
- [ ] `npm run dev:clean` script
- [ ] Orphan `presubmit/` storage cleanup job
- [ ] Production admin auth
- [ ] Real Bolt illustration
- [ ] Delete legacy `hero-crew.jpg` if no longer referenced
- [ ] Shake animation on invalid Continue (`nudge` exists in apply-funnel)
- [ ] Update `README.md` / old context docs to match 3-step funnel + current CTAs

### Do NOT without owner reversal

- Industry/revenue/demand fields in funnel
- Easy-money copy or fake stats
- Free-chat Bolt
- `HERO_BRAND_LINE` sitewide (grammatically breaks footer)
- Texture grids (owner rejected)
- Change brand away from trust blue

---

## 18) IMPLICIT REASONING

1. **Premium = restraint** — fewer words, real process, no easy-money insinuation
2. **Statements > self-report** — bank statements replace revenue/capacity checkboxes
3. **3 phases, not 12 screens** — three questions on one screen, then statements, then contact
4. **Hero read order** — logo "Built Together Funding" + hero line "Where funding…" = intentional sentence bridge
5. **CTA split** — "Get pre-qualified" = funding action; "Check your fit" = softer fit on info pages
6. **Calculator** — educational break-even only; inventory preset for seasonal/materials operators
7. **Mobile-first** — sticky CTA, chip scroll, slider touch targets, crypto fallback for LAN
8. **Compliance** — exact constant strings; pre-qual ≠ approval
9. **Stats honesty** — omit weak real numbers rather than inflate
10. **Multi-person hero** — duplicated faces undermine trust; regenerated with variety

---

## 19) VERIFICATION CHECKLIST

- [ ] `/` — hero `HERO_BRAND_LINE`, hero-crew.png, calculator, Get pre-qualified CTAs
- [ ] `/apply/` — 3 steps, mobile bottom bar, no crypto crash on LAN HTTP
- [ ] Calculator — swipe chips on mobile, sliders draggable, bridge CTA
- [ ] BoltAssistant on marketing pages; hidden on apply/upload
- [ ] No texture grids anywhere
- [ ] `npm run lint` && `npm run build` pass
- [ ] POST `/api/apply/` with Supabase env configured

---

## 20) REPO TREE (high-signal)

```
C:\Users\Asus\BTF CORP\
  app\                    # pages, API routes, layout, globals.css
  components\
    home\home-content.tsx
    growth-calculator.tsx
    sticky-mobile-cta.tsx
    apply\                # funnel, gate, progress, statements
    mascot\               # bolt, bolt-coach, bolt-assistant
    tracking\
    ui\button.tsx
  lib\
    constants.ts          # BRAND_LINE, HERO_BRAND_LINE, CTA_PREQUAL_LABEL
    apply-schema.ts
    apply-scoring.ts
    statements.ts         # createUploadSessionId
    calculator-preset.ts
    articles.ts
  docs\supabase-leads.sql, LAUNCH_CHECKLIST.md, SUPABASE_SETUP.md
  public\images\, public\brand\
  context\                # PDFs
  CONTEXT-PACK-MAX-FIDELITY.md  # THIS FILE
```

---

**END OF MAX-FIDELITY CONTEXT PACK**
