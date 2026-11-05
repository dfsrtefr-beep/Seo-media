import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/JsonLd";
import { ArticleCard } from "@/components/ArticleCard";
import {
  articleSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/schema";
import { formatDate, readingTime } from "@/lib/utils";
import { Markdown } from "@/components/Markdown";

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: true,
      category: true,
      tags: true,
      related: {
        where: { status: "PUBLISHED" },
        include: { category: true, author: true },
        take: 3,
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || undefined;
  const canonical = article.canonicalUrl || `${SITE_URL}/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      images: article.ogImageUrl || article.coverImageUrl
        ? [
            {
              url: article.ogImageUrl || article.coverImageUrl!,
              alt: article.coverImageAlt || article.title,
            },
          ]
        : undefined,
    },
    robots: article.noindex ? { index: false } : { index: true, follow: true },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const breadcrumbs = [
    { name: "Главная", url: SITE_URL },
    ...(article.category
      ? [
          {
            name: article.category.name,
            url: `${SITE_URL}/category/${article.category.slug}`,
          },
        ]
      : []),
    { name: article.title, url: `${SITE_URL}/articles/${article.slug}` },
  ];

  return (
    <>
      <JsonLd data={articleSchema(article)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={organizationSchema()} />

      <article className="container-page max-w-3xl py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-[--muted]">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-[--primary]">Главная</Link>
            </li>
            {article.category && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/category/${article.category.slug}`} className="hover:text-[--primary]">
                    {article.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li aria-current="page" className="text-[--foreground]">{article.title}</li>
          </ol>
        </nav>

        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-[--primary]"
          >
            {article.category.name}
          </Link>
        )}

        <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl text-balance">
          {article.title}
        </h1>

        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[--muted]">
          {article.author.avatarUrl ? (
            <Image
              src={article.author.avatarUrl}
              alt={article.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[--accent] text-sm font-semibold">
              {article.author.name.charAt(0)}
            </span>
          )}
          <div>
            <Link
              href={`/author/${article.author.slug}`}
              className="font-medium text-[--foreground] hover:text-[--primary]"
            >
              {article.author.name}
            </Link>
            <div className="text-xs">
              {formatDate(article.publishedAt)} · {readingTime(article.content)} мин. чтения
            </div>
          </div>
        </div>

        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || article.title}
            width={1200}
            height={675}
            priority
            className="mb-8 w-full rounded-lg"
          />
        )}

        <Markdown content={article.content} />

        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Link
                key={t.id}
                href={`/tag/${t.slug}`}
                className="rounded-full border border-[--border] px-3 py-1 text-sm hover:border-[--primary] hover:text-[--primary]"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-lg border border-[--border] bg-[--accent] p-5 text-sm text-[--muted]">
          Обновлено: {formatDate(article.updatedAt)}
        </div>
      </article>

      {article.related.length > 0 && (
        <section className="container-page py-12">
          <h2 className="mb-6 text-2xl font-bold">Похожие статьи</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {article.related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
