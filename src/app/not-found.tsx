import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-[--primary]">404</h1>
      <p className="mt-4 text-xl font-medium">Страница не найдена</p>
      <p className="mt-2 text-[--muted]">
        Возможно, страница была удалена или перемещена.
      </p>
      <Link href="/" className="btn-primary mt-8">
        На главную
      </Link>
    </div>
  );
}
