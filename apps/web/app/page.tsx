import { ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";
import { MockChatDemo } from "@/components/mock-chat-demo";
import { InstallCommand } from "@/components/site/install-command";
import { displayCategory, statusClass, statusLabel } from "@/content/hook-meta";
import { hookDocs } from "@/content/hook-docs";

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="wrap home-grid">
            <div>
              <span className="eyebrow">React hooks · MIT · React 18 + 19</span>
              <h1 className="h1">React hooks for building AI product interfaces.</h1>
              <p className="lede">
                A small, headless toolkit of hooks for streaming chat, token usage, file
                inputs, and tool calls. <b>You own the server routes and the provider keys</b>
                {" "}— AI Hooks ships UI logic, not a hosted API.
              </p>
              <InstallCommand />
              <div className="home-cta">
                <a className="btn primary" href="/docs">
                  Browse docs
                </a>
                <a className="btn" href="/examples">
                  View examples
                </a>
              </div>
              <div className="home-note">
                <ShieldCheck aria-hidden="true" size={15} strokeWidth={1.8} />
                Demos here run on a local mock stream. No keys, no network, no spend.
              </div>
            </div>
            <MockChatDemo />
          </div>
        </section>

        <section className="home-hooks">
          <div className="wrap">
            <div className="section-h">
              <div>
                <span className="eyebrow">// the package</span>
                <h2>Shipped hooks</h2>
              </div>
              <a className="link" href="/docs">
                All docs →
              </a>
            </div>
            <div className="hooks-row">
              {hookDocs.map((doc) => (
                <a className="hrow-card" href={`/docs/${doc.slug}`} key={doc.slug}>
                  <div className="top">
                    <span className="hn">
                      <span className="h">use</span>
                      {doc.name.replace("use", "")}
                    </span>
                    <span className={`status ${statusClass(doc.status)}`}>
                      {statusLabel(doc.status)}
                    </span>
                  </div>
                  <p>{doc.summary}</p>
                  <span className="cat-tag cat">{displayCategory(doc.category)}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
