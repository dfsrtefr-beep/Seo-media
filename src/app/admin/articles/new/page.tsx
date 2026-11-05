import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticleAction } from "./createAction";
import type { ArticleFormData } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [authors, categories, tags, articles] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.article.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }).then((list) => list.map((a) => ({ id: a.id, name: a.title }))),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Новая статья</h1>
      <ArticleForm
        authors={authors}
        categories={categories}
        tags={tags}
        articles={articles}
        onSave={async (data: ArticleFormData) => {
          return createArticleAction({
            ...data,
            status: data.status as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
            excerpt: data.excerpt || null,
            coverImageUrl: data.coverImageUrl || null,
            coverImageAlt: data.coverImageAlt || null,
            scheduledAt: data.scheduledAt || null,
            seoTitle: data.seoTitle || null,
            seoDescription: data.seoDescription || null,
            focusKeyword: data.focusKeyword || null,
            secondaryKeywords: (data.secondaryKeywords || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            canonicalUrl: data.canonicalUrl || null,
            ogTitle: data.ogTitle || null,
            ogDescription: data.ogDescription || null,
            ogImageUrl: data.ogImageUrl || null,
            noindex: data.noindex,
            categoryId: data.categoryId || null,
            tagIds: data.tagIds,
            relatedIds: data.relatedIds,
          });
        }}
      />
    </div>
  );
}
