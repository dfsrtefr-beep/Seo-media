import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с редакцией seo-media.",
};

export default function ContactPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold">Контакты</h1>
      <div className="prose-article">
        <p>Свяжитесь с редакцией по вопросам сотрудничества, публикаций и обратной связи.</p>
        <ul>
          <li>Email: <a href="mailto:info@seo-media.com">info@seo-media.com</a></li>
        </ul>
      </div>
    </div>
  );
}
