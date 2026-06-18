import type { Metadata } from "next";
import { KeyRound, PackageCheck, PanelsTopLeft, Unplug } from "lucide-react";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { hookDocs } from "@/content/hook-docs";
import { createPageMetadata } from "@/lib/metadata";
import { DocsCatalog } from "./docs-catalog";

export const metadata: Metadata = createPageMetadata({
  description: "Documentation for the shipped React hooks in AI Hooks.",
  path: "/docs",
  title: "Documentation",
});

export default function DocsIndexPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="docs" />
      <main className="wrap doc-layout">
        <SidebarNav active={{ kind: "docs" }} />
        <div className="doc-main">
          <div className="crumbs">
            <a href="/">Home</a> / <span>Documentation</span>
          </div>
          <h1 className="page-title">Documentation</h1>
          <p className="page-lede">
            AI Hooks is a small set of <b>headless React hooks</b> for building AI
            product interfaces. Find a hook in the sidebar, read its API, copy the
            usage, and wire it to <b>your own server route and provider key</b>.
          </p>

          <div className="principles">
            <div className="principle">
              <h4>
                <PanelsTopLeft aria-hidden="true" className="ic" size={15} strokeWidth={1.8} />
                Headless
              </h4>
              <p>Hooks return state and actions only. You render every pixel.</p>
            </div>
            <div className="principle">
              <h4>
                <KeyRound aria-hidden="true" className="ic" size={15} strokeWidth={1.8} />
                Your keys
              </h4>
              <p>The package never proxies model calls. Keys live on your server.</p>
            </div>
            <div className="principle">
              <h4>
                <Unplug aria-hidden="true" className="ic" size={15} strokeWidth={1.8} />
                Provider-agnostic
              </h4>
              <p>Swap models across providers without touching UI code.</p>
            </div>
            <div className="principle">
              <h4>
                <PackageCheck aria-hidden="true" className="ic" size={15} strokeWidth={1.8} />
                Zero deps
              </h4>
              <p>Tree-shakeable, small, and framework-friendly.</p>
            </div>
          </div>

          <DocsCatalog docs={hookDocs} />

          <div className="tools-callout">
            <div className="tc-txt">
              <b>Planning tools</b> — cost, tokens, models, providers. Reference
              utilities for designing an AI UI, <b>not part of the package API</b>.
              They live in the sidebar.
            </div>
            <a className="btn sm" href="/tools">
              Open tools →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
