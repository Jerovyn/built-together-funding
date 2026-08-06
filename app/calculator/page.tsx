import type { Metadata } from "next";
import Link from "next/link";
import { FundingCalculator } from "@/components/calculator/funding-calculator";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  CTA_CALC_LABEL,
  DISCLAIMER_ESTIMATE_LINE,
  DISCLAIMER_PREQUAL_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import { getProduct, type ProductSlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Funding Calculator",
  description: `Estimate a payment for working capital, equipment, term loans and more. Estimates only, from ${SITE_NAME}.`,
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const initial = getProduct(product ?? "");

  return (
    <>
      <section className="border-b border-btf-border">
        <div className="container max-w-xl py-8 sm:py-10">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-btf-text sm:text-4xl">
            Estimate a payment.
          </h1>
          <p className="mt-2 text-base text-btf-text-muted">
            No signup. Adjust amount and term — extras are optional.
          </p>
        </div>
      </section>

      <section className="border-b border-btf-border bg-btf-secondary">
        <div className="container max-w-xl py-8 sm:py-10">
          <FundingCalculator
            initialProductSlug={initial?.slug as ProductSlug | undefined}
          />
          <p className="mt-4 text-xs leading-relaxed text-btf-text-muted">
            {DISCLAIMER_ESTIMATE_LINE} {DISCLAIMER_PREQUAL_LINE}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <TrackedButtonLink
              href={
                initial
                  ? `${ROUTES.apply}?product=${initial.slug}`
                  : ROUTES.apply
              }
              variant="primary"
              trackLabel={CTA_CALC_LABEL}
              trackLocation="calculator_page_footer"
              showArrow
            >
              {CTA_CALC_LABEL}
            </TrackedButtonLink>
            <Link
              href={ROUTES.products}
              className="text-sm font-semibold text-btf-accent hover:underline"
            >
              Compare products →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
