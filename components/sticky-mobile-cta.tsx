"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA_PREQUAL_LABEL, ROUTES } from "@/lib/constants";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { cn } from "@/lib/utils";

const SHOW_ON_PREFIXES = [
  "/",
  "/products",
  "/how-it-works",
  "/who-we-help",
  "/funding-uses",
  "/about",
  "/resources",
  "/contact",
];

type StickyMobileCtaProps = {
  label?: string;
  trackLocation?: string;
};

export function StickyMobileCta({
  label = CTA_PREQUAL_LABEL,
  trackLocation = "sticky_mobile",
}: StickyMobileCtaProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const enabled =
    pathname === "/" ||
    SHOW_ON_PREFIXES.some(
      (p) => p !== "/" && pathname?.startsWith(p),
    );

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }
    // After header CTA + purpose taps have had the first screen — appear once
    // the visitor has scrolled into deeper value (avoids competing asks).
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 1.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  if (!enabled || !visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-btf-border bg-white/90 p-3 backdrop-blur-sm",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "md:hidden motion-safe:animate-fade-up",
      )}
    >
      <TrackedButtonLink
        href={ROUTES.apply}
        variant="primary"
        trackLabel={label}
        trackLocation={trackLocation}
        className="w-full justify-center gap-2 text-base"
      >
        {label}
      </TrackedButtonLink>
    </div>
  );
}
