import type { Metadata } from "next";
import Link from "next/link";
import { CtaBlock } from "@/components/cta-block";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { listPublishedArticles } from "@/lib/articles-db";

export const metadata: Metadata = {
  title: "Resources",
  description: "Short reads on using capital well in a trades business.",
};

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const articles = await listPublishedArticles();

  return (
    <>
      <MarketingPageHero
        badge="Resources"
        title="Read before you borrow"
        description="Five-minute reads. No pitch."
      />

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px] py-12 md:py-14">
        <ul className="grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/resources/${article.slug}/`}
                className="group block h-full"
              >
                <Card className="h-full bg-btf-card transition-all group-hover:-translate-y-0.5 group-hover:border-btf-accent/40 group-hover:shadow-btf-card">
                  <CardContent className="flex h-full flex-col gap-2 p-5">
                    {article.featuredImagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/content-images/${encodeURIComponent(article.featuredImagePath)}/`}
                        alt=""
                        className="mb-2 aspect-[16/10] w-full rounded-lg object-cover"
                      />
                    ) : null}
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

      <SectionShell className="pb-24 md:pb-28">
        <CtaBlock label="Check your fit" trackLocation="resources" primaryOnly />
      </SectionShell>
    </>
  );
}
