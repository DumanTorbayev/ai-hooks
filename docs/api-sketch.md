# API Sketch

Пакет для пользователя:

```bash
npm i @ai-hooks/react
```

## Basic Chat

```tsx
"use client";

import {
  useAbortController,
  useChatStream,
  useConversationStorage,
  useModelCost,
  useTokenUsage,
} from "@ai-hooks/react";

export function Chat() {
  const conversation = useConversationStorage({
    key: "main-chat",
  });

  const abort = useAbortController();

  const usage = useTokenUsage({
    model: "gpt-4.1-mini",
  });

  const cost = useModelCost({
    model: "gpt-4.1-mini",
    currency: "USD",
  });

  const chat = useChatStream({
    endpoint: "/api/chat",
    signal: abort.signal,
    messages: conversation.messages,

    onUserMessage(message) {
      conversation.add(message);
    },

    onAssistantStart(message) {
      conversation.add(message);
    },

    onAssistantDelta(delta) {
      conversation.appendToLastAssistantMessage(delta);
    },

    onUsage(nextUsage) {
      usage.add(nextUsage);
      cost.add(nextUsage);
    },
  });

  return (
    <div>
      {conversation.messages.map((message) => (
        <article key={message.id}>
          <strong>{message.role}</strong>
          <p>{message.content}</p>
        </article>
      ))}

      <textarea
        value={chat.input}
        onChange={(event) => chat.setInput(event.target.value)}
      />

      <button onClick={() => chat.send(chat.input)} disabled={chat.isStreaming}>
        Send
      </button>

      <button onClick={abort.abort} disabled={!chat.isStreaming}>
        Stop
      </button>

      <footer>
        <span>{usage.totalTokens} tokens</span>
        <span>{cost.formatted}</span>
      </footer>
    </div>
  );
}
```

## API Route

Пользователь платит за свои запросы сам, потому что ключ находится в его приложении:

```ts
import { streamChat } from "@ai-hooks/server";
import { openai } from "@ai-hooks/providers/openai";

export async function POST(request: Request) {
  const body = await request.json();

  const stream = await streamChat({
    provider: openai({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    model: "gpt-4.1-mini",
    messages: body.messages,
  });

  return stream.toResponse();
}
```

## File Upload

```tsx
import { useChatStream, useFileUpload } from "@ai-hooks/react";

export function ChatWithFiles() {
  const files = useFileUpload({
    accept: ["image/*", "application/pdf", "text/plain"],
    maxFiles: 5,
    maxSizeMB: 10,
  });

  const chat = useChatStream({
    endpoint: "/api/chat",
    body: {
      files: files.items,
    },
    onFinish() {
      files.clear();
    },
  });

  return (
    <form>
      <input
        type="file"
        multiple
        onChange={(event) => files.addFromInput(event.currentTarget)}
      />

      {files.items.map((file) => (
        <div key={file.id}>{file.name}</div>
      ))}

      <button onClick={() => chat.send("Analyze these files")}>
        Send
      </button>
    </form>
  );
}
```

## Tool Calls

```tsx
import { useChatStream, useToolCalls } from "@ai-hooks/react";

export function ChatWithTools() {
  const tools = useToolCalls({
    tools: {
      getWeather: async ({ city }: { city: string }) => {
        const response = await fetch(`/api/weather?city=${city}`);
        return response.json();
      },
    },
  });

  const chat = useChatStream({
    endpoint: "/api/chat",
    body: {
      tools: tools.schema,
    },
    onToolCall(toolCall) {
      tools.run(toolCall);
    },
  });

  return (
    <div>
      {tools.activeCalls.map((call) => (
        <p key={call.id}>Running {call.name}</p>
      ))}
    </div>
  );
}
```

## Cost Calculator Utility

```ts
import { estimateModelCost } from "@ai-hooks/core";

const cost = estimateModelCost({
  model: "gpt-4.1-mini",
  inputTokens: 12000,
  outputTokens: 3500,
});

console.log(cost.totalUsd);
```

## Model Info

```ts
import { getModelInfo } from "@ai-hooks/core";

const model = getModelInfo("gpt-4.1-mini");

console.log(model.contextWindow);
console.log(model.supports.streaming);
console.log(model.supports.toolCalling);
```

