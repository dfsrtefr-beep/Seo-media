import { prisma } from "@/lib/prisma";
import { saveSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const settings = await prisma.siteSetting.findMany();
  const initial: Record<string, string> = {};
  for (const s of settings) initial[s.key] = s.value;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Настройки</h1>
      <div className="max-w-xl">
        <SettingsForm initial={initial} onSave={saveSettings} />
      </div>
    </div>
  );
}
