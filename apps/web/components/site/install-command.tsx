import { CopyButton } from "@/components/copy-button";

const installCommand = "npm i @ai-hooks/react";

export function InstallCommand() {
  return (
    <div className="cmd" aria-label="Install command">
      <div className="pre">
        <span className="sigil">$</span>
        <code>
          npm i <span className="pkg">@ai-hooks/react</span>
        </code>
      </div>
      <CopyButton className="copybtn" copiedLabel="Copied" value={installCommand} />
    </div>
  );
}

