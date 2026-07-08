"use client";

import { cn } from "@/lib/utils";

type ApplyOptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Compact cards keep three grouped questions on one comfortable screen. */
  compact?: boolean;
};

export function ApplyOptionCard({
  label,
  description,
  selected,
  onClick,
  disabled,
  compact,
}: ApplyOptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-1 rounded-xl border text-left min-h-[44px]",
        compact ? "px-3 py-2.5" : "p-4",
        "transition-colors transition-transform duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
        "border-btf-border bg-btf-card hover:border-btf-accent/30",
        selected &&
          "border-btf-accent/60 bg-btf-accent/10 shadow-btf-glow ring-1 ring-btf-accent/20",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span className="text-sm font-semibold text-btf-text">{label}</span>
      {description ? (
        <span className="text-xs leading-relaxed text-btf-text-muted">
          {description}
        </span>
      ) : null}
    </button>
  );
}
