import { cn } from "@/lib/utils";

type InkGridProps = {
  className?: string;
};

/**
 * Network-line motif for dark ink sections — blueprint grid with node
 * connections, echoing the brand card. Pure SVG, no JS, sits behind content.
 */
export function InkGrid({ className }: InkGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id="btf-ink-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M56 0H0V56"
              fill="none"
              stroke="rgba(159,179,217,0.10)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="btf-ink-glow" cx="20%" cy="0%" r="90%">
            <stop offset="0%" stopColor="rgba(54,216,246,0.14)" />
            <stop offset="45%" stopColor="rgba(29,78,216,0.08)" />
            <stop offset="100%" stopColor="rgba(8,17,35,0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#btf-ink-grid)" />
        <rect width="100%" height="100%" fill="url(#btf-ink-glow)" />
        {/* Node connections — sparse, like the brand card */}
        <g stroke="rgba(54,216,246,0.20)" strokeWidth="1">
          <path d="M-20 130 L170 60 L360 150 L560 40 L780 120" fill="none" />
          <path d="M240 420 L430 330 L640 400 L860 300" fill="none" />
        </g>
        <g fill="rgba(54,216,246,0.45)">
          <circle cx="170" cy="60" r="2.5" />
          <circle cx="360" cy="150" r="2" />
          <circle cx="560" cy="40" r="2.5" />
          <circle cx="430" cy="330" r="2" />
          <circle cx="640" cy="400" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
