"use client";

import { useAbortController, useChatStream, useConversationStorage } from "@ai-hooks/react";
import { useState } from "react";

export function ChatPanel() {
  const abort = useAbortController();
  const conversation = useConversationStorage({ key: "next-basic-chat" });
  const [notice, setNotice] = useState<string | null>(null);

  const chat = useChatStream({
    endpoint: "/api/chat",
    messages: conversation.messages,
    onAssistantDelta: conversation.appendToLastAssistantMessage,
    onAssistantStart: () => conversation.addAssistantMessage(""),
    onError: (error) =>
      setNotice(error.name === "AbortError" ? "Generation stopped." : error.message),
    onFinish: () => setNotice(null),
    onUserMessage: conversation.addUserMessage,
    signal: abort.signal,
  });

  return (
    <section className="chat" aria-label="Basic chat example">
      <div className="messages">
        {conversation.messages.length ? (
          conversation.messages.map((message) => (
            <article className={`message ${message.role}`} key={message.id}>
              <span>{message.role}</span>
              <p>{message.content || "..."}</p>
            </article>
          ))
        ) : (
          <div className="empty">
            Send a message to stream a mock response from <code>app/api/chat/route.ts</code>.
          </div>
        )}
      </div>

      {chat.error ? <p className="notice">{notice ?? chat.error.message}</p> : null}

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          const content = chat.input;
          chat.setInput("");
          void chat.send(content);
        }}
      >
        <textarea
          aria-label="Message"
          onChange={(event) => chat.setInput(event.target.value)}
          placeholder="Ask the mock route how to wire a provider..."
          rows={3}
          value={chat.input}
        />
        <div className="actions">
          <button disabled={!chat.input.trim() || chat.isStreaming} type="submit">
            Send
          </button>
          <button disabled={!chat.isStreaming} onClick={abort.abort} type="button">
            Stop
          </button>
          <button disabled={chat.isStreaming} onClick={conversation.clear} type="button">
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
