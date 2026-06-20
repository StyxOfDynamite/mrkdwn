// @milkdown/crepe's own compiled bundle statically imports the real `@codemirror/language-data`
// package as an internal default for its CodeMirror feature, regardless of the `languages`
// config we pass — which makes Vite ship a chunk for every one of its ~100+ bundled languages
// whether or not Crepe's default is ever actually used. We always override `languages`
// ourselves (see lib/codeMirrorLanguages.ts), so this empty stub — aliased in vite.config.ts —
// is safe: Crepe's default merges with our explicit array, which fully supplies the real list.
export const languages: unknown[] = [];
