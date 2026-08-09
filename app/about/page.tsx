import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — small business funding for trades and service companies, led by operators.`,
};

export default function AboutPage() {
  return (
    <>
      <MarketingPageHero
        badge="About"
        title="Operator-led small business funding"
        description="Built for people who run trucks, crews, and schedules — with a stricter bar for when funding makes sense."
      />

      <SectionShell className="border-b border-btf-border bg-white/40 py-12 backdrop-blur-[2px] md:py-14">
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
        <CtaBlock trackLocation="about" primaryOnly />
      </SectionShell>
    </>
  );
}
