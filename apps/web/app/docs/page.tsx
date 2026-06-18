import type { Metadata } from "next";

import { hookDocs } from "@/content/hook-docs";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { createPageMetadata } from "@/lib/metadata";
import { DocsCatalog } from "./docs-catalog";
import styles from "./docs.module.css";

export const metadata: Metadata = createPageMetadata({
  description:
    "API notes and examples for the MVP React hooks in AI Hooks.",
  path: "/docs",
  title: "Docs",
});

const docTools = [
  {
    description: "Estimate request and monthly spend from demo model pricing.",
    href: "/cost-calculator",
    label: "Cost calculator",
  },
  {
    description: "Estimate prompt size and context-window pressure locally.",
    href: "/token-estimator",
    label: "Token estimator",
  },
  {
    description: "Inspect the mock model registry used by the demos.",
    href: "/model-comparison",
    label: "Model comparison",
  },
  {
    description: "Compare provider capabilities before choosing an API route.",
    href: "/provider-compatibility",
    label: "Provider matrix",
  },
] as const;

export default function DocsIndexPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="docs" />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                API notes · MVP hooks
              </div>
              <h1 className="utility-head">AI Hooks docs.</h1>
              <p className="utility-sub">
                Search the current React hooks, inspect API contracts, and copy examples
                that match the package we actually ship today.
              </p>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// current docs</span>
              <div className="summary-list">
                <span>{hookDocs.length} shipped hooks</span>
                <span>Search and categories</span>
                <span>API tables and recipes</span>
                <span>No future-only hooks listed</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <DocsCatalog docs={hookDocs} />
          </div>
        </section>

        <section className="block alt-block">
          <div className="wrap">
            <div className="block-head">
              <div className="lhs">
                <span className="sec-label">// tools</span>
                <h2>Planning tools for AI UI work.</h2>
                <p>
                  These utilities support the hooks, but they are not the package API.
                  They live here so top navigation stays focused on docs and examples.
                </p>
              </div>
            </div>

            <div className={styles.toolsGrid}>
              {docTools.map((tool) => (
                <a className={styles.toolCard} href={tool.href} key={tool.href}>
                  <span>{tool.label}</span>
                  <p>{tool.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
