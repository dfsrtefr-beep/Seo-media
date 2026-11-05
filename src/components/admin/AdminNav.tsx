"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/articles", label: "Статьи" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/tags", label: "Теги" },
  { href: "/admin/authors", label: "Авторы" },
  { href: "/admin/redirects", label: "Редиректы" },
  { href: "/admin/settings", label: "Настройки" },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-[--border] bg-[--accent]">
      <div className="border-b border-[--border] p-4">
        <Link href="/admin" className="text-lg font-bold">
          seo-media
        </Link>
        <p className="text-xs text-[--muted]">Админ-панель</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-[--primary] text-[--primary-foreground]"
                  : "hover:bg-[--border]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[--border] p-4">
        <div className="mb-2 text-sm font-medium">{session?.user?.name}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-[--muted] hover:text-red-500"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
