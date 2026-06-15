export function SiteHeader() {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a className="brand" href="#">
          <span className="glyph">AI</span>
          AI Hooks <span className="ver">mvp</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className="active" href="#hooks">
            Hooks
          </a>
          <a href="#patterns">Patterns</a>
          <a href="#playground">Playground</a>
          <a href="#models">Models</a>
          <a href="#docs">Docs</a>
        </nav>
        <div className="nav-spacer" />
        <a className="btn sm" href="#docs">
          Scope
        </a>
        <a className="btn primary sm" href="#playground">
          Try demo
        </a>
      </div>
    </header>
  );
}
