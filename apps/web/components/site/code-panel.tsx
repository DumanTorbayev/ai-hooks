import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";

import styles from "./code-panel.module.css";

type CodePanelProps = {
  code: string;
  file: string;
};

export function CodePanel({ code, file }: CodePanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span className={styles.file}>{file}</span>
        <CopyButton className={styles.copyButton} value={code} />
      </div>
      <pre className={styles.code}>
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
  let inJsxTag = false;
  let jsxExpressionDepth = 0;
  let jsxTagNamePending = false;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      output.push(code.slice(lastIndex, index));
    }

    const tokenClassName = getTokenClassName(token, {
      jsxExpressionDepth,
      inJsxTag,
      jsxTagNamePending,
    });

    output.push(
      <span className={tokenClassName} key={`${index}-${token}`}>
        {token}
      </span>,
    );

    if (isJsxTagStart(code, token, index)) {
      inJsxTag = true;
      jsxTagNamePending = token !== "<>" && token !== "</>";
    } else if (jsxTagNamePending && isIdentifierToken(token)) {
      jsxTagNamePending = false;
    }

    if (inJsxTag) {
      jsxExpressionDepth = Math.max(
        0,
        jsxExpressionDepth + countCharacter(token, "{") - countCharacter(token, "}"),
      );
    }

    if (inJsxTag && token.includes(">")) {
      inJsxTag = false;
      jsxExpressionDepth = 0;
      jsxTagNamePending = false;
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < code.length) {
    output.push(code.slice(lastIndex));
  }

  return output;
}

function getTokenClassName(
  token: string,
  context: { inJsxTag: boolean; jsxExpressionDepth: number; jsxTagNamePending: boolean },
) {
  if (token.startsWith("//")) return styles.tokenComment;
  if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) {
    return styles.tokenString;
  }
  if (token.startsWith("@")) return styles.tokenString;
  if (context.jsxTagNamePending && isIdentifierToken(token)) return styles.tokenJsxTag;
  if (context.inJsxTag && context.jsxExpressionDepth === 0 && isIdentifierToken(token)) {
    return styles.tokenJsxAttribute;
  }
  if (keywordTokens.has(token)) return styles.tokenKeyword;
  if (token.startsWith("use") && token.length > 3) return styles.tokenFunction;
  if (/^[A-Z]/.test(token)) return styles.tokenType;
  if (/^\d/.test(token)) return styles.tokenNumber;
  if (/^[{}()[\].,;:=<>/+\-*]+$/.test(token)) return styles.tokenPunctuation;
  return styles.tokenPlain;
}

function isIdentifierToken(token: string) {
  return /^[A-Za-z_$][\w$]*$/.test(token);
}

function countCharacter(value: string, character: string) {
  let count = 0;

  for (const current of value) {
    if (current === character) {
      count += 1;
    }
  }

  return count;
}

function isJsxTagStart(code: string, token: string, index: number) {
  if (!token.startsWith("<")) {
    return false;
  }

  const next = code[index + 1];
  const nextAfterSlash = code[index + 2];

  if (next === ">" || (next === "/" && nextAfterSlash === ">")) {
    return true;
  }

  if (next === "/" && nextAfterSlash && /[A-Za-z]/.test(nextAfterSlash)) {
    return true;
  }

  const previous = code[index - 1];
  const hasJsxBoundary =
    previous === undefined || /\s/.test(previous) || previous === "(" || previous === "[" || previous === "{";

  return Boolean(hasJsxBoundary && next && /[A-Za-z]/.test(next));
}
