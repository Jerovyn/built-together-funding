"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CTA_PREQUAL_LABEL,
  NAV_LINKS,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import { PRODUCTS } from "@/lib/products";
import { ProductIcon } from "@/components/products/product-icon";
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SiteHeader() {
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  // Close the products dropdown on outside click / Escape.
  useEffect(() => {
    if (!productsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProductsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [productsOpen]);

  const isProductsActive = pathname?.startsWith("/products");

  return (
    <header className="sticky top-0 z-50 border-b border-btf-border bg-white/80 backdrop-blur-md supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
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

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Main">
          <div ref={productsRef} className="relative">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-sm font-medium text-btf-text-muted transition-colors hover:text-btf-text",
                (isProductsActive || productsOpen) && "text-btf-accent",
              )}
              aria-expanded={productsOpen}
              aria-haspopup="menu"
              onClick={() => setProductsOpen((v) => !v)}
            >
              Products
              <ChevronDownIcon
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  productsOpen && "rotate-180",
                )}
              />
            </button>
            {productsOpen ? (
              <div
                role="menu"
                className="absolute left-1/2 top-full z-50 mt-3 w-[540px] -translate-x-1/2 rounded-2xl border border-btf-border bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.18)] motion-safe:animate-fade-up"
              >
                <div className="grid grid-cols-2 gap-1">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.slug}
                      href={`${ROUTES.products}${p.slug}/`}
                      role="menuitem"
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-btf-secondary"
                      onClick={() => setProductsOpen(false)}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-btf-accent/10 text-btf-accent">
                        <ProductIcon slug={p.slug} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-btf-text group-hover:text-btf-accent">
                          {p.shortName}
                        </span>
                        <span className="block text-xs text-btf-text-muted">
                          {p.amountRangeLabel}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={ROUTES.products}
                  className="mt-2 flex items-center justify-between rounded-xl border border-btf-border bg-btf-secondary px-3.5 py-2.5 text-sm font-semibold text-btf-text transition-colors hover:border-btf-accent/40 hover:text-btf-accent"
                  onClick={() => setProductsOpen(false)}
                >
                  Compare all products
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ) : null}
          </div>

          <Link
            href={ROUTES.calculator}
            className={cn(
              "text-sm font-medium text-btf-text-muted transition-colors hover:text-btf-text",
              pathname === ROUTES.calculator && "text-btf-accent",
            )}
          >
            Calculator
          </Link>

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
              className="hidden rounded-lg border border-btf-border bg-btf-card px-3 py-2 text-sm font-semibold text-btf-text hover:border-btf-accent/30 hover:bg-btf-secondary xl:inline-flex"
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
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-btf-border bg-white/95 backdrop-blur-md lg:hidden">
          <nav className="container max-w-6xl py-4" aria-label="Mobile">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-btf-text-muted">
              Financing products
            </p>
            <ul className="grid grid-cols-2 gap-1">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`${ROUTES.products}${p.slug}/`}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-btf-text hover:bg-btf-secondary"
                    onClick={() => setMenuOpen(false)}
                  >
                    {p.shortName}
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <Link
                  href={ROUTES.products}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-btf-accent hover:bg-btf-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  Compare all products →
                </Link>
              </li>
            </ul>

            <p className="mt-3 border-t border-btf-border px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-btf-text-muted">
              Explore
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href={ROUTES.calculator}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base font-medium text-btf-text hover:bg-btf-secondary",
                    pathname === ROUTES.calculator && "text-btf-accent",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Funding Calculator
                </Link>
              </li>
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
