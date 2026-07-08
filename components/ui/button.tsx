import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btf-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-btf-bg disabled:pointer-events-none disabled:opacity-50 min-h-[44px] motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]";

const variants = {
  primary:
    "bg-btf-accent text-white shadow-btf-glow hover:bg-btf-accent-mid hover:shadow-[0_10px_28px_rgba(29,78,216,0.28)] active:bg-btf-accent-soft",
  secondary:
    "border border-btf-border bg-white text-btf-text shadow-sm hover:border-btf-accent/40 hover:bg-btf-secondary hover:shadow-btf-card",
  ghost:
    "text-btf-text-muted hover:text-btf-text hover:bg-btf-secondary border border-transparent",
} as const;

export function ButtonArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 transition-transform group-hover:translate-x-0.5", className)}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export type ButtonVariant = keyof typeof variants;

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "primary",
  className,
  type,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClasses(variant, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      href={href}
      className={buttonClasses(variant, className)}
      {...props}
    />
  );
}
