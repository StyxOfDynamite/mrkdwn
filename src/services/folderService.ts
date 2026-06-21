import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { readDir, type DirEntry } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

export interface FolderEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

// See the matching comment in fileService.ts: the dialog plugin's scope auto-extension doesn't
// persist across restarts, but `rootFolderPath` does (it's saved in settings), so re-opening the
// app with a folder already selected needs this granted again before listing it.
async function ensureFolderAccess(path: string): Promise<void> {
  await invoke("allow_folder_access", { path });
}

export async function pickFolder(): Promise<string | null> {
  const path = await openDialog({ directory: true, multiple: false });
  if (!path || Array.isArray(path)) return null;
  await ensureFolderAccess(path);
  return path;
}

export async function listFolder(path: string): Promise<FolderEntry[]> {
  await ensureFolderAccess(path);
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
