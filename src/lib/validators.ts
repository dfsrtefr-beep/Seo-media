import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(300),
  slug: z
    .string()
    .min(1, "URL обязателен")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "URL должен содержать только латиницу, цифры и дефисы"),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(1, "Содержимое обязательно"),
  coverImageUrl: z.string().url("Некорректный URL").optional().nullable().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional().nullable(),

  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]),
  scheduledAt: z.string().optional().nullable(),

  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(300).optional().nullable(),
  focusKeyword: z.string().max(200).optional().nullable(),
  secondaryKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional().nullable().or(z.literal("")),
  ogTitle: z.string().max(200).optional().nullable(),
  ogDescription: z.string().max(300).optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  noindex: z.boolean().optional(),

  authorId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  relatedIds: z.array(z.string()).optional(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
