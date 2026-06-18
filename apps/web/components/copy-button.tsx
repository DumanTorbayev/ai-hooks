"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon, CopyIcon, RetryIcon } from "@/components/icons";

type CopyButtonProps = {
  value: string;
  className?: string;
  label?: string;
  copiedLabel?: string;
};

export function CopyButton({
  value,
  className,
  label = "Copy",
  copiedLabel = "Copied",
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  async function handleCopy() {
    try {
      await copyText(value);
      setState("copied");
    } catch {
      setState("failed");
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setState("idle");
    }, 1600);
  }

  const text = state === "copied" ? copiedLabel : state === "failed" ? "Retry" : label;
  const Icon = state === "copied" ? CheckIcon : state === "failed" ? RetryIcon : CopyIcon;

  return (
    <button
      aria-label={state === "copied" ? "Copied to clipboard" : "Copy to clipboard"}
      className={className}
      data-state={state}
      onClick={() => {
        void handleCopy();
      }}
      type="button"
    >
      <Icon aria-hidden="true" size={13} strokeWidth={1.8} />
      <span>{text}</span>
    </button>
  );
}

async function copyText(value: string) {
  if (globalThis.navigator?.clipboard?.writeText) {
    try {
      await globalThis.navigator.clipboard.writeText(value);
      return;
    } catch {
      // Browser permissions can block Clipboard API even on localhost.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "0";
  textarea.style.top = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0.01";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}
