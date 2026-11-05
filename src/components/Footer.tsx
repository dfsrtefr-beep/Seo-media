import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-[--border]">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 text-lg font-bold">seo-media</div>
            <p className="text-sm text-[--muted]">
              Информационный портал с экспертами статьями, новостями и аналитикой.
            </p>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Разделы</div>
            <ul className="space-y-2 text-sm text-[--muted]">
              <li><Link href="/articles" className="hover:text-[--primary]">Все статьи</Link></li>
              <li><Link href="/about" className="hover:text-[--primary]">О проекте</Link></li>
              <li><Link href="/contact" className="hover:text-[--primary]">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">Правовая информация</div>
            <ul className="space-y-2 text-sm text-[--muted]">
              <li><Link href="/privacy" className="hover:text-[--primary]">Политика конфиденциальности</Link></li>
              <li><Link href="/terms" className="hover:text-[--primary]">Пользовательское соглашение</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[--border] pt-6 text-center text-xs text-[--muted]">
          © {year} seo-media. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
