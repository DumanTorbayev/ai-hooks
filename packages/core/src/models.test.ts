import { describe, expect, it } from "vitest";

import { DEFAULT_MODEL_ID, getModelInfo, listModels } from "./models";

describe("model registry", () => {
  it("returns a copy of the source-backed model list", () => {
    const models = listModels();

    models.pop();

    expect(listModels().length).toBeGreaterThan(5);
  });

  it("looks up known models", () => {
    expect(getModelInfo(DEFAULT_MODEL_ID)).toMatchObject({
      displayName: "GPT-5.4 mini",
      provider: "openai",
    });
  });

  it("keeps every model row source-backed", () => {
    for (const model of listModels()) {
      expect(model.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(model.sourceUrls.length).toBeGreaterThan(0);
      expect(model.pricing?.inputPerMillionUsd).toBeGreaterThan(0);
      expect(model.pricing?.outputPerMillionUsd).toBeGreaterThan(0);
    }
  });

  it("fails fast for unknown models", () => {
    expect(() => getModelInfo("missing")).toThrow("Unknown model: missing");
  });
});
