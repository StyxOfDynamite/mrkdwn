import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

const MARKDOWN_FILTER = [{ name: "Markdown", extensions: ["md", "markdown"] }];

// The dialog plugin's fs-scope auto-extension only covers paths picked through Open/Save
// *this session* and isn't persisted — so paths from Recent Files, the folder tree, or an OS
// file-association open (all from outside the current dialog flow, possibly a previous app
// session) need this granted explicitly before every read/write. Cheap no-op if already granted.
async function ensureFileAccess(path: string): Promise<void> {
  await invoke("allow_file_access", { path });
}

export async function pickAndReadFile(): Promise<{ path: string; contents: string } | null> {
  const path = await open({ multiple: false, filters: MARKDOWN_FILTER });
  if (!path || Array.isArray(path)) return null;
  const contents = await readFile(path);
  return { path, contents };
}

export async function readFile(path: string): Promise<string> {
  await ensureFileAccess(path);
  return readTextFile(path);
}

export async function writeFile(path: string, contents: string): Promise<void> {
  await ensureFileAccess(path);
  await writeTextFile(path, contents);
}

export async function pickSavePath(defaultPath?: string): Promise<string | null> {
  return save({ filters: MARKDOWN_FILTER, defaultPath });
}
