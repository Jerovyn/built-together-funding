"use client";

import { useEffect, useRef, useState } from "react";
import { BookingReviewModal } from "@/components/booking/booking-review-modal";
import { BookingConfirmed } from "@/components/booking/funding-review-scheduler";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DISCLAIMER_PREQUAL_LINE, ROUTES } from "@/lib/constants";
import type { ApplyResultTier } from "@/types/apply";

type ApplyResultProps = {
  tier: ApplyResultTier;
  statementsSkipped?: boolean;
  bookingToken?: string | null;
  firstName?: string;
  businessName?: string;
  /** Stage A soft result — offer booking + optional continue-file. */
  stageA?: boolean;
  onContinueFile?: () => void;
};

const COPY: Record<
  ApplyResultTier,
  { headline: string; lines: string[] }
> = {
  prequalified: {
    headline: "Good news — you may be a fit.",
    lines: [
      "A real person reviews next. The person who reviews your file is the person who talks with you.",
      "Pick a call time now, or we'll reach out within one business day.",
    ],
  },
  needs_review: {
    headline: "We've got your answers — they need a closer look.",
    lines: [
      "Sometimes we need one or two clarifications before we map options.",
      "Book a short call, or wait for us to reach out within one business day.",
    ],
  },
  not_fit_yet: {
    headline: "This may not be the right timing yet.",
    lines: [
      "We fund when demand is already there and capacity is the constraint — that doesn't sound like the fit today.",
      "When the work is clearer, you're welcome back. No hard feelings.",
    ],
  },
};

export function ApplyResult({
  tier,
  statementsSkipped = false,
  bookingToken,
  firstName,
  businessName,
  stageA = false,
  onContinueFile,
}: ApplyResultProps) {
  const block = COPY[tier];
  const showUploadNote =
    !stageA && statementsSkipped && tier !== "not_fit_yet";
  const showBooking = tier !== "not_fit_yet" && Boolean(bookingToken);
  const showContinue =
    stageA && tier !== "not_fit_yet" && typeof onContinueFile === "function";
  const [bookedSlotLabel, setBookedSlotLabel] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (!showBooking || bookedSlotLabel || autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    setBookingOpen(true);
  }, [showBooking, bookedSlotLabel]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBooked = (label: string) => {
    setBookedSlotLabel(label);
  };

  return (
    <>
      <Card className="border-btf-accent/25 bg-btf-card">
        <CardContent className="space-y-6 p-6 md:p-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-btf-accent">
              {stageA ? "You're in" : "Next step"}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-btf-text md:text-3xl">
              {block.headline}
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-btf-text-muted md:text-base">
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {stageA && tier !== "not_fit_yet" ? (
              <p className="rounded-xl border border-btf-accent/25 bg-btf-accent/5 p-4 font-medium text-btf-text">
                Check your email and texts (if you opted in) for secure links to
                upload your last 3–6 months of bank statements (multiple files
                OK) and finish the application. Doing both makes funding much
                quicker — SSN and EIN come last.
              </p>
            ) : null}
            {showUploadNote && !bookedSlotLabel ? (
              <p className="rounded-xl border border-btf-accent/25 bg-btf-accent/5 p-4 font-medium text-btf-text">
                One more thing: watch your email (and texts, if you opted in) for
                a secure link to upload your bank statements. Your review moves
                fastest once we have them.
              </p>
            ) : null}
          </div>

          {showBooking && bookingToken && bookedSlotLabel ? (
            <BookingConfirmed
              slotLabel={bookedSlotLabel}
              statementsSkipped={statementsSkipped || stageA}
            />
          ) : null}

          {showBooking && bookingToken && !bookedSlotLabel ? (
            <div className="rounded-xl border border-btf-accent/30 bg-btf-accent/5 p-4">
              <p className="text-sm font-semibold text-btf-text">
                Schedule your review call
              </p>
              <p className="mt-1 text-xs text-btf-text-muted">
                30 minutes · Eastern time · we call you
              </p>
              <Button
                type="button"
                variant="primary"
                className="mt-3 w-full min-h-11 touch-manipulation sm:w-auto"
                onClick={() => setBookingOpen(true)}
              >
                Pick a call time
              </Button>
            </div>
          ) : null}

          <p className="rounded-xl border border-btf-border bg-btf-secondary p-4 text-sm leading-relaxed text-btf-text-muted">
            {DISCLAIMER_PREQUAL_LINE}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {showContinue ? (
              <Button
                type="button"
                variant="secondary"
                className="border border-btf-border"
                onClick={onContinueFile}
              >
                Finish file (optional)
              </Button>
            ) : null}
            {showBooking && bookingToken && !bookedSlotLabel ? (
              <Button
                type="button"
                variant="secondary"
                className="border border-btf-border"
                onClick={() => setBookingOpen(true)}
              >
                Open scheduler
              </Button>
            ) : null}
            {showBooking && bookingToken && bookedSlotLabel ? (
              <Button
                type="button"
                variant="secondary"
                className="border border-btf-border"
                onClick={() => setBookingOpen(true)}
              >
                View booking
              </Button>
            ) : null}
            <ButtonLink href={ROUTES.contact} variant="secondary">
              Contact
            </ButtonLink>
            <ButtonLink href={ROUTES.home} variant="ghost" className="border border-btf-border">
              Back to home
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

      {showBooking && bookingToken ? (
        <BookingReviewModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          bookingToken={bookingToken}
          firstName={firstName}
          businessName={businessName}
          statementsSkipped={statementsSkipped || stageA}
          bookedSlotLabel={bookedSlotLabel}
          onBooked={handleBooked}
        />
      ) : null}
    </>
  );
}
