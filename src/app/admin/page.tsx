import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [articleCount, publishedCount, draftCount, categoryCount, tagCount, recentArticles] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.article.findMany({
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { author: true },
      }),
    ]);

  const stats = [
    { label: "Всего статей", value: articleCount },
    { label: "Опубликовано", value: publishedCount },
    { label: "Черновики", value: draftCount },
    { label: "Категории", value: categoryCount },
    { label: "Теги", value: tagCount },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <Link href="/admin/articles/new" className="btn-primary">
          + Новая статья
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-[--muted]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Недавние статьи</h2>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="px-4 py-3 text-left font-medium">Заголовок</th>
              <th className="px-4 py-3 text-left font-medium">Статус</th>
              <th className="px-4 py-3 text-left font-medium">Автор</th>
              <th className="px-4 py-3 text-left font-medium">Обновлено</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((a) => (
              <tr key={a.id} className="border-b border-[--border] last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="hover:text-[--primary]">
                    {a.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      a.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : a.status === "DRAFT"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">{a.author.name}</td>
                <td className="px-4 py-3 text-[--muted]">
                  {formatDateTime(a.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
