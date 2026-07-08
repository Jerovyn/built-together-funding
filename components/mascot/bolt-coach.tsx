"use client";

import { useEffect, useRef, useState } from "react";
import { BoltMascot } from "@/components/mascot/bolt";
import { cn } from "@/lib/utils";

const COACH_TIPS = [
  "Tap your three answers.",
  "Statements now or later - your call.",
  "Owner info for your review.",
  "Business details next.",
  "Confirm and submit.",
] as const;

type BoltCoachProps = {
  currentStep: number;
  totalSteps: number;
  nudgeSignal?: number;
  className?: string;
};

function ProgressRing({ percent }: { percent: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 80 80"
      aria-hidden
    >
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="rgb(226 232 240)"
        strokeWidth="4"
      />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="rgb(29 78 216)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-300 ease-out"
      />
    </svg>
  );
}

/**
 * Inline apply-funnel coach: progress ring around Bolt, % badge, one-line tip.
 * Lives inside the sticky Continue bar so it never covers step content.
 */
export function BoltCoach({
  currentStep,
  totalSteps,
  nudgeSignal = 0,
  className,
}: BoltCoachProps) {
  const [wiggle, setWiggle] = useState(false);
  const prevStep = useRef(currentStep);

  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
  const tip =
    COACH_TIPS[Math.min(currentStep, COACH_TIPS.length - 1)] ?? COACH_TIPS[0];

  useEffect(() => {
    if (prevStep.current !== currentStep) {
      prevStep.current = currentStep;
      setWiggle(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (nudgeSignal > 0) setWiggle(true);
  }, [nudgeSignal]);

  return (
    <div
      className={cn(
        "pointer-events-none flex min-w-0 items-center gap-2.5",
        className,
      )}
      aria-live="polite"
    >
      <div className="relative shrink-0 motion-safe:animate-bolt-breathe">
        <div
          className={cn(
            "relative flex h-14 w-14 items-center justify-center",
            wiggle && "motion-safe:animate-bolt-wiggle",
          )}
          onAnimationEnd={() => setWiggle(false)}
        >
          <ProgressRing percent={pct} />
          <BoltMascot variant="badge" className="relative z-[1]" />
          <span
            className="absolute -right-1.5 -top-1 z-[2] rounded-full border border-btf-border bg-btf-card px-1 py-px text-[9px] font-bold tabular-nums text-btf-accent shadow-sm"
            aria-label={`${pct} percent complete`}
          >
            {pct}%
          </span>
        </div>
      </div>

      <p className="hidden min-w-0 text-xs leading-snug text-btf-text-muted min-[400px]:block">
        <span className="font-semibold text-btf-text">Bolt: </span>
        {tip}
      </p>
    </div>
  );
}
