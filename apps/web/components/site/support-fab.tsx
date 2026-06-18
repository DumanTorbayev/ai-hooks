import { Coffee } from "lucide-react";

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
      <Coffee aria-hidden="true" size={15} strokeWidth={1.8} />
      <span className="lbl">Buy me a coffee</span>
    </a>
  );
}
