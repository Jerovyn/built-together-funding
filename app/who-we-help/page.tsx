import type { Metadata } from "next";
import Image from "next/image";
import { CtaBlock } from "@/components/cta-block";
import { ListCheck } from "@/components/list-check";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { MinimumRequirements } from "@/components/marketing/minimum-requirements";
import { SectionShell } from "@/components/section-shell";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Who We Help",
  description: `${SITE_NAME} — small business funding for trades and service companies that need capacity, not a rescue loan.`,
};

const IDEAL_FIT = [
  "Steady business revenue on bank statements",
  "Work is booked — capacity is the bottleneck",
  "You can name the truck, crew, or equipment funding buys",
] as const;

const NOT_FIT = [
  "Under ~1 year in business",
  "No clear pipeline of work",
  "Funding to stay afloat, not to take more work",
] as const;

export default function WhoWeHelpPage() {
  return (
    <>
      <MarketingPageHero
        badge="Small business funding"
        title="Who we help"
        description="Trades and service companies with real demand who need funding for trucks, equipment, crews, or working capital."
      />

      <SectionShell className="border-b border-btf-border/60 bg-gradient-to-b from-btf-water-mid/70 to-btf-water py-12 md:py-14">
        <MinimumRequirements />
      </SectionShell>

      <SectionShell className="border-b border-btf-border/60 bg-gradient-to-b from-btf-water to-[#F0F7FC] py-12 md:py-14">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <ul className="space-y-2">
            {IDEAL_FIT.map((item) => (
              <ListCheck key={item}>{item}</ListCheck>
            ))}
          </ul>
          <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-btf-border/80 shadow-btf-card">
            <Image
              src="/images/work-trucks.jpg"
              alt="Work trucks at sunrise"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border/60 bg-gradient-to-b from-[#F0F7FC] to-btf-water-mid py-12 md:py-14">
        <h2 className="mb-4 text-lg font-bold text-btf-text">Not a fit yet</h2>
        <ul className="max-w-lg space-y-2">
          {NOT_FIT.map((item) => (
            <ListCheck key={item}>{item}</ListCheck>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="bg-gradient-to-b from-btf-water-mid via-[#C5DFF0] to-[#A8C8E0] pb-24 md:pb-28">
        <CtaBlock trackLocation="who_we_help" primaryOnly />
      </SectionShell>
    </>
  );
}
