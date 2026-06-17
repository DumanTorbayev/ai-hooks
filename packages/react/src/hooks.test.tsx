import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useMemo, useState } from "react";

import { useAbortController } from "./use-abort-controller";
import { useChatStream } from "./use-chat-stream";
import { useConversationStorage } from "./use-conversation-storage";
import { useFileUpload } from "./use-file-upload";
import { useModelCost } from "./use-model-cost";
import { useTokenUsage } from "./use-token-usage";
import { useToolCalls } from "./use-tool-calls";

afterEach(() => {
  cleanup();
});

describe("React hooks", () => {
  it("accumulates and resets token usage", () => {
    function TokenUsageDemo() {
      const usage = useTokenUsage({ inputTokens: 1, outputTokens: 2 });

      return (
        <>
          <output data-testid="total">{usage.totalTokens}</output>
          <button
            type="button"
            onClick={() =>
              usage.add({
                cachedInputTokens: 5,
                inputTokens: 3,
                outputTokens: 4,
              })
            }
          >
            Add
          </button>
          <button type="button" onClick={usage.reset}>
            Reset
          </button>
        </>
      );
    }

    render(<TokenUsageDemo />);

    expect(screen.getByTestId("total").textContent).toBe("3");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("total").textContent).toBe("15");
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByTestId("total").textContent).toBe("3");
  });

  it("updates model cost from token usage", () => {
    function ModelCostDemo() {
      const cost = useModelCost({
        pricing: {
          inputPerMillionUsd: 1,
          outputPerMillionUsd: 2,
        },
      });

      return (
        <>
          <output data-testid="total">{cost.totalUsd.toFixed(2)}</output>
          <button
            type="button"
            onClick={() =>
              cost.add({
                inputTokens: 1_000_000,
                outputTokens: 500_000,
              })
            }
          >
            Add
          </button>
          <button type="button" onClick={cost.reset}>
            Reset
          </button>
        </>
      );
    }

    render(<ModelCostDemo />);

    expect(screen.getByTestId("total").textContent).toBe("0.00");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("total").textContent).toBe("2.00");
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByTestId("total").textContent).toBe("0.00");
  });

  it("aborts the active signal and exposes a fresh signal", () => {
    function AbortDemo() {
      const controller = useAbortController();
      const [abortedSignal, setAbortedSignal] = useState("unset");

      return (
        <>
          <output data-testid="version">{controller.version}</output>
          <output data-testid="current">{String(controller.signal.aborted)}</output>
          <output data-testid="previous">{abortedSignal}</output>
          <button
            type="button"
            onClick={() => {
              const signal = controller.signal;
              controller.abort();
              setAbortedSignal(String(signal.aborted));
            }}
          >
            Abort
          </button>
        </>
      );
    }

    render(<AbortDemo />);

    fireEvent.click(screen.getByText("Abort"));

    expect(screen.getByTestId("version").textContent).toBe("1");
    expect(screen.getByTestId("previous").textContent).toBe("true");
    expect(screen.getByTestId("current").textContent).toBe("false");
  });

  it("persists and mutates conversation messages", () => {
    const storage = createMemoryStorage();

    function ConversationDemo() {
      const conversation = useConversationStorage({
        initialMessages: [
          {
            content: "System ready",
            createdAt: "2026-06-17T00:00:00.000Z",
            id: "system-1",
            role: "system",
          },
        ],
        key: "conversation-test",
        storage,
      });

      return (
        <>
          <output data-testid="count">{conversation.messages.length}</output>
          <output data-testid="last">
            {conversation.messages.at(-1)?.content ?? "empty"}
          </output>
          <button type="button" onClick={() => conversation.addUserMessage("Hello")}>
            Add user
          </button>
          <button
            type="button"
            onClick={() => conversation.appendToLastAssistantMessage(" streamed")}
          >
            Append assistant
          </button>
          <button type="button" onClick={conversation.clear}>
            Clear
          </button>
        </>
      );
    }

    render(<ConversationDemo />);

    expect(screen.getByTestId("count").textContent).toBe("1");
    fireEvent.click(screen.getByText("Add user"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("last").textContent).toBe("Hello");

    fireEvent.click(screen.getByText("Append assistant"));
    expect(screen.getByTestId("count").textContent).toBe("3");
    expect(screen.getByTestId("last").textContent).toBe(" streamed");

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("validates file uploads", () => {
    function FileUploadDemo() {
      const upload = useFileUpload({
        accept: ["text/plain"],
        maxFiles: 1,
        maxSizeMB: 1,
      });

      return (
        <>
          <output data-testid="items">{upload.items.map((item) => item.name).join(",")}</output>
          <output data-testid="errors">{upload.errors.join(",")}</output>
          <button
            type="button"
            onClick={() =>
              upload.addFiles([new File(["hello"], "notes.txt", { type: "text/plain" })])
            }
          >
            Add valid
          </button>
          <button
            type="button"
            onClick={() =>
              upload.addFiles([new File(["image"], "image.png", { type: "image/png" })])
            }
          >
            Add invalid
          </button>
          <button type="button" onClick={upload.clear}>
            Clear
          </button>
        </>
      );
    }

    render(<FileUploadDemo />);

    fireEvent.click(screen.getByText("Add valid"));
    expect(screen.getByTestId("items").textContent).toBe("notes.txt");

    fireEvent.click(screen.getByText("Add invalid"));
    expect(screen.getByTestId("items").textContent).toBe("notes.txt");
    expect(screen.getByTestId("errors").textContent).toContain(
      "image.png does not match accepted file types.",
    );

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("items").textContent).toBe("");
    expect(screen.getByTestId("errors").textContent).toBe("");
  });

  it("tracks tool call lifecycle", async () => {
    function ToolCallsDemo() {
      const tools = useMemo(
        () => ({
          lookup: async (args: unknown) => {
            const typedArgs = args as { query: string };
            return `result:${typedArgs.query}`;
          },
        }),
        [],
      );
      const toolCalls = useToolCalls({ tools });
      const [result, setResult] = useState("empty");

      return (
        <>
          <output data-testid="schema">{toolCalls.schema.map((tool) => tool.name).join(",")}</output>
          <output data-testid="status">{toolCalls.activeCalls[0]?.status ?? "idle"}</output>
          <output data-testid="result">{result}</output>
          <button
            type="button"
            onClick={() => {
              void toolCalls
                .run({
                  arguments: { query: "hooks" },
                  id: "call-1",
                  name: "lookup",
                })
                .then((value) => setResult(String(value)));
            }}
          >
            Run
          </button>
        </>
      );
    }

    render(<ToolCallsDemo />);

    expect(screen.getByTestId("schema").textContent).toBe("lookup");
    fireEvent.click(screen.getByText("Run"));

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("completed");
      expect(screen.getByTestId("result").textContent).toBe("result:hooks");
    });
  });

  it("streams mock chat responses", async () => {
    function ChatStreamDemo() {
      const [output, setOutput] = useState("");
      const [outputTokens, setOutputTokens] = useState(0);
      const chat = useChatStream({
        mockResponse: "hello",
        onAssistantDelta: (delta) => setOutput((current) => `${current}${delta}`),
        onUsage: (usage) => setOutputTokens(usage.outputTokens),
        transport: "mock",
      });

      return (
        <>
          <output data-testid="output">{output}</output>
          <output data-testid="output-tokens">{outputTokens}</output>
          <output data-testid="streaming">{String(chat.isStreaming)}</output>
          <button type="button" onClick={() => void chat.send("Say hi")}>
            Send
          </button>
        </>
      );
    }

    render(<ChatStreamDemo />);

    fireEvent.click(screen.getByText("Send"));
    expect(screen.getByTestId("streaming").textContent).toBe("true");

    await waitFor(() => {
      expect(screen.getByTestId("output").textContent).toBe("hello");
      expect(screen.getByTestId("output-tokens").textContent).toBe("2");
      expect(screen.getByTestId("streaming").textContent).toBe("false");
    });
  });
});

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear() {
      entries.clear();
    },
    getItem(key: string) {
      return entries.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(entries.keys())[index] ?? null;
    },
    removeItem(key: string) {
      entries.delete(key);
    },
    setItem(key: string, value: string) {
      entries.set(key, value);
    },
  };
}
