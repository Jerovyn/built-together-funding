"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getReviewDateOptions,
  REVIEW_DURATION_MINUTES,
  REVIEW_TIMEZONE,
} from "@/lib/booking/availability";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type Slot = {
  time: string;
  available: boolean;
  startTimeHms: string;
};

type PickStep = "day" | "time";

type FundingReviewSchedulerProps = {
  bookingToken: string;
  firstName?: string;
  businessName?: string;
  className?: string;
  compact?: boolean;
  hideHeader?: boolean;
  /** Modal layout: 2-step picker, fewer days, sticky footer. */
  embeddedInModal?: boolean;
  /** Limit weekday chips (modal uses 5). */
  dayCount?: number;
  initialBookedLabel?: string | null;
  statementsSkipped?: boolean;
  onBooked?: (slotLabel: string) => void;
  onDone?: () => void;
};

function formatDateChip(ymd: string): { dow: string; day: string; mon: string } {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    dow: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: String(d),
    mon: date.toLocaleDateString("en-US", { month: "short" }),
  };
}

function formatDateLong(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function BookingConfirmed({
  slotLabel,
  statementsSkipped,
  onDone,
  className,
}: {
  slotLabel: string;
  statementsSkipped?: boolean;
  onDone?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-btf-accent/30 bg-btf-accent/5 p-4 sm:p-5",
        className,
      )}
    >
      <p className="text-sm font-semibold text-btf-text sm:text-base">
        Your review call is confirmed
      </p>
      <p className="mt-2 text-sm font-medium text-btf-text">{slotLabel}</p>
      <p className="mt-3 text-xs leading-relaxed text-btf-text-muted sm:text-sm">
        We&apos;ll call you at the number on your file. Check your email for
        confirmation.
      </p>
      {statementsSkipped ? (
        <p className="mt-3 rounded-lg border border-btf-accent/20 bg-btf-card/80 p-3 text-xs leading-relaxed text-btf-text sm:text-sm">
          Watch your email (and texts, if you opted in) for a secure link to
          upload your bank statements — your review moves fastest once we have
          them.
        </p>
      ) : null}
      {onDone ? (
        <Button
          type="button"
          variant="primary"
          className="mt-4 w-full min-h-11 justify-center touch-manipulation sm:w-auto"
          onClick={onDone}
        >
          Done
        </Button>
      ) : null}
    </div>
  );
}

