"use client";

import { usePathname } from "next/navigation";

/** Task-focused routes — no decorative background. */
const EXCLUDED_PREFIXES = ["/apply", "/admin", "/upload", "/book"];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Soft cyan / secondary washes — visual pleasure without extra content. */
export function BrandAmbientBackground() {
  const pathname = usePathname() ?? "";
  if (isExcluded(pathname)) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F7F8FA]" />
      <div
        className="absolute -right-28 top-[-4rem] h-[32rem] w-[32rem] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(2,132,199,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -left-24 bottom-[-6rem] h-[26rem] w-[26rem] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 72%)",
        }}
      />
    </div>
  );
}
