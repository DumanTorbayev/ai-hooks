import { siteConfig } from "@/content/site";

export function SupportFab() {
  if (!siteConfig.supportUrl) {
    return null;
  }

  return (
    <a
      aria-label="Buy me a coffee"
      className="coffee-fab"
      href={siteConfig.supportUrl}
      rel="noreferrer"
      target="_blank"
    >
      <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 16 16" width="15">
        <path
          d="M3 5.5h8v3.8A3.7 3.7 0 0 1 7.3 13H6.7A3.7 3.7 0 0 1 3 9.3V5.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M11 6.5h1.2a1.8 1.8 0 0 1 0 3.6H11" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 2.5c.4.6.4 1.1 0 1.6M8 2.5c.4.6.4 1.1 0 1.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
      </svg>
      <span className="lbl">Buy me a coffee</span>
    </a>
  );
}

