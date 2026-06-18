import type { ReactNode } from "react";

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
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

const keywordTokens = new Set([
  "as",
  "async",
  "await",
  "catch",
  "const",
  "else",
  "export",
  "false",
  "finally",
  "from",
  "function",
  "if",
  "import",
  "interface",
  "let",
  "new",
  "null",
  "return",
  "throw",
  "true",
  "try",
  "type",
  "undefined",
  "var",
  "void",
]);

const tokenPattern =
  /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|@[a-zA-Z0-9_/-]+|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:=<>/+\-*]+)/g;

function highlightCode(code: string) {
  const output: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      output.push(code.slice(lastIndex, index));
    }

    output.push(
      <span className={getTokenClassName(token)} key={`${index}-${token}`}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < code.length) {
    output.push(code.slice(lastIndex));
  }

  return output;
}

function getTokenClassName(token: string) {
  if (token.startsWith("//")) return "tok-comment";
  if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) {
    return "tok-string";
  }
  if (token.startsWith("@")) return "tok-string";
  if (keywordTokens.has(token)) return "tok-keyword";
  if (token.startsWith("use") && token.length > 3) return "tok-function";
  if (/^[A-Z]/.test(token)) return "tok-type";
  if (/^\d/.test(token)) return "tok-number";
  if (/^[{}()[\].,;:=<>/+\-*]+$/.test(token)) return "tok-punctuation";
  return "tok-plain";
}
