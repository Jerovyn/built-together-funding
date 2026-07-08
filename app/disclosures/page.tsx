import type { Metadata } from "next";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import {
  CREDIT_CHECK_LINE,
  DISCLAIMER_PREQUAL_LINE,
  LEGAL_CAPACITY_PHILOSOPHY_LINE,
  LEGAL_NO_GUARANTEE_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Funding Disclosures",
  description: `Important disclosures about pre-qualification, funding options, and how ${SITE_NAME} approaches capital conversations.`,
};

const prose =
  "space-y-4 text-sm leading-relaxed text-btf-text-muted md:text-base";

export default function DisclosuresPage() {
  return (
    <>
      <MarketingPageHero
        badge="Legal"
        title="Funding Disclosures"
        description={`Plain-language disclosures about how ${SITE_NAME} thinks about pre-qualification, funding conversations, and what we do not promise. Last updated: May 7, 2026.`}
      />

      <SectionShell className="border-b border-btf-border">
        <div className="mx-auto max-w-3xl space-y-8">
          <Card className="bg-btf-card">
            <CardContent className="space-y-3 p-6 md:p-8">
              <p className="text-sm font-semibold text-btf-text">
                {DISCLAIMER_PREQUAL_LINE}
              </p>
              <p className="text-sm text-btf-text-muted">{LEGAL_NO_GUARANTEE_LINE}</p>
              <p className="text-sm text-btf-text-muted">
                {LEGAL_CAPACITY_PHILOSOPHY_LINE}
              </p>
            </CardContent>
          </Card>
          <DisclaimerNote />
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="Pre-qualification disclosure" />
            <div className={prose}>
              <p>
                Pre-qualification is a preliminary screen based on the information you
                provide. It is not a full underwriting review. {DISCLAIMER_PREQUAL_LINE}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Funding approval disclosure" />
            <div className={prose}>
              <p>
                No statement on this website - before, during, or after the
                pre-screen - means you are approved for funding. Approval language can
                only come from an actual underwriting process with a specific product,
                partner, and documented terms.
              </p>
              <p>{LEGAL_NO_GUARANTEE_LINE}</p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Underwriting / partner availability disclosure" />
            <div className={prose}>
              <p>
                Funding options depend on verification, partner appetite, program
                rules, and timing. A fit conversation today does not guarantee that the
                same option will exist later - or that a partner will choose to move
                forward.
              </p>
              <p>{DISCLAIMER_PREQUAL_LINE}</p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading
              title="No guarantee of terms, rates, savings, profit, or approval"
            />
            <div className={prose}>
              <p>{LEGAL_NO_GUARANTEE_LINE}</p>
              <p>
                Business outcomes depend on execution, market conditions, costs, and
                factors outside anyone&apos;s control. We do not promise revenue increases,
                margin improvements, or that funding will &quot;pay for itself.&quot;
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Credit check disclosure" />
            <div className={prose}>
              <p>{CREDIT_CHECK_LINE}</p>
              <p>
                Our pre-qualification form does not access your credit file. If your
                application moves to underwriting with a funding partner, that partner
                may perform a credit review - typically starting with a soft inquiry
                that does not affect your score. Some partners may require a hard
                inquiry before final funding; where that applies, it should be
                disclosed to you before it happens. Always confirm the pull type with
                the specific partner before you sign anything.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border">
        <div className="mx-auto max-w-3xl space-y-14">
          <section className="space-y-6">
            <SectionHeading title="Responsible funding philosophy" />
            <div className={prose}>
              <p>{LEGAL_CAPACITY_PHILOSOPHY_LINE}</p>
              <p>
                If demand is not real - or if the constraint is not truly
                capacity - more capital often makes problems worse. We are selective
                because the goal is sustainable operations, not a rushed transaction.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Business-use funding focus" />
            <div className={prose}>
              <p>
                {SITE_NAME} focuses on operating businesses with real workflows:
                crews, equipment, schedules, and customers. This is not a &quot;personal
                expense&quot; funding channel and it is not positioned as a consumer product
                line on this site.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Not for startups or no-revenue businesses" />
            <div className={prose}>
              <p>
                If you do not have meaningful operating history and revenue patterns, we
                are usually not the right place to start. The pre-screen is built around
                operators who can describe real demand and real constraints - not
                theoretical plans with no proof of work.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="SMS and email communication disclosure" />
            <div className={prose}>
              <p>
                If you consent, we may email you about your submission and next steps.
                If you opt in to SMS, messages are sent only as described at the time
                you consent. Reply{" "}
                <span className="font-medium text-btf-text">STOP</span> to opt out of
                SMS where applicable.
              </p>
              <p>{DISCLAIMER_PREQUAL_LINE}</p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Final review required" />
            <div className={prose}>
              <p>
                These disclosures are intentionally direct - but they are still a draft.
                Before paid advertising, partner programs, or any compliance-sensitive
                launch, have qualified counsel review disclosures alongside your Privacy
                Policy and Terms.
              </p>
              <p>
                Related pages:{" "}
                <Link
                  href="/privacy-policy/"
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  href="/terms/"
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Terms of Use
                </Link>
                , or{" "}
                <Link
                  href={ROUTES.contact}
                  className="text-btf-accent-soft underline-offset-4 hover:underline"
                >
                  Contact
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading title="Attorney review note" />
            <div className={prose}>
              <p>
                This disclosures page should be reviewed and finalized by legal counsel
                before you treat it as production-ready compliance documentation.
              </p>
            </div>
          </section>
        </div>
      </SectionShell>
    </>
  );
}
