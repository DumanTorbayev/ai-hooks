import { SupportButton } from "@/components/support-button";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot-compact">
        <a className="brand" href="/">
          <span className="glyph">AI</span> AI Hooks
        </a>
        <div className="foot-install">
          <code>
            npm i <span className="pkg">@ai-hooks/react</span>
          </code>
        </div>
        <div className="foot-links">
          <a href="/docs">Docs</a>
          <a href="/cost-calculator">Cost calculator</a>
          <a href="/provider-compatibility">Provider matrix</a>
          <a
            href="https://github.com/DumanTorbayev/ai-hooks"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <SupportButton className="btn support sm foot-support" />
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>MIT License · © 2026 AI Hooks · not affiliated with any model provider</span>
      </div>
    </footer>
  );
}
