import type { AiMessage, AiRole } from "@ai-hooks/core/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ConversationStorageOptions = {
  key: string;
  initialMessages?: AiMessage[];
  storage?: Storage;
};

export function useConversationStorage(options: ConversationStorageOptions) {
  const storage = options.storage;
  const storageKey = `ai-hooks:${options.key}`;
  const [messages, setMessages] = useState<AiMessage[]>(options.initialMessages ?? []);

  useEffect(() => {
    const targetStorage = storage ?? globalThis.localStorage;
    const value = targetStorage.getItem(storageKey);

    if (value) {
      setMessages(JSON.parse(value) as AiMessage[]);
    }
  }, [storage, storageKey]);

  useEffect(() => {
    const targetStorage = storage ?? globalThis.localStorage;
    targetStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storage, storageKey]);

  const add = useCallback((message: AiMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const addMessage = useCallback((role: AiRole, content: string) => {
    const message = createMessage(role, content);
    setMessages((current) => [...current, message]);
    return message;
  }, []);

  const appendToLastAssistantMessage = useCallback((delta: string) => {
    setMessages((current) => {
      const next = [...current];
      const index = findLastAssistantIndex(next);

      if (index === -1) {
        next.push(createMessage("assistant", delta));
      } else {
        next[index] = {
          ...next[index],
          content: `${next[index].content}${delta}`,
        };
      }

      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMessages(options.initialMessages ?? []);
  }, [options.initialMessages]);

  return useMemo(
    () => ({
      add,
      addAssistantMessage: (content: string) => addMessage("assistant", content),
      addMessage,
      addUserMessage: (content: string) => addMessage("user", content),
      appendToLastAssistantMessage,
      clear,
      messages,
    }),
    [add, addMessage, appendToLastAssistantMessage, clear, messages],
  );
}

function createMessage(role: AiRole, content: string): AiMessage {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${role}-${Date.now()}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function findLastAssistantIndex(messages: AiMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "assistant") {
      return index;
    }
  }

  return -1;
}
