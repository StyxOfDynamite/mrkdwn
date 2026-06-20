import { useDocumentStore } from "../../store/documentStore";

export function ModeToggle() {
  const mode = useDocumentStore((s) => s.mode);
  const setMode = useDocumentStore((s) => s.setMode);

  return (
    <div className="flex overflow-hidden rounded border border-white/30 text-xs">
      <button
        type="button"
        onClick={() => setMode("split")}
        className={`px-2 py-1 ${mode === "split" ? "bg-white/20" : ""}`}
      >
        Split
      </button>
      <button
        type="button"
        onClick={() => setMode("wysiwyg")}
        className={`px-2 py-1 ${mode === "wysiwyg" ? "bg-white/20" : ""}`}
      >
        WYSIWYG
      </button>
    </div>
  );
}
