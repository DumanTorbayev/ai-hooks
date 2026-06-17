import { describe, expect, it } from "vitest";

import { estimateTokens } from "./tokens";

describe("estimateTokens", () => {
  it("returns zero for empty text", () => {
    expect(estimateTokens({ text: "" })).toBe(0);
    expect(estimateTokens({ text: "   " })).toBe(0);
  });

  it("trims text and uses the default character ratio", () => {
    expect(estimateTokens({ text: "  abcde  " })).toBe(2);
  });

  it("supports a custom character ratio", () => {
    expect(estimateTokens({ charsPerToken: 3, text: "abcdef" })).toBe(2);
  });
});
