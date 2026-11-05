import { prisma } from "@/lib/prisma";

export async function publishDueArticles() {
  const now = new Date();
  const result = await prisma.article.updateMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: now },
    },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
      scheduledAt: null,
    },
  });
  return result.count;
}
