"use client";

import { useMemo, useState } from "react";

import type { HookDoc } from "@/content/hook-docs";

import styles from "./docs.module.css";

type DocsCatalogProps = {
  docs: readonly HookDoc[];
};

const categories = ["all", "streaming", "state", "usage", "files", "agents"] as const;

export function DocsCatalog({ docs }: DocsCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return docs.filter((doc) => {
      const matchesCategory = category === "all" || doc.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [doc.name, doc.summary, doc.category, doc.purpose].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });
  }, [category, docs, query]);

  return (
    <div className={styles.catalogLayout}>
      <aside className={styles.catalogSide}>
        <label className={styles.searchLabel} htmlFor="docs-search">
          Search hooks
        </label>
        <input
          className={styles.searchInput}
          id="docs-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="useChatStream, files, cost..."
          type="search"
          value={query}
        />

        <div className={styles.categoryList} role="list">
          {categories.map((item) => (
            <button
              className={category === item ? styles.categoryActive : undefined}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
              <span>
                {item === "all" ? docs.length : docs.filter((doc) => doc.category === item).length}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className={styles.grid}>
        {filteredDocs.map((doc) => (
          <a className={styles.card} href={`/docs/${doc.slug}`} key={doc.slug}>
            <div className="hc-top">
              <span className="hname">
                <span className="h">use</span>
                {doc.name.replace("use", "")}
              </span>
              <span className={`stable ${doc.status === "beta" ? "beta" : ""}`}>
                {doc.status}
              </span>
            </div>
            <p>{doc.summary}</p>
            <span className={styles.cardMeta}>{doc.category}</span>
            <code>{`import { ${doc.name} } from "@ai-hooks/react";`}</code>
          </a>
        ))}
      </div>
    </div>
  );
}
