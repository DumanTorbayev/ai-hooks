import { CopyButton } from "@/components/copy-button";

type CodePanelProps = {
  code: string;
  file: string;
};

export function CodePanel({ code, file }: CodePanelProps) {
  return (
    <div className="codepanel">
      <div className="cp-head">
        <span className="cp-file">{file}</span>
        <CopyButton className="cp-copy" value={code} />
      </div>
      <pre className="code">
        <code>{code}</code>
      </pre>
    </div>
  );
}

