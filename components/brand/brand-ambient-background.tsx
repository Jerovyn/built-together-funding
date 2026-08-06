"use client";

import { usePathname } from "next/navigation";

/** Task-focused routes — no decorative background. */
const EXCLUDED_PREFIXES = ["/apply", "/admin", "/upload", "/book"];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Quiet brand wash — no animated ripples (finished product, not template). */
export function BrandAmbientBackground() {
  const pathname = usePathname() ?? "";
  if (isExcluded(pathname)) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-white to-[#EEF4FA]" />
      <div
        className="absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
