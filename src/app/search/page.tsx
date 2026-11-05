import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск по статьям и материалам портала seo-media.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";

  const results = q
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: 30,
        include: { category: true, author: true },
      })
    : [];

  return (
    <div className="container-page py-12">
      <h1 className="mb-6 text-3xl font-bold">Поиск</h1>

      <form action="/search" method="GET" className="mb-8 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Введите запрос..."
          className="input max-w-md"
          aria-label="Поиск"
        />
        <button type="submit" className="btn-primary">
          Найти
        </button>
      </form>

      {q ? (
        <>
          <p className="mb-6 text-sm text-[--muted]">
            Найдено: {results.length}
          </p>
          {results.length === 0 ? (
            <div className="card py-16 text-center text-[--muted]">
              По запросу «{q}» ничего не найдено.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-[--muted]">Введите запрос для поиска по сайту.</p>
      )}
    </div>
  );
}
