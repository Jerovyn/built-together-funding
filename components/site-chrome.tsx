"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BrandAmbientBackground } from "@/components/brand/brand-ambient-background";
import { BoltAssistant } from "@/components/mascot/bolt-assistant";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";

/** Task paths: quiet chrome — logo header, no footer / bolt / sticky CTA. */
const TASK_PREFIXES = ["/apply", "/book", "/upload", "/admin"];

function isTaskPath(pathname: string): boolean {
  return TASK_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Bolt FAQ only where questions belong — not competing on every page. */
function showBolt(pathname: string): boolean {
  if (isTaskPath(pathname)) return false;
  return (
    pathname === "/contact" ||
    pathname === "/contact/" ||
    pathname.startsWith("/how-it-works")
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const task = isTaskPath(pathname);

  return (
    <>
      {!task ? <BrandAmbientBackground /> : null}
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader compact={task} />
        <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
        {!task ? <SiteFooter /> : null}
        {showBolt(pathname) ? <BoltAssistant /> : null}
        {!task ? <StickyMobileCta /> : null}
      </div>
    </>
  );
}
