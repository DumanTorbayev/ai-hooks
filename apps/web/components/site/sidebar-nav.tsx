"use client";

import Link from "next/link";
import { useState } from "react";

import { IntroIcon } from "@/components/icons";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { categoryLabels, categoryOrder, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";
import { planningTools, type PlanningToolId } from "@/content/tools";

import css from "./sidebar-nav.module.css";

type SidebarNavProps = {
  active?:
    | { kind: "docs" }
    | { kind: "hook"; slug: string }
    | { id?: PlanningToolId; kind: "tools" };
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SidebarNav({ active }: SidebarNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={cx(css.toggle, open && css.toggle_open)}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Browse docs <span className={css.chevron}>▾</span>
      </button>
      <aside className={cx(css.side, open && css.side_open)}>
        <nav aria-label="Documentation navigation">
          <div className={css.group}>
            <div className={css.label}>Get started</div>
            <Link className={cx(css.link, active?.kind === "docs" && css.link_active)} href="/docs">
              <IntroIcon /> Introduction
            </Link>
          </div>

          <div className={css.group}>
            <div className={css.label}>Hooks · the package</div>
            {categoryOrder.map((category) => {
              const items = hookDocs.filter((doc) => categoryLabels[doc.category] === category);

              if (!items.length) {
                return null;
              }

              return (
                <div key={category}>
                  <div className={css.subhead}>
                    {category} <span className={css.count}>{items.length}</span>
                  </div>
                  {items.map((doc) => (
                    <Link
                      className={cx(
                        css.link,
                        css.hook_link,
                        active?.kind === "hook" && active.slug === doc.slug && css.link_active,
                      )}
                      href={`/docs/${doc.slug}`}
                      key={doc.slug}
                    >
                      {doc.name}
                      <span
                        className={cx(css.status_dot, css[statusClass(doc.status)])}
                        title={statusLabel(doc.status)}
                      />
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className={css.group}>
            <div className={css.label}>Tools · planning</div>
            {planningTools.map((tool) => (
              <Link
                className={cx(
                  css.link,
                  active?.kind === "tools" && active.id === tool.id && css.link_active,
                )}
                href={`/tools/${tool.id}`}
                key={tool.id}
              >
                <PlanningToolIcon id={tool.id} />
                {tool.name}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
