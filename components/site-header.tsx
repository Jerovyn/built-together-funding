"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA_PREQUAL_LABEL, NAV_LINKS, ROUTES, SITE_NAME } from "@/lib/constants";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";
import { cn } from "@/lib/utils";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader() {
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-btf-border bg-btf-bg/95 backdrop-blur supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <div className="container flex max-w-6xl items-center justify-between gap-2 py-2 sm:gap-4 sm:py-2.5 md:py-3">
        <Link
          href={ROUTES.home}
          className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
        >
          <Image
            src="/brand/btf-logo-tools.png"
            alt=""
            width={540}
            height={436}
            priority
            className="h-9 w-auto shrink-0 sm:h-10 md:h-12"
          />
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="text-xs font-bold uppercase tracking-tight text-btf-text sm:text-sm md:text-base">
              Built Together
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-btf-accent sm:text-sm md:text-base">
              Funding
            </span>
          </span>
          <span className="sr-only">{SITE_NAME} home</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-btf-text-muted transition-colors hover:text-btf-text",
                pathname === item.href && "text-btf-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {phoneDisplay && phone ? (
            <TrackedPhoneLink
              href={`tel:${phone}`}
              className="hidden rounded-lg border border-btf-border bg-btf-card px-3 py-2 text-sm font-semibold text-btf-text hover:border-btf-accent/30 hover:bg-btf-secondary md:inline-flex"
              trackLocation="header"
            >
              {phoneDisplay}
            </TrackedPhoneLink>
          ) : null}
          <TrackedButtonLink
            href={ROUTES.apply}
            variant="primary"
            trackLabel={CTA_PREQUAL_LABEL}
            trackLocation="header"
            className="px-3 py-2 text-xs sm:text-sm"
            showArrow
          >
            <span className="hidden sm:inline">{CTA_PREQUAL_LABEL}</span>
            <span className="sm:hidden">Pre-qual</span>
          </TrackedButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-btf-border text-btf-text lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-btf-border bg-btf-bg lg:hidden">
          <nav className="container max-w-6xl py-4" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-base font-medium text-btf-text hover:bg-btf-secondary",
                      pathname === item.href && "text-btf-accent",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-btf-border pt-4">
              <TrackedButtonLink
                href={ROUTES.apply}
                variant="primary"
                trackLabel="Check your fit"
                trackLocation="header_menu"
                className="w-full justify-center"
                showArrow
              >
                Check your fit
              </TrackedButtonLink>
              {phoneDisplay && phone ? (
                <TrackedPhoneLink
                  href={`tel:${phone}`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-btf-border bg-btf-card px-4 py-2 text-sm font-semibold text-btf-text"
                  trackLocation="header_menu"
                >
                  Call {phoneDisplay}
                </TrackedPhoneLink>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
