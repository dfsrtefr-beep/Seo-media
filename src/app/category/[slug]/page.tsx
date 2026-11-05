import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  return prisma.category.findUnique({
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
  const category = await getCategory(params.slug);
  if (!category) return {};
  return {
    title: category.metaTitle || category.name,
    description: category.metaDesc || category.description || undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", url: SITE_URL },
          { name: category.name, url: `${SITE_URL}/category/${category.slug}` },
        ])}
      />
      <div className="container-page py-12">
        <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mb-8 text-lg text-[--muted]">{category.description}</p>
        )}

        {category.articles.length === 0 ? (
          <div className="card py-16 text-center text-[--muted]">
            В этом разделе пока нет статей.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
