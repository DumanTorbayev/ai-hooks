"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AiHooksLogo, GitHubIcon, MenuIcon, SearchIcon, SupportIcon } from "@/components/icons";
import { CommandPalette } from "@/components/site/command-palette";
import { ThemeToggle } from "@/components/site/theme-toggle";

import css from "./site-header.module.css";

const SUPPORT_URL = "https://opencollective.com/ai-hooks";

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
      <header className={`${css.header} ${mobileOpen ? css.menu_open : ""}`}>
        <div className={`wrap ${css.row}`}>
          <Link className={css.brand} href="/">
            <span className={css.glyph}>
              <AiHooksLogo />
            </span>
            <span>AI Hooks</span>
          </Link>

          <nav className={css.nav} aria-label="Primary navigation">
            <Link className={active === "docs" ? css.active : undefined} href="/docs">
              Docs
            </Link>
          </nav>

          <div className={css.spacer} />

          <div className={css.actions}>
            <button
              aria-label="Search docs ⌘K"
              className={css.search_button}
              onClick={() => setPaletteOpen(true)}
              type="button"
            >
              <SearchIcon size={15} />
              <span className={css.search_label}>Search docs</span>
              <span aria-hidden="true" className={css.kbd}>
                <span className={css.cmd_icon}>⌘</span>
                <span>K</span>
              </span>
            </button>
            <a className={css.support} href={SUPPORT_URL} rel="noreferrer" target="_blank">
              <SupportIcon size={15} />
              <span>Support project</span>
            </a>
            <ThemeToggle />
            <a
              aria-label="GitHub repository"
              className={css.github}
              href="https://github.com/DumanTorbayev/ai-hooks"
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon size={16} />
            </a>
            <button
              aria-label="Open mobile menu"
              className={css.hamburger}
              onClick={() => setMobileOpen((current) => !current)}
              type="button"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className={`wrap ${css.mobile_menu} ${mobileOpen ? css.mobile_menu_open : ""}`}>
          <Link href="/docs" onClick={() => setMobileOpen(false)}>
            Docs
          </Link>
          <a
            href={SUPPORT_URL}
            onClick={() => setMobileOpen(false)}
            rel="noreferrer"
            target="_blank"
          >
            Support project ↗
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
