import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import { TrackedPhoneLink } from "@/components/tracking/tracked-phone-link";
import { CTA_PREQUAL_LABEL, ROUTES, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME}. Fastest path: the pre-qual application.`,
};

export default function ContactPage() {
  const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <>
      <MarketingPageHero
        badge="Contact"
        title="Get in touch"
        description="Fastest path to an answer: start the pre-qual."
      />

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <TrackedButtonLink
              href={ROUTES.apply}
              variant="primary"
              trackLabel={CTA_PREQUAL_LABEL}
              trackLocation="contact"
              showArrow
            >
              {CTA_PREQUAL_LABEL}
            </TrackedButtonLink>
          </div>
          <ul className="space-y-3 text-sm text-btf-text">
            {phoneDisplay && phone ? (
              <li>
                <span className="text-btf-text-muted">Phone · </span>
                <TrackedPhoneLink
                  href={`tel:${phone}`}
                  className="font-semibold text-btf-accent hover:underline"
                  trackLocation="contact"
                >
                  {phoneDisplay}
                </TrackedPhoneLink>
              </li>
            ) : null}
            {email ? (
              <li>
                <span className="text-btf-text-muted">Email · </span>
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-btf-accent hover:underline break-all"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {!phone && !email ? (
              <li className="text-btf-text-muted">
                Use the application — {SITE_NAME} will follow up from your
                submission.
              </li>
            ) : null}
          </ul>
        </div>
      </SectionShell>

      <SectionShell className="bg-btf-bg pb-24 md:pb-28">
        <CtaBlock label="Check your fit" trackLocation="contact_footer" primaryOnly />
      </SectionShell>
    </>
  );
}
