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
};

const COPY: Record<
  ApplyResultTier,
  { headline: string; lines: string[] }
> = {
  prequalified: {
    headline: "Your business may be a fit for a funding review.",
    lines: [
      "Here's what happens next: a person reviews your file — and the person who reviews it is the person who calls you.",
      "Pick a time for your review call, or expect to hear from us within one business day.",
    ],
  },
  needs_review: {
    headline: "Your application needs manual review.",
    lines: [
      "We may need more information before determining fit.",
      "Book a call to walk through your file, or we'll reach out with specific questions within one business day.",
    ],
  },
  not_fit_yet: {
    headline: "This may not be the right fit yet.",
    lines: [
      "Funding should only be used when demand already exists and capacity is the constraint.",
      "That's not a knock on your business — it's timing. When revenue and demand are clearer, you're welcome back.",
    ],
  },
};

export function ApplyResult({
  tier,
  statementsSkipped = false,
  bookingToken,
  firstName,
  businessName,
}: ApplyResultProps) {
  const block = COPY[tier];
  const showUploadNote = statementsSkipped && tier !== "not_fit_yet";
  const showBooking = tier !== "not_fit_yet" && Boolean(bookingToken);
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
              Pre-screen result
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-btf-text md:text-3xl">
              {block.headline}
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-btf-text-muted md:text-base">
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
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
              statementsSkipped={statementsSkipped}
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
                Pick a time
              </Button>
            </div>
          ) : null}

          <p className="rounded-xl border border-btf-border bg-btf-secondary p-4 text-sm leading-relaxed text-btf-text-muted">
            {DISCLAIMER_PREQUAL_LINE}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          statementsSkipped={statementsSkipped}
          bookedSlotLabel={bookedSlotLabel}
          onBooked={handleBooked}
        />
      ) : null}
    </>
  );
}
