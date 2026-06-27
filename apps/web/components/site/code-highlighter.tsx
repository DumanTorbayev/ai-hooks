import type { ReactNode } from "react";

import css from "./code-panel.module.css";

type HighlightedCodeProps = {
  code: string;
  showLineNumbers: boolean;
};

export function HighlightedCode({ code, showLineNumbers }: HighlightedCodeProps) {
  if (!showLineNumbers) {
    return <span className={css.plain_code}>{highlightCode(code)}</span>;
  }

  return highlightCodeLines(code);
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

function highlightCodeLines(code: string) {
  const lines = splitLines(highlightCode(code));

  return lines.map((line, index) => (
    <span className={css.line} key={index}>
      <span className={css.line_number}>{index + 1}</span>
      <span className={css.line_code}>{line.length > 0 ? line : "\n"}</span>
    </span>
  ));
}

function highlightCode(code: string): ReactNode[] {
  const output: ReactNode[] = [];
  let lastIndex = 0;
  let inJsxTag = false;
  let jsxExpressionDepth = 0;
  let jsxTagNamePending = false;
  let previousToken: string | undefined;
  let activeJsxAttribute: string | undefined;

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
      memberTokenKind: getMemberTokenKind(code, token, index, previousToken, {
        activeJsxAttribute,
        inJsxTag,
        jsxExpressionDepth,
      }),
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

    if (
      inJsxTag &&
      jsxExpressionDepth === 0 &&
      !jsxTagNamePending &&
      isIdentifierToken(token) &&
      isFollowedByAttributeAssignment(code, index + token.length)
    ) {
      activeJsxAttribute = token;
    }

    if (inJsxTag) {
      jsxExpressionDepth = Math.max(
        0,
        jsxExpressionDepth + countCharacter(token, "{") - countCharacter(token, "}"),
      );

      if (jsxExpressionDepth === 0 && token.includes("}")) {
        activeJsxAttribute = undefined;
      }
    }

    if (inJsxTag && token.includes(">")) {
      inJsxTag = false;
      jsxExpressionDepth = 0;
      jsxTagNamePending = false;
      activeJsxAttribute = undefined;
    }

    lastIndex = index + token.length;
    previousToken = token;
  }

  if (lastIndex < code.length) {
    output.push(code.slice(lastIndex));
  }

  return output;
}

function splitLines(nodes: ReactNode[]) {
  const lines: ReactNode[][] = [[]];

  for (const node of nodes) {
    if (typeof node !== "string") {
      lines[lines.length - 1].push(node);
      continue;
    }

    const parts = node.split("\n");

    for (let index = 0; index < parts.length; index += 1) {
      if (index > 0) {
        lines.push([]);
      }

      if (parts[index]) {
        lines[lines.length - 1].push(parts[index]);
      }
    }
  }

  return lines;
}

function getTokenClassName(
  token: string,
  context: {
    inJsxTag: boolean;
    jsxExpressionDepth: number;
    jsxTagNamePending: boolean;
    memberTokenKind?: "method" | "property";
  },
) {
  if (token.startsWith("//")) return css.token_comment;
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    return css.token_string;
  }
  if (token.startsWith("@")) return css.token_string;
  if (context.jsxTagNamePending && isIdentifierToken(token)) return css.token_jsx_tag;
  if (context.memberTokenKind === "method") return css.token_method;
  if (context.memberTokenKind === "property") return css.token_property;
  if (context.inJsxTag && context.jsxExpressionDepth === 0 && isIdentifierToken(token)) {
    return css.token_jsx_attribute;
  }
  if (keywordTokens.has(token)) return css.token_keyword;
  if (token.startsWith("use") && token.length > 3) return css.token_function;
  if (/^[A-Z]/.test(token)) return css.token_type;
  if (/^\d/.test(token)) return css.token_number;
  if (/^[{}()[\].,;:=<>/+\-*]+$/.test(token)) return css.token_punctuation;
  return css.token_plain;
}

function getMemberTokenKind(
  code: string,
  token: string,
  index: number,
  previousToken: string | undefined,
  context: { activeJsxAttribute?: string; inJsxTag: boolean; jsxExpressionDepth: number },
) {
  if (previousToken !== "." || !isIdentifierToken(token)) {
    return undefined;
  }

  if (
    isFollowedByCall(code, index + token.length) ||
    (context.inJsxTag &&
      context.jsxExpressionDepth > 0 &&
      Boolean(context.activeJsxAttribute?.match(/^on[A-Z]/)))
  ) {
    return "method";
  }

  return "property";
}

function isFollowedByCall(code: string, index: number) {
  for (let currentIndex = index; currentIndex < code.length; currentIndex += 1) {
    const character = code[currentIndex];

    if (/\s/.test(character)) {
      continue;
    }

    return character === "(";
  }

  return false;
}

function isFollowedByAttributeAssignment(code: string, index: number) {
  for (let currentIndex = index; currentIndex < code.length; currentIndex += 1) {
    const character = code[currentIndex];

    if (/\s/.test(character)) {
      continue;
    }

    return character === "=";
  }

  return false;
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
    previous === undefined ||
    /\s/.test(previous) ||
    previous === "(" ||
    previous === "[" ||
    previous === "{";

  return Boolean(hasJsxBoundary && next && /[A-Za-z]/.test(next));
}
