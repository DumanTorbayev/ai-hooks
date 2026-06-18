import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { PlanningToolIcon } from "@/components/site/tool-icon";
import { planningTools } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description: "Planning tools for AI UI costs, tokens, models, and providers.",
  path: "/tools",
  title: "Tools",
});

export default function ToolsIndexPage() {
  return (
    <>
      <SiteHeader active="docs" />
      <main className="wrap doc-layout">
        <SidebarNav active={{ kind: "tools" }} />
        <div className="doc-main">
          <div className="crumbs">
            <a href="/docs">Docs</a> / <span>Tools</span>
          </div>
          <h1 className="page-title">Tools</h1>
          <p className="page-lede">
            Reference utilities for planning an AI UI — cost, tokens, models,
            providers. These are <b>not part of the package API</b>; the hooks are.
          </p>
          <div className="tool-cards">
            {planningTools.map((tool) => (
              <a className="tcard" href={`/tools/${tool.id}`} key={tool.id}>
                <div className="ic">
                  <PlanningToolIcon id={tool.id} size={17} />
                </div>
                <div>
                  <h4>{tool.name}</h4>
                  <p>{tool.description}</p>
                  <span className="planlabel">planning tool</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
