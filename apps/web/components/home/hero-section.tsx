import { estimateModelCost } from "@ai-hooks/core/cost";
import { listModels } from "@ai-hooks/core/models";
import { estimateTokens } from "@ai-hooks/core/tokens";

import { MockChatDemo } from "../mock-chat-demo";

export function HeroSection() {
  const prompt =
    "Summarize this uploaded document and return answer sections with citations.";
  const tokens = estimateTokens({ text: prompt });
  const cost = estimateModelCost({
    model: "mock-fast",
    inputTokens: tokens,
    outputTokens: 320,
  });
  const models = listModels();

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            React primitives for AI product UI
          </div>
          <h1 className="head">
            Build production AI interfaces <span className="alt">in React.</span>
          </h1>
          <p className="sub">
            Headless hooks, live mock streams, and copy-paste UI patterns for{" "}
            <b>chat, tool calls, files, voice, citations, and model-aware UX</b>.
          </p>

          <div className="featurow" aria-label="Feature highlights">
            {["streaming", "abort", "tools", "files", "usage", "models"].map((item) => (
              <span className="chip" key={item}>
                <span className="pl">+</span>
                {item}
              </span>
            ))}
          </div>

          <div className="cmd" aria-label="Install command">
            <div className="pre">
              <span className="sigil">$</span>
              <code>
                npm i <span className="pkg">@ai-hooks/react</span>
              </code>
            </div>
            <button className="copybtn" type="button">
              Copy
            </button>
          </div>
          <div className="cmd-meta">
            <span>
              <b>{tokens}</b> demo tokens
            </span>
            <span>
              <b>{cost.formatted}</b> mock cost
            </span>
            <span>
              <b>{models.length}</b> demo models
            </span>
          </div>

          <div className="notice">
            <span className="notice-icon">✓</span>
            <p>
              <b>No hosted AI API.</b> Public demos use mock streaming. Production
              requests go through your own route and your own provider keys.
            </p>
          </div>
        </div>

        <MockChatDemo />
      </div>
    </section>
  );
}
