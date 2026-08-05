import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description: `The ${SITE_NAME} process: seven quick steps, bank statements, human review, straight answer.`,
};

const STEPS = [
  "What you're looking for — funding type, amount, and use of funds",
  "Business basics — time in business and your industry",
  "Contact — where your options go, with your communication preferences",
  "Last 3 months of bank statements — upload now or secure link later",
  "Owner details — DOB, home address, and SSN for identity verification",
  "Business details — company name, EIN, and address",
  "Confirm and submit — then book a funding review call or hear from us within one business day",
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <MarketingPageHero
        badge="Process"
        title="How it works"
        description="Real numbers. Human review. No runaround."
      />

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px] py-12 md:py-14">
        <ol className="grid gap-4 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-xl border border-btf-border bg-btf-card p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-btf-accent/10 text-sm font-bold text-btf-accent">
                {i + 1}
              </span>
              <p className="text-sm font-medium leading-snug text-btf-text md:text-base">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell className="pb-24 md:pb-28">
        <CtaBlock label="Start pre-qual" trackLocation="how_it_works" primaryOnly />
      </SectionShell>
    </>
  );
}
