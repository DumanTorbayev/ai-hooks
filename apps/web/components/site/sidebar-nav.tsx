"use client";

import { BookOpen, Boxes, FileText } from "lucide-react";
import { useState } from "react";

import { PlanningToolIcon } from "@/components/site/tool-icon";
import { categoryLabels, categoryOrder } from "@/content/hook-meta";
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
              <BookOpen aria-hidden="true" size={14} strokeWidth={1.8} /> Overview
            </a>
            <a className={active?.kind === "examples" ? "on" : undefined} href="/examples">
              <FileText aria-hidden="true" size={14} strokeWidth={1.8} /> Examples
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
                    <Boxes aria-hidden="true" size={13} strokeWidth={1.8} />
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
