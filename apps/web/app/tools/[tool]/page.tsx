import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import {
  CostCalc,
  ModelCompare,
  ProviderMatrix,
  TokenEstimator,
} from "@/components/site/planning-tools";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { planningTools, type PlanningToolId } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";

import css from "@/components/site/docs-shell.module.css";

type ToolPageProps = {
  params: Promise<{ tool: PlanningToolId }>;
};

export function generateStaticParams() {
  return planningTools.map((tool) => ({ tool: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = planningTools.find((item) => item.id === toolId);

  if (!tool) {
    return {};
  }

  return createPageMetadata({
    description: tool.description,
    path: `/tools/${tool.id}`,
    title: tool.name,
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  const tool = planningTools.find((item) => item.id === toolId);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <SiteHeader active="docs" />
      <main className={`wrap ${css.docs_layout}`}>
        <SidebarNav active={{ id: tool.id, kind: "tools" }} />
        <div className={`${css.main} ${css.tool_main}`}>
          <div className={css.crumbs}>
            <Link href="/docs">Docs</Link> / <Link href="/tools">Tools</Link> /{" "}
            <span>{tool.name}</span>
          </div>
          <div className={css.planning_flag}>Planning tool · not part of the package API</div>
          <h1 className={css.page_title}>{tool.name}</h1>
          <p className={css.page_lede}>{tool.description}</p>
          {tool.id === "cost" ? <CostCalc /> : null}
          {tool.id === "tokens" ? <TokenEstimator /> : null}
          {tool.id === "models" ? <ModelCompare /> : null}
          {tool.id === "providers" ? <ProviderMatrix /> : null}
        </div>
      </main>
    </>
  );
}
