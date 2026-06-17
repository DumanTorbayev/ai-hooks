import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { TokenEstimator } from "@/components/token-estimator/token-estimator";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Estimate prompt tokens, planned output tokens, and context-window usage locally without sending text to an AI provider.",
  path: "/token-estimator",
  title: "Token Estimator",
});

export default function TokenEstimatorPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="tokens" />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Local utility · tokenizer planning
              </div>
              <h1 className="utility-head">Token estimator.</h1>
              <p className="utility-sub">
                Estimate prompt size, planned output, and context-window pressure before
                you wire a real provider or upload flow.
              </p>
              <div className="notice">
                <span className="notice-icon">✓</span>
                <p>
                  <b>No text is uploaded.</b> Estimation runs locally using the same
                  `estimateTokens()` utility exposed by `@ai-hooks/core`.
                </p>
              </div>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// useful for</span>
              <div className="summary-list">
                <span>Prompt budgeting</span>
                <span>RAG chunk planning</span>
                <span>File upload limits</span>
                <span>Context-window UX</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <TokenEstimator />
          </div>
        </section>
      </main>
    </>
  );
}
