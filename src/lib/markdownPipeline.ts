import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { HighlighterGeneric } from "shiki/core";
import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { getSharedHighlighter, LIGHT_THEME, DARK_THEME } from "./shikiHighlighter";

export const remarkPlugins: PluggableList = [remarkGfm];

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style"],
  },
};

export async function getRehypePlugins(): Promise<PluggableList> {
  const highlighter = await getSharedHighlighter();
  // HighlighterCore's lang/theme generics are `never` (it has no fixed bundled set, languages
  // are loaded explicitly), which TS rejects on contravariance grounds against the `any, any`
  // signature rehypeShikiFromHighlighter expects. Safe in practice: we only ever pass language
  // tags shiki actually has loaded above.
  const shikiTransformer = rehypeShikiFromHighlighter(
    highlighter as unknown as HighlighterGeneric<string, string>,
    {
      themes: { light: LIGHT_THEME, dark: DARK_THEME },
      defaultColor: "light",
    },
  );
  // rehype-sanitize and the Shiki transformer both ship plain `(tree) => tree` JSDoc types
  // rather than unified's full `Plugin`/`Transformer` generics, which TS rejects on
  // contravariance grounds even though this composition is the documented usage for both
  // packages. Cast the assembled list to unblock typechecking.
  return [
    rehypeRaw,
    rehypeSanitize(sanitizeSchema),
    () => shikiTransformer,
  ] as unknown as PluggableList;
}
