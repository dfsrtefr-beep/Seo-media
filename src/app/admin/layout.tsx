import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Providers } from "@/components/Providers";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </Providers>
  );
}
