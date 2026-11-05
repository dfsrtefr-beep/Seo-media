import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности seo-media.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Политика конфиденциальности</h1>
      <div className="prose-article">
        <p>
          Настоящая политика описывает, какие данные собираются при использовании
          сайта seo-media и как они обрабатываются.
        </p>
        <h2>Собираемые данные</h2>
        <p>
          Мы можем собирать анонимные данные об использовании сайта (посещения,
          страницы, браузер, устройство) с помощью аналитических сервисов. Эти данные
          не позволяют идентифицировать конкретного пользователя.
        </p>
        <h2>Файлы cookie</h2>
        <p>
          Сайт может использовать файлы cookie для корректной работы и анализа трафика.
        </p>
        <h2>Обратная связь</h2>
        <p>
          По вопросам обработки персональных данных:{" "}
          <a href="mailto:info@seo-media.com">info@seo-media.com</a>
        </p>
      </div>
    </div>
  );
}
