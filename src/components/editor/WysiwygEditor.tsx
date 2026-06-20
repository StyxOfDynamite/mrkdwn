import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import { useDocumentStore } from "../../store/documentStore";
import { codeMirrorLanguages } from "../../lib/codeMirrorLanguages";
// Importing the individual feature stylesheets we actually use, rather than the aggregated
// theme/common/style.css, skips latex.css (which @imports katex's font-heavy CSS) and the
// unused ai.css/top-bar.css/diff.css — those features are disabled below.
import "@milkdown/crepe/theme/common/reset.css";
import "@milkdown/crepe/theme/common/prosemirror.css";
import "@milkdown/crepe/theme/common/block-edit.css";
import "@milkdown/crepe/theme/common/code-mirror.css";
import "@milkdown/crepe/theme/common/cursor.css";
import "@milkdown/crepe/theme/common/image-block.css";
import "@milkdown/crepe/theme/common/link-tooltip.css";
import "@milkdown/crepe/theme/common/list-item.css";
import "@milkdown/crepe/theme/common/placeholder.css";
import "@milkdown/crepe/theme/common/toolbar.css";
import "@milkdown/crepe/theme/common/table.css";
import "@milkdown/crepe/theme/classic.css";

export function WysiwygEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialMarkdown = useRef(useDocumentStore.getState().markdown).current;

  useEffect(() => {
    if (!containerRef.current) return;

    const crepe = new Crepe({
      root: containerRef.current,
      defaultValue: initialMarkdown,
      features: { [Crepe.Feature.AI]: false, [Crepe.Feature.Latex]: false },
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: { languages: codeMirrorLanguages },
      },
    });

    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown, prevMarkdown) => {
        if (markdown !== prevMarkdown) {
          useDocumentStore.getState().setMarkdown(markdown);
        }
      });
    });

    let destroyed = false;
    crepe.create().catch((error) => {
      if (!destroyed) console.error("Failed to create Crepe editor", error);
    });

    return () => {
      destroyed = true;
      crepe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="milkdown-host h-full overflow-y-auto" />;
}
