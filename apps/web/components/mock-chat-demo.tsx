"use client";

import {
  useAbortController,
  useChatStream,
  useConversationStorage,
  useModelCost,
  useTokenUsage,
} from "@ai-hooks/react";

export function MockChatDemo() {
  const abort = useAbortController();
  const usage = useTokenUsage();
  const cost = useModelCost({ model: "mock-fast" });
  const conversation = useConversationStorage({
    key: "homepage-design-demo",
    initialMessages: [
      {
        id: "demo-system",
        role: "assistant",
        content:
          "Ask me to draft a streaming AI chat UI. This demo uses mock streaming, not paid model calls.",
        createdAt: new Date(0).toISOString(),
      },
    ],
  });

  const chat = useChatStream({
    mockResponse:
      "Start with a client component, stream deltas into the last assistant message, expose a Stop button with AbortController, and keep usage/cost as visible product state.",
    signal: abort.signal,
    transport: "mock",
    onUserMessage(content) {
      conversation.addUserMessage(content);
    },
    onAssistantStart() {
      conversation.addAssistantMessage("");
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
    <section className="demo" aria-label="Mock streaming chat demo">
      <div className="demo-head">
        <span className="tdot" />
        <span className="tdot" />
        <span className="tdot" />
        <div className="demo-title">
          <b>mock-chat.tsx</b> · live preview
        </div>
        <div className="demo-badge">
          <span className="dot" />
          local stream
        </div>
      </div>

      <div className="demo-hookbar">
        hook <code>useChatStream()</code>
        <span className="pill">{chat.isStreaming ? "streaming" : "idle"}</span>
      </div>

      <div className="chat-scroll">
        {conversation.messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <article className={`msg ${isUser ? "user" : "bot"}`} key={message.id}>
              <div className="av">{isUser ? "YOU" : "AI"}</div>
              <div className="bubble">
                <div className="role">
                  {isUser ? "user" : chat.isStreaming && !message.content ? "assistant · streaming" : "assistant"}
                </div>
                <span className="txt">{message.content || "Streaming"}</span>
                {!isUser && chat.isStreaming && !message.content ? <span className="cursor" /> : null}
              </div>
            </article>
          );
        })}

        {chat.isStreaming ? (
          <article className="toolcall" aria-label="Streaming usage">
            <div className="tc-head">
              usage meter <span className="ok">running</span>
            </div>
            <div className="tc-body">
              <span className="k">tokens</span>: estimating · <span className="k">cost</span>: mock
            </div>
          </article>
        ) : null}
      </div>

      <div className="composer">
        <div className="composer-inner">
          <textarea
            onChange={(event) => chat.setInput(event.target.value)}
            placeholder="Ask for an AI UI pattern..."
            rows={2}
            value={chat.input}
          />
          <button className="icon-btn" onClick={conversation.clear} type="button">
            ↺
          </button>
          <button
            className={`stop ${chat.isStreaming ? "on" : ""}`}
            disabled={!chat.isStreaming}
            onClick={abort.abort}
            type="button"
          >
            ■ Stop
          </button>
          <button
            className="send"
            disabled={chat.isStreaming || !chat.input.trim()}
            onClick={() => chat.send()}
            type="button"
          >
            →
          </button>
        </div>
        <div className="composer-foot">
          <span>
            Press <span className="kbd">⌘</span> <span className="kbd">Enter</span>
          </span>
          <span className="usage">
            <b>{usage.totalTokens}</b> tokens · <b>{cost.formatted}</b>
          </span>
        </div>
      </div>
    </section>
  );
}
