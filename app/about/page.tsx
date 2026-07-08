import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${SITE_NAME} exists — operator-led, stricter standard for growth capital.`,
};

export default function AboutPage() {
  return (
    <>
      <MarketingPageHero
        badge="About"
        title="Built by operators"
        description="For people who live in trucks, crews, and schedules — not bank lobby talk."
      />

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="space-y-4 p-6 md:p-8">
            <p className="text-base leading-relaxed text-btf-text md:text-lg">
              &ldquo;I&apos;ve been on both sides — funding that built companies
              and shortcuts that buried good operators. Then I ran my own service
              business: the trucks, the crews, the schedule.
            </p>
            <p className="text-base leading-relaxed text-btf-text-muted">
              {SITE_NAME} is the stricter playbook. Money when the work is
              already there and capacity is the ceiling. A straight no when
              it isn&apos;t.&rdquo;
            </p>
            <p className="text-sm font-semibold text-btf-text-muted">
              — Founder, Built Together Funding
            </p>
          </CardContent>
        </Card>
      </SectionShell>

      <SectionShell className="bg-btf-bg pb-24 md:pb-28">
        <CtaBlock label="Check your fit" trackLocation="about" primaryOnly />
      </SectionShell>
    </>
  );
}
