import { load, type Store } from "@tauri-apps/plugin-store";
import type { ThemeMode } from "../store/settingsStore";

const STORE_FILE = "settings.json";

interface PersistedSettings {
  theme: ThemeMode;
  rootFolderPath: string | null;
}

let storePromise: Promise<Store> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_FILE, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function loadSettings(): Promise<Partial<PersistedSettings>> {
  const store = await getStore();
  return {
    theme: await store.get<ThemeMode>("theme"),
    rootFolderPath: await store.get<string>("rootFolderPath"),
  };
}

export async function saveSetting<K extends keyof PersistedSettings>(
  key: K,
  value: PersistedSettings[K],
): Promise<void> {
  const store = await getStore();
  await store.set(key, value);
}
