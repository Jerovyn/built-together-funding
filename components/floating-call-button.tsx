"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/apply", "/book", "/upload", "/admin"];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/**
 * Mobile floating Call — always available for direct funding conversations.
 * Lifts above the sticky apply bar once that bar appears.
 */
export function FloatingCallButton() {
  const pathname = usePathname() ?? "";
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const [stickyUp, setStickyUp] = useState(false);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    if (hidden) {
      setStickyUp(false);
      return;
    }
    const onScroll = () =>
      setStickyUp(window.scrollY > window.innerHeight * 1.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  if (hidden || !phone) return null;

  return (
    <TrackedPhoneLink
      href={`tel:${phone}`}
      trackLocation="floating_call"
      aria-label={phoneDisplay ? `Call ${phoneDisplay}` : "Call us"}
      className={cn(
        "fixed right-4 z-50 inline-flex items-center gap-2 rounded-full bg-btf-accent px-4 py-3 text-sm font-bold text-white shadow-btf-glow",
        "transition-all duration-150 ease-out",
        "hover:bg-btf-accent-mid motion-safe:active:scale-[0.98]",
        "md:hidden motion-safe:animate-fade-up",
        stickyUp
          ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <PhoneIcon className="h-4 w-4 shrink-0" />
      Call
    </TrackedPhoneLink>
  );
}
