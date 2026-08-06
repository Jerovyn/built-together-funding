import Image from "next/image";
import Link from "next/link";
import { FundingCalculator } from "@/components/calculator/funding-calculator";
import { ProductIcon } from "@/components/products/product-icon";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  APPLY_TIME_ESTIMATE,
  CTA_PREQUAL_LABEL,
  CREDIT_CHECK_SHORT,
  DISCLAIMER_PREQUAL_LINE,
  HERO_BRAND_LINE,
  HOME_FAQS,
  HOME_MIN_REQUIREMENTS,
  HOME_TRADES_MARQUEE,
  ROUTES,
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
    step: "1",
    title: "Tell us what you're after",
    body: "Product, amount, basics. About 5 minutes.",
  },
  {
    step: "2",
    title: "Share bank statements",
    body: "Upload now or send later by secure link.",
  },
  {
    step: "3",
    title: "Get matched options",
    body: "A person reviews your file in 1 business day.",
  },
  {
    step: "4",
    title: "Book your review call",
    body: "Walk through the options together and pick.",
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
    bank: "Collateral + full financials",
  },
  {
    label: "Who you talk to",
    btf: "A person, on a call you book",
    bank: "A committee you never meet",
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
      {/* HERO — light, one primary action */}
      <SectionShell
        contained
        className="relative border-b border-btf-border py-10 sm:py-12 md:py-16"
      >
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <p className="text-sm font-bold tracking-tight text-btf-accent">
              {HERO_BRAND_LINE}
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl md:text-5xl">
              More work than you can handle?{" "}
              <span className="text-btf-accent">We fund the capacity.</span>
            </h1>
            <p className="max-w-lg text-base text-btf-text-muted">
              Eight ways to fund the next move — underwritten on your bank
              statements, not a stack of paperwork.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
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
                className="text-sm font-semibold text-btf-accent hover:underline"
              >
                Run your numbers →
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {TRUST_CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="flex items-center gap-1.5 text-sm font-medium text-btf-text-muted"
                >
                  <CheckIcon className="h-4 w-4 shrink-0 text-btf-accent" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
              <Image
                src="/images/hero-crew.png"
                alt="Roofing crew of several workers on a home at golden hour"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-btf-ink/50 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* TRADES MARQUEE — slower, readable, pauses on hover */}
      <section
        className="group overflow-hidden border-b border-btf-border bg-btf-secondary py-4"
        aria-label="Industries we serve"
      >
        <div
          className="flex w-max motion-reduce:animate-none motion-safe:animate-marquee-x group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-3 pr-3">
              {HOME_TRADES_MARQUEE.map((trade) => (
                <span
                  key={`${copy}-${trade}`}
                  className="shrink-0 rounded-full border border-btf-border bg-white px-4 py-1.5 text-sm font-medium text-btf-text-muted"
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
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          How it works
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={i * 40} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-btf-border bg-btf-card p-5 transition-shadow duration-150 hover:shadow-btf-card">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-btf-accent/10 text-sm font-bold tabular-nums text-btf-accent">
                  {item.step}
                </span>
                <p className="mt-3 text-base font-bold text-btf-text">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-btf-text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* PRODUCTS */}
      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 sm:py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
            What we finance
          </h2>
          <Link
            href={ROUTES.products}
            className="text-sm font-semibold text-btf-accent hover:underline"
          >
            Compare all products →
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 40} className="h-full">
              <Link
                href={`${ROUTES.products}${p.slug}/`}
                className="group flex h-full items-center gap-3 rounded-2xl border border-btf-border bg-btf-card p-4 transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-btf-accent/10 text-btf-accent">
                  <ProductIcon slug={p.slug} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-btf-text group-hover:text-btf-accent">
                    {p.shortName}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-btf-text-muted">
                    {p.amountRangeLabel}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* CALCULATOR */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          Run the math on what you&apos;d buy
        </h2>
        <Reveal className="mt-6 min-w-0 sm:mt-8">
          <FundingCalculator embedded />
        </Reveal>
      </SectionShell>

      {/* COMPARISON */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          Us vs. the typical bank
        </h2>
        <Reveal className="mt-8 overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
          <table className="w-full border-collapse bg-btf-card text-left text-sm">
            <thead>
              <tr className="border-b border-btf-border bg-btf-secondary">
                <th scope="col" className="p-3 sm:p-4" aria-label="Feature" />
                <th scope="col" className="p-3 font-bold text-btf-accent sm:p-4">
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
      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-balance text-xl font-bold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
              Minimum requirements
            </h2>
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
            <h2 className="text-balance text-xl font-bold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
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
        <h2 className="text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
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
                  className="text-lg font-bold text-btf-accent transition-transform duration-150 group-open:rotate-45"
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

      {/* FINAL CTA — the one dark brand moment */}
      <section className="relative overflow-hidden bg-btf-ink">
        <Image
          src="/images/action-washing.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
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
