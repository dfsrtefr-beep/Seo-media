import { prisma } from "@/lib/prisma";
import { createRedirect, deleteRedirect } from "./actions";
import { RedirectManager } from "./RedirectManager";

export const dynamic = "force-dynamic";

export default async function AdminRedirects() {
  const redirects = await prisma.redirect.findMany({ orderBy: { fromPath: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Редиректы</h1>
      <RedirectManager
        redirects={redirects}
        onCreate={createRedirect}
        onDelete={deleteRedirect}
      />
    </div>
  );
}
