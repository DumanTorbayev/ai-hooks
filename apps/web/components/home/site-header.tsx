type SiteHeaderProps = {
  active?: "home" | "cost";
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a className="brand" href="/">
          <span className="glyph">AI</span>
          AI Hooks <span className="ver">mvp</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className={active === "home" ? "active" : undefined} href="/#hooks">
            Hooks
          </a>
          <a href="/#patterns">Patterns</a>
          <a className={active === "cost" ? "active" : undefined} href="/cost-calculator">
            Calculator
          </a>
          <a href="/#playground">Playground</a>
          <a href="/#models">Models</a>
          <a href="/#docs">Docs</a>
        </nav>
        <div className="nav-spacer" />
        <a className="btn sm" href="/#docs">
          Scope
        </a>
        <a className="btn primary sm" href="/cost-calculator">
          Cost calculator
        </a>
      </div>
    </header>
  );
}
