import { CoffeeIcon } from "@/components/icons";
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
      <CoffeeIcon />
      <span className="lbl">Buy me a coffee</span>
    </a>
  );
}
