import Image from "next/image";
import Link from "next/link";
import { GrowthCalculator } from "@/components/growth-calculator";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  APPLY_TIME_ESTIMATE,
  CTA_PREQUAL_LABEL,
  CREDIT_CHECK_SHORT,
  HERO_BRAND_LINE,
  HOME_FAQS,
  HOME_MIN_REQUIREMENTS,
  ROUTES,
} from "@/lib/constants";

const TRADES = [
  "Roofing",
  "Landscaping",
  "Pressure washing",
  "Exterior cleaning",
  "Construction",
  "Builders",
  "General trades",
];

const TRUST_CHIPS = [
  "Real bank statements, not forms",
  CREDIT_CHECK_SHORT,
  "Review within 1 business day",
];

const FIT_SIGNALS = [
  "Booked out — capacity is the ceiling",
  "You can name the truck, machine, or crew you'd buy",
  "Statements already show steady revenue",
];

const MIN_REQUIREMENTS = HOME_MIN_REQUIREMENTS;
const FAQS = HOME_FAQS;

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
      {/* HERO */}
      <SectionShell
        contained
        className="relative border-b border-btf-border py-10 sm:py-12 md:py-16"
      >
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <p className="text-sm font-bold tracking-tight text-btf-accent">
              {HERO_BRAND_LINE}
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl sm:leading-[1.05] md:text-5xl">
              More work than you can handle?{" "}
              <span className="text-btf-accent">We fund the capacity.</span>
            </h1>
            <p className="max-w-lg text-base text-btf-text-muted">
              Equipment, trucks, crews, inventory, and marketing — underwritten
              on your statements.
            </p>
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

      {/* TRADES STRIP */}
      <section
        className="overflow-hidden border-b border-btf-ink-border bg-btf-ink py-3"
        aria-label="Industries we serve"
      >
        <div
          className="flex w-max motion-reduce:animate-none motion-safe:animate-marquee-x"
          aria-hidden="true"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {TRADES.map((trade) => (
                <span
                  key={`${copy}-${trade}`}
                  className="flex items-center gap-5 px-5 text-sm font-bold uppercase tracking-wide text-btf-on-ink-muted"
                >
                  {trade}
                  <span className="text-btf-accent-soft">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <SectionShell className="border-b border-btf-border py-10 sm:py-12 md:py-14">
        <h2 className="max-w-xl text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
          Run the math on what you&apos;d buy.
        </h2>
        <Reveal className="mt-6 min-w-0 sm:mt-8">
          <GrowthCalculator />
        </Reveal>
      </SectionShell>

      {/* MIN REQUIREMENTS */}
      <SectionShell className="border-b border-btf-border py-10 sm:py-12 md:py-14">
        <h2 className="text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
          Minimum requirements
        </h2>
        <p className="mt-2 max-w-xl text-sm text-btf-text-muted">
          We review every file by hand. These are the basics most successful
          applications share.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
          {MIN_REQUIREMENTS.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-btf-border bg-btf-card p-4 text-sm font-medium text-btf-text"
            >
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-btf-accent" />
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* FIT SIGNALS */}
      <SectionShell className="border-b border-btf-border bg-white/40 py-12 backdrop-blur-[2px] md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
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
          </div>
          <ul className="space-y-3 lg:max-w-md">
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
      </SectionShell>

      {/* FAQ */}
      <SectionShell className="border-b border-btf-border py-12 md:py-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          Quick answers
        </h2>
        <div className="mt-6 grid gap-2 lg:max-w-2xl">
          {FAQS.map((faq) => (
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
        <p className="mt-4 text-sm text-btf-text-muted">
          More questions? Use the{" "}
          <span className="font-medium text-btf-text">Questions?</span> guide on
          any page.
        </p>
      </SectionShell>

      {/* FINAL CTA */}
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
