import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type BoltMascotProps = ComponentProps<"svg"> & {
  variant?: "head" | "badge" | "coach";
};

/**
 * Bolt mascot placeholder (friendly working dog).
 * Simple inline SVG so we can swap to a real illustration later.
 */
export function BoltMascot({
  className,
  variant = "head",
  ...props
}: BoltMascotProps) {
  const sizeClass =
    variant === "badge"
      ? "h-10 w-10"
      : variant === "coach"
        ? "h-[4.5rem] w-[4.5rem]"
        : "h-16 w-16";
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Bolt mascot"
      className={cn("text-btf-text", sizeClass, className)}
      {...props}
    >
      {/* Background */}
      <circle cx="60" cy="60" r="56" fill="rgb(239 246 255)" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="rgb(226 232 240)" strokeWidth="2" />

      {/* Ears */}
      <path
        d="M24 44c-4-10 2-22 14-26 6 6 8 14 6 24-4 4-10 6-20 2z"
        fill="rgb(148 163 184)"
      />
      <path
        d="M96 44c4-10-2-22-14-26-6 6-8 14-6 24 4 4 10 6 20 2z"
        fill="rgb(148 163 184)"
      />

      {/* Helmet */}
      <path
        d="M28 52c3-18 16-30 32-30s29 12 32 30v4H28v-4z"
        fill="rgb(29 78 216)"
      />
      <path
        d="M36 52c2-12 11-20 24-20s22 8 24 20"
        fill="none"
        stroke="rgb(147 197 253)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Face */}
      <path
        d="M34 58c6 22 20 34 26 34s20-12 26-34c-8-10-20-14-26-14s-18 4-26 14z"
        fill="rgb(226 232 240)"
        stroke="rgb(148 163 184)"
        strokeWidth="2"
      />

      {/* Eyes */}
      <circle cx="48" cy="68" r="4" fill="rgb(15 23 42)" />
      <circle cx="72" cy="68" r="4" fill="rgb(15 23 42)" />
      <circle cx="46.5" cy="66.5" r="1.5" fill="white" />
      <circle cx="70.5" cy="66.5" r="1.5" fill="white" />

      {/* Snout */}
      <path
        d="M54 78c0 8 3 12 6 12s6-4 6-12c-4-2-8-2-12 0z"
        fill="rgb(203 213 225)"
      />
      <path
        d="M56 78c2 2 6 2 8 0"
        fill="none"
        stroke="rgb(100 116 139)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="78" r="3" fill="rgb(15 23 42)" />

      {/* Smile */}
      <path
        d="M52 86c4 4 12 4 16 0"
        fill="none"
        stroke="rgb(100 116 139)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Bolt tag */}
      <rect
        x="36"
        y="94"
        width="48"
        height="16"
        rx="8"
        fill="rgb(219 234 254)"
        stroke="rgb(191 219 254)"
      />
      <text
        x="60"
        y="106"
        textAnchor="middle"
        fontSize="10"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fill="rgb(29 78 216)"
      >
        BOLT
      </text>
    </svg>
  );
}

