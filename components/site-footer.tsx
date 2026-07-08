"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DISCLAIMER_SHORT,
  FOOTER_LINKS,
  NAV_LINKS,
  ROUTES,
} from "@/lib/constants";
import { TrackedLink } from "@/components/tracking/tracked-link";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";

export function SiteFooter() {
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-btf-ink text-btf-on-ink">
      <div className="container relative max-w-6xl py-10 sm:py-14">
        <p className="text-balance text-xl font-extrabold uppercase leading-tight tracking-tight text-btf-on-ink sm:text-2xl md:text-3xl lg:text-4xl">
          Funding is a commitment{" "}
          <span className="text-btf-accent-soft">to growth.</span>
        </p>

        <div className="mt-10 flex flex-col gap-8 border-t border-btf-ink-border pt-8 sm:mt-12 sm:gap-10 sm:pt-10 md:flex-row md:justify-between">
          <div className="max-w-md space-y-4">
            <Link href={ROUTES.home} className="inline-flex items-center gap-3">
              <Image
                src="/brand/btf-logo-tools.png"
                alt=""
                width={540}
                height={436}
                className="h-14 w-auto md:h-16"
              />
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold uppercase tracking-tight text-btf-on-ink">
                  Built Together
                </span>
                <span className="text-base font-bold uppercase tracking-tight text-btf-accent-soft">
                  Funding
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-btf-on-ink-muted">
              Money to grow your service business when the work is already
              there. Not a bailout — a build.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-btf-on-ink-muted">
                Explore
              </p>
              <ul className="mt-3 space-y-2">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-btf-on-ink-muted hover:text-btf-on-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-btf-on-ink-muted">
                Legal
              </p>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-btf-on-ink-muted hover:text-btf-on-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-btf-on-ink-muted">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-sm text-btf-on-ink-muted">
                <li>
                  <TrackedLink
                    href={ROUTES.apply}
                    className="hover:text-btf-on-ink"
                    trackLabel="Check your fit"
                    trackLocation="footer"
                  >
                    Check your fit
                  </TrackedLink>
                </li>
                <li>
                  <TrackedLink
                    href={ROUTES.iso}
                    className="hover:text-btf-on-ink"
                    trackLabel="ISO / Partner signup"
                    trackLocation="footer"
                  >
                    ISO / Partner signup
                  </TrackedLink>
                </li>
                {phoneDisplay && phone ? (
                  <li>
                    <TrackedPhoneLink
                      href={`tel:${phone}`}
                      className="hover:text-btf-on-ink"
                      trackLocation="footer"
                    >
                      {phoneDisplay}
                    </TrackedPhoneLink>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-btf-on-ink">
                      {email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-btf-ink-border pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-btf-on-ink-muted">
            {DISCLAIMER_SHORT}
          </p>
          <p className="text-xs text-btf-on-ink-muted">
            &copy; {year} Built Together Funding Corp. All rights reserved.
            {address ? ` ${address}.` : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
