"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { ButtonArrow, buttonClasses, type ButtonVariant } from "@/components/ui/button";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

function destinationPath(href: string): string {
  if (typeof window === "undefined") {
    return href.startsWith("/") ? href.split("?")[0] ?? href : "";
  }
  try {
    if (href.startsWith("/")) return href.split("?")[0] ?? href;
    return new URL(href, window.location.origin).pathname;
  } catch {
    return "";
  }
}

type TrackedLinkBase = Omit<ComponentProps<typeof Link>, "onClick"> & {
  trackLabel: string;
  trackLocation?: string;
  onClick?: ComponentProps<typeof Link>["onClick"];
};

export function TrackedLink({
  href,
  trackLabel,
  trackLocation,
  onClick,
  className,
  ...props
}: TrackedLinkBase) {
  const dest = typeof href === "string" ? href : "";
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        try {
          trackEvent("cta_click", {
            label: trackLabel,
            location: trackLocation,
            destination_path: destinationPath(dest),
          });
        } catch {
          /* never block navigation */
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}

export function TrackedButtonLink({
  href,
  variant = "primary",
  className,
  trackLabel,
  trackLocation,
  showArrow = false,
  children,
  onClick,
  ...props
}: TrackedLinkBase & { variant?: ButtonVariant; showArrow?: boolean }) {
  const dest = typeof href === "string" ? href : "";
  return (
    <Link
      href={href}
      className={buttonClasses(variant, cn(showArrow && "group", className))}
      onClick={(e) => {
        try {
          trackEvent("cta_click", {
            label: trackLabel,
            location: trackLocation,
            destination_path: destinationPath(dest),
          });
        } catch {
          /* never block navigation */
        }
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      {showArrow ? <ButtonArrow /> : null}
    </Link>
  );
}
