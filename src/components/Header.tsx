import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[--border] bg-[--background]/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[--primary] text-[--primary-foreground]">
            SM
          </span>
          seo-media
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/articles" className="hover:text-[--primary]">
            Статьи
          </Link>
          <Link href="/about" className="hover:text-[--primary]">
            О проекте
          </Link>
          <Link href="/contact" className="hover:text-[--primary]">
            Контакты
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/search" className="text-sm text-[--muted] hover:text-[--primary]">
            Поиск
          </Link>
        </div>
      </div>
    </header>
  );
}
