export type ProviderCapabilityKey =
  | "streaming"
  | "toolCalling"
  | "structuredOutput"
  | "visionInput"
  | "fileInput"
  | "openAiCompatible";

export type ProviderCapabilityLevel =
  | "supported"
  | "model-dependent"
  | "route-specific"
  | "limited"
  | "unsupported";

export type ProviderCapability = {
  level: ProviderCapabilityLevel;
  note: string;
};

export type ProviderCompatibilityInfo = {
  id: string;
  displayName: string;
  apiStyle: string;
  bestFor: string;
  capabilities: Record<ProviderCapabilityKey, ProviderCapability>;
  sourceUrls: string[];
  checkedAt: string;
};

const providerCompatibility = [
  {
    id: "openai",
    displayName: "OpenAI",
    apiStyle: "Responses API",
    bestFor: "multimodal apps, tool use, structured outputs",
    checkedAt: "2026-06-28",
    sourceUrls: [
      "https://developers.openai.com/api/docs/guides/streaming-responses",
      "https://developers.openai.com/api/docs/guides/function-calling",
      "https://developers.openai.com/api/docs/guides/structured-outputs",
      "https://developers.openai.com/api/docs/guides/images-vision",
    ],
    capabilities: {
      streaming: {
        level: "supported",
        note: "Responses can be streamed from the API.",
      },
      toolCalling: {
        level: "supported",
        note: "Function calling is a first-class API feature.",
      },
      structuredOutput: {
        level: "supported",
        note: "Structured outputs support JSON schema response formats.",
      },
      visionInput: {
        level: "supported",
        note: "Vision-capable models accept image inputs.",
      },
      fileInput: {
        level: "route-specific",
        note: "File inputs and retrieval use dedicated API patterns.",
      },
      openAiCompatible: {
        level: "supported",
        note: "Native OpenAI API shape.",
      },
    },
  },
  {
    id: "anthropic",
    displayName: "Anthropic",
    apiStyle: "Messages API",
    bestFor: "Claude apps, long-context chat, tool workflows",
    checkedAt: "2026-06-28",
    sourceUrls: [
      "https://platform.claude.com/docs/en/build-with-claude/streaming",
      "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
      "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
      "https://platform.claude.com/docs/en/build-with-claude/vision",
      "https://platform.claude.com/docs/en/build-with-claude/files",
    ],
    capabilities: {
      streaming: {
        level: "supported",
        note: "Messages API supports server-sent event streaming.",
      },
      toolCalling: {
        level: "supported",
        note: "Tool use is a documented Claude workflow.",
      },
      structuredOutput: {
        level: "supported",
        note: "Structured outputs support JSON schema formats.",
      },
      visionInput: {
        level: "supported",
        note: "Vision-capable Claude models accept image inputs.",
      },
      fileInput: {
        level: "supported",
        note: "Files and PDF workflows are supported through Claude APIs.",
      },
      openAiCompatible: {
        level: "unsupported",
        note: "Anthropic uses its own Messages API shape.",
      },
    },
  },
  {
    id: "google",
    displayName: "Google Gemini",
    apiStyle: "Gemini API",
    bestFor: "multimodal apps, files, Google AI ecosystem",
    checkedAt: "2026-06-28",
    sourceUrls: [
      "https://ai.google.dev/gemini-api/docs/text-generation",
      "https://ai.google.dev/gemini-api/docs/function-calling",
      "https://ai.google.dev/gemini-api/docs/structured-output",
      "https://ai.google.dev/gemini-api/docs/image-understanding",
      "https://ai.google.dev/gemini-api/docs/files",
    ],
    capabilities: {
      streaming: {
        level: "supported",
        note: "Gemini API supports streaming generation.",
      },
      toolCalling: {
        level: "supported",
        note: "Function calling is documented as a core capability.",
      },
      structuredOutput: {
        level: "supported",
        note: "Structured output is documented for JSON-shaped responses.",
      },
      visionInput: {
        level: "supported",
        note: "Gemini supports image understanding.",
      },
      fileInput: {
        level: "supported",
        note: "Files API supports reusable uploaded inputs.",
      },
      openAiCompatible: {
        level: "route-specific",
        note: "Google provides an OpenAI-compatible path for some usage.",
      },
    },
  },
  {
    id: "mistral",
    displayName: "Mistral AI",
    apiStyle: "Chat Completions",
    bestFor: "European provider stack, open-weight options, tool calls",
    checkedAt: "2026-06-28",
    sourceUrls: [
      "https://docs.mistral.ai/studio-api/conversations/chat-completion",
      "https://docs.mistral.ai/studio-api/conversations/function-calling",
      "https://docs.mistral.ai/studio-api/conversations/structured-output",
      "https://docs.mistral.ai/studio-api/conversations/vision",
    ],
    capabilities: {
      streaming: {
        level: "supported",
        note: "Chat completions support streaming responses.",
      },
      toolCalling: {
        level: "supported",
        note: "Function calling is documented for capable models.",
      },
      structuredOutput: {
        level: "supported",
        note: "Structured outputs are documented for chat workflows.",
      },
      visionInput: {
        level: "model-dependent",
        note: "Vision works with vision-capable Mistral models.",
      },
      fileInput: {
        level: "route-specific",
        note: "Document workflows use separate product/API surfaces.",
      },
      openAiCompatible: {
        level: "limited",
        note: "Chat completions are familiar, but not fully OpenAI-native.",
      },
    },
  },
  {
    id: "openrouter",
    displayName: "OpenRouter",
    apiStyle: "OpenAI-compatible router",
    bestFor: "multi-provider routing, fallback, model discovery",
    checkedAt: "2026-06-28",
    sourceUrls: [
      "https://openrouter.ai/docs/api/reference/overview",
      "https://openrouter.ai/docs/guides/features/structured-outputs",
      "https://openrouter.ai/docs/guides/routing/provider-selection",
    ],
    capabilities: {
      streaming: {
        level: "supported",
        note: "The router supports SSE streaming via the OpenAI-like schema.",
      },
      toolCalling: {
        level: "model-dependent",
        note: "Tools are mapped or forwarded depending on the selected model.",
      },
      structuredOutput: {
        level: "model-dependent",
        note: "Structured outputs depend on selected model support.",
      },
      visionInput: {
        level: "model-dependent",
        note: "Image input depends on selected model support.",
      },
      fileInput: {
        level: "limited",
        note: "File parsing is available through plugin-style routing.",
      },
      openAiCompatible: {
        level: "supported",
        note: "Requests use an OpenAI-compatible chat completion shape.",
      },
    },
  },
] as const satisfies readonly ProviderCompatibilityInfo[];

export function listProviderCompatibility(): ProviderCompatibilityInfo[] {
  return [...providerCompatibility];
}
