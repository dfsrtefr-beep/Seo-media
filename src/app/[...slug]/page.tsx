import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CatchAllRedirect({
  params,
}: {
  params: { slug: string[] };
}) {
  const path = `/${params.slug.join("/")}`;
  const r = await prisma.redirect.findUnique({ where: { fromPath: path } });
  if (r) {
    redirect(r.toPath);
  }
  notFound();
}
