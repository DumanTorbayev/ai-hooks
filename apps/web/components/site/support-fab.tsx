import { SupportIcon } from "@/components/icons";
import { siteConfig } from "@/content/site";

import styles from "./support-fab.module.css";

export function SupportFab() {
  if (!siteConfig.supportUrl) {
    return null;
  }

  return (
    <a
      aria-label="Support project"
      className={styles.link}
      href={siteConfig.supportUrl}
      rel="noreferrer"
      target="_blank"
    >
      <SupportIcon />
      <span className={styles.label}>Support project</span>
    </a>
  );
}
