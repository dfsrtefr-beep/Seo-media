"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const fields = [
  { key: "siteName", label: "Название сайта", placeholder: "seo-media" },
  { key: "siteDescription", label: "Описание сайта", placeholder: "Информационный портал" },
  { key: "contactEmail", label: "Контактный email", placeholder: "info@seo-media.com" },
  { key: "organizationName", label: "Название организации", placeholder: "seo-media" },
];

export function SettingsForm({
  initial,
  onSave,
}: {
  initial: Record<string, string>;
  onSave: (settings: Record<string, string>) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold">Основные настройки</h2>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input
              className="input"
              value={form[f.key] || ""}
              placeholder={f.placeholder}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          {saved && <span className="text-sm text-green-600">Сохранено</span>}
        </div>
      </div>

      <div className="card space-y-2 text-sm text-[--muted]">
        <h3 className="font-semibold text-[--foreground]">Google-интеграции</h3>
        <p>
          Для подключения Google Analytics 4 и Google Tag Manager задайте переменные
          окружения в файле <code>.env</code>:
        </p>
        <pre className="rounded bg-gray-100 p-3 dark:bg-gray-800">
{`NEXT_PUBLIC_GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_CONTAINER_ID="GTM-XXXXXXX"`}
        </pre>
        <p>
          Для Google Search Console добавьте свойство сайта вручную через консоль и
          подтвердите владение доменом.
        </p>
      </div>
    </div>
  );
}
