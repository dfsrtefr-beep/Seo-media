"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/lib/utils";

type SelectOption = { id: string; name: string };

export type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  status: string;
  scheduledAt: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  noindex: boolean;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  relatedIds: string[];
};

type Props = {
  initial?: ArticleFormData;
  authors: SelectOption[];
  categories: SelectOption[];
  tags: SelectOption[];
  articles: SelectOption[];
  onSave: (data: ArticleFormData) => Promise<{ ok: boolean; error?: string; id?: string }>;
  isEdit?: boolean;
};

const emptyForm: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  status: "DRAFT",
  scheduledAt: "",
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  secondaryKeywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  noindex: false,
  authorId: "",
  categoryId: "",
  tagIds: [],
  relatedIds: [],
};

export function ArticleForm({
  initial,
  authors,
  categories,
  tags,
  articles,
  onSave,
  isEdit,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>(initial || emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!isEdit && (!form.slug || form.slug === slugify(form.title))) {
      set("slug", slugify(title));
    }
  }

  function toggleArray(key: "tagIds" | "relatedIds", id: string) {
    setForm((f) => {
      const arr = f[key];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...f, [key]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: ArticleFormData = {
      ...form,
    };

    const res = await onSave(payload);
    setSaving(false);

    if (!res.ok) {
      setError(res.error || "Ошибка сохранения");
      return;
    }
    router.push("/admin/articles");
    router.refresh();
  }

  // SEO analysis
  const seoTitleLen = form.seoTitle.length;
  const seoDescLen = form.seoDescription.length;
  const keyword = form.focusKeyword.toLowerCase();
  const contentLower = form.content.toLowerCase();
  const keywordInH1 = keyword ? contentLower.includes(keyword) : false;
  const firstParagraph = contentLower.split("\n\n")[0] || "";
  const keywordInFirstParagraph = keyword ? firstParagraph.includes(keyword) : false;

  const checklist = [
    {
      label: "SEO Title заполнен (50–60 символов)",
      ok: seoTitleLen >= 30 && seoTitleLen <= 60,
      detail: `${seoTitleLen} символов`,
    },
    {
      label: "Meta Description (120–160 символов)",
      ok: seoDescLen >= 70 && seoDescLen <= 160,
      detail: `${seoDescLen} символов`,
    },
    { label: "Основной ключевой запрос указан", ok: !!form.focusKeyword },
    { label: "Ключ в первом абзаце", ok: keywordInFirstParagraph },
    { label: "Ключ встречается в тексте", ok: keywordInH1 },
    { label: "Изображение имеет Alt-текст", ok: !form.coverImageUrl || !!form.coverImageAlt },
    { label: "Категория выбрана", ok: !!form.categoryId },
  ];

  const passed = checklist.filter((c) => c.ok).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Основное</h2>
        <div>
          <label className="label">Заголовок *</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">URL (slug) *</label>
          <input
            className="input font-mono"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="label">Краткое описание (excerpt)</label>
          <textarea
            className="input"
            rows={2}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Содержимое (Markdown) *</label>
          <textarea
            className="input font-mono"
            rows={16}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">URL обложки</label>
            <input
              className="input"
              value={form.coverImageUrl}
              onChange={(e) => set("coverImageUrl", e.target.value)}
              placeholder="/images/cover.jpg"
            />
          </div>
          <div>
            <label className="label">Alt-текст обложки</label>
            <input
              className="input"
              value={form.coverImageAlt}
              onChange={(e) => set("coverImageAlt", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Publication */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Публикация</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Статус</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликовать</option>
              <option value="SCHEDULED">Запланировать</option>
              <option value="ARCHIVED">Архив</option>
            </select>
          </div>
          {form.status === "SCHEDULED" && (
            <div>
              <label className="label">Дата публикации</label>
              <input
                type="datetime-local"
                className="input"
                value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="label">Автор</label>
            <select
              className="input"
              value={form.authorId}
              onChange={(e) => set("authorId", e.target.value)}
              required
            >
              <option value="">Выберите автора</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Категория</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">Без категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Теги</label>
            <div className="flex flex-wrap gap-2 rounded-md border border-[--border] p-3">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.tagIds.includes(t.id)}
                    onChange={() => toggleArray("tagIds", t.id)}
                  />
                  {t.name}
                </label>
              ))}
              {tags.length === 0 && (
                <span className="text-sm text-[--muted]">Нет тегов</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="label">Похожие статьи</label>
          <div className="flex flex-wrap gap-2 rounded-md border border-[--border] p-3">
            {articles.map((a) => (
              <label key={a.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.relatedIds.includes(a.id)}
                  onChange={() => toggleArray("relatedIds", a.id)}
                />
                {a.name}
              </label>
            ))}
            {articles.length === 0 && (
              <span className="text-sm text-[--muted]">Нет других статей</span>
            )}
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">SEO</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              passed === checklist.length
                ? "bg-green-100 text-green-700"
                : passed >= Math.ceil(checklist.length / 2)
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {passed}/{checklist.length} пунктов
          </span>
        </div>

        <div className="space-y-2 rounded-md border border-[--border] p-3">
          {checklist.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              <span className={c.ok ? "text-green-600" : "text-red-500"}>
                {c.ok ? "✓" : "✗"}
              </span>
              <span>{c.label}</span>
              {c.detail && (
                <span className="ml-auto text-xs text-[--muted]">{c.detail}</span>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="label">
            SEO Title{" "}
            <span className={seoTitleLen > 60 ? "text-red-500" : "text-[--muted]"}>
              ({seoTitleLen}/60)
            </span>
          </label>
          <input
            className="input"
            value={form.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
            placeholder="Заголовок для поисковой выдачи"
          />
        </div>
        <div>
          <label className="label">
            Meta Description{" "}
            <span className={seoDescLen > 160 ? "text-red-500" : "text-[--muted]"}>
              ({seoDescLen}/160)
            </span>
          </label>
          <textarea
            className="input"
            rows={2}
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
            placeholder="Описание для поисковой выдачи"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Основной ключевой запрос</label>
            <input
              className="input"
              value={form.focusKeyword}
              onChange={(e) => set("focusKeyword", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Дополнительные ключи (через запятую)</label>
            <input
              className="input"
              value={form.secondaryKeywords}
              onChange={(e) => set("secondaryKeywords", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Canonical URL (необязательно)</label>
          <input
            className="input"
            value={form.canonicalUrl}
            onChange={(e) => set("canonicalUrl", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">OG Title</label>
            <input
              className="input"
              value={form.ogTitle}
              onChange={(e) => set("ogTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="label">OG Description</label>
            <input
              className="input"
              value={form.ogDescription}
              onChange={(e) => set("ogDescription", e.target.value)}
            />
          </div>
          <div>
            <label className="label">OG Image URL</label>
            <input
              className="input"
              value={form.ogImageUrl}
              onChange={(e) => set("ogImageUrl", e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.noindex}
            onChange={(e) => set("noindex", e.target.checked)}
          />
          Noindex (запретить индексацию)
        </label>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="btn-outline"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
