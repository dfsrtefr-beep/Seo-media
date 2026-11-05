import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

async function getTag(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true, author: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tag = await getTag(params.slug);
  if (!tag) return {};
  return {
    title: tag.metaTitle || `Тег: ${tag.name}`,
    description: tag.metaDesc || tag.description || undefined,
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTag(params.slug);
  if (!tag) notFound();

  return (
    <div className="container-page py-12">
      <h1 className="mb-2 text-3xl font-bold">#{tag.name}</h1>
      {tag.description && (
        <p className="mb-8 text-lg text-[--muted]">{tag.description}</p>
      )}

      {tag.articles.length === 0 ? (
        <div className="card py-16 text-center text-[--muted]">
          Нет статей с этим тегом.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tag.articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
