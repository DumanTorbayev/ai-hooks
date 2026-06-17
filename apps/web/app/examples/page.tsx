import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { createPageMetadata } from "@/lib/metadata";
import styles from "../docs/docs.module.css";

export const metadata: Metadata = createPageMetadata({
  description:
    "Current AI Hooks examples that match the package and demo routes shipped today.",
  path: "/examples",
  title: "Examples",
});

const examples = [
  {
    description:
      "A production-shaped chat scaffold using useChatStream, useAbortController, and useConversationStorage with mock streaming by default.",
    href: "https://github.com/DumanTorbayev/ai-hooks/tree/main/examples/next-basic-chat",
    name: "Next Basic Chat",
    tags: ["Next.js", "chat", "mock stream"],
  },
] as const;

export default function ExamplesPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="examples" />
      <main>
        <section className="utility-hero">
          <div className="wrap utility-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Copy-ready examples
              </div>
              <h1 className="utility-head">Examples.</h1>
              <p className="utility-sub">
                Small integration references that match the current package. New
                frameworks should appear here only after the example exists in the repo.
              </p>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// current examples</span>
              <div className="summary-list">
                <span>{examples.length} shipped example</span>
                <span>Mock streams by default</span>
                <span>Your route, your provider keys</span>
                <span>No project-owned model spend</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className={styles.grid}>
              {examples.map((example) => (
                <a
                  className={styles.card}
                  href={example.href}
                  key={example.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="hc-top">
                    <span className="hname">{example.name}</span>
                    <span className="stable">repo</span>
                  </div>
                  <p>{example.description}</p>
                  <div className={styles.tagRow}>
                    {example.tags.map((tag) => (
                      <span className={styles.cardMeta} key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <code>examples/next-basic-chat</code>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
