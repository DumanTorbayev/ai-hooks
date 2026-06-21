import { SupportIcon } from "@/components/icons";
import { siteConfig } from "@/content/site";

export function SupportFab() {
  if (!siteConfig.supportUrl) {
    return null;
  }

  return (
    <a
      aria-label="Support project"
      className="support-fab"
      href={siteConfig.supportUrl}
      rel="noreferrer"
      target="_blank"
    >
      <SupportIcon />
      <span className="lbl">Support project</span>
    </a>
  );
}