export function FundingReviewScheduler({
  bookingToken,
  firstName,
  businessName,
  className,
  compact = false,
  hideHeader = false,
  embeddedInModal = false,
  dayCount,
  initialBookedLabel = null,
  statementsSkipped = false,
  onBooked,
  onDone,
}: FundingReviewSchedulerProps) {
  const dates = useMemo(
    () => getReviewDateOptions(dayCount ?? (embeddedInModal ? 5 : 10)),
    [dayCount, embeddedInModal],
  );
  const [pickStep, setPickStep] = useState<PickStep>("day");
  const [selectedDate, setSelectedDate] = useState<string | null>(dates[0] ?? null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedLabel, setBookedLabel] = useState<string | null>(
    initialBookedLabel,
  );

  const stepped = embeddedInModal;
  const showTimeStep = !stepped || pickStep === "time";

  useEffect(() => {
    if (initialBookedLabel) setBookedLabel(initialBookedLabel);
  }, [initialBookedLabel]);

  useEffect(() => {
    if (bookedLabel) return;
    try {
      trackEvent("booking_view", {
        label: embeddedInModal ? "modal" : compact ? "inline" : "page",
      });
    } catch {
      /* silent */
    }
  }, [compact, bookedLabel, embeddedInModal]);

  const loadSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    setError(null);
    setSelectedTime(null);
    try {
      const res = await fetch(`/api/booking/availability/?date=${date}`);
      const json = (await res.json()) as {
        ok?: boolean;
        slots?: Slot[];
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setSlots([]);
        setError(json.message ?? "Could not load times.");
        return;
      }
      setSlots(json.slots ?? []);
    } catch {
      setError("Could not load times. Check your connection.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (bookedLabel || !selectedDate) return;
    if (stepped && pickStep === "day") return;
    void loadSlots(selectedDate);
  }, [selectedDate, loadSlots, bookedLabel, stepped, pickStep]);

  const handleSelectDate = (ymd: string) => {
    setSelectedDate(ymd);
    if (stepped) {
      setPickStep("time");
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setBooking(true);
    setError(null);
    const slot = slots.find((s) => s.time === selectedTime);
    if (!slot) return;

    try {
      const res = await fetch("/api/booking/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingToken,
          appointmentDate: selectedDate,
          startTime: slot.startTimeHms,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        slotLabel?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.message ?? "Could not book that time.");
        if (selectedDate) void loadSlots(selectedDate);
        return;
      }
      const label = json.slotLabel ?? selectedTime;
      setBookedLabel(label);
      try {
        trackEvent("booking_confirmed", {
          label: embeddedInModal ? "modal" : compact ? "inline" : "page",
        });
      } catch {
        /* silent */
      }
      onBooked?.(label);
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (bookedLabel) {
    return (
      <BookingConfirmed
        slotLabel={bookedLabel}
        statementsSkipped={statementsSkipped}
        onDone={onDone}
        className={className}
      />
    );
  }

  const showInlineHeader = !hideHeader;
  const availableSlots = slots.filter((s) => s.available);

  const dayPicker = (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-btf-text-muted sm:text-xs">
        Pick a day
      </p>
      <div
        className={cn(
          stepped
            ? "grid grid-cols-5 gap-1.5"
            : "flex gap-1.5 overflow-x-auto pb-0.5 sm:gap-2 sm:pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {dates.map((ymd) => {
          const chip = formatDateChip(ymd);
          const active = selectedDate === ymd;
          return (
            <button
              key={ymd}
              type="button"
              onClick={() => handleSelectDate(ymd)}
              className={cn(
                "flex min-h-12 touch-manipulation flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-center sm:min-h-11",
                stepped ? "min-w-0" : "min-w-[3.25rem] shrink-0 sm:min-w-[4.25rem]",
                stepped ? "sm:rounded-lg" : "sm:rounded-xl sm:px-3 sm:py-2",
                active
                  ? "border-btf-accent bg-btf-accent text-white shadow-btf-glow"
                  : "border-btf-border bg-btf-card text-btf-text hover:border-btf-accent/40",
              )}
            >
              <span className="text-[8px] font-semibold uppercase opacity-80 sm:text-[9px]">
                {chip.dow}
              </span>
              <span className="text-sm font-bold tabular-nums leading-none sm:text-base">
                {chip.day}
              </span>
              {!stepped ? (
                <span className="text-[9px] font-medium opacity-80 sm:text-[10px]">
                  {chip.mon}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  const timePicker = (
    <div>
      {stepped && selectedDate ? (
        <button
          type="button"
          onClick={() => setPickStep("day")}
          className="mb-2 text-xs font-semibold text-btf-accent hover:underline"
        >
          ← Change day ({formatDateLong(selectedDate)})
        </button>
      ) : null}
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-btf-text-muted sm:text-xs">
        Pick a time
      </p>
      {loadingSlots ? (
        <p className="text-sm text-btf-text-muted">Loading times…</p>
      ) : availableSlots.length === 0 ? (
        <p className="text-sm text-btf-text-muted">
          {error ?? "No open times this day — try another."}
        </p>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2",
            stepped && "sm:max-h-[11rem] sm:overflow-y-auto sm:overscroll-contain sm:pr-0.5",
          )}
        >
          {availableSlots.map((slot) => (
            <button
              key={slot.startTimeHms}
              type="button"
              onClick={() => setSelectedTime(slot.time)}
              className={cn(
                "min-h-10 touch-manipulation rounded-lg border px-2 py-2 text-xs font-semibold transition-colors sm:min-h-11 sm:text-sm",
                selectedTime === slot.time
                  ? "border-btf-accent bg-btf-accent/10 text-btf-accent"
                  : "border-btf-border bg-btf-card text-btf-text hover:border-btf-accent/40",
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const footer = stepped ? (
    <div className="shrink-0 border-t border-btf-border bg-btf-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
      {pickStep === "day" ? (
        <Button
          type="button"
          variant="primary"
          className="w-full min-h-11 justify-center touch-manipulation"
          disabled={!selectedDate}
          onClick={() => setPickStep("time")}
        >
          Next — pick a time
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          className="w-full min-h-11 justify-center touch-manipulation"
          disabled={!selectedDate || !selectedTime || booking}
          onClick={() => void handleBook()}
        >
          {booking ? "Booking…" : "Confirm call"}
        </Button>
      )}
    </div>
  ) : (
    <Button
      type="button"
      variant="primary"
      className="w-full min-h-11 justify-center touch-manipulation sm:w-auto"
      disabled={!selectedDate || !selectedTime || booking}
      onClick={() => void handleBook()}
    >
      {booking ? "Booking…" : (
        <>
          <span className="sm:hidden">Confirm call</span>
          <span className="hidden sm:inline">{`Book ${REVIEW_DURATION_MINUTES}-min review`}</span>
        </>
      )}
    </Button>
  );

  if (stepped) {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-4">
          <div className="space-y-3">
            {pickStep === "day" ? dayPicker : timePicker}
            {error && pickStep === "time" && !loadingSlots ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {showInlineHeader && !compact ? (
        <div>
          <h2 className="text-lg font-semibold text-btf-text">
            Book your funding review call
          </h2>
          <p className="mt-1 text-sm text-btf-text-muted">
            {firstName ? `${firstName}, pick` : "Pick"} a 30-minute slot — Eastern time (
            {REVIEW_TIMEZONE.replace("_", " ")}).{" "}
            {businessName ? `For ${businessName}.` : ""}
          </p>
        </div>
      ) : null}
      {showInlineHeader && compact ? (
        <div>
          <p className="text-sm font-semibold text-btf-text">
            Book your review call now
          </p>
          <p className="text-xs text-btf-text-muted">
            30 minutes · Eastern time · we call you
          </p>
        </div>
      ) : null}

      {dayPicker}
      {showTimeStep ? timePicker : null}

      {error && !loadingSlots ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {footer}
    </div>
  );
}

export { BookingConfirmed };
