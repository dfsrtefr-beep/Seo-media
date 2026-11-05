import { publishDueArticles } from "@/lib/publishDue";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await publishDueArticles();
  return Response.json({ published: count });
}
