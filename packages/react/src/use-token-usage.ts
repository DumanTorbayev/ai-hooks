import type { TokenUsage } from "@ai-hooks/core/types";
import { useCallback, useMemo, useState } from "react";

export function useTokenUsage(initialUsage: TokenUsage = { inputTokens: 0, outputTokens: 0 }) {
  const [usage, setUsage] = useState<TokenUsage>(initialUsage);

  const add = useCallback((nextUsage: TokenUsage) => {
    setUsage((current) => ({
      cachedInputTokens: (current.cachedInputTokens ?? 0) + (nextUsage.cachedInputTokens ?? 0),
      inputTokens: current.inputTokens + nextUsage.inputTokens,
      outputTokens: current.outputTokens + nextUsage.outputTokens,
    }));
  }, []);

  const reset = useCallback(() => {
    setUsage(initialUsage);
  }, [initialUsage]);

  return useMemo(
    () => ({
      ...usage,
      add,
      reset,
      totalTokens: usage.inputTokens + usage.outputTokens + (usage.cachedInputTokens ?? 0),
    }),
    [add, reset, usage],
  );
}
