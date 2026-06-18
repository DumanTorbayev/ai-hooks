"use client";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "@/components/icons";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    setTheme(next);

    try {
      localStorage.setItem("aih-theme", next);
    } catch {
      // Theme should still work for the current session when storage is unavailable.
    }
  }

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
      className="icon-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true" className="moon">
        <MoonIcon />
      </span>
      <span aria-hidden="true" className="sun">
        <SunIcon />
      </span>
    </button>
  );
}
