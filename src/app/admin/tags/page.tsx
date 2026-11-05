import { prisma } from "@/lib/prisma";
import { createTag, updateTag, deleteTag } from "./actions";
import { TagManager } from "./TagManager";

export const dynamic = "force-dynamic";

export default async function AdminTags() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Теги</h1>
      <TagManager
        tags={tags}
        onCreate={createTag}
        onUpdate={updateTag}
        onDelete={deleteTag}
      />
    </div>
  );
}
