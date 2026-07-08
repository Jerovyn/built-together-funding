"use client";

import { useEffect, useId } from "react";
import { FundingReviewScheduler } from "@/components/booking/funding-review-scheduler";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";

type BookingReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingToken: string;
  firstName?: string;
  businessName?: string;
  statementsSkipped?: boolean;
  bookedSlotLabel?: string | null;
  onBooked?: (slotLabel: string) => void;
};

export function BookingReviewModal({
  open,
  onOpenChange,
  bookingToken,
  firstName,
  businessName,
  statementsSkipped = false,
  bookedSlotLabel = null,
  onBooked,
}: BookingReviewModalProps) {
  const titleId = useId();
  const isConfirmed = Boolean(bookedSlotLabel);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isConfirmed) onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange, isConfirmed]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-stretch justify-center bg-btf-card p-0 sm:items-center sm:bg-btf-text/50 sm:p-4"
      role="presentation"
      style={{ touchAction: "none" }}
      onClick={() => {
        if (!isConfirmed) onOpenChange(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-btf-card",
          "sm:h-auto sm:max-h-[min(72dvh,640px)] sm:max-w-lg sm:rounded-2xl sm:border sm:border-btf-border sm:shadow-btf-card",
        )}
        style={{ touchAction: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-btf-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:py-3 sm:pt-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-btf-accent">
              {isConfirmed ? "Confirmed" : "Step 1 of 2"}
            </p>
            <h2
              id={titleId}
              className="text-base font-semibold tracking-tight text-btf-text sm:text-base"
            >
              {isConfirmed ? "You're on the calendar" : "Pick a review call time"}
            </h2>
          </div>
          {!isConfirmed ? (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="shrink-0 min-h-10 touch-manipulation rounded-lg border border-btf-border px-3 py-1.5 text-xs font-semibold text-btf-text-muted hover:text-btf-text"
              aria-label="Close scheduler"
            >
              Later
            </button>
          ) : null}
        </div>

        {isConfirmed ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-4">
            <FundingReviewScheduler
              bookingToken={bookingToken}
              firstName={firstName}
              businessName={businessName}
              embeddedInModal
              hideHeader
              statementsSkipped={statementsSkipped}
              initialBookedLabel={bookedSlotLabel}
              onBooked={onBooked}
              onDone={() => onOpenChange(false)}
            />
          </div>
        ) : (
          <FundingReviewScheduler
            bookingToken={bookingToken}
            firstName={firstName}
            businessName={businessName}
            embeddedInModal
            hideHeader
            statementsSkipped={statementsSkipped}
            initialBookedLabel={bookedSlotLabel}
            onBooked={onBooked}
            onDone={() => onOpenChange(false)}
          />
        )}
      </div>
    </div>
  );
}
