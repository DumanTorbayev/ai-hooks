import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { CodePanel } from "@/components/site/code-panel";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import { getHookDoc, hookDocs } from "@/content/hook-docs";
import { createPageMetadata } from "@/lib/metadata";

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

  return (
    <>
      <SiteHeader active="docs" />
      <main className="wrap detail-grid">
        <SidebarNav active={{ kind: "hook", slug: doc.slug }} />
        <article className="detail-main">
          <div className="crumbs">
            <a href="/docs">Docs</a> / <span>{displayCategory(doc.category)}</span> /{" "}
            <span>{doc.name}</span>
          </div>
          <div className="detail-title">
            <h1>
              <span className="h">use</span>
              {doc.name.replace("use", "")}
            </h1>
            <span className={`status ${statusClass(doc.status)}`}>
              {statusLabel(doc.status)}
            </span>
            <span className="cat-tag">{displayCategory(doc.category)}</span>
          </div>
          <p className="detail-purpose">{doc.purpose}</p>

          <section className="dsec" id="import">
            <h3>
              <span className="hash">#</span> Import
            </h3>
            <CodePanel code={rootImport} file="import" showLineNumbers={false} />
          </section>

          <section className="dsec" id="usage">
            <h3>
              <span className="hash">#</span> Usage
            </h3>
            <CodePanel code={doc.example} file={`${doc.name}.tsx`} />
          </section>

          <section className="dsec" id="options">
            <h3>
              <span className="hash">#</span> Options
            </h3>
            <div className="tbl-wrap">
              <div className="tbl-scroll">
                <table className="tbl">
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
                            <span className="pname">{item.name}</span>
                          </td>
                          <td>
                            <span className="ptype">{item.type}</span>
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

          <section className="dsec" id="returns">
            <h3>
              <span className="hash">#</span> Returns
            </h3>
            <div className="tbl-wrap">
              <div className="tbl-scroll">
                <table className="tbl">
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
                          <span className="pname">{item.name}</span>
                        </td>
                        <td>
                          <span className="ptype">{item.type}</span>
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="dsec" id="recipes">
            <h3>
              <span className="hash">#</span> Recipes
            </h3>
            {doc.recipes.map((recipe, index) => (
              <div className="recipe" key={recipe}>
                <div className="rt">
                  <span className="n">{index + 1}</span>
                  {recipe}
                </div>
              </div>
            ))}
          </section>

          <section className="dsec" id="source">
            <h3>
              <span className="hash">#</span> Source notes
            </h3>
            {doc.notes.map((item) => (
              <div className="source-note" key={item}>
                {item}
              </div>
            ))}
          </section>

          <section className="dsec" id="related">
            <h3>
              <span className="hash">#</span> Related hooks
            </h3>
            <div className="related-row">
              {relatedDocs.map((item) => (
                <a className="related-chip" href={`/docs/${item.slug}`} key={item.slug}>
                  <span className="h">use</span>
                  {item.name.replace("use", "")}
                </a>
              ))}
            </div>
          </section>
        </article>

        <aside className="detail-side">
          <div className="onthispage">
            <h4>On this page</h4>
            <a href="#import">Import</a>
            <a href="#usage">Usage</a>
            <a href="#options">Options</a>
            <a href="#returns">Returns</a>
            <a href="#recipes">Recipes</a>
            <a href="#source">Source notes</a>
            <a href="#related">Related</a>
          </div>
          <div className="meta-card">
            <h4>Details</h4>
            <div className="mrow">
              <span>Status</span>
              <span className="v">{statusLabel(doc.status)}</span>
            </div>
            <div className="mrow">
              <span>Category</span>
              <span className="v">{displayCategory(doc.category)}</span>
            </div>
            <div className="mrow">
              <span>Import</span>
              <span className="v">@ai-hooks/react</span>
            </div>
            <div className="mrow">
              <span>Bundle</span>
              <span className="v">tree-shakeable</span>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
