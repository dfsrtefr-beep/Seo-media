import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
  author: { name: string; slug: string };
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="card group flex flex-col overflow-hidden p-0">
      {article.coverImageUrl && (
        <Link href={`/articles/${article.slug}`} className="block overflow-hidden">
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || article.title}
            width={640}
            height={360}
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--primary]"
          >
            {article.category.name}
          </Link>
        )}
        <h3 className="mb-2 text-lg font-bold leading-snug">
          <Link href={`/articles/${article.slug}`} className="hover:text-[--primary]">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="mb-4 text-sm text-[--muted] line-clamp-3">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-2 text-xs text-[--muted]">
          <Link href={`/author/${article.author.slug}`} className="hover:text-[--primary]">
            {article.author.name}
          </Link>
          <span>·</span>
          <time dateTime={article.publishedAt?.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
