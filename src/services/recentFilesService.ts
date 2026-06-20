import { load, type Store } from "@tauri-apps/plugin-store";
import type { RecentFile } from "../store/settingsStore";

const STORE_FILE = "recent-files.json";
const MAX_ENTRIES = 15;

let storePromise: Promise<Store> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_FILE, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function getRecentFiles(): Promise<RecentFile[]> {
  const store = await getStore();
  return (await store.get<RecentFile[]>("files")) ?? [];
}

export async function addRecentFile(path: string): Promise<RecentFile[]> {
  const store = await getStore();
  const existing = (await store.get<RecentFile[]>("files")) ?? [];
  const next = [
    { path, lastOpened: Date.now() },
    ...existing.filter((f) => f.path !== path),
  ].slice(0, MAX_ENTRIES);
  await store.set("files", next);
  return next;
}
