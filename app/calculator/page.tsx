import type { Metadata } from "next";
import Link from "next/link";
import { FundingCalculator } from "@/components/calculator/funding-calculator";
import { Reveal } from "@/components/reveal";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  CTA_PREQUAL_LABEL,
  DISCLAIMER_ESTIMATE_LINE,
  DISCLAIMER_PREQUAL_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import { PRODUCTS, getProduct, type ProductSlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Funding Calculator — Payments, Total Cost & Break-Even",
  description: `Model payments for working capital, term loans, equipment financing, SBA loans and more — then flip the tab to see if the purchase pays for itself. Estimates only, from ${SITE_NAME}.`,
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
        <div className="container max-w-6xl py-10 sm:py-12">
          <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl">
            Know your numbers before you commit.
          </h1>
          <p className="mt-3 max-w-xl text-base text-btf-text-muted">
            What it costs, and whether it pays for itself — for every product
            we place.
          </p>
        </div>
      </section>

      <section className="border-b border-btf-border bg-btf-secondary">
        <div className="container max-w-6xl py-8 sm:py-10">
          <Reveal>
            <FundingCalculator initialProductSlug={initial?.slug as ProductSlug | undefined} />
          </Reveal>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-btf-text-muted">
            {DISCLAIMER_ESTIMATE_LINE} {DISCLAIMER_PREQUAL_LINE}
          </p>
        </div>
      </section>

      <section className="container max-w-6xl py-10 sm:py-12">
        <h2 className="text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl">
          Dig into a product
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 40, 160)}>
              <Link
                href={`${ROUTES.products}${p.slug}/`}
                className="group flex h-full flex-col rounded-xl border border-btf-border bg-btf-card p-4 transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
              >
                <p className="text-sm font-bold text-btf-text group-hover:text-btf-accent">
                  {p.shortName}
                </p>
                <p className="mt-1 text-xs text-btf-text-muted">
                  {p.amountRangeLabel} · {p.termRangeLabel}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <TrackedButtonLink
            href={ROUTES.apply}
            variant="primary"
            trackLabel={CTA_PREQUAL_LABEL}
            trackLocation="calculator_page_footer"
            showArrow
          >
            {CTA_PREQUAL_LABEL}
          </TrackedButtonLink>
        </div>
      </section>
    </>
  );
}
