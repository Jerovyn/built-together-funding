import type { Metadata } from "next";
import Link from "next/link";
import { readdir } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getArticleAdminById } from "@/lib/articles-db";
import { isSupabaseServiceConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Edit article",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

async function listBlogImages(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "content", "blog-images");
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export default async function AdminContentEditPage({ params }: PageProps) {
  const { id } = await params;
  if (!isSupabaseServiceConfigured()) notFound();

  const [article, images] = await Promise.all([
    getArticleAdminById(id),
    listBlogImages(),
  ]);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/content/"
          className="text-xs font-semibold text-btf-accent hover:underline"
        >
          ← Content
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-btf-text">Edit article</h1>
        {article.status === "published" ? (
          <p className="text-sm text-btf-text-muted">
            Live at{" "}
            <a
              href={`/resources/${article.slug}/`}
              className="text-btf-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              /resources/{article.slug}/
            </a>
          </p>
        ) : null}
      </div>

      <ArticleEditor
        id={article.id}
        images={images}
        initial={{
          title: article.title,
          slug: article.slug,
          description: article.description,
          readMinutes: article.read_minutes,
          intro: article.intro,
          sections: Array.isArray(article.sections) ? article.sections : [],
          takeaway: article.takeaway,
          featuredImagePath: article.featured_image_path,
          status: article.status,
        }}
      />
    </div>
  );
}
