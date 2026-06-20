import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { PluggableList } from "unified";
import { useDocumentStore } from "../../store/documentStore";
import { remarkPlugins, getRehypePlugins } from "../../lib/markdownPipeline";

const DEBOUNCE_MS = 150;

interface PreviewPaneProps {
  scrollFraction?: number;
}

export function PreviewPane({ scrollFraction }: PreviewPaneProps) {
  const markdown = useDocumentStore((s) => s.markdown);
  const [debounced, setDebounced] = useState(markdown);
  const [rehypePlugins, setRehypePlugins] = useState<PluggableList | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRehypePlugins().then(setRehypePlugins);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(markdown), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [markdown]);

  useEffect(() => {
    if (scrollFraction === undefined) return;
    const el = containerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTop = max > 0 ? scrollFraction * max : 0;
  }, [scrollFraction]);

  return (
    <div
      ref={containerRef}
      className="markdown-preview h-full overflow-y-auto px-6 py-4"
    >
      {rehypePlugins && (
        <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {debounced}
        </ReactMarkdown>
      )}
    </div>
  );
}
