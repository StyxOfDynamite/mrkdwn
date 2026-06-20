// @milkdown/crepe's compiled bundle statically imports the real `katex` package (plus its
// font-heavy CSS) regardless of whether the Latex feature is enabled — katex.js alone is a few
// hundred KB, before its ~40 webfont files. We don't use math rendering (out of scope for v1),
// and explicitly disable the Latex feature at runtime (see WysiwygEditor.tsx), so these no-ops
// are never actually called; this stub — aliased in vite.config.ts — just keeps the real
// package's weight out of the bundle.
function unused(): never {
  throw new Error("katex is stubbed out — the Latex feature is disabled in this app");
}

export default {
  render: unused,
  renderToString: unused,
};
