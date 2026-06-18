"use client";

import { useMemo, useState } from "react";

import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import type { HookDoc } from "@/content/hook-docs";

type DocsCatalogProps = {
  docs: readonly HookDoc[];
};

export function DocsCatalog({ docs }: DocsCatalogProps) {
  const [query, setQuery] = useState("");

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return docs;
    }

    return docs.filter((doc) =>
      [doc.name, doc.summary, doc.category, doc.purpose, displayCategory(doc.category)].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [docs, query]);

  return (
    <>
      <div className="searchbar">
        <span aria-hidden="true" className="search-icon">
          ⌕
        </span>
        <input
          id="docSearch"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter hooks by name or summary..."
          type="search"
          value={query}
        />
        <button
          className={`clearx ${query ? "show" : ""}`}
          onClick={() => setQuery("")}
          type="button"
        >
          ×
        </button>
      </div>
      <span className="cnt">
        {filteredDocs.length} {filteredDocs.length === 1 ? "hook" : "hooks"}
        {query ? ` matching "${query}"` : " across 5 categories"}
      </span>
      <div className="doc-cards">
        {filteredDocs.length === 0 ? (
          <div className="no-results">No hooks match "{query}".</div>
        ) : (
          filteredDocs.map((doc) => (
            <a className="dcard" href={`/docs/${doc.slug}`} key={doc.slug}>
              <div className="top">
                <span className="hn">
                  <span className="h">use</span>
                  {doc.name.replace("use", "")}
                </span>
                <span className={`status ${statusClass(doc.status)}`}>
                  {statusLabel(doc.status)}
                </span>
              </div>
              <p>{doc.summary}</p>
              <div className="imp">
                import {"{ "}
                <span className="nm">{doc.name}</span>
                {" }"} from <span className="pkg">"@ai-hooks/react"</span>
              </div>
              <div className="foot">
                <span className="cat-tag">{displayCategory(doc.category)}</span>
                <span className="go">Read docs →</span>
              </div>
            </a>
          ))
        )}
      </div>
    </>
  );
}

