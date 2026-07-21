import type { Article, ArticleSection } from "@/lib/articles";
import { ARTICLES as STATIC_ARTICLES } from "@/lib/articles";
import {
  createServiceRoleClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/server";

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  read_minutes: number;
  intro: string;
  sections: ArticleSection[];
  takeaway: string;
  featured_image_path: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function rowToArticle(row: ArticleRow): Article & { featuredImagePath?: string | null } {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    readMinutes: row.read_minutes,
    intro: row.intro,
    sections: Array.isArray(row.sections) ? row.sections : [],
    takeaway: row.takeaway,
    featuredImagePath: row.featured_image_path,
  };
}

export async function listPublishedArticles(): Promise<
  Array<Article & { featuredImagePath?: string | null }>
> {
  if (!isSupabaseServiceConfigured()) {
    return STATIC_ARTICLES.map((a) => ({ ...a, featuredImagePath: null }));
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return STATIC_ARTICLES.map((a) => ({ ...a, featuredImagePath: null }));
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, description, read_minutes, intro, sections, takeaway, featured_image_path, status, published_at, created_at, updated_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return STATIC_ARTICLES.map((a) => ({ ...a, featuredImagePath: null }));
  }

  return (data as ArticleRow[]).map(rowToArticle);
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<(Article & { featuredImagePath?: string | null }) | null> {
  if (!isSupabaseServiceConfigured()) {
    return STATIC_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return STATIC_ARTICLES.find((a) => a.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, description, read_minutes, intro, sections, takeaway, featured_image_path, status, published_at, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return STATIC_ARTICLES.find((a) => a.slug === slug) ?? null;
  }

  return rowToArticle(data as ArticleRow);
}

export async function listAllArticlesAdmin(): Promise<ArticleRow[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("articles")
    .select(
      "id, slug, title, description, read_minutes, intro, sections, takeaway, featured_image_path, status, published_at, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });
  return (data as ArticleRow[]) ?? [];
}

export async function getArticleAdminById(id: string): Promise<ArticleRow | null> {
  const supabase = createServiceRoleClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("articles")
    .select(
      "id, slug, title, description, read_minutes, intro, sections, takeaway, featured_image_path, status, published_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();
  return (data as ArticleRow) ?? null;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
