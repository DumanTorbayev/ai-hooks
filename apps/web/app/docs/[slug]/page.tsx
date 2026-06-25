import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { CodePanel } from "@/components/site/code-panel";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import { getHookDoc, hookDocs } from "@/content/hook-docs";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/components/site/docs-shell.module.css";

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
  const relatedDocs = hookDocs.filter((item) =>
    doc.related.some((relatedName) => relatedName === item.name),
  );
  const pairedDocs = doc.pairsWith.map((pair) => ({
    ...pair,
    target: hookDocs.find((item) => item.name === pair.hook),
  }));

  return (
    <>
      <SiteHeader active="docs" />
      <main className={`wrap ${styles.detailLayout}`}>
        <SidebarNav active={{ kind: "hook", slug: doc.slug }} />
        <article className={styles.detailMain}>
          <div className={styles.crumbs}>
            <Link href="/docs">Docs</Link> / <span>{displayCategory(doc.category)}</span> /{" "}
            <span>{doc.name}</span>
          </div>
          <div className={styles.detailTitle}>
            <h1>
              <span className={styles.hookPrefix}>use</span>
              {doc.name.replace("use", "")}
            </h1>
            <span className={`status ${statusClass(doc.status)}`}>{statusLabel(doc.status)}</span>
            <span className="cat-tag">{displayCategory(doc.category)}</span>
          </div>
          <p className={styles.detailPurpose}>{doc.purpose}</p>

          <div className={styles.boundaryNote}>
            <b>Package boundary:</b> <InlineCodeText text={doc.boundary} />
          </div>

          <section className={styles.section} id="import">
            <h3>
              <span className={styles.hash}>#</span> Import
            </h3>
            <CodePanel code={rootImport} file="import" showLineNumbers={false} />
          </section>

          <section className={styles.section} id="usage">
            <h3>
              <span className={styles.hash}>#</span> Usage
            </h3>
            <CodePanel code={doc.example} file={`${doc.name}.tsx`} />
          </section>

          <section className={styles.section} id="when-to-use">
            <h3>
              <span className={styles.hash}>#</span> When to use
            </h3>
            <ul className={styles.guidanceList}>
              {doc.useWhen.map((item) => (
                <li key={item}>
                  <InlineCodeText text={item} />
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} id="when-not-to-use">
            <h3>
              <span className={styles.hash}>#</span> When not to use
            </h3>
            <ul className={styles.guidanceList}>
              {doc.avoidWhen.map((item) => (
                <li key={item}>
                  <InlineCodeText text={item} />
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} id="edge-cases">
            <h3>
              <span className={styles.hash}>#</span> Edge cases
            </h3>
            <ul className={styles.guidanceList}>
              {doc.edgeCases.map((item) => (
                <li key={item}>
                  <InlineCodeText text={item} />
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} id="pairs">
            <h3>
              <span className={styles.hash}>#</span> Pairs well with
            </h3>
            <div className={styles.pairGrid}>
              {pairedDocs.map((item) =>
                item.target ? (
                  <Link
                    className={styles.pairCard}
                    href={`/docs/${item.target.slug}`}
                    key={item.hook}
                  >
                    <span>
                      <span className={styles.hookPrefix}>use</span>
                      {item.hook.replace("use", "")}
                    </span>
                    <p>
                      <InlineCodeText text={item.description} />
                    </p>
                  </Link>
                ) : (
                  <div className={styles.pairCard} key={item.hook}>
                    <span>{item.hook}</span>
                    <p>
                      <InlineCodeText text={item.description} />
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className={styles.section} id="options">
            <h3>
              <span className={styles.hash}>#</span> Options
            </h3>
            <div className={styles.tableWrap}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.options.length ? (
                      doc.options.map((item) => (
                        <tr key={item.name}>
                          <td>
                            <span className={styles.paramName}>{item.name}</span>
                          </td>
                          <td>
                            <span className={styles.paramType}>{item.type}</span>
                          </td>
                          <td className="mono">{item.defaultValue}</td>
                          <td>{item.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>This hook does not accept options.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className={styles.section} id="returns">
            <h3>
              <span className={styles.hash}>#</span> Returns
            </h3>
            <div className={styles.tableWrap}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.returns.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <span className={styles.paramName}>{item.name}</span>
                        </td>
                        <td>
                          <span className={styles.paramType}>{item.type}</span>
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className={styles.section} id="recipes">
            <h3>
              <span className={styles.hash}>#</span> Recipes
            </h3>
            {doc.recipes.map((recipe, index) => (
              <div className={styles.recipe} key={recipe}>
                <div className={styles.recipeTitle}>
                  <span className={styles.recipeNumber}>{index + 1}</span>
                  <InlineCodeText text={recipe} />
                </div>
              </div>
            ))}
          </section>

          <section className={styles.section} id="server-notes">
            <h3>
              <span className={styles.hash}>#</span> Server/provider notes
            </h3>
            {doc.notes.map((item) => (
              <div className={styles.sourceNote} key={item}>
                <InlineCodeText text={item} />
              </div>
            ))}
          </section>

          <section className={styles.section} id="related">
            <h3>
              <span className={styles.hash}>#</span> Related hooks
            </h3>
            <div className={styles.relatedRow}>
              {relatedDocs.map((item) => (
                <Link className={styles.relatedChip} href={`/docs/${item.slug}`} key={item.slug}>
                  <span className={styles.hookPrefix}>use</span>
                  {item.name.replace("use", "")}
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className={styles.detailSide}>
          <div className={styles.onThisPage}>
            <h4>On this page</h4>
            <a href="#import">Import</a>
            <a href="#usage">Usage</a>
            <a href="#when-to-use">When to use</a>
            <a href="#when-not-to-use">When not to use</a>
            <a href="#edge-cases">Edge cases</a>
            <a href="#pairs">Pairs</a>
            <a href="#options">Options</a>
            <a href="#returns">Returns</a>
            <a href="#recipes">Recipes</a>
            <a href="#server-notes">Server/provider notes</a>
            <a href="#related">Related</a>
          </div>
          <div className={styles.metaCard}>
            <h4>Details</h4>
            <div className={styles.metaRow}>
              <span>Status</span>
              <span className={styles.metaValue}>{statusLabel(doc.status)}</span>
            </div>
            <div className={styles.metaRow}>
              <span>Category</span>
              <span className={styles.metaValue}>{displayCategory(doc.category)}</span>
            </div>
            <div className={styles.metaRow}>
              <span>Import</span>
              <span className={styles.metaValue}>@ai-hooks/react</span>
            </div>
            <div className={styles.metaRow}>
              <span>Bundle</span>
              <span className={styles.metaValue}>tree-shakeable</span>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}

function InlineCodeText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((chunk, index) =>
        chunk.startsWith("`") && chunk.endsWith("`") ? (
          <code className={styles.inlineCode} key={`${chunk}-${index}`}>
            {chunk.slice(1, -1)}
          </code>
        ) : (
          chunk
        ),
      )}
    </>
  );
}
