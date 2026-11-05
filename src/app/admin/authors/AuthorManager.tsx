"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Author = {
  id: string;
  name: string;
  email: string;
  slug: string;
  bio: string | null;
  jobTitle: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  role: string;
};

type Action<T> = (input: T) => Promise<{ ok: boolean; error?: string }>;

export function AuthorManager({
  authors,
  onCreate,
  onUpdate,
  onDelete,
}: {
  authors: Author[];
  onCreate: Action<{
    name: string;
    email: string;
    password?: string;
    slug?: string;
    bio?: string;
    jobTitle?: string;
    role?: string;
  }>;
  onUpdate: (
    id: string,
    input: {
      name: string;
      email: string;
      slug?: string;
      bio?: string;
      jobTitle?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      role?: string;
    }
  ) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Author | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    slug: "",
    bio: "",
    jobTitle: "",
    website: "",
    twitter: "",
    linkedin: "",
    role: "AUTHOR",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function reset() {
    setForm({
      name: "",
      email: "",
      password: "",
      slug: "",
      bio: "",
      jobTitle: "",
      website: "",
      twitter: "",
      linkedin: "",
      role: "AUTHOR",
    });
    setError("");
  }

  function startCreate() {
    reset();
    setEditing(null);
    setCreating(true);
  }

  function startEdit(a: Author) {
    setEditing(a);
    setCreating(false);
    setForm({
      name: a.name,
      email: a.email,
      password: "",
      slug: a.slug,
      bio: a.bio || "",
      jobTitle: a.jobTitle || "",
      website: a.website || "",
      twitter: a.twitter || "",
      linkedin: a.linkedin || "",
      role: a.role,
    });
  }

  async function handleSave() {
    setSaving(true);
    const res = editing
      ? await onUpdate(editing.id, { ...form, slug: form.slug || undefined })
      : await onCreate({ ...form, slug: form.slug || undefined });
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
    if (!confirm("Удалить автора?")) return;
    await onDelete(id);
    router.refresh();
  }

  const inputCls = "input";
  const labelCls = "label";

  return (
    <div className="space-y-6">
      <button onClick={startCreate} className="btn-primary">
        + Добавить автора
      </button>

      {(creating || editing) && (
        <div className="card space-y-4">
          <h2 className="font-semibold">{editing ? "Редактировать автора" : "Новый автор"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Имя</label>
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          {!editing && (
            <div>
              <label className={labelCls}>Пароль (по умолчанию changeme123)</label>
              <input className={inputCls} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>URL (slug)</label>
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto" />
            </div>
            <div>
              <label className={labelCls}>Роль</label>
              <select className={inputCls} value={form.role} onChange={(e) => set("role", e.target.value)}>
                <option value="AUTHOR">Автор</option>
                <option value="EDITOR">Редактор</option>
                <option value="ADMIN">Администратор</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Должность</label>
            <input className={inputCls} value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Биография</label>
            <textarea className={inputCls} rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Сайт</label>
              <input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Twitter/X</label>
              <input className={inputCls} value={form.twitter} onChange={(e) => set("twitter", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>LinkedIn</label>
              <input className={inputCls} value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={() => { setCreating(false); setEditing(null); reset(); }} className="btn-outline">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="px-4 py-3 text-left font-medium">Имя</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Роль</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id} className="border-b border-[--border] last:border-0">
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3 text-[--muted]">{a.email}</td>
                <td className="px-4 py-3">{a.role}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(a)} className="text-[--primary] hover:underline">
                      Изменить
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
