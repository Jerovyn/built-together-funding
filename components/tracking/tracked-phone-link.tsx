"use client";

import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/tracking";

type TrackedPhoneLinkProps = ComponentProps<"a"> & {
  /** Non-PII label, e.g. "footer" or "contact" */
  trackLocation?: string;
};

/**
 * Tel link that records a `phone_click` without sending the number to analytics.
 */
export function TrackedPhoneLink({
  trackLocation,
  onClick,
  children,
  ...props
}: TrackedPhoneLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        try {
          trackEvent("phone_click", {
            label: "phone",
            location: trackLocation,
          });
        } catch {
          /* never block */
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
