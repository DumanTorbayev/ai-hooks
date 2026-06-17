"use client";

import { useEffect, useRef, useState } from "react";

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
      {text}
    </button>
  );
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Browser permissions can block Clipboard API even on localhost.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command failed.");
    }
  } finally {
    textarea.remove();
  }
}
