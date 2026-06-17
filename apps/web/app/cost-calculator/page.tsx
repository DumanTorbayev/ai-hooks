import type { Metadata } from "next";

import { LlmCostCalculator } from "@/components/cost-calculator/llm-cost-calculator";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Estimate LLM input tokens, output tokens, per-request cost, and monthly AI product spend without sending prompts to a provider.",
  path: "/cost-calculator",
  title: "LLM Cost Calculator",
});

export default function CostCalculatorPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="cost" />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Local utility · no provider calls
              </div>
              <h1 className="utility-head">LLM cost calculator.</h1>
              <p className="utility-sub">
                Estimate prompt tokens, completion tokens, request cost, and monthly
                traffic spend using the same core utilities exposed by AI Hooks.
              </p>
              <div className="notice">
                <span className="notice-icon">✓</span>
                <p>
                  <b>No API request.</b> This calculator runs in the browser with demo
                  model pricing and local token estimation.
                </p>
              </div>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// useful for</span>
              <div className="summary-list">
                <span>Pricing pages</span>
                <span>AI feature planning</span>
                <span>Usage dashboards</span>
                <span>Provider comparisons</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <LlmCostCalculator />
          </div>
        </section>
      </main>
    </>
  );
}
