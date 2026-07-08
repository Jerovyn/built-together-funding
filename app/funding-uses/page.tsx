import type { Metadata } from "next";
import Image from "next/image";
import { CtaBlock } from "@/components/cta-block";
import { GrowthCalculator } from "@/components/growth-calculator";
import { ListCheck } from "@/components/list-check";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Funding Uses",
  description: `Capacity capital with ${SITE_NAME}: equipment, trucks, crews, inventory, and proven marketing.`,
};

const GOOD_USES = [
  "Equipment for jobs you can't take yet",
  "Trucks and crews for booked work",
  "Inventory and materials for the season ahead",
  "Marketing that already converts — scaled up",
] as const;

const BAD_USES = [
  "Covering payroll gaps with no growth plan",
  "Borrowing when demand isn't there yet",
  "Stacking debt without more finished work",
] as const;

export default function FundingUsesPage() {
  return (
    <>
      <MarketingPageHero
        badge="Uses"
        title="Money with a job"
        description="Funding earns its keep when it buys capacity for work that's already there."
      />

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <ul className="space-y-3">
            {GOOD_USES.map((item) => (
              <ListCheck key={item}>{item}</ListCheck>
            ))}
          </ul>
          <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
            <Image
              src="/images/equipment-excavator.jpg"
              alt="Excavator on a job site at dawn"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-btf-bg py-12 md:py-14">
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
          Run your numbers
        </h2>
        <GrowthCalculator />
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <h2 className="mb-6 text-lg font-bold text-btf-text">
          Where we&apos;ll say no
        </h2>
        <ul className="max-w-xl space-y-2">
          {BAD_USES.map((item) => (
            <ListCheck key={item}>{item}</ListCheck>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="bg-btf-bg pb-24 md:pb-28">
        <CtaBlock label="Run my file" trackLocation="funding_uses" primaryOnly />
      </SectionShell>
    </>
  );
}
