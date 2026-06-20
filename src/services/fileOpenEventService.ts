import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { readFile } from "./fileService";
import { useDocumentStore } from "../store/documentStore";
import { addRecentFile } from "./recentFilesService";

async function openPath(path: string) {
  const contents = await readFile(path);
  useDocumentStore.getState().loadFile(path, contents);
  await addRecentFile(path);
}

export function registerFileOpenListener(): () => void {
  // Pull-based: covers the cold-start case where the OS asked us to open a file (macOS
  // RunEvent::Opened, or argv on Windows/Linux) before this listener could be registered.
  invoke<string | null>("take_initial_file_path").then((path) => {
    if (path) openPath(path);
  });

  // Push-based: covers later opens while already running (single-instance re-launch, or a
  // second RunEvent::Opened), where the listener is already registered by the time it fires.
  const unlistenPromise = listen<string>("open-file-path", (event) => {
    openPath(event.payload);
  });

  return () => {
    unlistenPromise.then((unlisten) => unlisten());
  };
}
