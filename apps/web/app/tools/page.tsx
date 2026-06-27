import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/home/site-header";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { planningTools } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";

import css from "@/components/site/docs-shell.module.css";

export const metadata: Metadata = createPageMetadata({
  description: "Planning tools for AI UI costs, tokens, models, and providers.",
  path: "/tools",
  title: "Tools",
});

export default function ToolsIndexPage() {
  return (
    <>
      <SiteHeader active="docs" />
      <main className={`wrap ${css.docs_layout}`}>
        <SidebarNav active={{ kind: "tools" }} />
        <div className={css.main}>
          <div className={css.crumbs}>
            <Link href="/docs">Docs</Link> / <span>Tools</span>
          </div>
          <h1 className={css.page_title}>Tools</h1>
          <p className={css.page_lede}>
            Reference utilities for planning an AI UI — cost, tokens, models, providers. These are{" "}
            <b>not part of the package API</b>; the hooks are.
          </p>
          <div className={css.tool_cards}>
            {planningTools.map((tool) => (
              <Link className={css.tool_card} href={`/tools/${tool.id}`} key={tool.id}>
                <div className={css.tool_icon}>
                  <PlanningToolIcon id={tool.id} size={17} />
                </div>
                <div>
                  <h4>{tool.name}</h4>
                  <p>{tool.description}</p>
                  <span className={css.plan_label}>planning tool</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
