"use client";

import { DisclaimerNote } from "@/components/disclaimer-note";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { CTA_PREQUAL_LABEL, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CtaBlockProps = {
  className?: string;
  showDisclaimer?: boolean;
  primaryOnly?: boolean;
  label?: string;
  trackLocation?: string;
};

export function CtaBlock({
  className,
  showDisclaimer = false,
  primaryOnly = false,
  label = CTA_PREQUAL_LABEL,
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
