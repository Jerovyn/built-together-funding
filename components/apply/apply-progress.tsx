import { APPLY_STEP_LABELS } from "@/lib/apply-schema";
import { cn } from "@/lib/utils";

type ApplyProgressProps = {
  currentStep: number;
  totalSteps: number;
  /** Absolute step index for label lookup (defaults to currentStep). */
  labelStep?: number;
  phaseHint?: string;
  className?: string;
};

/** Slim progress: phase + fraction. */
export function ApplyProgress({
  currentStep,
  totalSteps,
  labelStep,
  phaseHint,
  className,
}: ApplyProgressProps) {
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
  const labelIndex = labelStep ?? currentStep;
  const label = APPLY_STEP_LABELS[labelIndex] ?? `Step ${currentStep + 1}`;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-btf-text-muted">
        {phaseHint ? (
          <span className="text-btf-accent">{phaseHint} · </span>
        ) : null}
        {label}
        <span className="text-btf-text-muted/70">
          {" "}
          · {currentStep + 1} of {totalSteps}
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
          className="h-full rounded-full bg-btf-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
