import type { Metadata } from "next";

import { hookDocs } from "@/content/hook-docs";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "AI Hooks Docs",
  description:
    "API notes and examples for the MVP React hooks in AI Hooks.",
};

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
                Practical references for the current React hooks: imports, return
                values, options, usage notes, and copy-ready examples.
              </p>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// current docs</span>
              <div className="summary-list">
                <span>Headless React hooks</span>
                <span>Provider-agnostic examples</span>
                <span>No hidden provider calls</span>
                <span>Small subpath imports</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className={styles.grid}>
              {hookDocs.map((doc) => (
                <a className={styles.card} href={`/docs/${doc.slug}`} key={doc.slug}>
                  <div className="hc-top">
                    <span className="hname">
                      <span className="h">use</span>
                      {doc.name.replace("use", "")}
                    </span>
                    <span className={`stable ${doc.status === "beta" ? "beta" : ""}`}>
                      {doc.status}
                    </span>
                  </div>
                  <p>{doc.summary}</p>
                  <code>{doc.importPath}</code>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
