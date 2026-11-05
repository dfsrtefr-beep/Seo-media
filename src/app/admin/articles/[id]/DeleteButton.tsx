"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await action(id);
    router.push("/admin/articles");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn-outline text-red-600"
      >
        Удалить
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[--muted]">Точно удалить?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="btn bg-red-600 text-white hover:bg-red-700"
      >
        {loading ? "Удаление..." : "Да"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="btn-outline"
      >
        Нет
      </button>
    </div>
  );
}
