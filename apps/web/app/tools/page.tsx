import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { planningTools } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/components/site/docs-shell.module.css";

export const metadata: Metadata = createPageMetadata({
  description: "Planning tools for AI UI costs, tokens, models, and providers.",
  path: "/tools",
  title: "Tools",
});

export default function ToolsIndexPage() {
  return (
    <>
      <SiteHeader active="docs" />
      <main className={`wrap ${styles.docsLayout}`}>
        <SidebarNav active={{ kind: "tools" }} />
        <div className={styles.main}>
          <div className={styles.crumbs}>
            <a href="/docs">Docs</a> / <span>Tools</span>
          </div>
          <h1 className={styles.pageTitle}>Tools</h1>
          <p className={styles.pageLede}>
            Reference utilities for planning an AI UI — cost, tokens, models,
            providers. These are <b>not part of the package API</b>; the hooks are.
          </p>
          <div className={styles.toolCards}>
            {planningTools.map((tool) => (
              <a className={styles.toolCard} href={`/tools/${tool.id}`} key={tool.id}>
                <div className={styles.toolIcon}>
                  <PlanningToolIcon id={tool.id} size={17} />
                </div>
                <div>
                  <h4>{tool.name}</h4>
                  <p>{tool.description}</p>
                  <span className={styles.planLabel}>planning tool</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
