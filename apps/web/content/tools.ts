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

export const modelPricing = {
  "gpt-4o": {
    context: "128k",
    input: 2.5,
    output: 10,
    provider: "OpenAI",
  },
  "gpt-4o-mini": {
    context: "128k",
    input: 0.15,
    output: 0.6,
    provider: "OpenAI",
  },
  "claude-3.5-sonnet": {
    context: "200k",
    input: 3,
    output: 15,
    provider: "Anthropic",
  },
  "claude-3.5-haiku": {
    context: "200k",
    input: 0.8,
    output: 4,
    provider: "Anthropic",
  },
  "llama-3.1-70b": {
    context: "131k",
    input: 0.59,
    output: 0.79,
    provider: "Groq",
  },
  "mistral-large": {
    context: "128k",
    input: 2,
    output: 6,
    provider: "Mistral",
  },
} as const;

export type CapabilityLevel = "full" | "partial" | "none";

export const modelCapabilities: Record<
  keyof typeof modelPricing,
  { stream: CapabilityLevel; tools: CapabilityLevel; vision: CapabilityLevel }
> = {
  "claude-3.5-haiku": { stream: "full", tools: "full", vision: "none" },
  "claude-3.5-sonnet": { stream: "full", tools: "full", vision: "full" },
  "gpt-4o": { stream: "full", tools: "full", vision: "full" },
  "gpt-4o-mini": { stream: "full", tools: "full", vision: "full" },
  "llama-3.1-70b": { stream: "full", tools: "partial", vision: "none" },
  "mistral-large": { stream: "full", tools: "full", vision: "none" },
};

export const providerMatrix = [
  {
    json: "full",
    model: "gpt-4o",
    name: "OpenAI",
    streaming: "full",
    tools: "full",
    vision: "full",
  },
  {
    json: "full",
    model: "claude-3.5-sonnet",
    name: "Anthropic",
    streaming: "full",
    tools: "full",
    vision: "full",
  },
  {
    json: "full",
    model: "llama-3.1-70b",
    name: "Groq",
    streaming: "full",
    tools: "partial",
    vision: "none",
  },
  {
    json: "full",
    model: "mistral-large",
    name: "Mistral",
    streaming: "full",
    tools: "full",
    vision: "none",
  },
  {
    json: "partial",
    model: "local · llama3",
    name: "Ollama",
    streaming: "full",
    tools: "partial",
    vision: "partial",
  },
] as const satisfies readonly {
  json: CapabilityLevel;
  model: string;
  name: string;
  streaming: CapabilityLevel;
  tools: CapabilityLevel;
  vision: CapabilityLevel;
}[];

