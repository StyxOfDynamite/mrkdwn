import { useRef, useState } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCustomCss } from "../theme/CustomCssLoader";
import { exportToHtml } from "../../services/exportService";

export function ExportMenu() {
  const [open, setOpen] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const customCss = useCustomCss();
  const containerRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
  }

  async function handleExportHtml() {
    const { markdown } = useDocumentStore.getState();
    await exportToHtml(markdown, theme, customCss);
    close();
  }

  function handleExportPdf() {
    close();
    // Let the menu close and DOM settle before invoking the OS print dialog.
    setTimeout(() => window.print(), 50);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded px-2 py-1 text-xs hover:bg-white/10"
      >
        Export
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 rounded border border-app-border bg-app-bg py-1 text-app-fg shadow-lg">
          <button
            type="button"
            onClick={handleExportHtml}
            className="block w-full px-3 py-1.5 text-left text-xs hover:bg-app-accent/10"
          >
            Export HTML
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="block w-full px-3 py-1.5 text-left text-xs hover:bg-app-accent/10"
          >
            Export PDF (print)
          </button>
        </div>
      )}
    </div>
  );
}
