export type AiProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "mistral"
  | "openrouter"
  | "mock";

export type ModelSupport = {
  streaming: boolean;
  toolCalling: boolean;
  vision: boolean;
  audioInput: boolean;
  jsonMode: boolean;
};

export type ModelPricing = {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
  cachedInputPerMillionUsd?: number;
  note?: string;
};

export type ModelInfo = {
  id: string;
  provider: AiProvider;
  displayName: string;
  contextWindow: number;
  maxOutputTokens?: number;
  supports: ModelSupport;
  pricing?: ModelPricing;
  pricingVersion?: string;
};

const demoModels = [
  {
    id: "mock-fast",
    provider: "mock",
    displayName: "Mock Fast",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: false,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.15,
      outputPerMillionUsd: 0.6,
      note: "Demo pricing for local examples. Replace before publishing real provider pages.",
    },
    pricingVersion: "demo-2026-06",
  },
  {
    id: "mock-reasoning",
    provider: "mock",
    displayName: "Mock Reasoning",
    contextWindow: 200000,
    maxOutputTokens: 16384,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 2,
      outputPerMillionUsd: 8,
      note: "Demo pricing for cost UI examples.",
    },
    pricingVersion: "demo-2026-06",
  },
] as const satisfies readonly ModelInfo[];

export function listModels(): ModelInfo[] {
  return [...demoModels];
}

export function getModelInfo(modelId: string): ModelInfo {
  const model = demoModels.find((item) => item.id === modelId);

  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  return model;
}

