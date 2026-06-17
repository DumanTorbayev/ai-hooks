import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { CopyButton } from "@/components/copy-button";
import { SupportButton } from "@/components/support-button";
import { siteConfig } from "@/content/site";
import { getHookDoc, hookDocs } from "@/content/hook-docs";
import { createPageMetadata } from "@/lib/metadata";
import styles from "../docs.module.css";

type HookDocPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return hookDocs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: HookDocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getHookDoc(slug);

  if (!doc) {
    return {};
  }

  return createPageMetadata({
    description: doc.summary,
    path: `/docs/${doc.slug}`,
    title: doc.name,
  });
}

export default async function HookDocPage({ params }: HookDocPageProps) {
  const { slug } = await params;
  const doc = getHookDoc(slug);

  if (!doc) {
    notFound();
  }

  const rootImport = `import { ${doc.name} } from "@ai-hooks/react";`;
  const subpathImport = `import { ${doc.name} } from "${doc.importPath}";`;
  const relatedDocs = hookDocs.filter((item) =>
    doc.related.some((relatedName) => relatedName === item.name),
  );

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
                {doc.category} · {doc.status}
              </div>
              <h1 className="utility-head">{doc.name}</h1>
              <p className="utility-sub">{doc.summary}</p>
              <div className="notice">
                <span className="notice-icon">✓</span>
                <p>
                  <b>Composable hooks.</b> Each hook works on its own. Combine hooks only
                  when the workflow needs shared state.
                </p>
              </div>
            </div>

            <div className="utility-summary">
              <span className="sec-label">// import</span>
              <div className={styles.importBox}>
                <code>{rootImport}</code>
                <CopyButton
                  className={styles.importCopy}
                  copiedLabel="Copied"
                  label="Copy"
                  value={rootImport}
                />
              </div>
              <p className={styles.importHint}>
                Bundle-strict: <code>{subpathImport}</code>
              </p>
            </div>
          </div>
        </section>

        <section className="block">
          <div className={`wrap ${styles.layout}`}>
            <article className={styles.main}>
              <section>
                <span className="sec-label">// purpose</span>
                <p>{doc.purpose}</p>
              </section>

              <section>
                <span className="sec-label">// usage</span>
                <div className={styles.codeBlock}>
                  <div className={styles.codeHeader}>
                    <span>{doc.name}.tsx</span>
                    <CopyButton className={styles.codeCopy} value={doc.example} />
                  </div>
                  <pre className={styles.code}>
                    <code>{doc.example}</code>
                  </pre>
                </div>
              </section>

              <section>
                <span className="sec-label">// api</span>
                <div className={styles.tableWrap}>
                  <table className={styles.apiTable}>
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.options.map((item) => {
                        const row = splitApiRow(item);

                        return (
                          <tr key={item}>
                            <td>
                              <code>{row.name}</code>
                            </td>
                            <td>{row.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <span className="sec-label">// returns</span>
                <div className={styles.tableWrap}>
                  <table className={styles.apiTable}>
                    <thead>
                      <tr>
                        <th>Value</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.returns.map((item) => (
                        <tr key={item}>
                          <td>
                            <code>{item}</code>
                          </td>
                          <td>{getReturnDescription(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <span className="sec-label">// recipes</span>
                <div className={styles.recipeGrid}>
                  {doc.recipes.map((recipe) => (
                    <div className={styles.recipe} key={recipe}>
                      {recipe}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <span className="sec-label">// source notes</span>
                <ul className={styles.noteList}>
                  {doc.notes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </article>

            <aside className={styles.side}>
              {siteConfig.supportUrl ? (
                <section className={styles.supportCard}>
                  <h2>Support AI Hooks</h2>
                  <p>Help keep the docs, examples, and package work independent.</p>
                  <SupportButton className="btn support sm" />
                </section>
              ) : null}

              <section>
                <h2>On This Page</h2>
                <ul>
                  <li>Usage</li>
                  <li>API</li>
                  <li>Returns</li>
                  <li>Recipes</li>
                  <li>Source notes</li>
                </ul>
              </section>

              <section>
                <h2>Related Hooks</h2>
                <ul>
                  {relatedDocs.map((item) => (
                    <li key={item.slug}>
                      <a className={styles.sideLink} href={`/docs/${item.slug}`}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function splitApiRow(item: string) {
  const separatorIndex = item.indexOf(":");

  if (separatorIndex === -1) {
    return {
      description: item,
      name: item,
    };
  }

  return {
    description: item.slice(separatorIndex + 1).trim(),
    name: item.slice(0, separatorIndex).trim(),
  };
}

function getReturnDescription(name: string) {
  if (name.startsWith("is")) {
    return "Boolean state for rendering controls and status UI.";
  }

  if (name.includes("Tokens")) {
    return "Token counter value for usage or cost display.";
  }

  if (["send", "abort", "reset", "clear", "remove", "add", "run"].includes(name)) {
    return "Action returned by the hook for your UI to call.";
  }

  if (name.includes("error") || name === "errors") {
    return "Error state your UI can render or clear.";
  }

  return "State or helper value returned by the hook.";
}
