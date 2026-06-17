import { ImageResponse } from "next/og";

import { siteMetadata } from "@/lib/metadata";

export const alt = "AI Hooks - React UI patterns for AI apps";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f5f3ee",
          color: "#191a17",
          display: "flex",
          height: "100%",
          padding: 56,
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid #d8d4c7",
            borderRadius: 18,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
            padding: 44,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                color: "#0c5b48",
                display: "flex",
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 0,
              }}
            >
              AI Hooks
            </div>
            <div
              style={{
                border: "1px solid #c5ddd2",
                borderRadius: 8,
                color: "#0c5b48",
                display: "flex",
                fontSize: 22,
                padding: "9px 14px",
              }}
            >
              provider-agnostic
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 850,
                letterSpacing: 0,
                lineHeight: 1.02,
                maxWidth: 780,
              }}
            >
              React primitives for AI product UI
            </div>
            <div
              style={{
                color: "#454641",
                display: "flex",
                fontSize: 30,
                lineHeight: 1.3,
                maxWidth: 820,
              }}
            >
              Streaming chat, abort controls, token usage, model cost, tool calls,
              and file workflows.
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 18,
            }}
          >
            {["useChatStream", "useModelCost", "estimateTokens"].map((label) => (
              <div
                key={label}
                style={{
                  background: "#16181d",
                  border: "1px solid #2a2e37",
                  borderRadius: 10,
                  color: "#d9dde4",
                  display: "flex",
                  fontFamily: "monospace",
                  fontSize: 24,
                  padding: "13px 16px",
                }}
              >
                {label}
              </div>
            ))}
            <div
              style={{
                color: "#7c7d75",
                display: "flex",
                fontSize: 22,
                marginLeft: "auto",
              }}
            >
              {siteMetadata.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
