import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/home/site-header";
import { InfoIcon } from "@/components/icons";
import shell from "@/components/site/docs-shell.module.css";
import { SidebarNav } from "@/components/site/sidebar-nav";
import { createPageMetadata } from "@/lib/metadata";

import css from "./examples.module.css";

export const metadata: Metadata = createPageMetadata({
  description: "Runnable AI Hooks examples that match the package and demo routes shipped today.",
  path: "/examples",
  title: "Examples",
});

export default function ExamplesPage() {
  return (
    <>
      <SiteHeader />
      <main className={`wrap ${shell.docsLayout}`}>
        <SidebarNav />
        <div className={shell.main}>
          <div className={shell.crumbs}>
            <Link href="/docs">Docs</Link> / <span>Examples</span>
          </div>
          <h1 className={shell.pageTitle}>Examples</h1>
          <p className={shell.pageLede}>
            Runnable examples and implementation notes for the hooks that exist today. Examples use
            mock routes by default and keep provider keys on your server.
          </p>
          <div className={css.note}>
            <InfoIcon />
            <div>
              Current examples use <b>mock streams by default</b>. They never require project-owned
              provider keys and show where your own server route belongs.
            </div>
          </div>

          <article className={css.card}>
            <div className={css.card_head}>
              <span className={css.name}>Next Basic Chat</span>
              <div className={css.badges}>
                <span className="status stable">runnable</span>
                <span className="cat-tag">Next.js</span>
                <span className="cat-tag">mock-stream</span>
              </div>
            </div>
            <div className={css.card_body}>
              <div className={css.left}>
                <p>
                  A minimal App Router chat built with <code>useChatStream</code>,{" "}
                  <code>useAbortController</code>, and <code>useConversationStorage</code>. It shows
                  send → stream → stop with a mock API route.
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
                <div className={css.actions}>
                  <Link className="btn primary sm" href="/docs/use-chat-stream">
                    Open useChatStream
                  </Link>
                  <Link
                    className="btn sm"
                    href="https://github.com/DumanTorbayev/ai-hooks/tree/main/examples/next-basic-chat"
                  >
                    Open example →
                  </Link>
                </div>
              </div>
              <div className={css.right}>
                <div className={css.mini}>
                  <div className={css.mini_head}>app/page.tsx — preview</div>
                  <div className={css.mini_body}>
                    <div className={`${css.message} ${css.user}`}>
                      <div className={css.avatar}>YOU</div>
                      <div className={css.bubble}>Hello!</div>
                    </div>
                    <div className={`${css.message} ${css.bot}`}>
                      <div className={css.avatar}>AI</div>
                      <div className={css.bubble}>
                        Streaming reply from the mock route
                        <span className={css.cursor} />
                      </div>
                    </div>
                  </div>
                </div>
                <code className={css.command}>
                  pnpm --filter @ai-hooks/example-next-basic-chat dev
                </code>
              </div>
            </div>
          </article>

          <div className={css.empty}>
            More examples will be listed here only after they exist in the repository and pass the
            same build checks.
          </div>
        </div>
      </main>
    </>
  );
}
