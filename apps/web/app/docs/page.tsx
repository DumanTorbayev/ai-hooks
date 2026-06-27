import type { Metadata } from "next";
import Link from "next/link";

import { CodePanel } from "@/components/site/code-panel";
import { SiteHeader } from "@/components/home/site-header";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { createPageMetadata } from "@/lib/metadata";

import css from "@/components/site/docs-shell.module.css";

export const metadata: Metadata = createPageMetadata({
  description: "Introduction to AI Hooks and its headless React hook model.",
  path: "/docs",
  title: "Introduction",
});

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader active="docs" />
      <main className={`wrap ${css.docs_layout}`}>
        <SidebarNav active={{ kind: "docs" }} />
        <div className={css.main}>
          <div className={css.crumbs}>
            <Link href="/">Home</Link> / <span>Documentation</span> / <span>Introduction</span>
          </div>
          <h1 className={css.page_title}>Introduction</h1>
          <p className={css.page_lede}>
            AI Hooks is a small set of <b>headless React hooks</b> for building AI product
            interfaces — streaming chat, token usage, file inputs, and tool calls. It is <b>not</b>{" "}
            a hosted API, a proxy, or a UI kit: you keep your own server routes, provider keys, and
            markup. Start with <Link href="/docs/use-chat-stream">useChatStream</Link>, then add
            storage, cancellation, usage, files, or tools only when your UI needs them. Every hook
            reference includes a package boundary so it is clear what AI Hooks handles and what
            stays in your app.
          </p>

          <div className={css.principles}>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> Headless
              </h4>
              <p>Hooks return state and actions only. You render every pixel.</p>
            </div>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> Your keys
              </h4>
              <p>The package never proxies model calls. Keys live on your server.</p>
            </div>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> Provider-agnostic
              </h4>
              <p>Swap models across providers without touching UI code.</p>
            </div>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> No provider SDKs
              </h4>
              <p>The hooks stay small and do not bundle model-provider clients.</p>
            </div>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> Clear boundary
              </h4>
              <p>Each hook documents what the package owns and what your app owns.</p>
            </div>
            <div className={css.principle}>
              <h4>
                <span className={css.principle_icon}>⌘</span> Composable
              </h4>
              <p>Start with one hook, then add storage, usage, files, or tools only when needed.</p>
            </div>
          </div>

          <section className={css.section} id="installation">
            <h3>
              <span className={css.hash}>#</span> Installation
            </h3>
            <CodePanel code="npm i @ai-hooks/react" file="terminal" showLineNumbers={false} />
            <p className={css.doc_note}>
              This is the release install target. During the current MVP, the package remains
              private until the API, examples, and release checks are ready.
            </p>
            <p className={css.doc_note}>
              Then import a hook and point it at a route you control. AI Hooks never receives your
              prompts or keys; your server route calls the provider.
            </p>
            <CodePanel
              code={`import { useChatStream } from "@ai-hooks/react";

export function Chat() {
  const chat = useChatStream({ endpoint: "/api/chat" });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void chat.send();
      }}
    >
      <textarea
        value={chat.input}
        onChange={(event) => chat.setInput(event.target.value)}
      />
      <button disabled={chat.isStreaming}>Send</button>
    </form>
  );
}`}
              file="app/chat.tsx"
            />
            <p className={css.doc_note}>
              This is the first hook most teams should open. It gives you composer state, stream
              state, and callbacks; your app still owns the messages and server route.
            </p>
          </section>

          <div className={css.tools_callout}>
            <div className={css.tools_callout_text}>
              <b>Next:</b> open <Link href="/docs/use-chat-stream">useChatStream</Link> for the
              first real API reference. Planning tools for cost, tokens, models, and providers are
              reference utilities, <b>not part of the package API</b>.
            </div>
            <Link className="btn sm" href="/docs/use-chat-stream">
              Open first hook →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
