"use client";

import { useEffect, useRef, useState } from "react";
import { BoltMascot } from "@/components/mascot/bolt";
import { cn } from "@/lib/utils";

type BoltMascotInteractiveProps = {
  variant?: "head" | "badge";
  className?: string;
  /** When provided, plays a short motion-safe wiggle on step change. */
  step?: number;
  /** Increment (e.g. validation nudge) to replay the wiggle. */
  nudgeSignal?: number;
};

/**
 * Lightweight mascot wrapper: CSS-only hover/active feedback and optional
 * short wiggle on funnel step / nudge. Respects `prefers-reduced-motion` via Tailwind `motion-safe:`.
 */
export function BoltMascotInteractive({
  variant = "head",
  className,
  step,
  nudgeSignal = 0,
}: BoltMascotInteractiveProps) {
  const [wiggle, setWiggle] = useState(false);
  const prevStep = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (step === undefined) return;
    if (prevStep.current === undefined) {
      prevStep.current = step;
      return;
    }
    if (prevStep.current !== step) {
      prevStep.current = step;
      setWiggle(true);
    }
  }, [step]);

  useEffect(() => {
    if (nudgeSignal > 0) setWiggle(true);
  }, [nudgeSignal]);

  return (
    <span
      className={cn(
        "inline-block origin-center",
        "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
        "motion-safe:hover:scale-[1.06] motion-safe:active:scale-[0.97]",
        wiggle && "motion-safe:animate-bolt-wiggle",
        className,
      )}
      onAnimationEnd={() => setWiggle(false)}
    >
      <BoltMascot variant={variant} className="pointer-events-none select-none" />
    </span>
  );
}
