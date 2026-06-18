import { SupportButton } from "@/components/support-button";

type SiteHeaderProps = {
  active?: "docs" | "examples";
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
          <a
            className={active === "examples" ? "active" : undefined}
            href="/examples"
          >
            Examples
          </a>
          <a
            href="https://github.com/DumanTorbayev/ai-hooks"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
        <div className="nav-spacer" />
        <SupportButton className="btn support sm" />
      </div>
    </header>
  );
}
