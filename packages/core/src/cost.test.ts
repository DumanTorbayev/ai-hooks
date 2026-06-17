import { describe, expect, it } from "vitest";

import { estimateModelCost } from "./cost";

describe("estimateModelCost", () => {
  it("uses model pricing when no explicit pricing is provided", () => {
    const estimate = estimateModelCost({
      inputTokens: 1_000,
      model: "mock-fast",
      outputTokens: 500,
    });

    expect(estimate.inputUsd).toBeCloseTo(0.00015);
    expect(estimate.outputUsd).toBeCloseTo(0.0003);
    expect(estimate.totalUsd).toBeCloseTo(0.00045);
    expect(estimate.formatted).toBe("$0.00045");
  });

  it("prices cached input tokens separately when configured", () => {
    const estimate = estimateModelCost({
      cachedInputTokens: 200,
      inputTokens: 1_000,
      outputTokens: 500,
      pricing: {
        cachedInputPerMillionUsd: 0.1,
        inputPerMillionUsd: 1,
        outputPerMillionUsd: 2,
      },
    });

    expect(estimate.inputUsd).toBeCloseTo(0.00082);
    expect(estimate.outputUsd).toBeCloseTo(0.001);
    expect(estimate.totalUsd).toBeCloseTo(0.00182);
  });

  it("fails fast for an unknown model", () => {
    expect(() =>
      estimateModelCost({
        inputTokens: 1,
        model: "unknown-model",
        outputTokens: 1,
      }),
    ).toThrow("Unknown model: unknown-model");
  });
});
