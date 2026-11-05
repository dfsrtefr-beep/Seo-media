"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { articleSchema, type ArticleInput } from "@/lib/validators";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Не авторизован");
  return session;
}

export async function createArticle(input: ArticleInput) {
  await requireAuth();
  const data = articleSchema.parse(input);

  const slugExists = await prisma.article.findUnique({
    where: { slug: data.slug },
  });
  if (slugExists) {
    return { ok: false, error: "URL уже используется" };
  }

  const publishedAt =
    data.status === "PUBLISHED" ? new Date() : undefined;
  const scheduledAt =
    data.status === "SCHEDULED" && data.scheduledAt
      ? new Date(data.scheduledAt)
      : null;

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImageUrl: data.coverImageUrl || null,
      coverImageAlt: data.coverImageAlt || null,
      status: data.status,
      publishedAt,
      scheduledAt,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      focusKeyword: data.focusKeyword || null,
      secondaryKeywords: data.secondaryKeywords || [],
      canonicalUrl: data.canonicalUrl || null,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      noindex: data.noindex || false,
      authorId: data.authorId,
      categoryId: data.categoryId || null,
      tags: data.tagIds?.length
        ? { connect: data.tagIds.map((id) => ({ id })) }
        : undefined,
      related: data.relatedIds?.length
        ? { connect: data.relatedIds.map((id) => ({ id })) }
        : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/articles");
  return { ok: true, id: article.id };
}

export async function updateArticle(id: string, input: ArticleInput) {
  await requireAuth();
  const data = articleSchema.parse(input);

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Статья не найдена" };

  const slugExists = await prisma.article.findFirst({
    where: { slug: data.slug, id: { not: id } },
  });
  if (slugExists) return { ok: false, error: "URL уже используется" };

  let publishedAt = existing.publishedAt;
  if (data.status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  } else if (data.status === "DRAFT" || data.status === "ARCHIVED") {
    publishedAt = null;
  }

  const scheduledAt =
    data.status === "SCHEDULED" && data.scheduledAt
      ? new Date(data.scheduledAt)
      : null;

  await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImageUrl: data.coverImageUrl || null,
      coverImageAlt: data.coverImageAlt || null,
      status: data.status,
      publishedAt,
      scheduledAt,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      focusKeyword: data.focusKeyword || null,
      secondaryKeywords: data.secondaryKeywords || [],
      canonicalUrl: data.canonicalUrl || null,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      noindex: data.noindex || false,
      authorId: data.authorId,
      categoryId: data.categoryId || null,
      tags: {
        set: [],
        connect: (data.tagIds || []).map((tagId) => ({ id: tagId })),
      },
      related: {
        set: [],
        connect: (data.relatedIds || []).map((rid) => ({ id: rid })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/articles/${existing.slug}`);
  revalidatePath(`/articles/${data.slug}`);
  return { ok: true, id };
}

export async function deleteArticle(id: string) {
  await requireAuth();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/articles");
  return { ok: true };
}
