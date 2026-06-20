import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { PluggableList } from "unified";
import { useDocumentStore } from "../../store/documentStore";
import { remarkPlugins, getRehypePlugins } from "../../lib/markdownPipeline";

export function PrintableDocument() {
  const markdown = useDocumentStore((s) => s.markdown);
  const [rehypePlugins, setRehypePlugins] = useState<PluggableList | null>(null);

  useEffect(() => {
    getRehypePlugins().then(setRehypePlugins);
  }, []);

  return (
    <div className="printable-only markdown-preview px-8 py-6">
      {rehypePlugins && (
        <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {markdown}
        </ReactMarkdown>
      )}
    </div>
  );
}
