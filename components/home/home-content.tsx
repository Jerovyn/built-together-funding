import Image from "next/image";
import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  CTA_MICRO_LINE,
  CTA_PREQUAL_LABEL,
  HOME_DESIRE_SIGNALS,
  HOME_PULL_LINE,
  HOME_TRADES_MARQUEE,
  ROUTES,
} from "@/lib/constants";

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

/**
 * Three beats + desire: who it's for, capacity pull, two clear paths.
 */
export function HomeContent() {
  return (
    <>
      <SectionShell
        contained
        className="relative border-b border-btf-border py-10 sm:py-14 md:py-16"
      >
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-5">
            <p className="text-sm font-semibold text-btf-accent">
              Financing for trades &amp; service businesses
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-btf-text sm:text-4xl md:text-[2.75rem]">
              {HOME_PULL_LINE}
            </h1>
            <p className="max-w-md text-base text-btf-text-muted sm:text-lg">
              $10K to $10M. Underwritten on your bank statements. Straight
              answer in 1 business day — from a person, not a portal.
            </p>
            <div className="space-y-2">
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
              <p className="text-sm font-medium text-btf-text-muted">
                {CTA_MICRO_LINE}
              </p>
            </div>
          </div>

          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
            <Image
              src="/images/hero-crew.png"
              alt="Trade crew on a job — the kind of work we fund capacity for"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </SectionShell>

      <section
        className="group overflow-hidden border-b border-btf-border bg-btf-secondary py-3.5"
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

      <SectionShell className="border-b border-btf-border py-10 sm:py-12">
        <ul className="grid gap-3 sm:grid-cols-3">
          {HOME_DESIRE_SIGNALS.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm font-medium text-btf-text"
            >
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-btf-accent" />
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 sm:py-14">
        <p className="text-sm font-medium text-btf-text-muted">
          Tell us what you need → we review your statements → you pick on a
          call.
        </p>
        <h2 className="mt-3 max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          Ready when you are.
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <TrackedButtonLink
            href={ROUTES.apply}
            variant="primary"
            trackLabel={CTA_PREQUAL_LABEL}
            trackLocation="home_path_apply"
            className="h-auto min-h-[5.5rem] flex-col items-start justify-center gap-1 px-6 py-5 text-left motion-safe:active:scale-[0.98]"
            showArrow
          >
            <span className="text-lg font-bold">{CTA_PREQUAL_LABEL}</span>
            <span className="text-sm font-medium text-white/85">
              About 5 minutes. Won&apos;t hit your credit.
            </span>
          </TrackedButtonLink>
          <Link
            href={ROUTES.calculator}
            className="flex min-h-[5.5rem] flex-col items-start justify-center gap-1 rounded-lg border border-btf-border bg-btf-card px-6 py-5 text-left transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:active:scale-[0.98]"
          >
            <span className="text-lg font-bold text-btf-text">
              Run your numbers →
            </span>
            <span className="text-sm font-medium text-btf-text-muted">
              Estimate a payment. No signup needed.
            </span>
          </Link>
        </div>
        <p className="mt-6 text-sm text-btf-text-muted">
          <Link
            href={ROUTES.products}
            className="font-semibold text-btf-accent hover:underline"
          >
            Compare financing products →
          </Link>
        </p>
      </SectionShell>
    </>
  );
}
