"use client";

import { estimateModelCost } from "@ai-hooks/core/cost";
import { listModels } from "@ai-hooks/core/models";
import { estimateTokens } from "@ai-hooks/core/tokens";
import { useMemo, useState } from "react";

const models = listModels();
const defaultPrompt =
  "You are an AI product assistant. Summarize the user request, propose the next UI state, and return a concise implementation checklist.";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 5,
});

export function LlmCostCalculator() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [modelId, setModelId] = useState(models[0]?.id ?? "mock-fast");
  const [outputTokens, setOutputTokens] = useState(420);
  const [cachedInputTokens, setCachedInputTokens] = useState(0);
  const [requestsPerDay, setRequestsPerDay] = useState(1_000);
  const [daysPerMonth, setDaysPerMonth] = useState(30);

  const selectedModel = models.find((model) => model.id === modelId) ?? models[0];

  const estimate = useMemo(() => {
    const inputTokens = estimateTokens({ text: prompt });
    const safeCachedTokens = clampNumber(cachedInputTokens, 0, inputTokens);
    const safeOutputTokens = Math.max(outputTokens, 0);
    const safeRequestsPerDay = Math.max(requestsPerDay, 0);
    const safeDaysPerMonth = Math.max(daysPerMonth, 0);
    const cost = estimateModelCost({
      model: selectedModel.id,
      inputTokens,
      outputTokens: safeOutputTokens,
      cachedInputTokens: safeCachedTokens,
    });
    const dailyUsd = cost.totalUsd * safeRequestsPerDay;
    const monthlyUsd = dailyUsd * safeDaysPerMonth;

    return {
      inputTokens,
      cachedInputTokens: safeCachedTokens,
      outputTokens: safeOutputTokens,
      totalTokens: inputTokens + safeOutputTokens,
      cost,
      dailyUsd,
      monthlyUsd,
    };
  }, [cachedInputTokens, daysPerMonth, outputTokens, prompt, requestsPerDay, selectedModel]);

  return (
    <div className="calculator-shell">
      <div className="calculator-form" aria-label="LLM cost calculator controls">
        <div className="field full">
          <label htmlFor="calc-prompt">Prompt or average input</label>
          <textarea
            id="calc-prompt"
            onChange={(event) => setPrompt(event.target.value)}
            rows={7}
            value={prompt}
          />
          <span className="field-note">
            Token estimate uses the local `estimateTokens()` utility. No text leaves the
            browser.
          </span>
        </div>

        <div className="field">
          <label htmlFor="calc-model">Model</label>
          <select
            id="calc-model"
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

        <NumberField
          id="calc-output"
          label="Output tokens"
          min={0}
          onChange={setOutputTokens}
          value={outputTokens}
        />
        <NumberField
          id="calc-cached"
          label="Cached input tokens"
          min={0}
          onChange={setCachedInputTokens}
          value={cachedInputTokens}
        />
        <NumberField
          id="calc-requests"
          label="Requests / day"
          min={0}
          onChange={setRequestsPerDay}
          value={requestsPerDay}
        />
        <NumberField
          id="calc-days"
          label="Days / month"
          min={0}
          onChange={setDaysPerMonth}
          value={daysPerMonth}
        />

        <button
          className="btn sm"
          onClick={() => {
            setPrompt(defaultPrompt);
            setModelId(models[0]?.id ?? "mock-fast");
            setOutputTokens(420);
            setCachedInputTokens(0);
            setRequestsPerDay(1_000);
            setDaysPerMonth(30);
          }}
          type="button"
        >
          Reset example
        </button>
      </div>

      <aside className="calculator-results" aria-label="LLM cost estimate">
        <div className="result-top">
          <span className="sec-label">// estimate</span>
          <h2>{formatUsd(estimate.monthlyUsd)}</h2>
          <p>Estimated monthly spend for the current traffic and token assumptions.</p>
        </div>

        <div className="metric-grid">
          <Metric label="Input tokens" value={estimate.inputTokens.toLocaleString("en-US")} />
          <Metric label="Output tokens" value={estimate.outputTokens.toLocaleString("en-US")} />
          <Metric label="Total / request" value={estimate.totalTokens.toLocaleString("en-US")} />
          <Metric label="Per request" value={estimate.cost.formatted} />
          <Metric label="Per day" value={formatUsd(estimate.dailyUsd)} />
          <Metric label="Cached input" value={estimate.cachedInputTokens.toLocaleString("en-US")} />
        </div>

        <div className="pricing-card">
          <h3>{selectedModel.displayName}</h3>
          <div className="price-row">
            <span>Input / 1M</span>
            <b>{formatUsd(selectedModel.pricing?.inputPerMillionUsd ?? 0)}</b>
          </div>
          <div className="price-row">
            <span>Output / 1M</span>
            <b>{formatUsd(selectedModel.pricing?.outputPerMillionUsd ?? 0)}</b>
          </div>
          <div className="price-row">
            <span>Context</span>
            <b>{formatCompactTokens(selectedModel.contextWindow)}</b>
          </div>
          <p>
            Demo pricing is intentionally local. Real provider pages should use a dated
            pricing registry before publication.
          </p>
        </div>
      </aside>
    </div>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  min: number;
  onChange: (value: number) => void;
  value: number;
};

function NumberField({ id, label, min, onChange, value }: NumberFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
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

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatUsd(value: number) {
  return currencyFormatter.format(value);
}

function formatCompactTokens(tokens: number) {
  if (tokens >= 1_000) {
    return `${Math.round(tokens / 1_000)}k`;
  }

  return `${tokens}`;
}
