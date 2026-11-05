import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm, type ArticleFormData } from "@/components/admin/ArticleForm";
import { updateArticleAction } from "./updateAction";
import { deleteArticle } from "../actions";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article, authors, categories, tags, articles] = await Promise.all([
    prisma.article.findUnique({
      where: { id: params.id },
      include: { tags: true, related: true },
    }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.article.findMany({
      where: { id: { not: params.id } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }).then((list) => list.map((a) => ({ id: a.id, name: a.title }))),
  ]);

  if (!article) notFound();

  const initial: ArticleFormData = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || "",
    content: article.content,
    coverImageUrl: article.coverImageUrl || "",
    coverImageAlt: article.coverImageAlt || "",
    status: article.status,
    scheduledAt: article.scheduledAt
      ? article.scheduledAt.toISOString().slice(0, 16)
      : "",
    seoTitle: article.seoTitle || "",
    seoDescription: article.seoDescription || "",
    focusKeyword: article.focusKeyword || "",
    secondaryKeywords: article.secondaryKeywords.join(", "),
    canonicalUrl: article.canonicalUrl || "",
    ogTitle: article.ogTitle || "",
    ogDescription: article.ogDescription || "",
    ogImageUrl: article.ogImageUrl || "",
    noindex: article.noindex,
    authorId: article.authorId,
    categoryId: article.categoryId || "",
    tagIds: article.tags.map((t) => t.id),
    relatedIds: article.related.map((r) => r.id),
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактирование статьи</h1>
        <DeleteButton id={article.id} action={deleteArticle} />
      </div>
      <ArticleForm
        initial={initial}
        isEdit
        authors={authors}
        categories={categories}
        tags={tags}
        articles={articles}
        onSave={async (data: ArticleFormData) => {
          return updateArticleAction(article.id, {
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
