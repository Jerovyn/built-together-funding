import type { Metadata } from "next";
import { ApplyDisclaimerGate } from "@/components/apply/apply-disclaimer-gate";
import { ApplyFunnel } from "@/components/apply/apply-funnel";
import {
  APPLY_TIME_ESTIMATE,
  DISCLAIMER_PREQUAL_LINE,
  SITE_NAME,
} from "@/lib/constants";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "See your options",
  description: `Funding pre-qualification for ${SITE_NAME}. Pre-qualification is not funding approval.`,
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; finish?: string }>;
}) {
  const { product, finish } = await searchParams;
  const linkedProduct = getProduct(product ?? "");
  const finishToken = finish?.trim() || undefined;

  return (
    <section className="bg-btf-secondary px-3 py-4 pb-4 sm:px-4 sm:pb-8 md:py-8">
      <div className="mx-auto w-full max-w-2xl space-y-3">
        <header className="space-y-1">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-btf-text sm:text-2xl">
            {finishToken
              ? "Finish your secure file"
              : linkedProduct
                ? `See your options — ${linkedProduct.shortName}`
                : "See your options"}
          </h1>
          <p className="text-xs leading-snug text-btf-text-muted sm:text-sm">
            {finishToken
              ? "Upload statements and complete identity / business details. SSN and EIN stay on this secure step."
              : `${APPLY_TIME_ESTIMATE}. No SSN or statements until you choose to finish the file.`}
          </p>
          <p className="text-xs leading-snug text-btf-text-muted">
            {DISCLAIMER_PREQUAL_LINE}
          </p>
        </header>

        <div className="relative rounded-xl border border-btf-border bg-btf-card p-3 shadow-btf-card sm:p-4">
          <ApplyDisclaimerGate>
            <ApplyFunnel
              initialProductSlug={linkedProduct?.slug}
              finishToken={finishToken}
            />
          </ApplyDisclaimerGate>
        </div>
      </div>
    </section>
  );
}
