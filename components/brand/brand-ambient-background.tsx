"use client";

import { usePathname } from "next/navigation";

/** Task-focused routes — no decorative background. */
const EXCLUDED_PREFIXES = ["/apply", "/admin", "/upload", "/book"];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Soft water wash — lighter sky blues with a quiet ink breath.
 * Meant to read as one continuous surface behind marketing pages.
 */
export function BrandAmbientBackground() {
  const pathname = usePathname() ?? "";
  if (isExcluded(pathname)) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4FC] via-[#F5FAFE] to-[#DCEFF8]" />
      <div
        className="absolute -left-[20%] top-[-10%] h-[42rem] w-[42rem] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(2,132,199,0.08) 42%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[15%] top-[18%] h-[36rem] w-[36rem] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(2,132,199,0.16) 0%, rgba(18,38,80,0.06) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute bottom-[-18%] left-[20%] h-[40rem] w-[50rem] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(18,38,80,0.10) 0%, rgba(185,220,242,0.35) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
