import Link from "next/link";

import { CheckIcon } from "@/components/icons";
import { SiteHeader } from "@/components/home/site-header";
import { MockChatDemo } from "@/components/mock-chat-demo";
import { InstallCommand } from "@/components/site/install-command";
import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";

import css from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={css.hero}>
          <div className={`wrap ${css.grid}`}>
            <div>
              <span className="eyebrow">React hooks · MIT · React 18 + 19</span>
              <h1 className={css.title}>React hooks for building AI product interfaces.</h1>
              <p className={css.lede}>
                A small, headless toolkit of hooks for streaming chat, token usage, file inputs, and
                tool calls. <b>You own the server routes and the provider keys</b> — AI Hooks ships
                UI logic, not a hosted API.
              </p>
              <InstallCommand />
              <div className={css.cta}>
                <Link className="btn primary" href="/docs/use-chat-stream">
                  Start with useChatStream
                </Link>
                <Link className="btn" href="/docs">
                  Browse all docs
                </Link>
              </div>
              <div className={css.note}>
                <CheckIcon size={14} />
                No hosted API: your route calls the provider, demos use local mock streams.
              </div>
            </div>
            <MockChatDemo />
          </div>
        </section>

        <section className={css.hooks}>
          <div className="wrap">
            <div className={css.section_header}>
              <div>
                <span className="eyebrow">// the package</span>
                <h2>Shipped hooks</h2>
              </div>
              <Link className="link" href="/docs">
                All docs →
              </Link>
            </div>
            <div className={css.hooks_row}>
              {hookDocs.map((doc) => (
                <Link className={css.hook_card} href={`/docs/${doc.slug}`} key={doc.slug}>
                  <div className={css.hook_card_top}>
                    <span className={css.hook_name}>
                      <span className={css.hook_name_prefix}>use</span>
                      {doc.name.replace("use", "")}
                    </span>
                    <span className={`status ${statusClass(doc.status)}`}>
                      {statusLabel(doc.status)}
                    </span>
                  </div>
                  <p className={css.hook_summary}>{doc.summary}</p>
                  <span className={`cat-tag ${css.hook_category}`}>
                    {displayCategory(doc.category)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
