import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

import githubLight from "shiki/themes/github-light.mjs";
import githubDark from "shiki/themes/github-dark.mjs";

import javascript from "shiki/langs/javascript.mjs";
import typescript from "shiki/langs/typescript.mjs";
import jsx from "shiki/langs/jsx.mjs";
import tsx from "shiki/langs/tsx.mjs";
import python from "shiki/langs/python.mjs";
import rust from "shiki/langs/rust.mjs";
import go from "shiki/langs/go.mjs";
import json from "shiki/langs/json.mjs";
import yaml from "shiki/langs/yaml.mjs";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import html from "shiki/langs/html.mjs";
import markdown from "shiki/langs/markdown.mjs";
import sql from "shiki/langs/sql.mjs";
import c from "shiki/langs/c.mjs";
import cpp from "shiki/langs/cpp.mjs";

export const LIGHT_THEME = "github-light";
export const DARK_THEME = "github-dark";

// Explicit per-language/per-theme imports (rather than the top-level `shiki` package, which
// bundles its full ~700-grammar registry as lazy chunks shipped inside the app regardless of
// whether they're ever loaded) keep the production bundle to just the languages we use.
let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getSharedHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: [
        javascript,
        typescript,
        jsx,
        tsx,
        python,
        rust,
        go,
        json,
        yaml,
        bash,
        css,
        html,
        markdown,
        sql,
        c,
        cpp,
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}
