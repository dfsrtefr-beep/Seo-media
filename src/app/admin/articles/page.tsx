import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Статьи</h1>
        <Link href="/admin/articles/new" className="btn-primary">
          + Новая статья
        </Link>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="px-4 py-3 text-left font-medium">Заголовок</th>
              <th className="px-4 py-3 text-left font-medium">Категория</th>
              <th className="px-4 py-3 text-left font-medium">Статус</th>
              <th className="px-4 py-3 text-left font-medium">Обновлено</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-[--border] last:border-0">
                <td className="px-4 py-3">{a.title}</td>
                <td className="px-4 py-3 text-[--muted]">
                  {a.category?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      a.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : a.status === "DRAFT"
                          ? "bg-gray-100 text-gray-700"
                          : a.status === "SCHEDULED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[--muted]">
                  {formatDateTime(a.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="text-[--primary] hover:underline"
                    >
                      Изменить
                    </Link>
                    {a.status === "PUBLISHED" && (
                      <Link
                        href={`/articles/${a.slug}`}
                        className="text-[--muted] hover:underline"
                        target="_blank"
                      >
                        Просмотр
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[--muted]">
                  Статей пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
