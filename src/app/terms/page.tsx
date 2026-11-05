import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description: "Пользовательское соглашение seo-media.",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Пользовательское соглашение</h1>
      <div className="prose-article">
        <p>
          Используя сайт seo-media, вы соглашаетесь с условиями настоящего соглашения.
        </p>
        <h2>Использование материалов</h2>
        <p>
          Материалы сайта предназначены для информационных целей. При цитировании
          указывайте источник и ссылку на оригинал.
        </p>
        <h2>Ответственность</h2>
        <p>
          Редакция прилагает усилия для обеспечения достоверности информации, однако
          не несёт ответственности за возможные неточности.
        </p>
        <h2>Связь с нами</h2>
        <p>
          По вопросам соглашения:{" "}
          <a href="mailto:info@seo-media.com">info@seo-media.com</a>
        </p>
      </div>
    </div>
  );
}
