import { SupportButton } from "@/components/support-button";

type SiteHeaderProps = {
  active?: "cost" | "tokens" | "models" | "providers" | "docs";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a className="brand" href="/">
          <span className="glyph">AI</span>
          AI Hooks <span className="ver">mvp</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className={active === "docs" ? "active" : undefined} href="/docs">
            Docs
          </a>
          <a className={active === "cost" ? "active" : undefined} href="/cost-calculator">
            Cost
          </a>
          <a className={active === "tokens" ? "active" : undefined} href="/token-estimator">
            Tokens
          </a>
          <a className={active === "models" ? "active" : undefined} href="/model-comparison">
            Models
          </a>
          <a
            className={active === "providers" ? "active" : undefined}
            href="/provider-compatibility"
          >
            Providers
          </a>
        </nav>
        <div className="nav-spacer" />
        <SupportButton className="btn support sm" />
        <a className="btn primary sm" href="/docs">
          Get started
        </a>
      </div>
    </header>
  );
}
