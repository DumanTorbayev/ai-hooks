export type AiProvider = "openai" | "anthropic" | "google" | "mistral" | "openrouter";

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
  contextWindow?: number;
  maxOutputTokens?: number;
  supports: ModelSupport;
  pricing?: ModelPricing;
  pricingVersion?: string;
  sourceUrls: string[];
  checkedAt: string;
};

export const DEFAULT_MODEL_ID = "gpt-5.4-mini";

const openAiSources = [
  "https://developers.openai.com/api/docs/models",
  "https://openai.com/api/pricing/",
];

const anthropicSources = [
  "https://platform.claude.com/docs/en/about-claude/models/overview",
  "https://platform.claude.com/docs/en/about-claude/pricing",
];

const googleSources = [
  "https://ai.google.dev/gemini-api/docs/models",
  "https://ai.google.dev/gemini-api/docs/pricing",
];

const mistralSources = ["https://docs.mistral.ai/models/overview", "https://mistral.ai/pricing/"];

const checkedAt = "2026-06-18";

const modelRegistry = [
  {
    id: "gpt-5.4-mini",
    provider: "openai",
    displayName: "GPT-5.4 mini",
    contextWindow: 400000,
    maxOutputTokens: 128000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.75,
      cachedInputPerMillionUsd: 0.075,
      outputPerMillionUsd: 4.5,
      note: "OpenAI standard processing price for text input/output.",
    },
    pricingVersion: checkedAt,
    sourceUrls: openAiSources,
    checkedAt,
  },
  {
    id: "gpt-5.4",
    provider: "openai",
    displayName: "GPT-5.4",
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 2.5,
      cachedInputPerMillionUsd: 0.25,
      outputPerMillionUsd: 15,
      note: "OpenAI standard processing price for text input/output.",
    },
    pricingVersion: checkedAt,
    sourceUrls: openAiSources,
    checkedAt,
  },
  {
    id: "gpt-5.5",
    provider: "openai",
    displayName: "GPT-5.5",
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 5,
      cachedInputPerMillionUsd: 0.5,
      outputPerMillionUsd: 30,
      note: "OpenAI standard processing price for text input/output.",
    },
    pricingVersion: checkedAt,
    sourceUrls: openAiSources,
    checkedAt,
  },
  {
    id: "claude-haiku-4-5-20251001",
    provider: "anthropic",
    displayName: "Claude Haiku 4.5",
    contextWindow: 200000,
    maxOutputTokens: 64000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 1,
      cachedInputPerMillionUsd: 0.1,
      outputPerMillionUsd: 5,
      note: "Claude API list price. Cache reads use 0.1x base input price.",
    },
    pricingVersion: checkedAt,
    sourceUrls: anthropicSources,
    checkedAt,
  },
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    displayName: "Claude Sonnet 4.6",
    contextWindow: 1000000,
    maxOutputTokens: 64000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 3,
      cachedInputPerMillionUsd: 0.3,
      outputPerMillionUsd: 15,
      note: "Claude API list price. Cache reads use 0.1x base input price.",
    },
    pricingVersion: checkedAt,
    sourceUrls: anthropicSources,
    checkedAt,
  },
  {
    id: "claude-opus-4-8",
    provider: "anthropic",
    displayName: "Claude Opus 4.8",
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 5,
      cachedInputPerMillionUsd: 0.5,
      outputPerMillionUsd: 25,
      note: "Claude API list price. Cache reads use 0.1x base input price.",
    },
    pricingVersion: checkedAt,
    sourceUrls: anthropicSources,
    checkedAt,
  },
  {
    id: "gemini-3.5-flash",
    provider: "google",
    displayName: "Gemini 3.5 Flash",
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: true,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 1.5,
      cachedInputPerMillionUsd: 0.15,
      outputPerMillionUsd: 9,
      note: "Gemini Developer API standard paid-tier text pricing.",
    },
    pricingVersion: checkedAt,
    sourceUrls: googleSources,
    checkedAt,
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    displayName: "Gemini 2.5 Flash",
    contextWindow: 1000000,
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: true,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.3,
      cachedInputPerMillionUsd: 0.03,
      outputPerMillionUsd: 2.5,
      note: "Gemini Developer API standard paid-tier text/image/video pricing.",
    },
    pricingVersion: checkedAt,
    sourceUrls: googleSources,
    checkedAt,
  },
  {
    id: "gemini-3.1-flash-lite",
    provider: "google",
    displayName: "Gemini 3.1 Flash-Lite",
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: true,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.25,
      cachedInputPerMillionUsd: 0.025,
      outputPerMillionUsd: 1.5,
      note: "Gemini Developer API standard paid-tier text/image/video pricing.",
    },
    pricingVersion: checkedAt,
    sourceUrls: googleSources,
    checkedAt,
  },
  {
    id: "mistral-medium-3.5",
    provider: "mistral",
    displayName: "Mistral Medium 3.5",
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 1.5,
      outputPerMillionUsd: 7.5,
      note: "Mistral public pricing page, per million input/output tokens.",
    },
    pricingVersion: checkedAt,
    sourceUrls: mistralSources,
    checkedAt,
  },
  {
    id: "mistral-small-4",
    provider: "mistral",
    displayName: "Mistral Small 4",
    supports: {
      streaming: true,
      toolCalling: true,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.1,
      outputPerMillionUsd: 0.3,
      note: "Mistral public pricing page, per million input/output tokens.",
    },
    pricingVersion: checkedAt,
    sourceUrls: mistralSources,
    checkedAt,
  },
  {
    id: "mistral-large-3",
    provider: "mistral",
    displayName: "Mistral Large 3",
    supports: {
      streaming: true,
      toolCalling: false,
      vision: true,
      audioInput: false,
      jsonMode: true,
    },
    pricing: {
      inputPerMillionUsd: 0.5,
      outputPerMillionUsd: 1.5,
      note: "Mistral public pricing page, per million input/output tokens.",
    },
    pricingVersion: checkedAt,
    sourceUrls: mistralSources,
    checkedAt,
  },
] as const satisfies readonly ModelInfo[];

export function listModels(): ModelInfo[] {
  return [...modelRegistry];
}

export function getModelInfo(modelId: string): ModelInfo {
  const model = modelRegistry.find((item) => item.id === modelId);

  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  return model;
}
