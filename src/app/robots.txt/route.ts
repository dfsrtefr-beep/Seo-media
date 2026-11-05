const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL.replace(/\/$/, "")}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
