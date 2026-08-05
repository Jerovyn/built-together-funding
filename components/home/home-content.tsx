import Image from "next/image";
import Link from "next/link";
import { FundingCalculator } from "@/components/calculator/funding-calculator";
import { InkGrid } from "@/components/brand/ink-grid";
import { CountUp } from "@/components/count-up";
import { ProductIcon } from "@/components/products/product-icon";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  APPLY_TIME_ESTIMATE,
  CTA_PREQUAL_LABEL,
  CREDIT_CHECK_SHORT,
  DISCLAIMER_PREQUAL_LINE,
  HOME_FAQS,
  HOME_MIN_REQUIREMENTS,
  HOME_STATS,
  HOME_TRADES_MARQUEE,
  ROUTES,
  SITE_TAGLINE,
} from "@/lib/constants";
import { PRODUCTS } from "@/lib/products";

const TRUST_CHIPS = [
  "Underwritten on bank statements",
  CREDIT_CHECK_SHORT,
  "Review within 1 business day",
];

const FIT_SIGNALS = [
  "Booked out — capacity is the ceiling",
  "You can name the truck, machine, or crew you'd buy",
  "Statements already show steady revenue",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us what you're after",
    body: "Product, amount, and basics — about 5 minutes, no hard credit pull.",
  },
  {
    step: "02",
    title: "Share bank statements",
    body: "Upload now or use a secure link later. Real deposits beat forms.",
  },
  {
    step: "03",
    title: "Get matched options",
    body: "A person reviews your file within 1 business day and maps what fits.",
  },
  {
    step: "04",
    title: "Book your review call",
    body: "Pick a time on the spot — we walk the options with you on a video call.",
  },
];

