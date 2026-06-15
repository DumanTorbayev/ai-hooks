export type AiRole = "system" | "user" | "assistant" | "tool";

export type AiMessage = {
  id: string;
  role: AiRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens?: number;
};

export type MoneyEstimate = {
  inputUsd: number;
  outputUsd: number;
  totalUsd: number;
  formatted: string;
};

export type StreamDelta = {
  type: "text";
  value: string;
};

