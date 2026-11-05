"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  _count: { articles: number };
};

type Action<T> = (input: T) => Promise<{ ok: boolean; error?: string }>;

export function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  categories: Category[];
  onCreate: Action<{
    name: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDesc?: string;
  }>;
  onUpdate: (
    id: string,
    input: {
      name: string;
      slug?: string;
      description?: string;
      metaTitle?: string;
      metaDesc?: string;
    }
  ) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setSlug("");
    setDescription("");
    setMetaTitle("");
    setMetaDesc("");
    setError("");
  }

  function startCreate() {
    reset();
    setEditing(null);
    setCreating(true);
  }

  function startEdit(c: Category) {
    setEditing(c);
    setCreating(false);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setMetaTitle(c.metaTitle || "");
    setMetaDesc(c.metaDesc || "");
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const payload = { name, slug: slug || undefined, description, metaTitle, metaDesc };
    const res = editing
      ? await onUpdate(editing.id, { ...payload })
      : await onCreate(payload);
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Ошибка");
      return;
    }
    reset();
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить категорию?")) return;
    await onDelete(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <button onClick={startCreate} className="btn-primary">
        + Добавить категорию
      </button>

      {(creating || editing) && (
        <div className="card space-y-4">
          <h2 className="font-semibold">
            {editing ? "Редактировать категорию" : "Новая категория"}
          </h2>
          <div>
            <label className="label">Название</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">URL (slug)</label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" />
          </div>
          <div>
            <label className="label">Описание</label>
            <textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">SEO Title</label>
              <input className="input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Meta Description</label>
              <input className="input" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setEditing(null);
                reset();
              }}
              className="btn-outline"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="px-4 py-3 text-left font-medium">Название</th>
              <th className="px-4 py-3 text-left font-medium">URL</th>
              <th className="px-4 py-3 text-left font-medium">Статей</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-[--border] last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 font-mono text-[--muted]">{c.slug}</td>
                <td className="px-4 py-3">{c._count.articles}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(c)} className="text-[--primary] hover:underline">
                      Изменить
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[--muted]">
                  Категорий нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