const COMPARISON_ROWS = [
  {
    label: "Application",
    btf: "About 5 minutes, online",
    bank: "Long forms, branch visits",
  },
  {
    label: "First answer",
    btf: "Within 1 business day",
    bank: "Days to weeks",
  },
  {
    label: "Underwriting",
    btf: "Bank statements first",
    bank: "Collateral + full financial package",
  },
  {
    label: "Options",
    btf: "8 products across a partner network",
    bank: "One institution's products",
  },
  {
    label: "Who you talk to",
    btf: "A person, on a call you book",
    bank: "A committee you never meet",
  },
  {
    label: "Pre-qualification",
    btf: "No credit score impact",
    bank: "Varies — often a pull up front",
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function HomeContent() {
  return (
    <>
      {/* HERO — dark ink with network grid */}
      <section className="relative overflow-hidden bg-btf-ink">
        <InkGrid />
        <div className="container relative max-w-6xl py-12 sm:py-14 md:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#36D8F6]">
                {SITE_TAGLINE}
              </p>
              <h1 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-on-ink sm:text-4xl md:text-5xl lg:text-[3.4rem]">
                More work than you can handle?{" "}
                <span className="bg-gradient-to-r from-[#36D8F6] to-btf-accent-soft bg-clip-text text-transparent">
                  We fund the capacity.
                </span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-btf-on-ink-muted">
                Working capital, equipment, term loans, and five more ways to
                fund the next move — matched to your business and underwritten
                on real bank statements.
              </p>
              <div className="flex flex-wrap gap-3">
                <TrackedButtonLink
                  href={ROUTES.apply}
                  variant="primary"
                  trackLabel={CTA_PREQUAL_LABEL}
                  trackLocation="home_hero"
                  className="px-7 py-3.5 text-base"
                  showArrow
                >
                  {CTA_PREQUAL_LABEL}
                </TrackedButtonLink>
                <Link
                  href={ROUTES.calculator}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-btf-ink-border bg-white/5 px-5 py-3 text-base font-semibold text-btf-on-ink transition-colors hover:border-[#36D8F6]/50 hover:bg-white/10"
                >
                  Run your numbers
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {TRUST_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="flex items-center gap-1.5 text-sm font-medium text-btf-on-ink-muted"
                  >
                    <CheckIcon className="h-4 w-4 shrink-0 text-[#36D8F6]" />
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="relative">
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-btf-ink-border shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src="/images/hero-crew.png"
                  alt="Roofing crew of several workers on a home at golden hour"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-btf-ink/70 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <div className="absolute -bottom-4 left-4 rounded-xl border border-btf-ink-border bg-btf-ink-2/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:left-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-btf-on-ink-muted">
                  Every file
                </p>
                <p className="text-sm font-extrabold text-btf-on-ink">
                  Reviewed by a person · 1 business day
                </p>
              </div>
            </Reveal>
          </div>

          {/* Stats band — operational, honest */}
          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-btf-ink-border pt-8 sm:mt-16 lg:grid-cols-4">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-3xl font-extrabold tabular-nums tracking-tight text-btf-on-ink sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium leading-snug text-btf-on-ink-muted sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRADES MARQUEE */}
      <section
        className="overflow-hidden border-b border-white/60 bg-white/25 py-4 backdrop-blur-md"
        aria-label="Industries we serve"
      >
        <div
          className="flex w-max motion-reduce:animate-none motion-safe:animate-marquee-x"
          aria-hidden="true"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-3 pr-3">
              {HOME_TRADES_MARQUEE.map((trade) => (
                <span
                  key={`${copy}-${trade}`}
                  className="shrink-0 rounded-full border border-white/80 bg-white/35 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007ABE] shadow-[0_0_18px_rgba(54,216,246,0.14)] backdrop-blur-sm sm:px-5 sm:py-2 sm:text-xs"
                >
                  {trade}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">
          Industries we serve include {HOME_TRADES_MARQUEE.join(", ")}.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-btf-accent">
          Simple process
        </p>
        <h2 className="mt-2 max-w-xl text-balance text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          From application to answers in four steps.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={Math.min(i * 80, 320)} className="h-full">
              <div className="relative flex h-full flex-col rounded-2xl border border-btf-border bg-btf-card p-5 transition-all duration-200 hover:border-btf-accent/30 hover:shadow-btf-card">
                <span className="text-3xl font-extrabold tabular-nums text-btf-accent/15">
                  {item.step}
                </span>
                <p className="mt-2 text-base font-bold text-btf-text">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-btf-text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-sm text-btf-text-muted">
          Full detail on{" "}
          <Link
            href={ROUTES.howItWorks}
            className="font-semibold text-btf-accent hover:underline"
          >
            how it works
          </Link>
          .
        </p>
      </SectionShell>

      {/* PRODUCTS */}
      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 sm:py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-btf-accent">
              Financing solutions
            </p>
            <h2 className="mt-2 max-w-xl text-balance text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
              Eight ways to fund the next move.
            </h2>
          </div>
          <Link
            href={ROUTES.products}
            className="text-sm font-semibold text-btf-accent hover:underline"
          >
            Compare all products →
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 60, 300)} className="h-full">
              <Link
                href={`${ROUTES.products}${p.slug}/`}
                className="group flex h-full flex-col rounded-2xl border border-btf-border bg-btf-card p-4 transition-all duration-200 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:hover:-translate-y-1"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-btf-accent/10 text-btf-accent">
                  <ProductIcon slug={p.slug} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-bold text-btf-text group-hover:text-btf-accent">
                  {p.shortName}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-btf-accent">
                  {p.amountRangeLabel}
                </p>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-btf-text-muted">
                  {p.tagline}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* CALCULATOR */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-btf-accent">
          Funding calculator
        </p>
        <h2 className="mt-2 max-w-xl text-balance text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          Know your numbers before you commit.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-btf-text-muted">
          Model the payment with the right math for each product — then flip
          the tab and see if the move pays for itself.
        </p>
        <Reveal className="mt-6 min-w-0 sm:mt-8">
          <FundingCalculator embedded />
        </Reveal>
        <p className="mt-4 text-sm text-btf-text-muted">
          Want the full-screen version?{" "}
          <Link
            href={ROUTES.calculator}
            className="font-semibold text-btf-accent hover:underline"
          >
            Open the calculator
          </Link>
          .
        </p>
      </SectionShell>

      {/* COMPARISON */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-btf-accent">
          Why owners pick us
        </p>
        <h2 className="mt-2 max-w-xl text-balance text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          Built Together Funding vs. the bank line.
        </h2>
        <Reveal className="mt-8 overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
          <table className="w-full border-collapse bg-btf-card text-left text-sm">
            <thead>
              <tr className="border-b border-btf-border bg-btf-secondary">
                <th scope="col" className="p-3 sm:p-4" aria-label="Feature" />
                <th
                  scope="col"
                  className="p-3 font-extrabold text-btf-accent sm:p-4"
                >
                  Built Together Funding
                </th>
                <th
                  scope="col"
                  className="p-3 font-semibold text-btf-text-muted sm:p-4"
                >
                  Typical bank
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-btf-border last:border-0">
                  <th
                    scope="row"
                    className="p-3 align-top text-xs font-semibold text-btf-text-muted sm:p-4 sm:text-sm"
                  >
                    {row.label}
                  </th>
                  <td className="p-3 align-top font-semibold text-btf-text sm:p-4">
                    <span className="flex gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-btf-accent" />
                      {row.btf}
                    </span>
                  </td>
                  <td className="p-3 align-top text-btf-text-muted sm:p-4">{row.bank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-btf-text-muted">
          {DISCLAIMER_PREQUAL_LINE}
        </p>
      </SectionShell>

      {/* MIN REQUIREMENTS + FIT */}
      <SectionShell className="border-b border-btf-border bg-white/40 py-12 backdrop-blur-[2px] md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
              Minimum requirements
            </h2>
            <p className="mt-2 max-w-xl text-sm text-btf-text-muted">
              We review every file by hand. These are the basics most
              successful applications share.
            </p>
            <ul className="mt-5 grid gap-3">
              {HOME_MIN_REQUIREMENTS.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-btf-border bg-btf-card p-4 text-sm font-medium text-btf-text"
                >
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-btf-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
              When we say yes, it means something.
            </h2>
            <p className="mt-2 text-sm text-btf-text-muted">
              We decline files where the math doesn&apos;t work.{" "}
              <Link
                href={ROUTES.whoWeHelp}
                className="font-semibold text-btf-accent hover:underline"
              >
                Who we help
              </Link>
            </p>
            <ul className="mt-5 space-y-3">
              {FIT_SIGNALS.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm font-medium text-btf-text md:text-base"
                >
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-btf-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell className="border-b border-btf-border py-12 md:py-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          Quick answers
        </h2>
        <div className="mt-6 grid gap-2 lg:max-w-2xl">
          {HOME_FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-btf-border bg-btf-card open:border-btf-accent/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-btf-text [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  className="text-lg font-bold text-btf-accent transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-snug text-btf-text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </SectionShell>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-btf-ink">
        <InkGrid />
        <Image
          src="/images/action-washing.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-btf-ink via-btf-ink/90 to-btf-ink/50"
          aria-hidden
        />
        <div className="container relative max-w-6xl py-12 sm:py-16 md:py-20">
          <h2 className="max-w-lg text-balance text-2xl font-extrabold leading-tight tracking-tight text-btf-on-ink sm:text-3xl md:text-5xl">
            Start your pre-qual.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-btf-on-ink-muted">
            {APPLY_TIME_ESTIMATE}. A straight answer within one business day.
          </p>
          <div className="mt-6">
            <TrackedButtonLink
              href={ROUTES.apply}
              variant="primary"
              trackLabel={CTA_PREQUAL_LABEL}
              trackLocation="home_final_cta"
              className="px-8 py-4 text-lg"
              showArrow
            >
              {CTA_PREQUAL_LABEL}
            </TrackedButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
