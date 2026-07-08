import { APPLY_STEP_LABELS } from "@/lib/apply-schema";
import { cn } from "@/lib/utils";

type ApplyProgressProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

/** Slim top progress: descriptive phase label + bar (% lives on BoltCoach). */
export function ApplyProgress({
  currentStep,
  totalSteps,
  className,
}: ApplyProgressProps) {
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
  const label = APPLY_STEP_LABELS[currentStep] ?? `Step ${currentStep + 1}`;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-btf-text-muted">
        {label}{" "}
        <span className="text-btf-text-muted/70">
          ({currentStep + 1} of {totalSteps})
        </span>
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-btf-muted"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`${label}, ${pct} percent complete`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-btf-accent to-btf-accent-mid transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
