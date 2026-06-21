import {
  DEFAULT_MODEL_ID,
  listModels,
  listProviderCompatibility,
  type AiProvider,
  type ModelInfo,
  type ModelPricing,
  type ProviderCapabilityLevel,
} from "@ai-hooks/core";

export type PlanningToolId = "cost" | "tokens" | "models" | "providers";

export const planningTools = [
  {
    id: "cost",
    name: "Cost calculator",
    description: "Estimate request cost from input/output token counts and model pricing.",
  },
  {
    id: "tokens",
    name: "Token estimator",
    description: "Paste text to estimate token and word counts before you send.",
  },
  {
    id: "models",
    name: "Model comparison",
    description: "Compare context windows, pricing, and capabilities side by side.",
  },
  {
    id: "providers",
    name: "Provider matrix",
    description: "See which capabilities each provider supports for UI planning.",
  },
] as const satisfies readonly {
  id: PlanningToolId;
  name: string;
  description: string;
}[];

export type CapabilityLevel = "full" | "partial" | "none";

export type ModelWithPricing = ModelInfo & { pricing: ModelPricing };

export const defaultModelId = DEFAULT_MODEL_ID;

export const modelCatalog = listModels().filter((model): model is ModelWithPricing =>
  Boolean(model.pricing),
);

export const providerMatrix = listProviderCompatibility();

export const providerLabels: Record<AiProvider, string> = {
  anthropic: "Anthropic",
  google: "Google",
  mistral: "Mistral",
  openai: "OpenAI",
  openrouter: "OpenRouter",
};

export function supportBadge(value: boolean): CapabilityLevel {
  return value ? "full" : "none";
}

export function providerCapabilityBadge(level: ProviderCapabilityLevel): CapabilityLevel {
  if (level === "supported") {
    return "full";
  }

  if (level === "unsupported") {
    return "none";
  }

  return "partial";
}
