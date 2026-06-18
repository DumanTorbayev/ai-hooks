import { CopyButton } from "@/components/copy-button";
import { MockChatDemo } from "../mock-chat-demo";

const installCommand = "npm i @ai-hooks/react";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            Open-source React hooks for AI UI
          </div>
          <h1 className="head">
            Build AI interfaces without locking into a provider.
          </h1>
          <p className="sub">
            AI Hooks gives you small headless React hooks for streaming chat, stop
            generation, local conversation state, token usage, tool calls, and file
            upload flows.
          </p>

          <div className="featurow" aria-label="Feature highlights">
            {["chat streams", "abort", "storage", "usage", "tools", "files"].map((item) => (
              <span className="chip" key={item}>
                <span className="pl">+</span>
                {item}
              </span>
            ))}
          </div>

          <div className="cmd" aria-label="Install command">
            <div className="pre">
              <span className="sigil">$</span>
              <code>
                npm i <span className="pkg">@ai-hooks/react</span>
              </code>
            </div>
            <CopyButton className="copybtn" value={installCommand} />
          </div>
          <div className="cmd-meta">
            <span>1 package</span>
            <span>0 provider SDKs in your UI</span>
            <span>your API route keeps the keys</span>
          </div>

          <div className="notice">
            <span className="notice-icon">✓</span>
            <p>
              <b>This is not a hosted AI API.</b> The library manages UI state. Your app
              still sends requests through your own backend and provider account.
            </p>
          </div>

          <div className="hero-actions">
            <a className="btn accent sm" href="/docs/use-chat-stream">
              Start with useChatStream
            </a>
            <a className="btn sm" href="#hooks">
              See current hooks
            </a>
          </div>
        </div>

        <MockChatDemo />
      </div>
    </section>
  );
}
