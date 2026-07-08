import type { Metadata } from "next";
import Image from "next/image";
import { CtaBlock } from "@/components/cta-block";
import { ListCheck } from "@/components/list-check";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Who We Help",
  description: `${SITE_NAME} — service and trade businesses scaling capacity.`,
};

const IDEAL_FIT = [
  "Steady revenue on the books",
  "Work is there — capacity is the bottleneck",
  "You can name what the money buys",
] as const;

const NOT_FIT = [
  "Under ~6 months in business",
  "No clear pipeline of work",
  "Money to survive, not grow",
] as const;

export default function WhoWeHelpPage() {
  return (
    <>
      <MarketingPageHero
        badge="Fit"
        title="Who we fund"
        description="Operators already winning — who need more trucks, machines, crews, or inventory."
      />

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px] py-12 md:py-14">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <ul className="space-y-2">
            {IDEAL_FIT.map((item) => (
              <ListCheck key={item}>{item}</ListCheck>
            ))}
          </ul>
          <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-btf-border shadow-btf-card">
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

      <SectionShell className="border-b border-btf-border py-12 md:py-14">
        <h2 className="mb-4 text-lg font-bold text-btf-text">Not a fit yet</h2>
        <ul className="max-w-lg space-y-2">
          {NOT_FIT.map((item) => (
            <ListCheck key={item}>{item}</ListCheck>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="bg-white/40 pb-24 backdrop-blur-[2px] md:pb-28">
        <CtaBlock label="Check your fit" trackLocation="who_we_help" primaryOnly />
      </SectionShell>
    </>
  );
}
