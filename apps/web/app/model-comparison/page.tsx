import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { ModelComparisonTable } from "@/components/model-comparison/model-comparison-table";

export const metadata: Metadata = {
  title: "Model Comparison - AI Hooks",
  description:
    "Compare demo model capabilities, context windows, and pricing fields used by AI Hooks utilities.",
};

export default function ModelComparisonPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="models" />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Demo registry · provider agnostic
              </div>
              <h1 className="utility-head">Model comparison.</h1>
              <p className="utility-sub">
                Compare model capabilities, context limits, and pricing fields that AI
                product UI can use for routing decisions, feature gates, and cost
                estimates.
              </p>
              <div className="notice">
                <span className="notice-icon">✓</span>
                <p>
                  <b>No model calls.</b> This page reads local registry data only. Real
                  provider pricing should be added with dated sources before publish.
                </p>
              </div>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// useful for</span>
              <div className="summary-list">
                <span>Provider selection UI</span>
                <span>Feature availability checks</span>
                <span>Context-window planning</span>
                <span>Cost calculator inputs</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <ModelComparisonTable />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
