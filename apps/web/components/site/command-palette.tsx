"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { SearchIcon } from "@/components/icons";
import { hookDocs } from "@/content/hook-docs";
import { planningTools } from "@/content/tools";

import styles from "./command-palette.module.css";

type PaletteItem = {
  description: string;
  group: "Hooks" | "Pages" | "Tools";
  href: string;
  label: string;
};

const pageItems: PaletteItem[] = [
  {
    description: "Package positioning and first hook",
    group: "Pages",
    href: "/",
    label: "Home",
  },
  {
    description: "Documentation introduction",
    group: "Pages",
    href: "/docs",
    label: "Introduction",
  },
  {
    description: "Current docs-backed implementation notes",
    group: "Pages",
    href: "/examples",
    label: "Examples",
  },
  {
    description: "Cost, token, model, and provider planning utilities",
    group: "Pages",
    href: "/tools",
    label: "Tools",
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CommandPalette({ onClose, open }: { onClose: () => void; open: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const hookItems = hookDocs.map((doc) => ({
      description: doc.summary,
      group: "Hooks" as const,
      href: `/docs/${doc.slug}`,
      label: doc.name,
    }));
    const toolItems = planningTools.map((tool) => ({
      description: "planning tool",
      group: "Tools" as const,
      href: `/tools/${tool.id}`,
      label: tool.name,
    }));

    return [...hookItems, ...toolItems, ...pageItems];
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) =>
      [item.label, item.description, item.group, item.href].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [items, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setSelectedIndex(0);
  }, [open]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, Math.max(filteredItems.length - 1, 0)));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter" && filteredItems[selectedIndex]) {
        event.preventDefault();
        router.push(filteredItems[selectedIndex].href);
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [filteredItems, onClose, open, router, selectedIndex]);

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(filteredItems.length - 1, 0)));
  }, [filteredItems.length]);

  if (!open) {
    return null;
  }

  const groupedItems = (["Hooks", "Tools", "Pages"] as const).map((group) => ({
    group,
    items: filteredItems.filter((item) => item.group === group),
  }));

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        aria-label="Search documentation"
        aria-modal="true"
        className={styles.palette}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={styles.inputRow}>
          <SearchIcon />
          <input
            autoComplete="off"
            autoFocus
            className={styles.input}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search hooks and tools..."
            value={query}
          />
          <span className={styles.escape}>esc</span>
        </div>
        <div className={styles.results} role="listbox">
          {filteredItems.length === 0 ? (
            <div className={styles.empty}>No matches for {query}</div>
          ) : (
            groupedItems.map(({ group, items: groupItems }) =>
              groupItems.length ? (
                <div key={group}>
                  <div className={styles.groupLabel}>{group}</div>
                  {groupItems.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    return (
                      <button
                        aria-selected={globalIndex === selectedIndex}
                        className={cx(
                          styles.result,
                          globalIndex === selectedIndex && styles.selected,
                        )}
                        key={`${item.group}-${item.href}`}
                        onClick={() => {
                          router.push(item.href);
                          onClose();
                        }}
                        role="option"
                        type="button"
                      >
                        <span className={styles.name}>{formatPaletteLabel(item.label)}</span>
                        <span className={styles.description}>{item.description}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null,
            )
          )}
        </div>
      </div>
    </div>
  );
}

function formatPaletteLabel(label: string) {
  if (!label.startsWith("use")) {
    return label;
  }

  return (
    <>
      <span className={styles.hookPrefix}>use</span>
      {label.slice(3)}
    </>
  );
}
