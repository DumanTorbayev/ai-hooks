import Link from "next/link";
import type { ReactNode } from "react";

import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";

import { CodePanel } from "./code-panel";
import css from "./docs-shell.module.css";
import { SidebarNav } from "./sidebar-nav";

type HookDocItem = (typeof hookDocs)[number];
type HookPairItem = HookDocItem["pairsWith"][number];
type OptionItem = HookDocItem["options"][number];
type ReturnItem = HookDocItem["returns"][number];
type PairedHookDoc = HookPairItem & {
  target?: HookDocItem;
};

type HookDocDetailProps = {
  doc: HookDocItem;
};

export function HookDocDetail({ doc }: HookDocDetailProps) {
  const rootImport = `import { ${doc.name} } from "@ai-hooks/react";`;
  const relatedDocs = hookDocs.filter((item) =>
    doc.related.some((relatedName) => relatedName === item.name),
  );
  const pairedDocs = doc.pairsWith.map((pair) => ({
    ...pair,
    target: hookDocs.find((item) => item.name === pair.hook),
  }));

  return (
    <main className={`wrap ${css.detail_layout}`}>
      <SidebarNav active={{ kind: "hook", slug: doc.slug }} />
      <article className={css.detail_main}>
        <HookDocHeader doc={doc} />
        <BoundaryNote text={doc.boundary} />

        <DocSection id="import" title="Import">
          <CodePanel code={rootImport} file="import" showLineNumbers={false} />
        </DocSection>

        <DocSection id="usage" title="Usage">
          <CodePanel code={doc.example} file={`${doc.name}.tsx`} />
        </DocSection>

        <GuidanceSection id="when-to-use" items={doc.useWhen} title="When to use" />
        <GuidanceSection id="when-not-to-use" items={doc.avoidWhen} title="When not to use" />
        <GuidanceSection id="edge-cases" items={doc.edgeCases} title="Edge cases" />
        <PairsSection items={pairedDocs} />
        <OptionsSection items={doc.options} />
        <ReturnsSection items={doc.returns} />
        <RecipesSection items={doc.recipes} />
        <NotesSection items={doc.notes} />
        <RelatedHooksSection docs={relatedDocs} />
      </article>

      <HookDetailSide doc={doc} />
    </main>
  );
}

function HookDocHeader({ doc }: { doc: HookDocItem }) {
  return (
    <>
      <div className={css.crumbs}>
        <Link href="/docs">Docs</Link> / <span>{displayCategory(doc.category)}</span> /{" "}
        <span>{doc.name}</span>
      </div>
      <div className={css.detail_title}>
        <h1>
          <span className={css.hook_prefix}>use</span>
          {doc.name.replace("use", "")}
        </h1>
        <span className={`status ${statusClass(doc.status)}`}>{statusLabel(doc.status)}</span>
        <span className="cat-tag">{displayCategory(doc.category)}</span>
      </div>
      <p className={css.detail_purpose}>{doc.purpose}</p>
    </>
  );
}

function BoundaryNote({ text }: { text: string }) {
  return (
    <div className={css.boundary_note}>
      <b>Package boundary:</b> <InlineCodeText text={text} />
    </div>
  );
}

function DocSection({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section className={css.section} id={id}>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3>
      <span className={css.hash}>#</span> {children}
    </h3>
  );
}

function GuidanceSection({
  id,
  items,
  title,
}: {
  id: string;
  items: readonly string[];
  title: string;
}) {
  return (
    <DocSection id={id} title={title}>
      <ul className={css.guidance_list}>
        {items.map((item) => (
          <li key={item}>
            <InlineCodeText text={item} />
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

function PairsSection({ items }: { items: readonly PairedHookDoc[] }) {
  return (
    <DocSection id="pairs" title="Pairs well with">
      <div className={css.pair_grid}>
        {items.map((item) =>
          item.target ? (
            <Link className={css.pair_card} href={`/docs/${item.target.slug}`} key={item.hook}>
              <span>
                <span className={css.hook_prefix}>use</span>
                {item.hook.replace("use", "")}
              </span>
              <p>
                <InlineCodeText text={item.description} />
              </p>
            </Link>
          ) : (
            <div className={css.pair_card} key={item.hook}>
              <span>{item.hook}</span>
              <p>
                <InlineCodeText text={item.description} />
              </p>
            </div>
          ),
        )}
      </div>
    </DocSection>
  );
}

function OptionsSection({ items }: { items: readonly OptionItem[] }) {
  return (
    <DocSection id="options" title="Options">
      <div className={css.table_wrap}>
        <div className={css.table_scroll}>
          <table className={css.table}>
            <thead>
              <tr>
                <th>Option</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <span className={css.param_name}>{item.name}</span>
                    </td>
                    <td>
                      <span className={css.param_type}>{item.type}</span>
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
    </DocSection>
  );
}

function ReturnsSection({ items }: { items: readonly ReturnItem[] }) {
  return (
    <DocSection id="returns" title="Returns">
      <div className={css.table_wrap}>
        <div className={css.table_scroll}>
          <table className={css.table}>
            <thead>
              <tr>
                <th>Value</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td>
                    <span className={css.param_name}>{item.name}</span>
                  </td>
                  <td>
                    <span className={css.param_type}>{item.type}</span>
                  </td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DocSection>
  );
}

function RecipesSection({ items }: { items: readonly string[] }) {
  return (
    <DocSection id="recipes" title="Recipes">
      {items.map((recipe, index) => (
        <div className={css.recipe} key={recipe}>
          <div className={css.recipe_title}>
            <span className={css.recipe_number}>{index + 1}</span>
            <InlineCodeText text={recipe} />
          </div>
        </div>
      ))}
    </DocSection>
  );
}

function NotesSection({ items }: { items: readonly string[] }) {
  return (
    <DocSection id="server-notes" title="Server/provider notes">
      {items.map((item) => (
        <div className={css.source_note} key={item}>
          <InlineCodeText text={item} />
        </div>
      ))}
    </DocSection>
  );
}

function RelatedHooksSection({ docs }: { docs: readonly HookDocItem[] }) {
  return (
    <DocSection id="related" title="Related hooks">
      <div className={css.related_row}>
        {docs.map((item) => (
          <Link className={css.related_chip} href={`/docs/${item.slug}`} key={item.slug}>
            <span className={css.hook_prefix}>use</span>
            {item.name.replace("use", "")}
          </Link>
        ))}
      </div>
    </DocSection>
  );
}

function HookDetailSide({ doc }: { doc: HookDocItem }) {
  return (
    <aside className={css.detail_side}>
      <div className={css.on_this_page}>
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
      <div className={css.meta_card}>
        <h4>Details</h4>
        <div className={css.meta_row}>
          <span>Status</span>
          <span className={css.meta_value}>{statusLabel(doc.status)}</span>
        </div>
        <div className={css.meta_row}>
          <span>Category</span>
          <span className={css.meta_value}>{displayCategory(doc.category)}</span>
        </div>
        <div className={css.meta_row}>
          <span>Import</span>
          <span className={css.meta_value}>@ai-hooks/react</span>
        </div>
        <div className={css.meta_row}>
          <span>Bundle</span>
          <span className={css.meta_value}>tree-shakeable</span>
        </div>
      </div>
    </aside>
  );
}

function InlineCodeText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((chunk, index) =>
        chunk.startsWith("`") && chunk.endsWith("`") ? (
          <code className={css.inline_code} key={`${chunk}-${index}`}>
            {chunk.slice(1, -1)}
          </code>
        ) : (
          chunk
        ),
      )}
    </>
  );
}
