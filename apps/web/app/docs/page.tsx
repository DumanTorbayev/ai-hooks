import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { SiteHeader } from "@/components/home/site-header";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description: "Introduction to AI Hooks and its headless React hook model.",
  path: "/docs",
  title: "Introduction",
});

export default function DocsIndexPage() {
  return (
    <>
      <SiteHeader active="docs" />
      <main className="wrap doc-layout">
        <SidebarNav active={{ kind: "docs" }} />
        <div className="doc-main">
          <div className="crumbs">
            <a href="/">Home</a> / <span>Documentation</span> / <span>Introduction</span>
          </div>
          <h1 className="page-title">Introduction</h1>
          <p className="page-lede">
            AI Hooks is a small set of <b>headless React hooks</b> for building AI
            product interfaces — streaming chat, token usage, file inputs, and tool
            calls. It is <b>not</b> a hosted API, a proxy, or a UI kit: you keep your
            own server routes, provider keys, and markup. Find a hook in the sidebar,
            read its API, copy the usage, and ship.
          </p>

          <div className="principles">
            <div className="principle">
              <h4>
                <span className="ic">⌘</span> Headless
              </h4>
              <p>Hooks return state and actions only. You render every pixel.</p>
            </div>
            <div className="principle">
              <h4>
                <span className="ic">⌘</span> Your keys
              </h4>
              <p>The package never proxies model calls. Keys live on your server.</p>
            </div>
            <div className="principle">
              <h4>
                <span className="ic">⌘</span> Provider-agnostic
              </h4>
              <p>Swap models across providers without touching UI code.</p>
            </div>
            <div className="principle">
              <h4>
                <span className="ic">⌘</span> Zero deps
              </h4>
              <p>Tree-shakeable, small, and framework-friendly.</p>
            </div>
          </div>

          <section className="dsec" id="installation">
            <h3>
              <span className="hash">#</span> Installation
            </h3>
            <CodePanel code="npm i @ai-hooks/react" file="terminal" showLineNumbers={false} />
            <p className="doc-note">
              Then import a hook and point it at a route you control — your provider
              key stays on the server.
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
            <p className="doc-note">
              Browse the full hook list in the sidebar — each entry links straight to
              its API reference.
            </p>
          </section>

          <div className="tools-callout">
            <div className="tc-txt">
              <b>Planning tools</b> — cost, tokens, models, providers. Reference
              utilities for designing an AI UI, <b>not part of the package API</b>.
              They live in the sidebar.
            </div>
            <a className="btn sm" href="/tools">
              Open tools →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
