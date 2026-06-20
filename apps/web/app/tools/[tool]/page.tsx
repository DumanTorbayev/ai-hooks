import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { CostCalc, ModelCompare, ProviderMatrix, TokenEstimator } from "@/components/site/planning-tools";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { planningTools, type PlanningToolId } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/components/site/docs-shell.module.css";

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
      <main className={`wrap ${styles.docsLayout}`}>
        <SidebarNav active={{ id: tool.id, kind: "tools" }} />
        <div className={`${styles.main} ${styles.toolMain}`}>
          <div className={styles.crumbs}>
            <a href="/docs">Docs</a> / <a href="/tools">Tools</a> / <span>{tool.name}</span>
          </div>
          <div className={styles.planningFlag}>Planning tool · not part of the package API</div>
          <h1 className={styles.pageTitle}>{tool.name}</h1>
          <p className={styles.pageLede}>{tool.description}</p>
          {tool.id === "cost" ? <CostCalc /> : null}
          {tool.id === "tokens" ? <TokenEstimator /> : null}
          {tool.id === "models" ? <ModelCompare /> : null}
          {tool.id === "providers" ? <ProviderMatrix /> : null}
        </div>
      </main>
    </>
  );
}
