import { CopyButton } from "@/components/copy-button";

import styles from "./install-command.module.css";

const installCommand = "npm i @ai-hooks/react";

export function InstallCommand() {
  return (
    <div className={styles.command} aria-label="Install command">
      <div className={styles.pre}>
        <span className={styles.sigil}>$</span>
        <code>
          npm i <span className={styles.packageName}>@ai-hooks/react</span>
        </code>
      </div>
      <CopyButton className={styles.copyButton} copiedLabel="Copied" value={installCommand} />
    </div>
  );
}
