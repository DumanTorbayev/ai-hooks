import type { Metadata } from "next";

import { hookDocs } from "@/content/hook-docs";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { createPageMetadata } from "@/lib/metadata";
import { DocsCatalog } from "./docs-catalog";

export const metadata: Metadata = createPageMetadata({
  description:
    "API notes and examples for the MVP React hooks in AI Hooks.",
  path: "/docs",
  title: "Docs",
});

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
      </main>
    </>
  );
}
