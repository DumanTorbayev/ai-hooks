"use client";

import { useEffect, useState } from "react";

import { GitHubIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { CommandPalette } from "@/components/site/command-palette";
import { ThemeToggle } from "@/components/site/theme-toggle";

import styles from "./site-header.module.css";

type SiteHeaderProps = {
  active?: "docs";
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
      <header className={`${styles.header} ${mobileOpen ? styles.menuOpen : ""}`}>
        <div className={`wrap ${styles.row}`}>
          <a className={styles.brand} href="/">
            <span className={styles.glyph}>⌘</span>
            <span>AI Hooks</span>
          </a>

          <nav className={styles.nav} aria-label="Primary navigation">
            <a className={active === "docs" ? styles.active : undefined} href="/docs">
              Docs
            </a>
          </nav>

          <div className={styles.spacer} />

          <div className={styles.actions}>
            <button
              className={styles.searchButton}
              onClick={() => setPaletteOpen(true)}
              type="button"
            >
              <SearchIcon size={13} />
              Search docs <span className={styles.kbd}>⌘K</span>
            </button>
            <ThemeToggle />
            <a
              aria-label="GitHub repository"
              className={styles.github}
              href="https://github.com/DumanTorbayev/ai-hooks"
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon size={16} />
            </a>
            <button
              aria-label="Open mobile menu"
              className={styles.hamburger}
              onClick={() => setMobileOpen((current) => !current)}
              type="button"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className={`wrap ${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
          <a href="/docs" onClick={() => setMobileOpen(false)}>
            Docs
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
