import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 9,
      include: { category: true, author: true },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { articles: true } } },
    }),
  ]);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <section className="border-b border-[--border] bg-[--accent]">
        <div className="container-page py-16 text-center sm:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Экспертные статьи и аналитика для роста вашего бизнеса
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[--muted]">
            Публикуем проверенные материалы, исследования и практические руководства,
            которые помогают принимать взвешенные решения.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/articles" className="btn-primary">
              Читать статьи
            </Link>
            <Link href="/about" className="btn-outline">
              О проекте
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Последние публикации</h2>
          <Link href="/articles" className="text-sm text-[--primary] hover:underline">
            Все статьи →
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="card py-16 text-center text-[--muted]">
            Пока нет опубликованных статей. Загляните позже.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="mb-6 text-2xl font-bold">Разделы</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="card flex items-center justify-between hover:border-[--primary]"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-[--muted]">{c._count.articles} статей</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
