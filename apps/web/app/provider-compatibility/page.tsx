import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { ProviderCompatibilityMatrix } from "@/components/provider-compatibility/provider-compatibility-matrix";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Compare AI provider support for streaming, tool calls, structured output, vision, file input, and OpenAI-compatible API shapes.",
  path: "/provider-compatibility",
  title: "Provider Compatibility Matrix",
});

export default function ProviderCompatibilityPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Source-backed · provider capabilities
              </div>
              <h1 className="utility-head">Provider compatibility.</h1>
              <p className="utility-sub">
                Compare how major AI providers support the product primitives that AI
                Hooks cares about: streaming, tool calls, structured output, vision,
                files, and OpenAI-compatible API shapes.
              </p>
              <div className="notice">
                <span className="notice-icon">✓</span>
                <p>
                  <b>No API calls.</b> This page reads static compatibility data checked
                  against official provider documentation.
                </p>
              </div>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// useful for</span>
              <div className="summary-list">
                <span>Provider adapter planning</span>
                <span>Feature-gated chat UI</span>
                <span>BYOK product decisions</span>
                <span>Docs and SEO pages</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <ProviderCompatibilityMatrix />
          </div>
        </section>
      </main>
    </>
  );
}
