import { estimateModelCost, type EstimateModelCostInput } from "@ai-hooks/core/cost";
import type { TokenUsage } from "@ai-hooks/core/types";
import { useCallback, useMemo, useState } from "react";

export type UseModelCostOptions = Omit<EstimateModelCostInput, keyof TokenUsage>;

export function useModelCost(options: UseModelCostOptions = {}) {
  const [usage, setUsage] = useState<TokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
  });

  const add = useCallback((nextUsage: TokenUsage) => {
    setUsage((current) => ({
      cachedInputTokens: (current.cachedInputTokens ?? 0) + (nextUsage.cachedInputTokens ?? 0),
      inputTokens: current.inputTokens + nextUsage.inputTokens,
      outputTokens: current.outputTokens + nextUsage.outputTokens,
    }));
  }, []);

  const reset = useCallback(() => {
    setUsage({ inputTokens: 0, outputTokens: 0 });
  }, []);

  const estimate = estimateModelCost({
    ...options,
    ...usage,
  });

  return useMemo(
    () => ({
      ...estimate,
      add,
      reset,
      usage,
    }),
    [add, estimate, reset, usage],
  );
}
