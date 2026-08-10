"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";
import {
  BRAND_LINE,
  CTA_MICRO_LINE,
  CTA_PREQUAL_LABEL,
  HOME_PULL_LINE,
  HOME_SUPPORT_LINE,
  HOME_TRADES_MARQUEE,
  ROUTES,
} from "@/lib/constants";
import {
  HOME_PURPOSE_OPTIONS,
  writeHomePurposeSeed,
  type HomePurposeOption,
} from "@/lib/home-purpose";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

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

const EASE_POINTS = [
  "About 2 minutes to see if we should talk — no SSN yet",
  "Checking options won't affect your credit score",
  "Same person reviews your file and calls you",
  "Bank statements optional until you're ready",
] as const;

const HOME_TRADES_MARQUEE_LIST = HOME_TRADES_MARQUEE.slice(0, 14);

/**
 * Flow: H1 + purpose taps → compact photo trust break → trades marquee.
 */
export function HomeContent() {
  const router = useRouter();
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();
  const [marqueePaused, setMarqueePaused] = useState(false);

  const startWithPurpose = (option: HomePurposeOption) => {
    writeHomePurposeSeed(option.useOfFunds);
    try {
      trackEvent("cta_click", {
        label: option.label,
        location: "home_purpose",
        destination_path: ROUTES.apply,
      });
    } catch {
      /* silent */
    }
    router.push(ROUTES.apply);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-btf-water via-btf-water-mid/80 to-btf-muted">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-btf-accent-soft/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-btf-ink-3/[0.08] blur-3xl"
        />
        <div className="container relative max-w-6xl px-4 py-6 sm:py-12 md:py-16">
          <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="min-w-0 space-y-3 sm:space-y-5">
              <p className="text-sm font-semibold text-btf-accent">
                Small business funding · Trades &amp; service companies
              </p>
              <h1 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-tight text-btf-text sm:text-4xl sm:font-extrabold md:text-[2.5rem]">
                {HOME_PULL_LINE}
              </h1>
              {/* Long support copy — desktop/tablet only so mobile reaches taps faster */}
              <p className="hidden max-w-md text-base leading-relaxed text-btf-text-muted sm:block sm:text-lg">
                {HOME_SUPPORT_LINE}
              </p>
              <p className="hidden text-sm font-medium text-btf-text-muted sm:block">
                {CTA_MICRO_LINE}
              </p>
              {phoneDisplay && phone ? (
                <TrackedPhoneLink
                  href={`tel:${phone}`}
                  className="hidden text-sm font-semibold text-btf-accent transition-colors duration-150 hover:text-btf-accent-mid hover:underline sm:inline-block"
                  trackLocation="home_hero"
                >
                  Or call {phoneDisplay}
                </TrackedPhoneLink>
              ) : null}
            </div>

            <div className="min-w-0 space-y-3 rounded-2xl border border-btf-border/70 bg-white/55 p-4 shadow-sm backdrop-blur-sm sm:p-5">
              <p className="text-base font-semibold text-btf-text">
                What do you need funding for?
              </p>
              <ul className="flex flex-col gap-2.5">
                {HOME_PURPOSE_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => startWithPurpose(option)}
                      className={cn(
                        "group flex w-full min-h-12 items-center justify-between gap-3 rounded-xl border border-btf-border/80 bg-white/95 px-5 py-3.5 text-left text-base font-semibold text-btf-text shadow-sm",
                        "transition-all duration-150 ease-out",
                        "hover:border-btf-accent/45 hover:bg-white hover:shadow-btf-glow",
                        "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                      )}
                    >
                      <span>{option.label}</span>
                      <span
                        aria-hidden
                        className="text-btf-accent transition-transform duration-150 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="pt-1 text-center text-xs text-btf-text-muted sm:text-left">
                Or{" "}
                <Link
                  href={ROUTES.apply}
                  className="font-semibold text-btf-accent underline-offset-2 hover:underline"
                >
                  {CTA_PREQUAL_LABEL.toLowerCase()}
                </Link>{" "}
                without picking yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust break — clean photo; soft CSS arch reveals page wash (not white) */}
      <section className="relative bg-gradient-to-b from-btf-water-mid/70 via-btf-water to-[#F0F7FC] px-4 py-6 sm:py-8">
        <div className="relative mx-auto max-w-5xl">
          <div
            className="relative aspect-[16/10] w-full overflow-hidden border border-btf-border/50 shadow-btf-card sm:aspect-[2.2/1]"
            style={{
              borderRadius: "50% 50% 1.25rem 1.25rem / 22% 22% 1.25rem 1.25rem",
            }}
          >
            <Image
              src="/images/home-friendly-trade.jpg"
              alt="Trade business owner with a work truck at a job site"
              fill
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover object-[center_28%]"
              priority
            />
          </div>
          <p className="mt-3 text-center text-sm font-medium text-btf-text-muted">
            {BRAND_LINE}
          </p>
        </div>
      </section>

      {/* Trades — one-line animated marquee on all breakpoints */}
      <section
        className="border-y border-btf-border/50 bg-gradient-to-b from-[#F0F7FC] to-btf-water py-3"
        aria-label="Industries we serve"
      >
        <div
          className="overflow-hidden"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onTouchStart={() => setMarqueePaused(true)}
          onTouchEnd={() => setMarqueePaused(false)}
        >
          <div
            className={cn(
              "flex w-max motion-reduce:animate-none motion-safe:animate-marquee-x",
              marqueePaused && "[animation-play-state:paused]",
            )}
            aria-hidden="true"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-3 pr-3">
                {HOME_TRADES_MARQUEE_LIST.map((trade) => (
                  <span
                    key={`${copy}-${trade}`}
                    className="shrink-0 rounded-full border border-btf-border/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-btf-text-muted backdrop-blur-sm"
                  >
                    {trade}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="sr-only">
          Industries we serve include {HOME_TRADES_MARQUEE_LIST.join(", ")}, and
          more.
        </p>
      </section>

      <SectionShell className="bg-gradient-to-b from-[#F0F7FC] via-btf-water to-btf-water-mid py-12 sm:py-14">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          A simpler way to check small business funding options.
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {EASE_POINTS.map((item) => (
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

      <SectionShell className="relative overflow-hidden bg-gradient-to-b from-btf-water-mid via-[#DCE8F2] to-[#EEF4F8] py-12 sm:py-14">
        <div className="relative">
          <p className="text-sm font-medium text-btf-text-muted">
            Tell us what you need → we review → you choose on a call.
          </p>
          <h2 className="mt-3 max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
            Compare funding options when you&apos;re ready.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <TrackedButtonLink
              href={ROUTES.apply}
              variant="primary"
              trackLabel={CTA_PREQUAL_LABEL}
              trackLocation="home_path_apply"
              className="group h-auto min-h-[5.5rem] flex-col items-start justify-center gap-1 px-6 py-5 text-left"
              showArrow
            >
              <span className="text-lg font-bold">{CTA_PREQUAL_LABEL}</span>
              <span className="text-sm font-medium text-white/85">
                About 2 minutes. Won&apos;t hit your credit.
              </span>
            </TrackedButtonLink>
            <Link
              href={ROUTES.calculator}
              className="flex min-h-[5.5rem] flex-col items-start justify-center gap-1 rounded-xl border border-btf-border/80 bg-white/95 px-6 py-5 text-left shadow-sm transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
            >
              <span className="text-lg font-bold text-btf-text">
                Estimate payments first →
              </span>
              <span className="text-sm font-medium text-btf-text-muted">
                Payment ranges. No signup needed.
              </span>
            </Link>
          </div>
          <p className="mt-6 text-sm text-btf-text-muted">
            <Link
              href={ROUTES.products}
              className="font-semibold text-btf-accent transition-colors duration-150 hover:text-btf-accent-mid hover:underline"
            >
              Compare financing products →
            </Link>
          </p>
        </div>
      </SectionShell>
    </>
  );
}
