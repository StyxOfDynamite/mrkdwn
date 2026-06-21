import { create } from "zustand";

export type EditorMode = "split" | "wysiwyg";

interface DocumentState {
  markdown: string;
  filePath: string | null;
  dirty: boolean;
  mode: EditorMode;
  /**
   * Bumped whenever content is loaded from outside the active editor (Open, Save As, Recent
   * Files, folder tree, file association, New). The WYSIWYG pane only learns about its own
   * edits via Crepe's markdownUpdated listener — it has no way to notice the store's `markdown`
   * changing externally — so AppShell keys it by this counter to force a remount with the new
   * content instead. Not bumped by setMarkdown, since that's the editors' own typing.
   */
  loadVersion: number;
  setMarkdown: (markdown: string) => void;
  loadFile: (filePath: string, markdown: string) => void;
  markSaved: (filePath: string) => void;
  setMode: (mode: EditorMode) => void;
  newDocument: () => void;
}

const WELCOME_MARKDOWN = `# Welcome to mrkdwn

A clean, professional markdown editor.

## Features

- **Split view** and *WYSIWYG* editing
- Syntax highlighted code blocks
- Export to PDF and HTML

| Feature | Status |
| --- | --- |
| Split view | Done |
| WYSIWYG | In progress |

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

export const useDocumentStore = create<DocumentState>((set) => ({
  markdown: WELCOME_MARKDOWN,
  filePath: null,
  dirty: false,
  mode: "split",
  loadVersion: 0,
  setMarkdown: (markdown) => set({ markdown, dirty: true }),
  loadFile: (filePath, markdown) =>
    set((state) => ({ filePath, markdown, dirty: false, loadVersion: state.loadVersion + 1 })),
  markSaved: (filePath) => set({ filePath, dirty: false }),
  setMode: (mode) => set({ mode }),
  newDocument: () =>
    set((state) => ({
      markdown: "",
      filePath: null,
      dirty: false,
      loadVersion: state.loadVersion + 1,
    })),
}));
