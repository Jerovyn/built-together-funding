import type { Metadata } from "next";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { HOME_FAQS, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description: `How ${SITE_NAME} works: apply online, we review your statements, you pick on a call.`,
};

const STEPS = [
  {
    title: "Tell us what you're after",
    body: "About 2 minutes online — what the money is for, amount, revenue, and how to reach you. No SSN yet. No hard credit pull.",
  },
  {
    title: "We review your statements",
    body: "Upload last 3–6 months when you're ready. A person looks at real deposits within 1 business day — not a black-box score.",
  },
  {
    title: "You pick on a call",
    body: "We walk the options together. You decide. No pressure.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <MarketingPageHero
        title="How it works"
        description="Three steps. Real numbers. A person on the other end."
      />

      <SectionShell className="border-b border-btf-border py-12 md:py-14">
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col rounded-xl border border-btf-border bg-btf-card p-5"
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

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <h2 className="text-xl font-bold text-btf-text md:text-2xl">
          Quick answers
        </h2>
        <div className="mt-6 grid gap-2 lg:max-w-2xl">
          {HOME_FAQS.slice(0, 4).map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-btf-border bg-btf-card open:border-btf-accent/30"
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

      <SectionShell className="pb-16 md:pb-20">
        <CtaBlock trackLocation="how_it_works" primaryOnly />
      </SectionShell>
    </>
  );
}
