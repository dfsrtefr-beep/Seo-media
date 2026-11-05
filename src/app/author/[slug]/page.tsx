import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { personSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

async function getAuthor(slug: string) {
  return prisma.user.findUnique({
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
  const author = await getAuthor(params.slug);
  if (!author) return {};
  return {
    title: author.name,
    description: author.bio || `Статьи автора ${author.name}`,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = await getAuthor(params.slug);
  if (!author) notFound();

  return (
    <>
      <JsonLd data={personSchema(author)} />
      <div className="container-page py-12">
        <div className="mb-10 flex items-start gap-6">
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={96}
              height={96}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[--accent] text-3xl font-semibold">
              {author.name.charAt(0)}
            </span>
          )}
          <div>
            <h1 className="text-3xl font-bold">{author.name}</h1>
            {author.jobTitle && (
              <p className="text-[--primary]">{author.jobTitle}</p>
            )}
            {author.bio && (
              <p className="mt-3 max-w-2xl text-[--muted]">{author.bio}</p>
            )}
            <div className="mt-3 flex gap-3 text-sm">
              {author.website && (
                <a href={author.website} className="text-[--primary] hover:underline" rel="noopener noreferrer" target="_blank">
                  Сайт
                </a>
              )}
              {author.twitter && (
                <a href={author.twitter} className="text-[--primary] hover:underline" rel="noopener noreferrer" target="_blank">
                  Twitter/X
                </a>
              )}
              {author.linkedin && (
                <a href={author.linkedin} className="text-[--primary] hover:underline" rel="noopener noreferrer" target="_blank">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold">Статьи автора</h2>
        {author.articles.length === 0 ? (
          <div className="card py-16 text-center text-[--muted]">
            У автора пока нет опубликованных статей.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {author.articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
