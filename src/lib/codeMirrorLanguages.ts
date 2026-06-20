import { LanguageDescription, LanguageSupport, StreamLanguage } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";

// A curated, explicitly-imported set of CodeMirror languages matching the ones Shiki highlights
// in the preview (see shikiHighlighter.ts), used for code-block language support in the raw
// editor and WYSIWYG panes. `@codemirror/language-data` covers ~100+ languages via dynamic
// imports declared in one module, which makes Vite ship a chunk for every one of them regardless
// of use; importing only the packages we need keeps the production bundle to just those.
//
// javascript/css/html/markdown are imported statically (rather than via dynamic `import()` like
// the rest below): `lang-markdown` embeds `lang-html`, which embeds `lang-css` and
// `lang-javascript`, and `lang-markdown` itself is already a static dependency of
// `SourceEditor.tsx` — so Rollup always inlines all four into the main chunk regardless, and
// pretending otherwise via `import()` only produced build warnings.
export const codeMirrorLanguages: LanguageDescription[] = [
  LanguageDescription.of({
    name: "javascript",
    alias: ["js", "jsx"],
    extensions: ["js", "mjs", "cjs", "jsx"],
    load: () => Promise.resolve(javascript({ jsx: true })),
  }),
  LanguageDescription.of({
    name: "typescript",
    alias: ["ts", "tsx"],
    extensions: ["ts", "tsx"],
    load: () => Promise.resolve(javascript({ jsx: true, typescript: true })),
  }),
  LanguageDescription.of({
    name: "css",
    extensions: ["css"],
    load: () => Promise.resolve(css()),
  }),
  LanguageDescription.of({
    name: "html",
    extensions: ["html", "htm"],
    load: () => Promise.resolve(html()),
  }),
  LanguageDescription.of({
    name: "markdown",
    alias: ["md"],
    extensions: ["md", "markdown"],
    load: () => Promise.resolve(markdown()),
  }),
  LanguageDescription.of({
    name: "python",
    alias: ["py"],
    extensions: ["py"],
    load: () => import("@codemirror/lang-python").then((m) => m.python()),
  }),
  LanguageDescription.of({
    name: "rust",
    alias: ["rs"],
    extensions: ["rs"],
    load: () => import("@codemirror/lang-rust").then((m) => m.rust()),
  }),
  LanguageDescription.of({
    name: "cpp",
    alias: ["c", "c++", "cc"],
    extensions: ["c", "h", "cpp", "hpp", "cc"],
    load: () => import("@codemirror/lang-cpp").then((m) => m.cpp()),
  }),
  LanguageDescription.of({
    name: "go",
    extensions: ["go"],
    load: () => import("@codemirror/lang-go").then((m) => m.go()),
  }),
  LanguageDescription.of({
    name: "sql",
    extensions: ["sql"],
    load: () => import("@codemirror/lang-sql").then((m) => m.sql()),
  }),
  LanguageDescription.of({
    name: "yaml",
    alias: ["yml"],
    extensions: ["yaml", "yml"],
    load: () => import("@codemirror/lang-yaml").then((m) => m.yaml()),
  }),
  LanguageDescription.of({
    name: "json",
    extensions: ["json"],
    load: () => import("@codemirror/lang-json").then((m) => m.json()),
  }),
  LanguageDescription.of({
    name: "bash",
    alias: ["sh", "shell"],
    extensions: ["sh", "bash"],
    load: () =>
      import("@codemirror/legacy-modes/mode/shell").then(
        (m) => new LanguageSupport(StreamLanguage.define(m.shell)),
      ),
  }),
];
