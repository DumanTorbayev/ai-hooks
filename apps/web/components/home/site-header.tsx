"use client";

import { useEffect, useState } from "react";

import { GitHubIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { CommandPalette } from "@/components/site/command-palette";
import { ThemeToggle } from "@/components/site/theme-toggle";

type SiteHeaderProps = {
  active?: "docs" | "examples";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      <header className={`site-header ${mobileOpen ? "menu-open" : ""}`}>
        <div className="wrap hd-row">
          <a className="brand" href="/">
            <span className="glyph">⌘</span>
            <span>AI Hooks</span>
            <span className="ver">v2.4</span>
          </a>

          <nav className="hd-nav" aria-label="Primary navigation">
            <a className={active === "docs" ? "active" : undefined} href="/docs">
              Docs
            </a>
            <a className={active === "examples" ? "active" : undefined} href="/examples">
              Examples
            </a>
          </nav>

          <div className="hd-spacer" />

          <div className="hd-right">
            <button className="kbtn" onClick={() => setPaletteOpen(true)} type="button">
              <SearchIcon size={13} />
              Search docs <span className="kbd">⌘K</span>
            </button>
            <ThemeToggle />
            <a
              aria-label="GitHub repository"
              className="gh"
              href="https://github.com/DumanTorbayev/ai-hooks"
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon size={16} />
            </a>
            <button
              aria-label="Open mobile menu"
              className="hamburger"
              onClick={() => setMobileOpen((current) => !current)}
              type="button"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className={`wrap m-menu ${mobileOpen ? "open" : ""}`}>
          <a href="/docs" onClick={() => setMobileOpen(false)}>
            Docs
          </a>
          <a href="/examples" onClick={() => setMobileOpen(false)}>
            Examples
          </a>
          <a
            href="https://github.com/DumanTorbayev/ai-hooks"
            onClick={() => setMobileOpen(false)}
            rel="noreferrer"
            target="_blank"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <CommandPalette onClose={() => setPaletteOpen(false)} open={paletteOpen} />
    </>
  );
}
