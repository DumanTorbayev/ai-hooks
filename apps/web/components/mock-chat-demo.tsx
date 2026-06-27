"use client";

import { useEffect, useRef, useState } from "react";

import { SendIcon, StopIcon } from "@/components/icons";

import css from "./mock-chat-demo.module.css";

type Message = {
  content: string;
  role: "assistant" | "user";
  streaming?: boolean;
};

const replies = [
  "Good question. `messages` is the ordered thread, `send()` starts a turn, `isStreaming` flips true while tokens arrive, and `stop()` aborts cleanly.",
  "You point `endpoint` at your own route, so the provider key stays on your server. The hook just manages streaming UI state.",
  "Pair it with `useConversationStorage` to persist threads and `useTokenUsage` to track tokens per turn.",
];

export function MockChatDemo() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "What does `useChatStream` return?",
      role: "user",
    },
    {
      content: "It returns `messages`, `send()`, `isStreaming`, and `stop()` — you render the UI.",
      role: "assistant",
    },
  ]);
  const [tokens, setTokens] = useState(428);
  const replyIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    },
    [],
  );

  function send() {
    const prompt = input.trim();

    if (!prompt || isStreaming) {
      return;
    }

    setInput("");
    setMessages((current) => [
      ...current,
      { content: prompt, role: "user" },
      { content: "", role: "assistant", streaming: true },
    ]);

    const words = replies[replyIndexRef.current % replies.length].split(" ");
    replyIndexRef.current += 1;
    let index = 0;
    setIsStreaming(true);

    timerRef.current = window.setInterval(() => {
      if (index >= words.length) {
        stop(false);
        return;
      }

      const nextWord = words[index];
      index += 1;
      setTokens((current) => current + 2);
      setMessages((current) => {
        const copy = [...current];
        const last = copy[copy.length - 1];

        if (!last || last.role !== "assistant") {
          return current;
        }

        copy[copy.length - 1] = {
          ...last,
          content: `${last.content}${last.content ? " " : ""}${nextWord}`,
        };
        return copy;
      });
    }, 90);
  }

  function stop(keepPartial = true) {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsStreaming(false);
    setMessages((current) => {
      const copy = [...current];
      const last = copy[copy.length - 1];

      if (!last || last.role !== "assistant") {
        return current;
      }

      copy[copy.length - 1] = {
        ...last,
        content: keepPartial && !last.content ? "Stopped before the first token." : last.content,
        streaming: false,
      };
      return copy;
    });
  }

  return (
    <section className={css.preview} aria-label="Mock useChatStream preview">
      <div className={css.head}>
        <span className={css.dot} />
        <span className={css.dot} />
        <span className={css.dot} />
        <span className={css.title}>
          <b>useChatStream</b> — preview
        </span>
        <span className={css.badge}>
          <span className={css.badge_dot} /> mock
        </span>
      </div>
      <div className={css.scroll}>
        {messages.map((message, index) => (
          <article
            className={`${css.message} ${message.role === "user" ? css.user : css.bot}`}
            key={index}
          >
            <div className={css.avatar}>{message.role === "user" ? "YOU" : "AI"}</div>
            <div className={css.body}>
              <div className={css.role}>
                {message.role === "assistant" && message.streaming
                  ? "assistant · streaming"
                  : message.role}
              </div>
              {renderInlineCode(message.content)}
              {message.streaming ? <span className={css.cursor} /> : null}
            </div>
          </article>
        ))}
      </div>
      <div className={css.composer}>
        <div className={css.inner}>
          <textarea
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Message the mock model..."
            rows={1}
            value={input}
          />
          {isStreaming ? (
            <button
              className={`${css.stop} ${css.stop_visible}`}
              onClick={() => stop()}
              type="button"
            >
              <StopIcon /> Stop
            </button>
          ) : (
            <button
              aria-label="send"
              className={css.send}
              disabled={!input.trim()}
              onClick={send}
              type="button"
            >
              <SendIcon />
            </button>
          )}
        </div>
        <div className={css.foot}>
          <span>
            <span className={css.key}>Enter</span> send
          </span>
          <span>
            <span className={css.key}>Shift</span> newline
          </span>
          <span className={css.usage}>
            tokens <b>{tokens.toLocaleString("en-US")}</b> / 128k
          </span>
        </div>
      </div>
    </section>
  );
}

function renderInlineCode(value: string) {
  const chunks = value.split(/(`[^`]+`)/g);

  return chunks.map((chunk, index) => {
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return <code key={index}>{chunk.slice(1, -1)}</code>;
    }

    return <span key={index}>{chunk}</span>;
  });
}
