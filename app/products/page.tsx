import type { Metadata } from "next";
import Link from "next/link";
import { ProductIcon } from "@/components/products/product-icon";
import { Reveal } from "@/components/reveal";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  BROKER_DISCLOSURE,
  CTA_PREQUAL_LABEL,
  ROUTES,
} from "@/lib/constants";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Financing Products — Compare Your Options",
  description:
    "Working capital, term loans, lines of credit, equipment financing, SBA loans, MCA consolidation, acquisitions, and commercial real estate — one application compares options across our partner network.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-btf-border bg-gradient-to-br from-[#F0F9FF] via-white to-[#F7F8FA]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-btf-accent/[0.06] blur-3xl"
        />
        <div className="container relative max-w-6xl py-10 sm:py-12">
          <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl">
            Small business funding products, compared in one place
          </h1>
          <p className="mt-3 max-w-xl text-base text-btf-text-muted">
            Working capital, equipment financing, term loans, and more —
            reviewed across our partner network and explained by a person.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl bg-white/50 py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 40, 160)}>
              <Link
                href={`${ROUTES.products}${p.slug}/`}
                className="group flex h-full flex-col rounded-2xl border border-btf-border bg-btf-card p-5 shadow-sm transition-all duration-150 hover:border-btf-accent/40 hover:shadow-btf-card motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.98]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-btf-accent/10 text-btf-accent">
                  <ProductIcon slug={p.slug} />
                </span>
                <h2 className="mt-4 text-lg font-extrabold tracking-tight text-btf-text group-hover:text-btf-accent">
                  {p.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-btf-accent">
                  {p.amountRangeLabel}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-btf-text-muted">
                  {p.tagline}
                </p>
                <p className="mt-4 text-sm font-semibold text-btf-accent">
                  Learn more{" "}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-btf-border bg-btf-secondary p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-bold text-btf-text">
              Not sure which fits?
            </p>
            <p className="mt-1 text-sm text-btf-text-muted">
              Start the pre-qual and pick &ldquo;Not sure yet&rdquo; — we route
              your file to whatever the statements support.
            </p>
          </div>
          <TrackedButtonLink
            href={ROUTES.apply}
            variant="primary"
            trackLabel={CTA_PREQUAL_LABEL}
            trackLocation="products_index"
            className="shrink-0"
            showArrow
          >
            {CTA_PREQUAL_LABEL}
          </TrackedButtonLink>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-btf-text-muted">
          {BROKER_DISCLOSURE}
        </p>
      </section>
    </>
  );
}
