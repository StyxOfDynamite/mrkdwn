import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { readDir, type DirEntry } from "@tauri-apps/plugin-fs";

export interface FolderEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export async function pickFolder(): Promise<string | null> {
  const path = await openDialog({ directory: true, multiple: false });
  if (!path || Array.isArray(path)) return null;
  return path;
}

export async function listFolder(path: string): Promise<FolderEntry[]> {
  const entries: DirEntry[] = await readDir(path);
  return entries
    .map((entry) => ({
      name: entry.name ?? "",
      path: `${path}/${entry.name}`,
      isDirectory: entry.isDirectory,
    }))
    .sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}
