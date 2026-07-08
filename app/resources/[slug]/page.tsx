import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBlock } from "@/components/cta-block";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { SectionShell } from "@/components/section-shell";
import { ARTICLES, getArticle } from "@/lib/articles";
import { DISCLAIMER_PREQUAL_LINE, ROUTES } from "@/lib/constants";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <SectionShell className="border-b border-btf-border">
        <div className="mx-auto max-w-3xl">
          <Link
            href={ROUTES.resources}
            className="text-xs font-bold uppercase tracking-wider text-btf-accent hover:underline"
          >
            ← Resources
          </Link>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-btf-text md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-btf-text-muted">
            {article.readMinutes} minute read
          </p>
          <p className="mt-6 text-lg leading-relaxed text-btf-text-muted">
            {article.intro}
          </p>
        </div>
      </SectionShell>

      <SectionShell className="border-b border-btf-border bg-white/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-3xl space-y-12">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold tracking-tight text-btf-text md:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-btf-text-muted">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {section.bullets ? (
                  <ul className="space-y-2.5 pl-1">
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 40)} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-btf-accent"
                          aria-hidden
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-btf-accent/25 bg-btf-accent/5 p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-btf-accent">
              The takeaway
            </p>
            <p className="mt-3 text-base font-semibold leading-relaxed text-btf-text md:text-lg">
              {article.takeaway}
            </p>
          </div>

          <DisclaimerNote className="text-xs">
            This article is educational, not financial or legal advice.{" "}
            {DISCLAIMER_PREQUAL_LINE}
          </DisclaimerNote>
        </div>
      </SectionShell>

      <SectionShell className="pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-btf-text md:text-3xl">
            Sound like your situation?
          </h2>
          <CtaBlock />
        </div>
      </SectionShell>
    </>
  );
}
