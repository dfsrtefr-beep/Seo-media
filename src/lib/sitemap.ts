import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function generateSitemapXml(): Promise<string> {
  const base = SITE_URL.replace(/\/$/, "");

  const [articles, categories, tags, authors] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.tag.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.user.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticUrls = [
    { loc: `${base}/`, priority: "1.0", lastmod: new Date().toISOString() },
    { loc: `${base}/articles`, priority: "0.9" },
    { loc: `${base}/about`, priority: "0.5" },
    { loc: `${base}/contact`, priority: "0.5" },
  ];

  const urlset = [
    ...staticUrls.map((u) => urlEntry(u.loc, u.priority, u.lastmod)),
    ...articles.map((a) =>
      urlEntry(`${base}/articles/${a.slug}`, "0.8", a.updatedAt.toISOString())
    ),
    ...categories.map((c) =>
      urlEntry(`${base}/category/${c.slug}`, "0.7", c.updatedAt.toISOString())
    ),
    ...tags.map((t) =>
      urlEntry(`${base}/tag/${t.slug}`, "0.5", t.updatedAt.toISOString())
    ),
    ...authors.map((a) =>
      urlEntry(`${base}/author/${a.slug}`, "0.5", a.updatedAt.toISOString())
    ),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;
}

function urlEntry(loc: string, priority: string, lastmod?: string): string {
  const lastmodXml = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>\n    <loc>${loc}</loc>${lastmodXml}\n    <priority>${priority}</priority>\n  </url>`;
}
