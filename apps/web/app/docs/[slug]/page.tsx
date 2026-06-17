import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { CopyButton } from "@/components/copy-button";
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
                Hook reference · {doc.status}
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
                <span className="sec-label">// example</span>
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
            </article>

            <aside className={styles.side}>
              <section>
                <h2>Returns</h2>
                <ul>
                  {doc.returns.map((item) => (
                    <li key={item}>
                      <code>{item}</code>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>Options</h2>
                <ul>
                  {doc.options.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>Notes</h2>
                <ul>
                  {doc.notes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
