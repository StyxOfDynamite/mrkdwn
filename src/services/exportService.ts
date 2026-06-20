import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import ReactMarkdown from "react-markdown";
import previewCss from "../styles/preview.css?raw";
import shikiDarkOverrideCss from "../styles/shikiDarkOverride.css?raw";
import { remarkPlugins, getRehypePlugins } from "../lib/markdownPipeline";
import { writeFile, pickHtmlSavePath } from "./fileService";
import type { ThemeMode } from "../store/settingsStore";

async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const rehypePlugins = await getRehypePlugins();
  const element = createElement(
    "div",
    { className: "markdown-preview" },
    createElement(ReactMarkdown, { remarkPlugins, rehypePlugins }, markdown),
  );
  return renderToStaticMarkup(element);
}

async function buildStandaloneHtml(
  markdown: string,
  theme: ThemeMode,
  customCss: string,
): Promise<string> {
  const bodyHtml = await renderMarkdownToHtml(markdown);
  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8" />
<title>Exported document</title>
<style>
body { margin: 0; padding: 2rem; background-color: ${theme === "dark" ? "#1e1e1e" : "#ffffff"}; }
${previewCss}
${shikiDarkOverrideCss}
${customCss}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}

export async function exportToHtml(
  markdown: string,
  theme: ThemeMode,
  customCss: string,
): Promise<boolean> {
  const path = await pickHtmlSavePath();
  if (!path) return false;
  const html = await buildStandaloneHtml(markdown, theme, customCss);
  await writeFile(path, html);
  return true;
}
