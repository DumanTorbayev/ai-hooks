import { DEFAULT_MODEL_ID, getModelInfo, type ModelPricing } from "./models";
import type { MoneyEstimate, TokenUsage } from "./types";

export type EstimateModelCostInput = TokenUsage & {
  model?: string;
  pricing?: ModelPricing;
  currency?: "USD";
};

export function estimateModelCost(input: EstimateModelCostInput): MoneyEstimate {
  const pricing = input.pricing ?? getModelInfo(input.model ?? DEFAULT_MODEL_ID).pricing;

  if (!pricing) {
    throw new Error("Model pricing is required to estimate cost.");
  }

  const billableInputTokens = Math.max(
    input.inputTokens - (input.cachedInputTokens ?? 0),
    0,
  );
  const cachedInputTokens = input.cachedInputTokens ?? 0;

  const inputUsd =
    (billableInputTokens / 1_000_000) * pricing.inputPerMillionUsd +
    (cachedInputTokens / 1_000_000) *
      (pricing.cachedInputPerMillionUsd ?? pricing.inputPerMillionUsd);

  const outputUsd = (input.outputTokens / 1_000_000) * pricing.outputPerMillionUsd;
  const totalUsd = inputUsd + outputUsd;

  return {
    inputUsd,
    outputUsd,
    totalUsd,
    formatted: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: input.currency ?? "USD",
      maximumFractionDigits: totalUsd < 0.01 ? 5 : 2,
    }).format(totalUsd),
  };
}
