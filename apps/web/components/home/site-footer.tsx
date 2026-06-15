export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <a className="brand" href="/">
            <span className="glyph">AI</span> AI Hooks
          </a>
          <p>Headless React primitives for production AI interfaces.</p>
          <div className="foot-install">
            <code>
              npm i <span className="pkg">@ai-hooks/react</span>
            </code>
          </div>
        </div>
        <div>
          <h4>Product</h4>
          <a href="/#hooks">Hooks</a>
          <a href="/#patterns">Patterns</a>
          <a href="/cost-calculator">Cost calculator</a>
          <a href="/#playground">Playground</a>
          <a href="/#models">Models</a>
        </div>
        <div>
          <h4>Docs</h4>
          <a href="/#docs">MVP scope</a>
          <a href="/#docs">Provider adapters</a>
          <a href="/#docs">Bundle size</a>
          <a href="/#docs">Monetization notes</a>
        </div>
        <div>
          <h4>Principles</h4>
          <a href="/#docs">No hosted API</a>
          <a href="/#docs">No telemetry by default</a>
          <a href="/#docs">Subpath exports</a>
          <a href="/#docs">Mock demos first</a>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>MIT License · © 2026 AI Hooks · not affiliated with any model provider</span>
      </div>
    </footer>
  );
}
