export type HookDoc = {
  slug: string;
  name: string;
  status: "ready" | "beta";
  summary: string;
  importPath: string;
  purpose: string;
  returns: string[];
  options: string[];
  notes: string[];
  example: string;
};

export const hookDocs = [
  {
    slug: "use-chat-stream",
    name: "useChatStream",
    status: "ready",
    summary: "Stream assistant text into your own chat UI.",
    importPath: "@ai-hooks/react/use-chat-stream",
    purpose:
      "Use this when your UI needs a composer state, a send action, streaming state, and callbacks for assistant deltas. The hook can run against a mock stream for demos or against your own server endpoint in production.",
    returns: ["input", "setInput", "send", "isStreaming", "error"],
    options: [
      "endpoint: server route used when transport is fetch",
      "transport: fetch or mock",
      "messages: current conversation payload",
      "body: extra request body fields",
      "signal: AbortSignal from useAbortController",
      "mockResponse: local demo response text",
      "onAssistantDelta: append streamed text to your UI",
      "onUsage: receive usage metadata when available",
    ],
    notes: [
      "AI Hooks does not call providers directly.",
      "Production requests should go through your own API route.",
      "Mock transport is useful for docs, examples, and UI tests.",
    ],
    example: `import { useChatStream } from "@ai-hooks/react/use-chat-stream";
import { useConversationStorage } from "@ai-hooks/react/use-conversation-storage";

export function ChatPanel() {
  const conversation = useConversationStorage({ key: "support-chat" });

  const chat = useChatStream({
    endpoint: "/api/chat",
    messages: conversation.messages,
    onUserMessage: conversation.addUserMessage,
    onAssistantStart: () => conversation.addAssistantMessage(""),
    onAssistantDelta: conversation.appendToLastAssistantMessage,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void chat.send();
      }}
    >
      <textarea
        value={chat.input}
        onChange={(event) => chat.setInput(event.target.value)}
      />
      <button disabled={chat.isStreaming}>Send</button>
    </form>
  );
}`,
  },
  {
    slug: "use-abort-controller",
    name: "useAbortController",
    status: "ready",
    summary: "Add real stop-generation behavior to streaming requests.",
    importPath: "@ai-hooks/react/use-abort-controller",
    purpose:
      "Use this when a user needs to cancel an in-flight fetch stream or provider request. The hook exposes a current signal and creates a fresh controller after aborting.",
    returns: ["signal", "abort", "reset", "version"],
    options: ["No options."],
    notes: [
      "Pass signal into useChatStream or your own fetch call.",
      "abort() cancels the current controller and prepares the next one.",
      "version can be used when you need to react to controller resets.",
    ],
    example: `import { useAbortController } from "@ai-hooks/react/use-abort-controller";
import { useChatStream } from "@ai-hooks/react/use-chat-stream";

export function Composer() {
  const abort = useAbortController();
  const chat = useChatStream({
    endpoint: "/api/chat",
    signal: abort.signal,
  });

  return chat.isStreaming ? (
    <button onClick={abort.abort}>Stop</button>
  ) : (
    <button onClick={() => void chat.send()}>Send</button>
  );
}`,
  },
  {
    slug: "use-conversation-storage",
    name: "useConversationStorage",
    status: "ready",
    summary: "Persist conversation state in local storage.",
    importPath: "@ai-hooks/react/use-conversation-storage",
    purpose:
      "Use this when a demo, prototype, or client-side workflow needs durable messages without introducing a backend database.",
    returns: [
      "messages",
      "add",
      "addMessage",
      "addUserMessage",
      "addAssistantMessage",
      "appendToLastAssistantMessage",
      "clear",
    ],
    options: [
      "key: stable storage key suffix",
      "initialMessages: optional seed messages",
      "storage: custom Storage implementation for tests",
    ],
    notes: [
      "The storage key is prefixed with ai-hooks:.",
      "Messages use the portable AiMessage shape from @ai-hooks/core.",
      "Use server storage for production account history.",
    ],
    example: `import { useConversationStorage } from "@ai-hooks/react/use-conversation-storage";

export function Thread() {
  const conversation = useConversationStorage({ key: "demo-thread" });

  return (
    <>
      {conversation.messages.map((message) => (
        <p key={message.id}>{message.content}</p>
      ))}
      <button onClick={() => conversation.addUserMessage("Hello")}>
        Add message
      </button>
      <button onClick={conversation.clear}>Clear</button>
    </>
  );
}`,
  },
  {
    slug: "use-token-usage",
    name: "useTokenUsage",
    status: "ready",
    summary: "Track token usage as product state.",
    importPath: "@ai-hooks/react/use-token-usage",
    purpose:
      "Use this when a chat, calculator, or dashboard needs visible input, output, cached, and total token counters.",
    returns: ["inputTokens", "outputTokens", "cachedInputTokens", "totalTokens", "add", "reset"],
    options: ["initialUsage: optional starting TokenUsage object"],
    notes: [
      "The hook accumulates usage across calls.",
      "It does not estimate tokens by itself.",
      "Pair it with provider usage metadata or estimateTokens().",
    ],
    example: `import { useTokenUsage } from "@ai-hooks/react/use-token-usage";
import { useChatStream } from "@ai-hooks/react/use-chat-stream";

export function UsageAwareChat() {
  const usage = useTokenUsage();

  const chat = useChatStream({
    endpoint: "/api/chat",
    onUsage: usage.add,
  });

  return (
    <>
      <button onClick={() => void chat.send()}>Send</button>
      <span>{usage.totalTokens} tokens</span>
    </>
  );
}`,
  },
  {
    slug: "use-model-cost",
    name: "useModelCost",
    status: "ready",
    summary: "Estimate model spend from usage counters.",
    importPath: "@ai-hooks/react/use-model-cost",
    purpose:
      "Use this when the UI needs request, session, or monthly cost feedback based on model pricing and token usage.",
    returns: ["usage", "inputUsd", "outputUsd", "totalUsd", "formatted", "add", "reset"],
    options: [
      "model: model id from the model registry",
      "pricing: explicit pricing override",
      "currency: USD",
    ],
    notes: [
      "Pricing data should be verified before public provider pages.",
      "You can pass explicit pricing for custom or private models.",
      "The hook does not send usage data anywhere.",
    ],
    example: `import { useModelCost } from "@ai-hooks/react/use-model-cost";

export function CostMeter() {
  const cost = useModelCost({ model: "mock-fast" });

  return (
    <>
      <button
        onClick={() =>
          cost.add({ inputTokens: 1200, outputTokens: 420 })
        }
      >
        Add usage
      </button>
      <strong>{cost.formatted}</strong>
    </>
  );
}`,
  },
  {
    slug: "use-file-upload",
    name: "useFileUpload",
    status: "beta",
    summary: "Validate local files before an AI workflow uses them.",
    importPath: "@ai-hooks/react/use-file-upload",
    purpose:
      "Use this when a chat UI accepts files but the app needs to enforce file count, size, and MIME or extension rules before upload.",
    returns: ["items", "errors", "addFiles", "addFromInput", "remove", "clear"],
    options: [
      "accept: MIME types, extensions, or wildcards like image/*",
      "maxFiles: maximum retained files",
      "maxSizeMB: maximum file size",
    ],
    notes: [
      "The hook does not upload files.",
      "Use your own server route for parsing or provider upload.",
      "Validation runs in the browser before any network request.",
    ],
    example: `import { useFileUpload } from "@ai-hooks/react/use-file-upload";

export function FilePicker() {
  const upload = useFileUpload({
    accept: ["application/pdf", "image/*", ".txt"],
    maxFiles: 3,
    maxSizeMB: 10,
  });

  return (
    <>
      <input
        type="file"
        multiple
        onChange={(event) => upload.addFromInput(event.currentTarget)}
      />
      {upload.items.map((item) => (
        <button key={item.id} onClick={() => upload.remove(item.id)}>
          Remove {item.name}
        </button>
      ))}
    </>
  );
}`,
  },
  {
    slug: "use-tool-calls",
    name: "useToolCalls",
    status: "beta",
    summary: "Track tool call lifecycle for agent UI.",
    importPath: "@ai-hooks/react/use-tool-calls",
    purpose:
      "Use this when an AI interface needs to show which tools are running, completed, or failed while keeping execution handlers in your app.",
    returns: ["activeCalls", "schema", "run", "clear"],
    options: ["tools: record of tool handlers keyed by tool name"],
    notes: [
      "Tool handlers run in your app, not inside AI Hooks.",
      "schema exposes the registered tool names for UI/debug panels.",
      "Store provider-specific tool schemas outside the hook.",
    ],
    example: `import { useToolCalls } from "@ai-hooks/react/use-tool-calls";

export function ToolTimeline() {
  const tools = useToolCalls({
    tools: {
      getWeather: async (args) => ({ city: args, temp: 72 }),
    },
  });

  return (
    <>
      <button
        onClick={() =>
          void tools.run({
            id: crypto.randomUUID(),
            name: "getWeather",
            arguments: "San Francisco",
          })
        }
      >
        Run tool
      </button>
      {tools.activeCalls.map((call) => (
        <p key={call.id}>{call.name}: {call.status}</p>
      ))}
    </>
  );
}`,
  },
] as const satisfies readonly HookDoc[];

export function getHookDoc(slug: string) {
  return hookDocs.find((doc) => doc.slug === slug);
}
