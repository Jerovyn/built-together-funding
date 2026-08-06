import Image from "next/image";
import Link from "next/link";
import { FundingCalculator } from "@/components/calculator/funding-calculator";
import { ProductIcon } from "@/components/products/product-icon";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  CTA_MICRO_LINE,
  CTA_PREQUAL_LABEL,
  HOME_FAQS,
  HOME_TRADES_MARQUEE,
  ROUTES,
} from "@/lib/constants";
import { PRODUCTS } from "@/lib/products";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Tell us what you're after",
    body: "5 minutes online. No hard credit pull.",
  },
  {
    step: "2",
    title: "A person reviews your file",
    body: "Real deposits beat paperwork. 1 business day.",
  },
  {
    step: "3",
    title: "Pick your option on a call",
    body: "We walk the numbers together. You decide.",
  },
];

const PROOF_STRIP = [
  "5 minutes online",
  "Answer in 1 business day",
  "A person, not a committee",
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
      {/* HERO — one idea, one action */}
      <SectionShell
        contained
        className="relative border-b border-btf-border py-10 sm:py-12 md:py-16"
      >
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-5">
            <h1 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl md:text-5xl">
              Money to <span className="text-btf-accent">grow your business.</span>
            </h1>
            <p className="max-w-lg text-base text-btf-text-muted sm:text-lg">
              Trucks, crews, equipment — $10K to $10M for trades and service
              businesses. A straight answer in 1 business day.
            </p>
            <div className="space-y-2.5">
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
              <p className="text-sm font-medium text-btf-text-muted">
                {CTA_MICRO_LINE}
              </p>
            </div>
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

      {/* TRADES MARQUEE — zero-reading-effort "people like me" signal */}
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

      {/* HOW IT WORKS — three steps, one line each */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          How it works
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={i * 40} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-btf-border bg-btf-card p-5 transition-all duration-150 hover:shadow-btf-card motion-safe:active:scale-[0.98]">
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
        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {PROOF_STRIP.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-sm font-medium text-btf-text-muted"
            >
              <CheckIcon className="h-4 w-4 shrink-0 text-btf-accent" />
              {item}
            </li>
          ))}
        </ul>
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
                className="group flex h-full items-center gap-3 rounded-2xl border border-btf-border bg-btf-card p-4 transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:active:scale-[0.98]"
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

      {/* CALCULATOR — the useful gift, right after the products */}
      <SectionShell className="border-b border-btf-border py-12 sm:py-14 md:py-16">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          Run the math on what you&apos;d buy
        </h2>
        <Reveal className="mt-6 min-w-0 sm:mt-8">
          <FundingCalculator embedded />
        </Reveal>
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
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-btf-text transition-colors duration-150 active:bg-btf-secondary/70 [&::-webkit-details-marker]:hidden">
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

      {/* FINAL CTA — disarm, don't push */}
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
          <h2 className="max-w-xl text-balance text-2xl font-extrabold leading-tight tracking-tight text-btf-on-ink sm:text-3xl md:text-5xl">
            No pressure. No credit hit.{" "}
            <span className="text-btf-accent-soft">Just your options.</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-btf-on-ink-muted">
            About 5 minutes. If it&apos;s not a fit, we&apos;ll tell you
            straight.
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
