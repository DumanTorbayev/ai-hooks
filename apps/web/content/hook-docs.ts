export type ApiOptionDoc = {
  defaultValue: string;
  description: string;
  name: string;
  type: string;
};

export type ApiReturnDoc = {
  description: string;
  name: string;
  type: string;
};

export type HookPairDoc = {
  description: string;
  hook: string;
};

export type HookDoc = {
  slug: string;
  name: string;
  status: "ready" | "beta";
  category: "streaming" | "state" | "usage" | "files" | "agents";
  summary: string;
  purpose: string;
  boundary: string;
  useWhen: string[];
  avoidWhen: string[];
  edgeCases: string[];
  pairsWith: HookPairDoc[];
  returns: ApiReturnDoc[];
  options: ApiOptionDoc[];
  notes: string[];
  recipes: string[];
  related: string[];
  example: string;
};

export const hookDocs = [
  {
    slug: "use-chat-stream",
    name: "useChatStream",
    status: "ready",
    category: "streaming",
    summary: "Stream assistant text into your own chat UI.",
    purpose:
      "Use this when your UI needs a composer state, a send action, streaming state, and callbacks for assistant deltas. The hook can run against a mock stream for demos or against your own server endpoint in production.",
    boundary:
      "AI Hooks manages composer and stream state. Your server route still calls the model provider and forwards text deltas; provider keys never belong in the browser.",
    useWhen: [
      "You already have, or plan to create, a server route for model calls.",
      "Your app owns the message UI and needs stream state, input state, and send behavior.",
      "You want mock streaming for docs, tests, or UI work before provider wiring is ready.",
    ],
    avoidWhen: [
      "You need a hosted chat API, browser-side provider calls, or managed API keys.",
      "You want the hook to own long-term message storage or database writes.",
      "Your route streams structured events that are not converted into text deltas yet.",
    ],
    edgeCases: [
      "`endpoint` is required when `transport` is `fetch`.",
      "`send` ignores empty input and concurrent sends while a stream is active.",
      "The fetch transport reads streamed text chunks; parse provider SSE or JSON inside your route before forwarding deltas.",
      "Pass an `AbortSignal` when the UI needs a real Stop button.",
    ],
    pairsWith: [
      {
        hook: "useConversationStorage",
        description: "Persist user and assistant messages through the stream callbacks.",
      },
      {
        hook: "useAbortController",
        description: "Cancel an in-flight response and prepare the next signal.",
      },
      {
        hook: "useTokenUsage",
        description: "Accumulate provider usage metadata from `onUsage`.",
      },
    ],
    returns: [
      {
        description: "Current composer text.",
        name: "input",
        type: "string",
      },
      {
        description: "Updates composer text.",
        name: "setInput",
        type: "(value: string) => void",
      },
      {
        description: "Starts a stream using the provided content or current input.",
        name: "send",
        type: "(content?: string) => Promise<void>",
      },
      {
        description: "True while the current response is streaming.",
        name: "isStreaming",
        type: "boolean",
      },
      {
        description: "Last request or streaming error.",
        name: "error",
        type: "Error | null",
      },
    ],
    options: [
      {
        defaultValue: "undefined",
        description: "Server route used when transport is fetch.",
        name: "endpoint",
        type: "string",
      },
      {
        defaultValue: '"fetch"',
        description: "Use fetch for a real route or mock for local demos.",
        name: "transport",
        type: '"fetch" | "mock"',
      },
      {
        defaultValue: "undefined",
        description: "Current conversation payload sent to your endpoint.",
        name: "messages",
        type: "AiMessage[]",
      },
      {
        defaultValue: "undefined",
        description: "Extra JSON fields merged into the request body.",
        name: "body",
        type: "Record<string, unknown>",
      },
      {
        defaultValue: "undefined",
        description: "AbortSignal from useAbortController or your own controller.",
        name: "signal",
        type: "AbortSignal",
      },
      {
        defaultValue: "generated text",
        description: "Local response text used by mock transport.",
        name: "mockResponse",
        type: "string",
      },
      {
        defaultValue: "undefined",
        description: "Called before streaming starts with the submitted user text.",
        name: "onUserMessage",
        type: "(content: string) => void",
      },
      {
        defaultValue: "undefined",
        description: "Called when an assistant message should be created.",
        name: "onAssistantStart",
        type: "() => void",
      },
      {
        defaultValue: "undefined",
        description: "Called for every streamed text delta.",
        name: "onAssistantDelta",
        type: "(delta: string) => void",
      },
      {
        defaultValue: "undefined",
        description: "Called when usage metadata is available.",
        name: "onUsage",
        type: "(usage: TokenUsage) => void",
      },
      {
        defaultValue: "undefined",
        description: "Called after a stream completes successfully.",
        name: "onFinish",
        type: "() => void",
      },
      {
        defaultValue: "undefined",
        description: "Called when a request or stream fails.",
        name: "onError",
        type: "(error: Error) => void",
      },
    ],
    notes: [
      "AI Hooks does not call providers directly.",
      "Production requests should go through your own API route.",
      "Mock transport is useful for docs, examples, and UI tests.",
    ],
    recipes: [
      "Connect to your own `/api/chat` route.",
      "Append assistant deltas into any message store.",
      "Pair with useAbortController for stop-generation UI.",
    ],
    related: ["useAbortController", "useConversationStorage", "useTokenUsage"],
    example: `import { useChatStream, useConversationStorage } from "@ai-hooks/react";

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
    category: "streaming",
    summary: "Add real stop-generation behavior to streaming requests.",
    purpose:
      "Use this when a user needs to cancel an in-flight fetch stream or provider request. The hook exposes a current signal and creates a fresh controller after aborting.",
    boundary:
      "AI Hooks creates and resets AbortController state. Your fetch call or provider client must accept the signal for cancellation to take effect.",
    useWhen: [
      "A streaming chat needs a Stop button that actually cancels fetch work.",
      "You want one reusable signal for a request lifecycle instead of creating controllers inline.",
      "The UI needs to know when a controller was replaced after cancel/reset.",
    ],
    avoidWhen: [
      "The async work you call does not accept or respect `AbortSignal`.",
      "You need retry, timeout, or backoff orchestration rather than cancellation state.",
      "A simple disabled button is enough because the request cannot be cancelled.",
    ],
    edgeCases: [
      "`abort()` aborts the current controller and immediately creates a fresh one.",
      "Always pass the latest `signal` into new requests after a reset.",
      "`version` increments when the controller changes and is useful for effects/debug UI.",
      "Provider SDK calls still need to wire the signal into their own cancellation API.",
    ],
    pairsWith: [
      {
        hook: "useChatStream",
        description: "Pass `signal` into chat streaming and call `abort()` from the Stop button.",
      },
    ],
    returns: [
      {
        description: "Current abort signal for fetch or streaming work.",
        name: "signal",
        type: "AbortSignal",
      },
      {
        description: "Aborts the current controller and creates a fresh one.",
        name: "abort",
        type: "() => void",
      },
      {
        description: "Creates a fresh controller without aborting first.",
        name: "reset",
        type: "() => void",
      },
      {
        description: "Increments whenever the controller is replaced.",
        name: "version",
        type: "number",
      },
    ],
    options: [],
    notes: [
      "Pass signal into useChatStream or your own fetch call.",
      "abort() cancels the current controller and prepares the next one.",
      "version can be used when you need to react to controller resets.",
    ],
    recipes: [
      "Add a Stop button while a response is streaming.",
      "Reset the signal after cancellation.",
      "Use the same signal with your own fetch implementation.",
    ],
    related: ["useChatStream"],
    example: `import { useAbortController, useChatStream } from "@ai-hooks/react";

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
    category: "state",
    summary: "Persist conversation state in local storage.",
    purpose:
      "Use this when a demo, prototype, or client-side workflow needs durable messages without introducing a backend database.",
    boundary:
      "AI Hooks stores messages in browser storage only. Use server storage for account history, sensitive messages, multi-device sync, or audit requirements.",
    useWhen: [
      "You need local conversation state that survives refreshes in demos or prototypes.",
      "You want helper actions for appending user, assistant, and streamed assistant messages.",
      "A browser `Storage` implementation is enough for the current workflow.",
    ],
    avoidWhen: [
      "Messages are sensitive, account-scoped, or need server-side access control.",
      "The product needs multi-device sync, audit history, or collaboration.",
      "Local storage quota and JSON serialization limits are not acceptable.",
    ],
    edgeCases: [
      "The final key is prefixed with `ai-hooks:`.",
      "`clear()` resets to `initialMessages` when provided, not always to an empty list.",
      "`appendToLastAssistantMessage` creates an assistant message if none exists yet.",
      "Pass a custom `storage` in tests or non-standard browser shells.",
      "Invalid stored JSON falls back to `initialMessages` instead of crashing the UI.",
    ],
    pairsWith: [
      {
        hook: "useChatStream",
        description: "Use chat callbacks to add user messages and append assistant deltas.",
      },
      {
        hook: "useTokenUsage",
        description: "Reset token counters when clearing a local conversation.",
      },
    ],
    returns: [
      {
        description: "Current message list.",
        name: "messages",
        type: "AiMessage[]",
      },
      {
        description: "Appends a complete AiMessage object.",
        name: "add",
        type: "(message: AiMessage) => void",
      },
      {
        description: "Creates and appends a message for the provided role.",
        name: "addMessage",
        type: "(role: AiRole, content: string) => AiMessage",
      },
      {
        description: "Creates and appends a user message.",
        name: "addUserMessage",
        type: "(content: string) => AiMessage",
      },
      {
        description: "Creates and appends an assistant message.",
        name: "addAssistantMessage",
        type: "(content: string) => AiMessage",
      },
      {
        description: "Appends streamed text to the last assistant message.",
        name: "appendToLastAssistantMessage",
        type: "(delta: string) => void",
      },
      {
        description: "Resets messages back to initialMessages or an empty list.",
        name: "clear",
        type: "() => void",
      },
    ],
    options: [
      {
        defaultValue: "required",
        description: "Stable storage key suffix. The hook prefixes it with ai-hooks:.",
        name: "key",
        type: "string",
      },
      {
        defaultValue: "[]",
        description: "Optional seed messages used before storage is loaded.",
        name: "initialMessages",
        type: "AiMessage[]",
      },
      {
        defaultValue: "localStorage",
        description: "Custom Storage implementation for tests or non-browser shells.",
        name: "storage",
        type: "Storage",
      },
    ],
    notes: [
      "The storage key is prefixed with ai-hooks:.",
      "Messages use the portable AiMessage shape from @ai-hooks/core.",
      "Use server storage for production account history.",
    ],
    recipes: [
      "Persist a demo conversation in localStorage.",
      "Seed examples with initial messages.",
      "Swap storage in tests with a custom Storage implementation.",
    ],
    related: ["useChatStream"],
    example: `import { useConversationStorage } from "@ai-hooks/react";

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
    category: "usage",
    summary: "Track token usage as product state.",
    purpose:
      "Use this when a chat, calculator, or dashboard needs visible input, output, cached, and total token counters.",
    boundary:
      "AI Hooks accumulates the usage values you pass in. Provider metadata, tokenizer output, or estimator values still come from your route or planning tools.",
    useWhen: [
      "A provider response returns usage metadata and the UI should show running totals.",
      "You need session-level input, output, cached-input, and total counters.",
      "The same counters will feed a cost estimate or usage badge.",
    ],
    avoidWhen: [
      "You need exact tokenization before a request is sent; use a tokenizer or estimator instead.",
      "You need billing-grade usage reconciliation from the provider invoice.",
      "No route or provider response exposes usage metadata yet.",
    ],
    edgeCases: [
      "The hook accumulates only values passed to `add()`.",
      "`cachedInputTokens` contributes to `totalTokens` and is accumulated when present.",
      "`reset()` returns to the first argument passed to `useTokenUsage`.",
      "The first argument is a `TokenUsage` object, not an options object.",
    ],
    pairsWith: [
      {
        hook: "useChatStream",
        description: "Pass `usage.add` to `onUsage` when your route returns usage metadata.",
      },
      {
        hook: "useModelCost",
        description: "Convert usage counters into an estimated spend display.",
      },
    ],
    returns: [
      {
        description: "Accumulated input token count.",
        name: "inputTokens",
        type: "number",
      },
      {
        description: "Accumulated output token count.",
        name: "outputTokens",
        type: "number",
      },
      {
        description: "Accumulated cached input tokens when provided.",
        name: "cachedInputTokens",
        type: "number | undefined",
      },
      {
        description: "Input + output + cached input tokens.",
        name: "totalTokens",
        type: "number",
      },
      {
        description: "Adds provider usage metadata to the current totals.",
        name: "add",
        type: "(usage: TokenUsage) => void",
      },
      {
        description: "Resets usage back to the initial value.",
        name: "reset",
        type: "() => void",
      },
    ],
    options: [
      {
        defaultValue: "{ inputTokens: 0, outputTokens: 0 }",
        description: "Optional first argument used as the starting usage object.",
        name: "initialUsage",
        type: "TokenUsage",
      },
    ],
    notes: [
      "The hook accumulates usage across calls.",
      "It does not estimate tokens by itself.",
      "Pair it with provider usage metadata or estimateTokens().",
    ],
    recipes: [
      "Show session token counters beside a chat composer.",
      "Accumulate usage from provider metadata.",
      "Reset counters when a conversation is cleared.",
    ],
    related: ["useChatStream", "useModelCost"],
    example: `import { useChatStream, useTokenUsage } from "@ai-hooks/react";

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
    category: "usage",
    summary: "Estimate model spend from usage counters.",
    purpose:
      "Use this when the UI needs request, session, or monthly cost feedback based on model pricing and token usage.",
    boundary:
      "AI Hooks estimates cost from supplied usage and reviewed pricing rows. It is not billing reconciliation and pricing data does not update live.",
    useWhen: [
      "The product should show estimated spend beside chat or usage counters.",
      "You want to compare the cost impact of different model choices in UI.",
      "A custom or private model price can be passed explicitly.",
    ],
    avoidWhen: [
      "You need invoice-grade billing, taxes, discounts, or organization-level credits.",
      "Provider pricing must update automatically without a reviewed registry change.",
      "Usage is unknown or estimated too loosely to make the cost meaningful.",
    ],
    edgeCases: [
      "Bundled model pricing is source-backed but reviewed manually.",
      "Pass `pricing` when your provider contract or model price differs from the registry.",
      "`cachedInputTokens` are priced separately when the pricing row includes cached input.",
      "`reset()` clears accumulated usage back to zero.",
    ],
    pairsWith: [
      {
        hook: "useTokenUsage",
        description: "Feed accumulated usage into the cost estimate.",
      },
    ],
    returns: [
      {
        description: "Current accumulated token usage.",
        name: "usage",
        type: "TokenUsage",
      },
      {
        description: "Estimated input-token cost in USD.",
        name: "inputUsd",
        type: "number",
      },
      {
        description: "Estimated output-token cost in USD.",
        name: "outputUsd",
        type: "number",
      },
      {
        description: "Estimated combined cost in USD.",
        name: "totalUsd",
        type: "number",
      },
      {
        description: "Formatted total cost string.",
        name: "formatted",
        type: "string",
      },
      {
        description: "Adds usage to the current estimate.",
        name: "add",
        type: "(usage: TokenUsage) => void",
      },
      {
        description: "Resets accumulated usage to zero.",
        name: "reset",
        type: "() => void",
      },
    ],
    options: [
      {
        defaultValue: "undefined",
        description: "Model id from the registry.",
        name: "model",
        type: "string",
      },
      {
        defaultValue: "undefined",
        description: "Explicit pricing override for custom or private models.",
        name: "pricing",
        type: "ModelPricing",
      },
      {
        defaultValue: '"USD"',
        description: "Display currency for formatted output.",
        name: "currency",
        type: "string",
      },
    ],
    notes: [
      "Bundled pricing rows include source URLs and a checkedAt date.",
      "You can pass explicit pricing for custom or private models.",
      "The hook does not send usage data anywhere.",
    ],
    recipes: [
      "Display estimated request cost from usage counters.",
      "Pass explicit pricing for private model routes.",
      "Pair with the LLM cost calculator before production pricing pages.",
    ],
    related: ["useTokenUsage"],
    example: `import { useModelCost } from "@ai-hooks/react";

export function CostMeter() {
  const cost = useModelCost({ model: "gpt-5.4-mini" });

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
    category: "files",
    summary: "Validate local files before an AI workflow uses them.",
    purpose:
      "Use this when a chat UI accepts files but the app needs to enforce file count, size, and MIME or extension rules before upload.",
    boundary:
      "AI Hooks validates local File objects only. Uploading, parsing, OCR, storage, and provider file APIs stay inside your app boundary.",
    useWhen: [
      "A composer accepts local files and needs client-side validation before submit.",
      "You need a small list of selected file metadata for UI rendering.",
      "The product wants to block unsupported file types before any network request.",
    ],
    avoidWhen: [
      "You need actual uploads, file parsing, OCR, embeddings, or provider Files API calls.",
      "You need malware scanning or server-side content validation.",
      "The workflow must persist files after the browser session ends.",
    ],
    edgeCases: [
      "`accept` supports exact MIME types, extensions like `.txt`, and wildcards like `image/*`.",
      "`maxFiles` limits the retained list after adding accepted files.",
      "`errors` contains validation errors from the most recent add attempt.",
      "The hook keeps browser `File` objects; your route still decides how to upload or parse them.",
    ],
    pairsWith: [
      {
        hook: "useChatStream",
        description:
          "Send selected file metadata or uploaded file ids through your own chat route.",
      },
    ],
    returns: [
      {
        description: "Accepted files with stable ids and metadata.",
        name: "items",
        type: "UploadedFileItem[]",
      },
      {
        description: "Validation errors from the most recent add attempt.",
        name: "errors",
        type: "string[]",
      },
      {
        description: "Validates and adds a FileList or File array.",
        name: "addFiles",
        type: "(files: FileList | File[]) => void",
      },
      {
        description: "Reads files from an input element and adds them.",
        name: "addFromInput",
        type: "(input: HTMLInputElement) => void",
      },
      {
        description: "Removes an accepted file by id.",
        name: "remove",
        type: "(id: string) => void",
      },
      {
        description: "Clears accepted files and validation errors.",
        name: "clear",
        type: "() => void",
      },
    ],
    options: [
      {
        defaultValue: "undefined",
        description: "Accepted MIME types, extensions, or wildcards like image/*.",
        name: "accept",
        type: "string[]",
      },
      {
        defaultValue: "undefined",
        description: "Maximum number of retained files.",
        name: "maxFiles",
        type: "number",
      },
      {
        defaultValue: "undefined",
        description: "Maximum file size in megabytes.",
        name: "maxSizeMB",
        type: "number",
      },
    ],
    notes: [
      "The hook does not upload files.",
      "Use your own server route for parsing or provider upload.",
      "Validation runs in the browser before any network request.",
    ],
    recipes: [
      "Validate file count and size before submit.",
      "Keep upload UI state separate from provider file APIs.",
      "Remove invalid files before calling your own route.",
    ],
    related: ["useChatStream"],
    example: `import { useFileUpload } from "@ai-hooks/react";

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
    category: "agents",
    summary: "Track tool call lifecycle for agent UI.",
    purpose:
      "Use this when an AI interface needs to show which tools are running, completed, or failed while keeping execution handlers in your app.",
    boundary:
      "AI Hooks tracks tool-call lifecycle state. Tool schemas, argument validation, permissions, execution, retries, and side effects stay in your app.",
    useWhen: [
      "An agent UI needs a visible timeline of running, completed, and failed tool calls.",
      "Tool handlers should stay inside your app boundary.",
      "You want a small registry of callable tool names for debug or UI panels.",
    ],
    avoidWhen: [
      "You need provider-specific tool schema generation or hosted execution.",
      "Tools are long-running jobs that require queues, retries, or background workers.",
      "Tool arguments are untrusted and have not been validated before side effects.",
    ],
    edgeCases: [
      "`run()` throws for unknown tool names.",
      "A failed handler updates the call status to `failed` and then rethrows.",
      "`schema` exposes registered names only; provider-specific JSON schemas stay outside the hook.",
      "Validate arguments before running side-effectful handlers.",
    ],
    pairsWith: [
      {
        hook: "useChatStream",
        description: "Render tool-call progress next to streamed assistant output.",
      },
      {
        hook: "useAbortController",
        description: "Use cancellation state when a tool-triggering stream can be stopped.",
      },
    ],
    returns: [
      {
        description: "Running, completed, and failed tool calls.",
        name: "activeCalls",
        type: "ActiveToolCall[]",
      },
      {
        description: "Registered tool names for UI or debug panels.",
        name: "schema",
        type: "{ name: string }[]",
      },
      {
        description: "Runs a registered tool handler and tracks lifecycle state.",
        name: "run",
        type: "(toolCall: ToolCallInput) => Promise<unknown>",
      },
      {
        description: "Clears tracked tool call state.",
        name: "clear",
        type: "() => void",
      },
    ],
    options: [
      {
        defaultValue: "required",
        description: "Record of tool handlers keyed by tool name.",
        name: "tools",
        type: "ToolHandlers",
      },
    ],
    notes: [
      "Tool handlers run in your app, not inside AI Hooks.",
      "schema exposes the registered tool names for UI/debug panels.",
      "Store provider-specific tool schemas outside the hook.",
    ],
    recipes: [
      "Render active tool calls in an agent timeline.",
      "Keep handler execution inside your app boundary.",
      "Clear completed calls when a conversation resets.",
    ],
    related: ["useChatStream"],
    example: `import { useToolCalls } from "@ai-hooks/react";

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
