import type { Metadata } from "next";
import Link from "next/link";
import { readdir } from "fs/promises";
import path from "path";
import { ContentGeneratePanel } from "@/components/admin/content-generate-panel";
import { Card, CardContent } from "@/components/ui/card";
import { listAllArticlesAdmin } from "@/lib/articles-db";
import { isSupabaseServiceConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Content",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

export default async function AdminContentPage() {
  if (!isSupabaseServiceConfigured()) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-btf-text-muted">
          Supabase is not configured. Run the v5 SQL migration, then refresh.
        </CardContent>
      </Card>
    );
  }

  const [articles, images] = await Promise.all([
    listAllArticlesAdmin(),
    listBlogImages(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-btf-text">Content</h1>
        <p className="text-sm text-btf-text-muted">
          Generate a draft, proofread, then Post — live on Resources immediately.
        </p>
      </div>

      <ContentGeneratePanel images={images} />

      <div className="overflow-x-auto rounded-xl border border-btf-border bg-btf-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-btf-border text-xs uppercase tracking-wider text-btf-text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-btf-text-muted"
                >
                  No articles yet. Generate a draft or run{" "}
                  <code className="text-btf-accent">
                    docs/supabase-v5-seed-articles.sql
                  </code>
                  .
                </td>
              </tr>
            ) : (
              articles.map((row) => (
                <tr key={row.id} className="border-b border-btf-border">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/content/${row.id}/`}
                      className="font-medium text-btf-accent hover:underline"
                    >
                      {row.title}
                    </Link>
                    <div className="text-xs text-btf-text-muted">/{row.slug}/</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-btf-text-muted">
                    {row.status}
                  </td>
                  <td className="px-4 py-3 text-btf-text-muted">
                    {new Date(row.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
