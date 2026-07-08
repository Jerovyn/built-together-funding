import type { Metadata } from "next";
import Link from "next/link";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Resources",
  description: "Short reads on using capital well in a trades business.",
};

export default function ResourcesPage() {
  return (
    <>
      <MarketingPageHero
        badge="Resources"
        title="Read before you borrow"
        description="Five-minute reads. No pitch."
      />

      <SectionShell className="border-b border-btf-border bg-btf-secondary py-12 md:py-14">
        <ul className="grid gap-4 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/resources/${article.slug}/`}
                className="group block h-full"
              >
                <Card className="h-full bg-btf-card transition-all group-hover:-translate-y-0.5 group-hover:border-btf-accent/40 group-hover:shadow-btf-card">
                  <CardContent className="flex h-full flex-col gap-2 p-5">
                    <p className="text-xs font-semibold text-btf-accent">
                      {article.readMinutes} min
                    </p>
                    <h2 className="text-base font-bold leading-snug text-btf-text">
                      {article.title}
                    </h2>
                    <p className="text-sm leading-snug text-btf-text-muted">
                      {article.description}
                    </p>
                    <p className="mt-auto pt-2 text-sm font-semibold text-btf-accent">
                      Read →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="bg-btf-bg pb-24 md:pb-28">
        <CtaBlock label="Check your fit" trackLocation="resources" primaryOnly />
      </SectionShell>
    </>
  );
}
