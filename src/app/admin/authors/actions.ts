"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Не авторизован");
}

export async function createAuthor(data: {
  name: string;
  email: string;
  password?: string;
  slug?: string;
  bio?: string;
  jobTitle?: string;
  role?: string;
}) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  const email = data.email.toLowerCase().trim();

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return { ok: false, error: "Email уже используется" };

  const passwordHash = await bcrypt.hash(data.password || "changeme123", 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email,
      slug,
      passwordHash,
      bio: data.bio || null,
      jobTitle: data.jobTitle || null,
      role: (data.role as UserRole) || "AUTHOR",
    },
  });
  revalidatePath("/admin/authors");
  return { ok: true };
}

export async function updateAuthor(
  id: string,
  data: {
    name: string;
    email: string;
    slug?: string;
    bio?: string;
    jobTitle?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    role?: string;
  }
) {
  await requireAuth();
  const slug = data.slug || slugify(data.name);
  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      slug,
      bio: data.bio || null,
      jobTitle: data.jobTitle || null,
      website: data.website || null,
      twitter: data.twitter || null,
      linkedin: data.linkedin || null,
      role: (data.role as UserRole) || "AUTHOR",
    },
  });
  revalidatePath("/admin/authors");
  return { ok: true };
}

export async function deleteAuthor(id: string) {
  await requireAuth();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/authors");
  return { ok: true };
}
