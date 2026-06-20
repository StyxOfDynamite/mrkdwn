import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { useDocumentStore } from "../../store/documentStore";
import { getRecentFiles, addRecentFile } from "../../services/recentFilesService";
import { readFile } from "../../services/fileService";

export function RecentFilesMenu() {
  const [open, setOpen] = useState(false);
  const recentFiles = useSettingsStore((s) => s.recentFiles);
  const setRecentFiles = useSettingsStore((s) => s.setRecentFiles);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRecentFiles().then(setRecentFiles);
  }, [setRecentFiles]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleOpenRecent(path: string) {
    const contents = await readFile(path);
    useDocumentStore.getState().loadFile(path, contents);
    setRecentFiles(await addRecentFile(path));
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded px-2 py-1 text-xs hover:bg-white/10"
      >
        Recent
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-64 rounded border border-app-border bg-app-bg py-1 text-app-fg shadow-lg">
          {recentFiles.length === 0 ? (
            <div className="px-3 py-2 text-xs text-app-fg/60">No recent files</div>
          ) : (
            recentFiles.map((file) => (
              <button
                key={file.path}
                type="button"
                onClick={() => handleOpenRecent(file.path)}
                className="block w-full truncate px-3 py-1.5 text-left text-xs hover:bg-app-accent/10"
                title={file.path}
              >
                {file.path.split("/").pop()}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
