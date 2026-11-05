import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}
