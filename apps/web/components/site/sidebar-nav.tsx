"use client";

import { useState } from "react";

import { categoryLabels, categoryOrder, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";
import { planningTools, type PlanningToolId } from "@/content/tools";

type SidebarNavProps = {
  active?: { kind: "docs" | "examples" } | { kind: "hook"; slug: string } | { id?: PlanningToolId; kind: "tools" };
};

export function SidebarNav({ active }: SidebarNavProps) {
  const [open, setOpen] = useState(false);

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
              <span aria-hidden="true">□</span> Overview
            </a>
            <a className={active?.kind === "examples" ? "on" : undefined} href="/examples">
              <span aria-hidden="true">◇</span> Examples
            </a>
          </div>

          <div className="grp">
            <div className="lbl">Hooks · the package</div>
            {categoryOrder.map((category) => {
              const items = hookDocs.filter((doc) => categoryLabels[doc.category] === category);

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
          </div>

          <div className="grp">
            <div className="lbl">Tools · planning</div>
            {planningTools.map((tool) => (
              <a
                className={active?.kind === "tools" && active.id === tool.id ? "on" : undefined}
                href={`/tools/${tool.id}`}
                key={tool.id}
              >
                <span aria-hidden="true">{toolGlyph(tool.id)}</span>
                {tool.name}
              </a>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

function toolGlyph(id: PlanningToolId) {
  const glyphs: Record<PlanningToolId, string> = {
    cost: "$",
    models: "▦",
    providers: "▤",
    tokens: "▭",
  };

  return glyphs[id];
}
