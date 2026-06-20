import { useState } from "react";
import { SourceEditor } from "../editor/SourceEditor";
import { WysiwygEditor } from "../editor/WysiwygEditor";
import { PreviewPane } from "../preview/PreviewPane";
import { FolderTree } from "../file/FolderTree";
import { ModeToggle } from "./ModeToggle";
import { Toolbar } from "./Toolbar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { CustomCssPicker } from "../theme/CustomCssPicker";
import { ExportMenu } from "../export/ExportMenu";
import { PrintableDocument } from "../export/PrintableDocument";
import { useDocumentStore } from "../../store/documentStore";

export function AppShell() {
  const mode = useDocumentStore((s) => s.mode);
  const [scrollFraction, setScrollFraction] = useState(0);

  return (
    <div className="flex h-full flex-col">
      <header className="no-print flex h-10 shrink-0 items-center justify-between border-b border-app-border bg-app-accent px-4 text-sm font-medium text-white">
        <div className="flex items-center gap-4">
          <span>mrkdwn</span>
          <Toolbar />
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu />
          <CustomCssPicker />
          <ThemeToggle />
          <ModeToggle />
        </div>
      </header>
      <main className="no-print flex flex-1 overflow-hidden">
        <FolderTree />
        {mode === "split" ? (
          <div key="split" className="flex flex-1">
            <div className="w-1/2 border-r border-app-border">
              <SourceEditor onScroll={setScrollFraction} />
            </div>
            <div className="w-1/2">
              <PreviewPane scrollFraction={scrollFraction} />
            </div>
          </div>
        ) : (
          <div key="wysiwyg" className="flex-1">
            <WysiwygEditor />
          </div>
        )}
      </main>
      <PrintableDocument />
    </div>
  );
}
