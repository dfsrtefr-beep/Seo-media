"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Redirect = { id: string; fromPath: string; toPath: string; statusCode: number };

export function RedirectManager({
  redirects,
  onCreate,
  onDelete,
}: {
  redirects: Redirect[];
  onCreate: (data: { fromPath: string; toPath: string; statusCode: number }) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState(301);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await onCreate({ fromPath, toPath, statusCode });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Ошибка");
      return;
    }
    setFromPath("");
    setToPath("");
    setError("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить редирект?")) return;
    await onDelete(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold">Добавить редирект (301)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Откуда (путь)</label>
            <input className="input" value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/old-url" />
          </div>
          <div>
            <label className="label">Куда (путь)</label>
            <input className="input" value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-url" />
          </div>
          <div>
            <label className="label">Код</label>
            <select className="input" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))}>
              <option value={301}>301 (постоянный)</option>
              <option value={302}>302 (временный)</option>
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Добавление..." : "Добавить"}
        </button>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="px-4 py-3 text-left font-medium">Откуда</th>
              <th className="px-4 py-3 text-left font-medium">Куда</th>
              <th className="px-4 py-3 text-left font-medium">Код</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-b border-[--border] last:border-0">
                <td className="px-4 py-3 font-mono">{r.fromPath}</td>
                <td className="px-4 py-3 font-mono text-[--muted]">{r.toPath}</td>
                <td className="px-4 py-3">{r.statusCode}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[--muted]">
                  Редиректов нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
