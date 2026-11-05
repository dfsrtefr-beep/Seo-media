import { prisma } from "@/lib/prisma";
import { createAuthor, updateAuthor, deleteAuthor } from "./actions";
import { AuthorManager } from "./AuthorManager";

export const dynamic = "force-dynamic";

export default async function AdminAuthors() {
  const authors = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Авторы</h1>
      <AuthorManager
        authors={authors}
        onCreate={createAuthor}
        onUpdate={updateAuthor}
        onDelete={deleteAuthor}
      />
    </div>
  );
}
