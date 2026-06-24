import type { AiMessage, AiRole } from "@ai-hooks/core/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ConversationStorageOptions = {
  key: string;
  initialMessages?: AiMessage[];
  storage?: Storage;
};

export function useConversationStorage(options: ConversationStorageOptions) {
  const storage = options.storage;
  const storageKey = `ai-hooks:${options.key}`;
  const [messages, setMessages] = useState<AiMessage[]>(options.initialMessages ?? []);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const initialMessagesRef = useRef(options.initialMessages ?? []);

  useEffect(() => {
    initialMessagesRef.current = options.initialMessages ?? [];
  }, [options.initialMessages]);

  useEffect(() => {
    const targetStorage = getTargetStorage(storage);
    const value = targetStorage?.getItem(storageKey);

    if (value) {
      setMessages(parseStoredMessages(value, initialMessagesRef.current));
    } else {
      setMessages(initialMessagesRef.current);
    }

    setLoadedStorageKey(storageKey);
  }, [storage, storageKey]);

  useEffect(() => {
    if (loadedStorageKey !== storageKey) {
      return;
    }

    const targetStorage = getTargetStorage(storage);
    targetStorage?.setItem(storageKey, JSON.stringify(messages));
  }, [loadedStorageKey, messages, storage, storageKey]);

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
    setMessages(initialMessagesRef.current);
  }, []);

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

function getTargetStorage(storage: Storage | undefined) {
  if (storage) {
    return storage;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function parseStoredMessages(value: string, fallback: AiMessage[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as AiMessage[]) : fallback;
  } catch {
    return fallback;
  }
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
