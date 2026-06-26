# @ai-hooks/react

Headless React hooks for building AI product interfaces.

This package is part of AI Hooks. It provides React state primitives for streaming chat, abort
control, conversation storage, token usage, model cost estimates, file input validation, and tool
call UI state.

AI Hooks is not a hosted API or a provider proxy. Your app owns server routes, provider keys,
database writes, and markup.

## Install

Release install target:

```bash
npm i @ai-hooks/react
```

The package is still private during MVP and is not published to npm yet.

## Import

```tsx
import { useChatStream, useConversationStorage } from "@ai-hooks/react";
```

Subpath imports are also available for consumers that prefer explicit entrypoints:

```tsx
import { useChatStream } from "@ai-hooks/react/use-chat-stream";
```

## Example

```tsx
import { useChatStream, useConversationStorage } from "@ai-hooks/react";

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
      <textarea value={chat.input} onChange={(event) => chat.setInput(event.target.value)} />
      <button disabled={chat.isStreaming}>Send</button>
    </form>
  );
}
```

## Boundary

`@ai-hooks/react` ships UI logic and state. It does not include provider SDKs, proxy model calls,
host API keys, store conversations on a server, or render a UI kit. Your server route should call
OpenAI, Anthropic, Google, or another provider and stream deltas back to the client.
