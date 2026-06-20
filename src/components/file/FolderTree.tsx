import { useEffect, useState } from "react";
import { listFolder, type FolderEntry } from "../../services/folderService";
import { readFile } from "../../services/fileService";
import { useDocumentStore } from "../../store/documentStore";
import { useSettingsStore } from "../../store/settingsStore";
import { addRecentFile } from "../../services/recentFilesService";

interface TreeNodeProps {
  entry: FolderEntry;
}

function TreeNode({ entry }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<FolderEntry[] | null>(null);

  async function toggle() {
    if (!entry.isDirectory) {
      const contents = await readFile(entry.path);
      useDocumentStore.getState().loadFile(entry.path, contents);
      await addRecentFile(entry.path);
      return;
    }
    if (!expanded && children === null) {
      setChildren(await listFolder(entry.path));
    }
    setExpanded((v) => !v);
  }

  const isMarkdown = /\.(md|markdown)$/i.test(entry.name);
  if (!entry.isDirectory && !isMarkdown) return null;

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="block w-full truncate rounded px-2 py-0.5 text-left text-xs hover:bg-app-accent/10"
      >
        {entry.isDirectory ? (expanded ? "▾ " : "▸ ") : "  "}
        {entry.name}
      </button>
      {expanded && children && (
        <div className="ml-3">
          {children.map((child) => (
            <TreeNode key={child.path} entry={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree() {
  const rootFolderPath = useSettingsStore((s) => s.rootFolderPath);
  const [entries, setEntries] = useState<FolderEntry[]>([]);

  useEffect(() => {
    if (!rootFolderPath) {
      setEntries([]);
      return;
    }
    listFolder(rootFolderPath).then(setEntries);
  }, [rootFolderPath]);

  if (!rootFolderPath) return null;

  return (
    <div className="h-full overflow-y-auto border-r border-app-border bg-app-bg p-2">
      {entries.map((entry) => (
        <TreeNode key={entry.path} entry={entry} />
      ))}
    </div>
  );
}
