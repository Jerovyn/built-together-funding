import type { Metadata } from "next";
import { ApplyDisclaimerGate } from "@/components/apply/apply-disclaimer-gate";
import { ApplyFunnel } from "@/components/apply/apply-funnel";
import { APPLY_TIME_ESTIMATE, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "See if you qualify",
  description: `Funding pre-qualification for ${SITE_NAME}. Pre-qualification is not funding approval.`,
};

export default function ApplyPage() {
  // Natural document scroll (no nested scroll areas) so mobile browsers
  // handle the funnel like a normal page.
  return (
    <section className="bg-btf-secondary px-3 py-4 pb-4 sm:px-4 sm:pb-8 md:py-8">
      <div className="mx-auto w-full max-w-2xl space-y-3">
        <header className="space-y-0.5">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-btf-text sm:text-2xl">
            See if you qualify
          </h1>
          <p className="text-xs leading-snug text-btf-text-muted sm:text-sm">
            {APPLY_TIME_ESTIMATE}. Funding questions, bank statements, owner and
            business details — then a straight answer within one business day.
          </p>
        </header>

        <div className="relative rounded-xl border border-btf-border bg-btf-card p-3 shadow-btf-card sm:p-4">
          <ApplyDisclaimerGate>
            <ApplyFunnel />
          </ApplyDisclaimerGate>
        </div>
      </div>
    </section>
  );
}
