"use client";

import { useMemo, useState } from "react";

import { ExamplesIcon, IntroIcon } from "@/components/icons";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { categoryLabels, categoryOrder, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";
import { planningTools, type PlanningToolId } from "@/content/tools";

type SidebarNavProps = {
  active?: { kind: "docs" | "examples" } | { kind: "hook"; slug: string } | { id?: PlanningToolId; kind: "tools" };
};

export function SidebarNav({ active }: SidebarNavProps) {
  const [open, setOpen] = useState(false);
  const [hookQuery, setHookQuery] = useState("");
  const normalizedHookQuery = hookQuery.trim().toLowerCase();
  const visibleHooks = useMemo(() => {
    if (!normalizedHookQuery) {
      return hookDocs;
    }

    return hookDocs.filter((doc) =>
      [doc.name, doc.summary, doc.category, categoryLabels[doc.category]].some((value) =>
        value.toLowerCase().includes(normalizedHookQuery),
      ),
    );
  }, [normalizedHookQuery]);

  return (
    <>
      <button
        className={`nav-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Browse docs <span className="chev">▾</span>
      </button>
      <aside className={`side ${open ? "open" : ""}`}>
        <nav className="docnav" aria-label="Documentation navigation">
          <div className="grp">
            <div className="lbl">Get started</div>
            <a className={active?.kind === "docs" ? "on" : undefined} href="/docs">
              <IntroIcon /> Introduction
            </a>
            <a className={active?.kind === "examples" ? "on" : undefined} href="/examples">
              <ExamplesIcon /> Examples
            </a>
          </div>

          <div className="grp">
            <div className="lbl">Hooks · the package</div>
            <div className="side-search">
              <input
                aria-label="Search hooks"
                onChange={(event) => setHookQuery(event.target.value)}
                onInput={(event) => setHookQuery(event.currentTarget.value)}
                placeholder="Search hooks..."
                type="search"
                value={hookQuery}
              />
            </div>
            {categoryOrder.map((category) => {
              const items = visibleHooks.filter((doc) => categoryLabels[doc.category] === category);

              if (!items.length) {
                return null;
              }

              return (
                <div key={category}>
                  <div className="sub">
                    {category} <span className="n">{items.length}</span>
                  </div>
                  {items.map((doc) => (
                    <a
                      className={`hk ${
                        active?.kind === "hook" && active.slug === doc.slug ? "on" : ""
                      }`}
                      href={`/docs/${doc.slug}`}
                      key={doc.slug}
                    >
                      {doc.name}
                      <span className={`st ${statusClass(doc.status)}`} title={statusLabel(doc.status)} />
                    </a>
                  ))}
                </div>
              );
            })}
            {!visibleHooks.length ? <div className="nav-empty">No hooks found.</div> : null}
          </div>

          <div className="grp">
            <div className="lbl">Tools · planning</div>
            {planningTools.map((tool) => (
              <a
                className={active?.kind === "tools" && active.id === tool.id ? "on" : undefined}
                href={`/tools/${tool.id}`}
                key={tool.id}
              >
                <PlanningToolIcon id={tool.id} />
                {tool.name}
              </a>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
