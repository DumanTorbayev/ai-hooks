"use client";

import { useState } from "react";

import { IntroIcon } from "@/components/icons";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { categoryLabels, categoryOrder, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";
import { planningTools, type PlanningToolId } from "@/content/tools";

import styles from "./sidebar-nav.module.css";

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
        className={cx(styles.toggle, open && styles.toggleOpen)}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Browse docs <span className={styles.chevron}>▾</span>
      </button>
      <aside className={cx(styles.side, open && styles.sideOpen)}>
        <nav aria-label="Documentation navigation">
          <div className={styles.group}>
            <div className={styles.label}>Get started</div>
            <a
              className={cx(styles.link, active?.kind === "docs" && styles.linkActive)}
              href="/docs"
            >
              <IntroIcon /> Introduction
            </a>
          </div>

          <div className={styles.group}>
            <div className={styles.label}>Hooks · the package</div>
            {categoryOrder.map((category) => {
              const items = hookDocs.filter((doc) => categoryLabels[doc.category] === category);

              if (!items.length) {
                return null;
              }

              return (
                <div key={category}>
                  <div className={styles.subhead}>
                    {category} <span className={styles.count}>{items.length}</span>
                  </div>
                  {items.map((doc) => (
                    <a
                      className={cx(
                        styles.link,
                        styles.hookLink,
                        active?.kind === "hook" && active.slug === doc.slug && styles.linkActive,
                      )}
                      href={`/docs/${doc.slug}`}
                      key={doc.slug}
                    >
                      {doc.name}
                      <span
                        className={cx(styles.statusDot, styles[statusClass(doc.status)])}
                        title={statusLabel(doc.status)}
                      />
                    </a>
                  ))}
                </div>
              );
            })}
          </div>

          <div className={styles.group}>
            <div className={styles.label}>Tools · planning</div>
            {planningTools.map((tool) => (
              <a
                className={cx(
                  styles.link,
                  active?.kind === "tools" && active.id === tool.id && styles.linkActive,
                )}
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
