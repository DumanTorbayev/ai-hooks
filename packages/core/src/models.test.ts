import { describe, expect, it } from "vitest";

import { getModelInfo, listModels } from "./models";

describe("model registry", () => {
  it("returns a copy of the demo model list", () => {
    const models = listModels();

    models.pop();

    expect(listModels()).toHaveLength(2);
  });

  it("looks up known models", () => {
    expect(getModelInfo("mock-fast")).toMatchObject({
      displayName: "Mock Fast",
      provider: "mock",
    });
  });

  it("fails fast for unknown models", () => {
    expect(() => getModelInfo("missing")).toThrow("Unknown model: missing");
  });
});
