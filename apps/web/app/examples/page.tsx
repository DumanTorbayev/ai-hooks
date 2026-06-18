import type { Metadata } from "next";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { CopyButton } from "@/components/copy-button";
import { InfoIcon } from "@/components/icons";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  description: "Current AI Hooks examples that match the package and demo routes shipped today.",
  path: "/examples",
  title: "Examples",
});

const cloneCommand = "npx @ai-hooks/example next-basic-chat";

export default function ExamplesPage() {
  return (
    <>
      <TopBanner />
      <SiteHeader active="examples" />
      <main className="wrap doc-layout">
        <SidebarNav active={{ kind: "examples" }} />
        <div className="doc-main">
          <div className="crumbs">
            <a href="/docs">Docs</a> / <span>Examples</span>
          </div>
          <h1 className="page-title">Examples</h1>
          <p className="page-lede">
            Runnable starting points built from the shipped hooks. There is one example
            today — more appear here only once they ship.
          </p>
          <div className="ex-note">
            <InfoIcon />
            <div>
              Examples run on a <b>mock streaming engine by default</b> so you can clone
              and run them with no keys. To use a real model, add your own provider key
              to the example&apos;s server route.
            </div>
          </div>

          <article className="ex-card">
            <div className="ec-head">
              <span className="name">Next Basic Chat</span>
              <div className="badges">
                <span className="status stable">stable</span>
                <span className="cat-tag">Next.js</span>
                <span className="cat-tag">mock-stream</span>
              </div>
            </div>
            <div className="ec-body">
              <div className="ec-left">
                <p>
                  A minimal streaming chat built with <code>useChatStream</code> on a
                  Next.js App Router route. Shows the send → stream → stop loop and an
                  optional token counter.
                </p>
                <ul>
                  <li>
                    Streaming via <code>useChatStream</code>
                  </li>
                  <li>
                    Stop generation with <code>useAbortController</code>
                  </li>
                  <li>
                    Token counter with <code>useTokenUsage</code>
                  </li>
                  <li>
                    Mock route at <code>app/api/chat/route.ts</code>
                  </li>
                </ul>
                <div className="ec-actions">
                  <a className="btn primary sm" href="/docs/use-chat-stream">
                    Open useChatStream
                  </a>
                  <CopyButton className="btn sm" value={cloneCommand} />
                </div>
              </div>
              <div className="ec-right">
                <div className="ex-mini">
                  <div className="emh">app/page.tsx — preview</div>
                  <div className="emb">
                    <div className="pm user">
                      <div className="av">YOU</div>
                      <div className="b">Hello!</div>
                    </div>
                    <div className="pm bot">
                      <div className="av">AI</div>
                      <div className="b">
                        Streaming reply from the mock route<span className="cur" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cmd">
                  <div className="pre">
                    <span className="sigil">$</span>
                    <code>
                      npx <span className="pkg">@ai-hooks/example</span> next-basic-chat
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="ex-empty">
            More examples are in progress and will be listed here only once they ship.
            This page never shows examples that do not exist yet.
          </div>
        </div>
      </main>
    </>
  );
}
