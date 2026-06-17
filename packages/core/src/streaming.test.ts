import { describe, expect, it } from "vitest";

import { createMockTextStream } from "./streaming";

describe("createMockTextStream", () => {
  it("yields text in deterministic chunks", async () => {
    const chunks: string[] = [];

    for await (const chunk of createMockTextStream({
      chunkSize: 2,
      delayMs: 0,
      text: "abcdef",
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["ab", "cd", "ef"]);
  });
});
