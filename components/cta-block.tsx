"use client";

import { DisclaimerNote } from "@/components/disclaimer-note";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CtaBlockProps = {
  className?: string;
  showDisclaimer?: boolean;
  primaryOnly?: boolean;
  /** Primary button label — defaults to contextual "Check your fit". */
  label?: string;
  trackLocation?: string;
};

export function CtaBlock({
  className,
  showDisclaimer = false,
  primaryOnly = false,
  label = "Check your fit",
  trackLocation = "cta_block",
}: CtaBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <TrackedButtonLink
        href={ROUTES.apply}
        variant="primary"
        trackLabel={label}
        trackLocation={trackLocation}
        className={primaryOnly ? "w-full justify-center sm:w-auto" : undefined}
        showArrow
      >
        {label}
      </TrackedButtonLink>
      {primaryOnly ? null : (
        <TrackedButtonLink
          href={ROUTES.howItWorks}
          variant="secondary"
          trackLabel="How It Works"
          trackLocation={trackLocation}
        >
          How it works
        </TrackedButtonLink>
      )}
      {showDisclaimer ? (
        <DisclaimerNote className="sm:basis-full sm:mt-1" />
      ) : null}
    </div>
  );
}
