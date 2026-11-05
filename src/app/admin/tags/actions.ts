"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Не авторизован");
}

export async function createTag(data: { name: string; slug?: string; description?: string }) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  const exists = await prisma.tag.findUnique({ where: { slug } });
  if (exists) return { ok: false, error: "Такой URL уже существует" };
  await prisma.tag.create({
    data: { name: data.name, slug, description: data.description || null },
  });
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function updateTag(
  id: string,
  data: { name: string; slug?: string; description?: string }
) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  await prisma.tag.update({
    where: { id },
    data: { name: data.name, slug, description: data.description || null },
  });
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteTag(id: string) {
  await requireAuth();
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
  return { ok: true };
}
