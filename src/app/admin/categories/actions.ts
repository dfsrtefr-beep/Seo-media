"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Не авторизован");
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  metaTitle?: string;
  metaDesc?: string;
}) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { ok: false, error: "Такой URL уже существует" };

  await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDesc?: string;
  }
) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAuth();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { ok: true };
}
