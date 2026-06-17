"use client";

import { useState } from "react";

type PlaygroundMode = "stream" | "tools" | "files";

const modeContent = {
  files: {
    prompt: "Validate uploaded files before sending metadata to an AI route.",
    completion:
      "useFileUpload keeps accepted files, validation errors, and removal actions in your UI state.",
    meta: "3 files · 1 rejected · browser validation · $0.00",
  },
  stream: {
    prompt: "Draft a short product update for an AI chat interface.",
    completion:
      "AI Hooks keeps streaming, abort state, and usage visible in React apps. Start with mock streams, then swap in your own provider route.",
    meta: "38 tokens · 0.9s · mock · $0.00",
  },
  tools: {
    prompt: "Show the current tool calls for an agent workflow.",
    completion:
      "useToolCalls tracks active, completed, and failed tool calls while execution stays in your app.",
    meta: "2 calls · planSearch complete · synthesize running · $0.00",
  },
} satisfies Record<PlaygroundMode, { prompt: string; completion: string; meta: string }>;

export function PlaygroundSection() {
  const [mode, setMode] = useState<PlaygroundMode>("stream");
  const [runCount, setRunCount] = useState(1);
  const [toolCalls, setToolCalls] = useState(true);
  const [latency, setLatency] = useState(true);
  const active = modeContent[mode];
  const status = runCount === 0 ? "idle" : runCount % 2 === 0 ? "streaming" : "done";

  return (
    <section className="block alt-block" id="playground">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// playground</span>
            <h2>Mock streaming playground.</h2>
            <p>
              The public site can demonstrate streaming, latency, stop states, and usage
              without spending project-owned model credits.
            </p>
          </div>
        </div>

        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-bar">
              <div className="seg">
                <button
                  className={mode === "stream" ? "on" : undefined}
                  onClick={() => setMode("stream")}
                  type="button"
                >
                  Stream
                </button>
                <button
                  className={mode === "tools" ? "on" : undefined}
                  onClick={() => setMode("tools")}
                  type="button"
                >
                  Tools
                </button>
                <button
                  className={mode === "files" ? "on" : undefined}
                  onClick={() => setMode("files")}
                  type="button"
                >
                  Files
                </button>
              </div>
              <span className="nospend">$0.00 spend</span>
            </div>
            <div className="pg-stream">
              <div className="role">prompt</div>
              <div className="uline">{active.prompt}</div>
              <div className="role">completion · mock</div>
              <div>
                {active.completion}
                {status === "streaming" ? <span className="acur" /> : null}
              </div>
              <div className="tok-meta">
                <b>{status}</b> · {active.meta}
              </div>
            </div>
            <div className="pg-ctrl">
              <button
                className="pg-run"
                onClick={() => setRunCount((current) => current + 1)}
                type="button"
              >
                Run mock
              </button>
              <button className="pg-reset" onClick={() => setRunCount(0)} type="button">
                Reset
              </button>
            </div>
          </div>

          <div className="pg-side">
            <div className="side-card">
              <h4>Runtime controls</h4>
              <div className="opt">
                <span>Model</span>
                <span className="v">mock-fast</span>
              </div>
              <div className="opt">
                <span>Tokens / sec</span>
                <span className="v">{latency ? "~42" : "instant"}</span>
              </div>
              <div className="opt">
                <span>Tool calls</span>
                <button
                  aria-label="Toggle tool calls"
                  aria-pressed={toolCalls}
                  className={`toggle ${toolCalls ? "on" : ""}`}
                  onClick={() => setToolCalls((enabled) => !enabled)}
                  type="button"
                />
              </div>
              <div className="opt">
                <span>Simulate latency</span>
                <button
                  aria-label="Toggle latency simulation"
                  aria-pressed={latency}
                  className={`toggle ${latency ? "on" : ""}`}
                  onClick={() => setLatency((enabled) => !enabled)}
                  type="button"
                />
              </div>
            </div>
            <div className="side-card ratecard">
              <h4>Why mock?</h4>
              <p>
                Real provider demos create cost and abuse risk. Mock streams prove UX
                behavior without API keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
