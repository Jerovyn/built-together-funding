"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";
import {
  BRAND_LINE,
  CTA_MICRO_LINE,
  CTA_PREQUAL_LABEL,
  HOME_DESIRE_SIGNALS,
  HOME_PULL_LINE,
  HOME_TRADES_MARQUEE,
  ROUTES,
} from "@/lib/constants";
import {
  HOME_PURPOSE_OPTIONS,
  writeHomePurposeSeed,
  type HomePurposeOption,
} from "@/lib/home-purpose";
import { trackEvent } from "@/lib/tracking";

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
  "Won't affect your credit score to look",
  "Same person reviews your file and calls you",
  "Statements optional until you're ready",
] as const;

/** Shorter marquee — less “we serve everyone” wallpaper. */
const HOME_TRADES_SHORT = HOME_TRADES_MARQUEE.slice(0, 14);

/**
 * Capacity pull + OnDeck-style purpose taps + friendly photo overlap + paths.
 */
export function HomeContent() {
  const router = useRouter();
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();

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
      {/* Instagram / mobile first screen: ink + purpose taps */}
      <section className="relative overflow-hidden bg-btf-ink text-btf-on-ink">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(2,132,199,0.18), transparent 50%)",
          }}
        />
        <div className="container relative max-w-6xl px-4 py-10 sm:py-14 md:py-16">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="min-w-0 space-y-5">
              <p className="text-sm font-semibold text-btf-accent-soft">
                Financing for trades &amp; service businesses
              </p>
              <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-btf-on-ink sm:text-4xl md:text-[2.6rem]">
                {HOME_PULL_LINE}
              </h1>
              <p className="max-w-md text-base text-btf-on-ink-muted sm:text-lg">
                Apply in minutes. Underwritten on your bank statements. Straight
                answer in 1 business day — from a person, not a portal.
              </p>
              <p className="text-sm font-medium text-btf-on-ink-muted">
                {CTA_MICRO_LINE}
              </p>
              {phoneDisplay && phone ? (
                <TrackedPhoneLink
                  href={`tel:${phone}`}
                  className="inline-block text-sm font-semibold text-btf-accent-soft hover:underline"
                  trackLocation="home_hero"
                >
                  Or call {phoneDisplay}
                </TrackedPhoneLink>
              ) : null}
            </div>

            <div className="min-w-0 space-y-3">
              <p className="text-base font-semibold text-btf-on-ink">
                Why do you need funding?
              </p>
              <ul className="flex flex-col gap-2.5">
                {HOME_PURPOSE_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => startWithPurpose(option)}
                      className="flex w-full min-h-12 items-center justify-center rounded-full bg-white px-5 py-3.5 text-center text-base font-semibold text-btf-ink shadow-sm transition-transform duration-150 hover:bg-btf-secondary motion-safe:active:scale-[0.98]"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="pt-1 text-center text-xs text-btf-on-ink-muted sm:text-left">
                Or{" "}
                <Link
                  href={ROUTES.apply}
                  className="font-semibold text-btf-accent-soft underline-offset-2 hover:underline"
                >
                  {CTA_PREQUAL_LABEL.toLowerCase()}
                </Link>{" "}
                without picking yet.
              </p>
            </div>
          </div>
        </div>

        {/* Soft curve into photo band */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-btf-ink/80 to-transparent sm:h-12"
          aria-hidden
        />
      </section>

      {/* Friendly photo with overlapping white card — OnDeck-style scroll */}
      <section className="relative bg-btf-ink pb-16 pt-2 sm:pb-20">
        <div className="container relative max-w-3xl px-4">
          <div className="relative mx-auto aspect-[4/3] max-h-[22rem] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-btf-ink-border shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:max-h-[26rem]">
            <Image
              src="/images/home-friendly-trade.jpg"
              alt="Trade business owner with a work truck at a job site"
              fill
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-btf-ink/80 via-btf-ink/20 to-transparent px-5 pb-5 pt-16">
              <p className="text-sm font-semibold uppercase tracking-wide text-btf-accent-soft">
                Built Together Funding
              </p>
              <p className="mt-1 text-lg font-bold text-btf-on-ink">{BRAND_LINE}</p>
            </div>
          </div>

          <div className="relative z-10 mx-auto -mt-10 max-w-xl rounded-2xl border border-btf-border bg-white px-5 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.12)] sm:-mt-14 sm:px-8 sm:py-7">
            <ul className="space-y-3">
              {HOME_DESIRE_SIGNALS.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm font-medium text-btf-text sm:text-base"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-btf-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
              {HOME_TRADES_SHORT.map((trade) => (
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
          Industries we serve include {HOME_TRADES_SHORT.join(", ")}, and more.
        </p>
      </section>

      <SectionShell className="border-b border-btf-border bg-white py-12 sm:py-14">
        <h2 className="max-w-xl text-balance text-2xl font-bold tracking-tight text-btf-text md:text-3xl">
          We removed the hard parts on purpose.
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

      <SectionShell className="border-b border-btf-border py-12 sm:py-14">
        <p className="text-sm font-medium text-btf-text-muted">
          Tell us what you need → we review → you pick on a call.
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
              About 2 minutes. Won&apos;t hit your credit.
            </span>
          </TrackedButtonLink>
          <Link
            href={ROUTES.calculator}
            className="flex min-h-[5.5rem] flex-col items-start justify-center gap-1 rounded-lg border border-btf-border bg-btf-card px-6 py-5 text-left transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:active:scale-[0.98]"
          >
            <span className="text-lg font-bold text-btf-text">
              Run your numbers first →
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
