import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Все статьи и материалы портала seo-media.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const pageSize = 12;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, author: true },
    }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 text-3xl font-bold">Все статьи</h1>

      {articles.length === 0 ? (
        <div className="card py-16 text-center text-[--muted]">
          Пока нет опубликованных статей.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <a href={`/articles?page=${page - 1}`} className="btn-outline">
              ← Назад
            </a>
          )}
          <span className="text-sm text-[--muted]">
            Страница {page} из {totalPages}
          </span>
          {page < totalPages && (
            <a href={`/articles?page=${page + 1}`} className="btn-outline">
              Вперёд →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
