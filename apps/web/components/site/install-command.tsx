import { CopyButton } from "@/components/copy-button";

import css from "./install-command.module.css";

const installCommand = "npm i @ai-hooks/react";

export function InstallCommand() {
  return (
    <div className={css.wrap}>
      <span className={css.label}>release install target</span>
      <div className={css.command} aria-label="Install command">
        <div className={css.pre}>
          <span className={css.sigil}>$</span>
          <code>
            npm i <span className={css.package_name}>@ai-hooks/react</span>
          </code>
        </div>
        <CopyButton className={css.copy_button} copiedLabel="Copied" value={installCommand} />
      </div>
    </div>
  );
}
