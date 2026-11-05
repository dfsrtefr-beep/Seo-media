"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Не авторизован");
}

export async function createRedirect(data: { fromPath: string; toPath: string; statusCode: number }) {
  await requireAuth();
  const fromPath = data.fromPath.startsWith("/") ? data.fromPath : `/${data.fromPath}`;
  const exists = await prisma.redirect.findUnique({ where: { fromPath } });
  if (exists) return { ok: false, error: "Такой путь уже есть" };
  await prisma.redirect.create({
    data: { fromPath, toPath: data.toPath, statusCode: data.statusCode || 301 },
  });
  revalidatePath("/admin/redirects");
  return { ok: true };
}

export async function deleteRedirect(id: string) {
  await requireAuth();
  await prisma.redirect.delete({ where: { id } });
  revalidatePath("/admin/redirects");
  return { ok: true };
}
