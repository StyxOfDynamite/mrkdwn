import { useDocumentStore } from "../../store/documentStore";
import { useSettingsStore } from "../../store/settingsStore";
import { pickAndReadFile, pickSavePath, writeFile } from "../../services/fileService";
import { pickFolder } from "../../services/folderService";
import { addRecentFile } from "../../services/recentFilesService";
import { RecentFilesMenu } from "../file/RecentFilesMenu";

export function Toolbar() {
  const filePath = useDocumentStore((s) => s.filePath);
  const dirty = useDocumentStore((s) => s.dirty);
  const setRootFolderPath = useSettingsStore((s) => s.setRootFolderPath);
  const setRecentFiles = useSettingsStore((s) => s.setRecentFiles);

  async function handleOpen() {
    const result = await pickAndReadFile();
    if (!result) return;
    useDocumentStore.getState().loadFile(result.path, result.contents);
    setRecentFiles(await addRecentFile(result.path));
  }

  async function handleSave() {
    const { markdown, filePath: currentPath } = useDocumentStore.getState();
    const path = currentPath ?? (await pickSavePath());
    if (!path) return;
    await writeFile(path, markdown);
    useDocumentStore.getState().markSaved(path);
    setRecentFiles(await addRecentFile(path));
  }

  async function handleSaveAs() {
    const { markdown } = useDocumentStore.getState();
    const path = await pickSavePath(filePath ?? undefined);
    if (!path) return;
    await writeFile(path, markdown);
    useDocumentStore.getState().markSaved(path);
    setRecentFiles(await addRecentFile(path));
  }

  async function handleOpenFolder() {
    const folder = await pickFolder();
    if (!folder) return;
    setRootFolderPath(folder);
  }

  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={handleOpen} className="rounded px-2 py-1 text-xs hover:bg-white/10">
        Open
      </button>
      <button type="button" onClick={handleSave} className="rounded px-2 py-1 text-xs hover:bg-white/10">
        Save{dirty ? " *" : ""}
      </button>
      <button type="button" onClick={handleSaveAs} className="rounded px-2 py-1 text-xs hover:bg-white/10">
        Save As
      </button>
      <button type="button" onClick={handleOpenFolder} className="rounded px-2 py-1 text-xs hover:bg-white/10">
        Open Folder
      </button>
      <RecentFilesMenu />
    </div>
  );
}
