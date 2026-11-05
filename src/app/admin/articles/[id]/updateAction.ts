"use server";

import { updateArticle } from "../actions";
import type { ArticleInput } from "@/lib/validators";

export async function updateArticleAction(id: string, input: ArticleInput) {
  return updateArticle(id, input);
}
