import { useCallback, useMemo, useState } from "react";

export type ToolCallInput = {
  id: string;
  name: string;
  arguments: unknown;
};

export type ToolHandler = (args: unknown) => Promise<unknown> | unknown;

export type ToolHandlers = Record<string, ToolHandler>;

export type ActiveToolCall = ToolCallInput & {
  status: "running" | "completed" | "failed";
  result?: unknown;
  error?: string;
};

export function useToolCalls(options: { tools: ToolHandlers }) {
  const [activeCalls, setActiveCalls] = useState<ActiveToolCall[]>([]);

  const run = useCallback(
    async (toolCall: ToolCallInput) => {
      const handler = options.tools[toolCall.name];

      if (!handler) {
        throw new Error(`Unknown tool: ${toolCall.name}`);
      }

      setActiveCalls((current) => [
        ...current,
        {
          ...toolCall,
          status: "running",
        },
      ]);

      try {
        const result = await handler(toolCall.arguments);
        setActiveCalls((current) =>
          current.map((item) =>
            item.id === toolCall.id ? { ...item, result, status: "completed" } : item,
          ),
        );
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Tool call failed.";
        setActiveCalls((current) =>
          current.map((item) =>
            item.id === toolCall.id ? { ...item, error: message, status: "failed" } : item,
          ),
        );
        throw error;
      }
    },
    [options.tools],
  );

  const clear = useCallback(() => {
    setActiveCalls([]);
  }, []);

  return useMemo(
    () => ({
      activeCalls,
      clear,
      run,
      schema: Object.keys(options.tools).map((name) => ({ name })),
    }),
    [activeCalls, clear, options.tools, run],
  );
}
