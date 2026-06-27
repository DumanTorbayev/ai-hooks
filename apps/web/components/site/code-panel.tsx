import { CopyButton } from "@/components/copy-button";

import { HighlightedCode } from "./code-highlighter";
import css from "./code-panel.module.css";

type CodePanelProps = {
  code: string;
  file: string;
  showLineNumbers?: boolean;
};

export function CodePanel({ code, file, showLineNumbers = true }: CodePanelProps) {
  return (
    <div className={css.panel}>
      <div className={css.head}>
        <span className={css.file}>{file}</span>
        <CopyButton className={css.copy_button} value={code} />
      </div>
      <pre className={css.code}>
        <code>
          <HighlightedCode code={code} showLineNumbers={showLineNumbers} />
        </code>
      </pre>
    </div>
  );
}
