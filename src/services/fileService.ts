import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const MARKDOWN_FILTER = [{ name: "Markdown", extensions: ["md", "markdown"] }];

export async function pickAndReadFile(): Promise<{ path: string; contents: string } | null> {
  const path = await open({ multiple: false, filters: MARKDOWN_FILTER });
  if (!path || Array.isArray(path)) return null;
  const contents = await readTextFile(path);
  return { path, contents };
}

export async function readFile(path: string): Promise<string> {
  return readTextFile(path);
}

export async function writeFile(path: string, contents: string): Promise<void> {
  await writeTextFile(path, contents);
}

export async function pickSavePath(defaultPath?: string): Promise<string | null> {
  return save({ filters: MARKDOWN_FILTER, defaultPath });
}

export async function pickCssFile(): Promise<string | null> {
  const path = await open({ multiple: false, filters: [{ name: "CSS", extensions: ["css"] }] });
  if (!path || Array.isArray(path)) return null;
  return path;
}

export async function pickHtmlSavePath(defaultPath?: string): Promise<string | null> {
  return save({ filters: [{ name: "HTML", extensions: ["html"] }], defaultPath });
}
