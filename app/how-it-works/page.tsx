import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { HOME_FAQS, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description: `How ${SITE_NAME} small business funding works: apply online, we review bank statements, you choose options on a call.`,
};

const STEPS = [
  {
    title: "Tell us what you need funding for",
    body: "About 2 minutes online — use of funds, amount, revenue, and how to reach you. No SSN yet. No hard credit pull.",
  },
  {
    title: "We review your bank statements",
    body: "Upload last 3–6 months when you're ready. A person reviews real deposits within 1 business day.",
  },
  {
    title: "Choose options on a call",
    body: "We walk through funding that fits. You decide what to take — or not.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <MarketingPageHero
        title="How small business funding works here"
        description="Apply online, we review your bank statements, then you choose funding options on a call with a person."
      />

      <SectionShell className="border-b border-btf-border/60 bg-gradient-to-b from-btf-water-mid/80 to-btf-water py-12 md:py-14">
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col rounded-xl border border-btf-border/80 bg-white/90 p-5 shadow-sm transition-all duration-150 hover:border-btf-accent/30 hover:shadow-btf-card motion-safe:hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-btf-accent/10 text-sm font-bold text-btf-accent">
                {i + 1}
              </span>
              <p className="mt-3 text-base font-bold text-btf-text">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-btf-text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell className="border-b border-btf-border/60 bg-gradient-to-b from-btf-water to-btf-muted/70 py-12 md:py-14">
        <h2 className="text-xl font-bold text-btf-text md:text-2xl">
          Quick answers
        </h2>
        <div className="mt-6 grid gap-2 lg:max-w-2xl">
          {HOME_FAQS.slice(0, 4).map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-btf-border/80 bg-white/90 open:border-btf-accent/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-btf-text [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  className="text-lg font-bold text-btf-accent transition-transform duration-150 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-snug text-btf-text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-gradient-to-b from-btf-muted/60 via-[#C5DFF0] to-[#A8C8E0] pb-16 md:pb-20">
        <CtaBlock trackLocation="how_it_works" primaryOnly />
      </SectionShell>
    </>
  );
}
