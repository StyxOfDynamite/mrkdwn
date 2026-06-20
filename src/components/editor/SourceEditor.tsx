import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { useRef } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { useSettingsStore } from "../../store/settingsStore";
import { codeMirrorLanguages } from "../../lib/codeMirrorLanguages";

const baseExtensions = [
  markdown({ codeLanguages: codeMirrorLanguages }),
  EditorView.lineWrapping,
];

interface SourceEditorProps {
  onScroll?: (fraction: number) => void;
}

export function SourceEditor({ onScroll }: SourceEditorProps) {
  const markdownText = useDocumentStore((s) => s.markdown);
  const setMarkdown = useDocumentStore((s) => s.setMarkdown);
  const theme = useSettingsStore((s) => s.theme);
  const detachScrollListener = useRef<(() => void) | undefined>(undefined);

  const handleCreateEditor = (view: EditorView) => {
    detachScrollListener.current?.();
    if (!onScroll) return;
    const scroller = view.scrollDOM;
    const listener = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      onScroll(max > 0 ? scroller.scrollTop / max : 0);
    };
    scroller.addEventListener("scroll", listener);
    detachScrollListener.current = () => scroller.removeEventListener("scroll", listener);
  };

  return (
    <CodeMirror
      value={markdownText}
      height="100%"
      theme={theme === "dark" ? "dark" : "light"}
      extensions={baseExtensions}
      onChange={setMarkdown}
      onCreateEditor={handleCreateEditor}
      className="h-full text-sm"
      basicSetup={{ lineNumbers: false, foldGutter: false }}
    />
  );
}
