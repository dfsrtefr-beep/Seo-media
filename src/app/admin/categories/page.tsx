import { prisma } from "@/lib/prisma";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Категории</h1>
      <CategoryManager
        categories={categories}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
