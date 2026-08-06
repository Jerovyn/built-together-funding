"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BoltMascot } from "@/components/mascot/bolt";
import { ButtonLink } from "@/components/ui/button";
import {
  CREDIT_CHECK_LINE,
  CTA_PREQUAL_LABEL,
  DISCLAIMER_PREQUAL_LINE,
  ROUTES,
} from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const GUIDE_ANSWERS: { q: string; a: string }[] = [
  {
    q: "Is this the same as approval?",
    a: "No. Seeing your options tells us your business may be a fit for a funding review. Final options depend on review, underwriting, and partner availability.",
  },
  {
    q: "Will this touch my credit?",
    a: CREDIT_CHECK_LINE,
  },
  {
    q: "What do you need from me?",
    a: "About 5 minutes online: what you're after, contact, and your last 3 months of bank statements (upload now or later). Have your EIN handy.",
  },
  {
    q: "How fast will I hear back?",
    a: "A person reviews every file. You'll usually hear from us within one business day — with a real answer either way.",
  },
  {
    q: "Who do you fund?",
    a: "Trades and service businesses where the work is already there and capacity is the ceiling — roofing, cleaning, landscaping, construction, and similar.",
  },
  {
    q: "Is my information safe?",
    a: "Yes. Encrypted in transit, stored privately, used only to review your application. We don't sell your information.",
  },
];

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

/**
 * Sitewide floating guide. Every answer is scripted - no free-form chat -
 * so nothing Bolt says can drift outside compliance-approved language.
 * Hidden on the funnel (Bolt coaches inline there) and on upload pages.
 */
export function BoltAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Only rendered on Contact / How it works via SiteChrome.
  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next && !opened.current) {
        opened.current = true;
        try {
          trackEvent("guide_open", { page_path: pathname ?? undefined });
        } catch {
          /* silent */
        }
      }
      return next;
    });
  };

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Bolt, your guide"
          className="fixed bottom-24 right-4 z-40 flex max-h-[min(34rem,calc(100vh-8rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-btf-border bg-btf-card shadow-btf-card motion-safe:animate-fade-up"
        >
          <div className="flex items-center gap-3 border-b border-btf-border bg-btf-secondary px-4 py-3">
            <BoltMascot variant="badge" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-btf-text">Bolt</p>
              <p className="text-xs text-btf-text-muted">
                Straight answers, not a sales pitch.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close guide"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-btf-text-muted transition-colors hover:bg-btf-bg hover:text-btf-text"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {GUIDE_ANSWERS.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-btf-border bg-btf-bg open:border-btf-accent/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-sm font-semibold text-btf-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    className="shrink-0 text-base font-bold text-btf-accent transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-btf-text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <div className="space-y-2 border-t border-btf-border bg-btf-secondary px-4 py-3">
            <ButtonLink
              href={ROUTES.apply}
              variant="primary"
              className="group w-full justify-center"
            >
              {CTA_PREQUAL_LABEL}
            </ButtonLink>
            <p className="text-[11px] leading-snug text-btf-text-muted">
              {DISCLAIMER_PREQUAL_LINE}
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close Bolt guide" : "Open Bolt guide"}
        className={cn(
          "fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full border border-btf-border bg-btf-card py-1.5 pl-1.5 pr-4 shadow-btf-card transition-all duration-150 md:bottom-4",
          "motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-btf-accent/40 motion-safe:active:scale-[0.98]",
          open && "border-btf-accent/40",
        )}
      >
        <BoltMascot variant="badge" />
        <span className="text-sm font-bold text-btf-text">
          {open ? "Close" : "Questions?"}
        </span>
      </button>
    </>
  );
}
