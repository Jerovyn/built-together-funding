import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ApplyFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  /** Use when the step title is already the question (keeps label for screen readers). */
  hideLabel?: boolean;
};

export function ApplyField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  hideLabel = false,
  required = false,
}: ApplyFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {hideLabel ? (
        htmlFor ? (
          <label htmlFor={htmlFor} className="sr-only">
            {label}
            {required ? " (required)" : ""}
          </label>
        ) : null
      ) : (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-btf-text"
        >
          {label}
          {required ? (
            <span className="text-red-500" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
      )}
      {children}
      {hint ? (
        <p className="text-xs leading-snug text-btf-text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
