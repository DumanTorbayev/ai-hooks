"use client";

import { listModels } from "@ai-hooks/core/models";
import { estimateTokens } from "@ai-hooks/core/tokens";
import { useMemo, useState } from "react";

const models = listModels();
const sampleText =
  "Summarize the attached product feedback, group issues by workflow, and return the top three UX fixes with citations.";

export function TokenEstimator() {
  const [text, setText] = useState(sampleText);
  const [charsPerToken, setCharsPerToken] = useState(4);
  const [expectedOutputTokens, setExpectedOutputTokens] = useState(600);
  const [modelId, setModelId] = useState(models[0]?.id ?? "mock-fast");

  const selectedModel = models.find((model) => model.id === modelId) ?? models[0];

  const stats = useMemo(() => {
    const inputTokens = estimateTokens({ text, charsPerToken });
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const totalPlannedTokens = inputTokens + Math.max(expectedOutputTokens, 0);
    const contextUsed = selectedModel.contextWindow
      ? (totalPlannedTokens / selectedModel.contextWindow) * 100
      : 0;
    const remainingContext = Math.max(selectedModel.contextWindow - totalPlannedTokens, 0);

    return {
      characters,
      words,
      lines,
      inputTokens,
      totalPlannedTokens,
      contextUsed,
      remainingContext,
    };
  }, [charsPerToken, expectedOutputTokens, selectedModel, text]);

  return (
    <div className="calculator-shell">
      <div className="calculator-form" aria-label="Token estimator controls">
        <div className="field full">
          <label htmlFor="token-text">Prompt or document excerpt</label>
          <textarea
            id="token-text"
            onChange={(event) => setText(event.target.value)}
            rows={10}
            value={text}
          />
          <span className="field-note">
            This is a rough local estimate. Different tokenizers vary by model and language.
          </span>
        </div>

        <div className="field">
          <label htmlFor="token-model">Context model</label>
          <select
            id="token-model"
            onChange={(event) => setModelId(event.target.value)}
            value={modelId}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="chars-per-token">Chars / token: {charsPerToken}</label>
          <div className="range-pair">
            <input
              id="chars-per-token"
              max={8}
              min={2}
              onChange={(event) => setCharsPerToken(Number(event.target.value))}
              step={0.25}
              type="range"
              value={charsPerToken}
            />
            <input
              aria-label="Chars per token value"
              max={8}
              min={2}
              onChange={(event) => setCharsPerToken(Number(event.target.value))}
              step={0.25}
              type="number"
              value={charsPerToken}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="expected-output">Expected output tokens</label>
          <input
            id="expected-output"
            min={0}
            onChange={(event) => setExpectedOutputTokens(Number(event.target.value))}
            type="number"
            value={expectedOutputTokens}
          />
        </div>

        <button
          className="btn sm"
          onClick={() => {
            setText(sampleText);
            setCharsPerToken(4);
            setExpectedOutputTokens(600);
            setModelId(models[0]?.id ?? "mock-fast");
          }}
          type="button"
        >
          Reset example
        </button>
      </div>

      <aside className="calculator-results" aria-label="Token estimate">
        <div className="result-top">
          <span className="sec-label">// token estimate</span>
          <h2>{stats.inputTokens.toLocaleString("en-US")}</h2>
          <p>Estimated input tokens for the current text.</p>
        </div>

        <div className="metric-grid">
          <Metric label="Characters" value={stats.characters.toLocaleString("en-US")} />
          <Metric label="Words" value={stats.words.toLocaleString("en-US")} />
          <Metric label="Lines" value={stats.lines.toLocaleString("en-US")} />
          <Metric label="Chars / token" value={charsPerToken.toLocaleString("en-US")} />
          <Metric
            label="With output"
            value={stats.totalPlannedTokens.toLocaleString("en-US")}
          />
          <Metric
            label="Remaining context"
            value={stats.remainingContext.toLocaleString("en-US")}
          />
        </div>

        <div className="pricing-card">
          <h3>{selectedModel.displayName} context</h3>
          <div className="context-meter" aria-label="Context usage">
            <span style={{ width: `${Math.min(stats.contextUsed, 100)}%` }} />
          </div>
          <div className="price-row">
            <span>Context window</span>
            <b>{selectedModel.contextWindow.toLocaleString("en-US")}</b>
          </div>
          <div className="price-row">
            <span>Planned usage</span>
            <b>{stats.contextUsed.toFixed(2)}%</b>
          </div>
          <p>
            Use this before designing prompts, file limits, retrieval chunks, and model
            comparison pages.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
