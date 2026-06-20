import { create } from "zustand";

export type EditorMode = "split" | "wysiwyg";

interface DocumentState {
  markdown: string;
  filePath: string | null;
  dirty: boolean;
  mode: EditorMode;
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
  setMarkdown: (markdown) => set({ markdown, dirty: true }),
  loadFile: (filePath, markdown) => set({ filePath, markdown, dirty: false }),
  markSaved: (filePath) => set({ filePath, dirty: false }),
  setMode: (mode) => set({ mode }),
  newDocument: () => set({ markdown: "", filePath: null, dirty: false }),
}));
