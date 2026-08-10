"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BRAND_LINE,
  DISCLAIMER_PREQUAL_LINE,
  FOOTER_LINKS,
  ROUTES,
} from "@/lib/constants";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";

/**
 * Short footer (Krug): phone/email, a handful of links, one disclosure line.
 * Soft slate wash — refined close that stays on-brand without a loud blue slab.
 */
export function SiteFooter() {
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const year = new Date().getFullYear();

  const links = [
    { href: ROUTES.products, label: "Products" },
    { href: ROUTES.calculator, label: "Calculator" },
    { href: ROUTES.howItWorks, label: "How it works" },
    { href: ROUTES.whoWeHelp, label: "Who we help" },
    { href: ROUTES.resources, label: "Resources" },
    { href: ROUTES.contact, label: "Contact" },
    ...FOOTER_LINKS.filter((l) => l.href !== "/iso/"),
  ];

  return (
    <footer className="border-t border-btf-border/80 bg-gradient-to-b from-[#EEF4F8] to-[#E2EBF2] text-btf-text">
      <div className="container max-w-6xl py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Link href={ROUTES.home} className="inline-flex items-center gap-2.5">
              <Image
                src="/brand/btf-logo-bt-mark.png"
                alt=""
                width={44}
                height={44}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-bold tracking-tight text-btf-text">
                Built Together Funding
              </span>
            </Link>
            <p className="max-w-xs text-sm text-btf-text-muted">{BRAND_LINE}</p>
            <ul className="space-y-1 text-sm text-btf-text-muted">
              {phoneDisplay && phone ? (
                <li>
                  <TrackedPhoneLink
                    href={`tel:${phone}`}
                    className="hover:text-btf-accent"
                    trackLocation="footer"
                  >
                    {phoneDisplay}
                  </TrackedPhoneLink>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-btf-accent"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-btf-text-muted transition-colors hover:text-btf-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 space-y-2 border-t border-btf-border pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-btf-text-muted">
            {DISCLAIMER_PREQUAL_LINE}{" "}
            <Link
              href="/disclosures/"
              className="text-btf-accent underline underline-offset-2 hover:text-btf-accent-mid"
            >
              Full disclosures
            </Link>
          </p>
          <p className="text-xs text-btf-text-muted">
            &copy; {year} Built Together Funding Corp.
          </p>
        </div>
      </div>
    </footer>
  );
}
