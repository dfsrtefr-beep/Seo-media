"use server";

import { createArticle } from "../actions";
import type { ArticleInput } from "@/lib/validators";

export async function createArticleAction(input: ArticleInput) {
  return createArticle(input);
}
