import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductIcon } from "@/components/products/product-icon";
import { Reveal } from "@/components/reveal";
import { TrackedButtonLink } from "@/components/tracking/tracked-link";
import {
  BROKER_DISCLOSURE,
  CTA_PREQUAL_LABEL,
  DISCLAIMER_ESTIMATE_LINE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants";
import { PRODUCTS, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${product.amountRangeLabel}`,
    description: `${product.tagline} ${product.amountRangeLabel}, ${product.termRangeLabel}. ${DISCLAIMER_ESTIMATE_LINE}`,
  };
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://builttogetherfunding.com";
  const pageUrl = `${siteUrl}/products/${product.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/products/`,
          },
          { "@type": "ListItem", position: 3, name: product.name, item: pageUrl },
        ],
      },
      {
        "@type": "Service",
        name: product.name,
        serviceType: "Business financing brokerage",
        description: product.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: "US",
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: product.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  const applyHref = `${ROUTES.apply}?product=${product.slug}`;
  const calcHref = `${ROUTES.calculator}?product=${product.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-btf-border">
        <div className="container max-w-6xl py-8 sm:py-10 md:py-12">
          <nav aria-label="Breadcrumb" className="text-xs text-btf-text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={ROUTES.home} className="hover:text-btf-text">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={ROUTES.products} className="hover:text-btf-text">
                  Products
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-semibold text-btf-text">{product.shortName}</li>
            </ol>
          </nav>

          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
            <div className="min-w-0">
              <h1 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-btf-text sm:text-4xl md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-btf-text-muted">
                {product.tagline}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <TrackedButtonLink
                  href={applyHref}
                  variant="primary"
                  trackLabel={CTA_PREQUAL_LABEL}
                  trackLocation={`product_${product.slug}`}
                  showArrow
                >
                  {CTA_PREQUAL_LABEL}
                </TrackedButtonLink>
                <Link
                  href={calcHref}
                  className="text-sm font-semibold text-btf-accent hover:underline"
                >
                  Estimate a payment →
                </Link>
              </div>
              <p className="mt-4 text-xs text-btf-text-muted">
                Won&apos;t affect your credit score.
              </p>
            </div>

            {/* Quick facts card */}
            <Reveal className="min-w-0">
              <div className="rounded-2xl border border-btf-border bg-btf-card p-5 shadow-btf-card sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-btf-accent/10 text-btf-accent">
                    <ProductIcon slug={product.slug} className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-bold text-btf-text">Quick facts</p>
                </div>
                <dl className="mt-4 divide-y divide-btf-border">
                  {product.quickFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="shrink-0 text-xs font-medium text-btf-text-muted">
                        {fact.label}
                      </dt>
                      <dd className="text-right text-sm font-semibold text-btf-text">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Uses */}
      <section className="border-b border-btf-border">
        <div className="container max-w-6xl py-10 sm:py-14">
          <h2 className="max-w-xl text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
            What can you use it for?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.uses.map((use, i) => (
              <Reveal
                key={use.title}
                delay={Math.min(i * 40, 160)}
                className="h-full"
              >
                <div className="flex h-full flex-col rounded-xl border border-btf-border bg-btf-card p-4 transition-all duration-150 hover:border-btf-accent/30 hover:shadow-btf-card motion-safe:active:scale-[0.98]">
                  <p className="text-sm font-bold text-btf-text">{use.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-btf-text-muted">
                    {use.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-btf-border bg-btf-secondary">
        <div className="container max-w-6xl py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
            <div>
              <h2 className="text-balance text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
                Why {product.shortName.toLowerCase()} through {SITE_NAME}?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-btf-text-muted">
                Best for: {product.bestFor}. One application, statements-first
                review, and a person who walks you through the options — not a
                portal that ghosts you.
              </p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {product.benefits.slice(0, 4).map((benefit, i) => (
                <Reveal key={benefit} delay={Math.min(i * 40, 160)} as="li">
                  <span className="flex gap-2.5 rounded-xl border border-btf-border bg-btf-card p-3.5 text-sm font-medium text-btf-text">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-btf-accent" />
                    {benefit}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-btf-border">
        <div className="container max-w-6xl py-10 sm:py-14">
          <h2 className="text-xl font-extrabold tracking-tight text-btf-text sm:text-2xl md:text-3xl">
            {product.shortName} questions
          </h2>
          <div className="mt-6 grid gap-2 lg:max-w-2xl">
            {product.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-btf-border bg-btf-card open:border-btf-accent/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-btf-text transition-colors duration-150 active:bg-btf-secondary/70 [&::-webkit-details-marker]:hidden">
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-btf-ink">
        <div className="container relative max-w-6xl py-12 sm:py-16">
          <h2 className="max-w-lg text-balance text-2xl font-extrabold leading-tight tracking-tight text-btf-on-ink sm:text-3xl md:text-4xl">
            See if {product.shortName.toLowerCase()} fits your file.
          </h2>
          <p className="mt-3 max-w-md text-sm text-btf-on-ink-muted">
            About 5 minutes. Straight answer within one business day.
          </p>
          <div className="mt-6">
            <TrackedButtonLink
              href={applyHref}
              variant="primary"
              trackLabel={CTA_PREQUAL_LABEL}
              trackLocation={`product_${product.slug}_footer`}
              className="px-7 py-3.5"
              showArrow
            >
              {CTA_PREQUAL_LABEL}
            </TrackedButtonLink>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-btf-on-ink-muted">
            {BROKER_DISCLOSURE}
          </p>
        </div>
      </section>
    </>
  );
}
