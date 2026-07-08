"use client";

import { usePathname } from "next/navigation";

/** Task-focused routes — no decorative background. */
const EXCLUDED_PREFIXES = ["/apply", "/admin", "/upload", "/book"];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function BrandAmbientBackground() {
  const pathname = usePathname() ?? "";
  if (isExcluded(pathname)) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-white to-[#EEF4FA]" />

      <svg
        className="absolute inset-0 h-full w-full motion-reduce:opacity-90"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMaxYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="btf-dot-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.1" fill="#007ABE" fillOpacity="0.07" />
          </pattern>
          <linearGradient id="btf-wave-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007ABE" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#082D54" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="btf-wave-b" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#36D8F6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#007ABE" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="btf-wave-c" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#36D8F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#007ABE" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Subtle grid — upper area */}
        <rect
          x="980"
          y="40"
          width="880"
          height="420"
          fill="url(#btf-dot-grid)"
          opacity="0.85"
        />

        {/* Diagonal accent lines */}
        <g stroke="#007ABE" strokeOpacity="0.07" strokeWidth="1.5">
          <line x1="1200" y1="0" x2="1920" y2="520" />
          <line x1="1320" y1="0" x2="1920" y2="400" />
          <line x1="1050" y1="180" x2="1920" y2="780" strokeDasharray="6 10" />
          <line x1="80" y1="620" x2="720" y2="1080" strokeOpacity="0.05" />
        </g>

        {/* Soft arc rings — bottom right */}
        <circle
          cx="1580"
          cy="920"
          r="420"
          fill="none"
          stroke="#007ABE"
          strokeOpacity="0.06"
          strokeWidth="1.5"
        />
        <circle
          cx="1680"
          cy="980"
          r="280"
          fill="none"
          stroke="#36D8F6"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />

        {/* Animated wave layers — bottom-right */}
        <g className="motion-safe:animate-btf-ripple-1 motion-reduce:animate-none">
          <path
            d="M820 1080 C980 860, 1180 980, 1380 820 C1580 660, 1720 760, 1920 620 L1920 1080 Z"
            fill="url(#btf-wave-c)"
          />
        </g>
        <g className="motion-safe:animate-btf-ripple-2 motion-reduce:animate-none">
          <path
            d="M960 1080 C1120 900, 1280 1020, 1480 860 C1660 720, 1780 820, 1920 700 L1920 1080 Z"
            fill="url(#btf-wave-b)"
          />
        </g>
        <g className="motion-safe:animate-btf-ripple-3 motion-reduce:animate-none">
          <path
            d="M1080 1080 C1220 940, 1360 1040, 1540 900 C1700 780, 1820 860, 1920 780 L1920 1080 Z"
            fill="url(#btf-wave-a)"
          />
        </g>
      </svg>

      {/* Left readability fade + top wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
    </div>
  );
}
