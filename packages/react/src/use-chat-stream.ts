import { createMockTextStream } from "@ai-hooks/core/streaming";
import type { AiMessage, TokenUsage } from "@ai-hooks/core/types";
import { useCallback, useMemo, useState } from "react";

export type ChatStreamTransport = "fetch" | "mock";

export type UseChatStreamOptions = {
  endpoint?: string;
  transport?: ChatStreamTransport;
  messages?: AiMessage[];
  body?: Record<string, unknown>;
  signal?: AbortSignal;
  mockResponse?: string;
  onUserMessage?: (content: string) => void;
  onAssistantStart?: () => void;
  onAssistantDelta?: (delta: string) => void;
  onUsage?: (usage: TokenUsage) => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
};

export function useChatStream(options: UseChatStreamOptions = {}) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = useCallback(
    async (content = input) => {
      const trimmed = content.trim();

      if (!trimmed || isStreaming) {
        return;
      }

      setError(null);
      setIsStreaming(true);
      options.onUserMessage?.(trimmed);
      options.onAssistantStart?.();

      try {
        if ((options.transport ?? "fetch") === "mock") {
          await streamMockResponse(options, trimmed);
        } else {
          await streamFetchResponse(options, trimmed);
        }

        options.onFinish?.();
      } catch (unknownError) {
        const nextError =
          unknownError instanceof Error ? unknownError : new Error("Chat stream failed.");
        setError(nextError);
        options.onError?.(nextError);
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming, options],
  );

  return useMemo(
    () => ({
      error,
      input,
      isStreaming,
      send,
      setInput,
    }),
    [error, input, isStreaming, send],
  );
}

async function streamMockResponse(options: UseChatStreamOptions, prompt: string) {
  const response =
    options.mockResponse ??
    `This is a mock streamed response for: "${prompt}". Replace transport with fetch when your API route is ready.`;

  for await (const delta of createMockTextStream({ text: response })) {
    if (options.signal?.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }

    options.onAssistantDelta?.(delta);
  }

  options.onUsage?.({
    inputTokens: Math.ceil(prompt.length / 4),
    outputTokens: Math.ceil(response.length / 4),
  });
}

async function streamFetchResponse(options: UseChatStreamOptions, prompt: string) {
  if (!options.endpoint) {
    throw new Error("endpoint is required when transport is fetch.");
  }

  const response = await fetch(options.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...options.body,
      messages: options.messages,
      prompt,
    }),
    signal: options.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat endpoint failed with ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const result = await reader.read();

    if (result.done) {
      break;
    }

    options.onAssistantDelta?.(decoder.decode(result.value, { stream: true }));
  }
}
