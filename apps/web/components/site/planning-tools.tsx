"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  defaultModelId,
  modelCatalog,
  providerCapabilityBadge,
  providerMatrix,
  providerLabels,
  supportBadge,
  type CapabilityLevel,
} from "@/content/tools";

export function CostCalc() {
  const [model, setModel] = useState(defaultModelId);
  const [requests, setRequests] = useState(1);
  const [inputTokens, setInputTokens] = useState(1200);
  const [outputTokens, setOutputTokens] = useState(400);
  const selectedModel = modelCatalog.find((item) => item.id === model) ?? modelCatalog[0];

  if (!selectedModel) {
    return <p className="tv-disclaim">No source-backed model pricing is available.</p>;
  }

  const { pricing } = selectedModel;
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillionUsd * requests;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillionUsd * requests;

  return (
    <>
      <div className="calc">
        <div className="cfields">
          <Field label="Model">
            <select onChange={(event) => setModel(event.target.value)} value={selectedModel.id}>
              {modelCatalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.displayName} · {providerLabels[item.provider]}
                </option>
              ))}
            </select>
          </Field>
          <NumberField label="Requests" min={1} onChange={setRequests} value={requests} />
          <NumberField label="Input tokens" min={0} onChange={setInputTokens} value={inputTokens} />
          <NumberField label="Output tokens" min={0} onChange={setOutputTokens} value={outputTokens} />
        </div>
        <div className="cout">
          <Metric label="Input cost" value={formatUsd(inputCost)} />
          <Metric label="Output cost" value={formatUsd(outputCost)} />
          <Metric label="Total" strong value={formatUsd(inputCost + outputCost)} />
        </div>
      </div>
      <p className="tv-disclaim">
        Source-backed pricing checked {selectedModel.checkedAt}. Formula: (input/1e6 ×
        input_rate + output/1e6 × output_rate) × requests.{" "}
        <a href={selectedModel.sourceUrls[0]} rel="noreferrer" target="_blank">
          Official source
        </a>
      </p>
    </>
  );
}

export function TokenEstimator() {
  const [text, setText] = useState(
    "You are a helpful assistant. Summarize the attached report in three concise bullet points and flag any risks.",
  );
  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      chars: text.length,
      tokens: Math.ceil(text.length / 4),
      words: trimmed ? trimmed.split(/\s+/).length : 0,
    };
  }, [text]);

  return (
    <>
      <div className="estimator">
        <textarea onChange={(event) => setText(event.target.value)} value={text} />
        <div className="est-out">
          <Metric label="Characters" value={stats.chars.toLocaleString("en-US")} />
          <Metric label="Words" value={stats.words.toLocaleString("en-US")} />
          <Metric label="Est. tokens" strong value={stats.tokens.toLocaleString("en-US")} />
          <Metric label="Ratio" value="~4 chars/token" />
        </div>
      </div>
      <p className="tv-disclaim">Heuristic only. Exact counts vary by tokenizer, model, and language.</p>
    </>
  );
}

export function ModelCompare() {
  const [selected, setSelected] = useState(defaultModelId);
  const selectedModel = modelCatalog.find((item) => item.id === selected) ?? modelCatalog[0];

  return (
    <>
      <div className="model-grid">
        {modelCatalog.map((item) => {
          return (
            <button
              className={`mcard ${selected === item.id ? "sel" : ""}`}
              key={item.id}
              onClick={() => setSelected(item.id)}
              type="button"
            >
              <div className="mcard-head">
                <div>
                  <h3>{item.displayName}</h3>
                  <p>{item.id}</p>
                </div>
                <span className="radio-check" />
              </div>
              <div className="mrow">
                <span>provider</span>
                <b>{providerLabels[item.provider]}</b>
              </div>
              <div className="mrow">
                <span>context</span>
                <b>{formatContext(item.contextWindow)}</b>
              </div>
              <div className="mrow">
                <span>input / 1M</span>
                <b>{formatUsdRate(item.pricing.inputPerMillionUsd)}</b>
              </div>
              <div className="mrow">
                <span>output / 1M</span>
                <b>{formatUsdRate(item.pricing.outputPerMillionUsd)}</b>
              </div>
              <div className="mrow">
                <span>stream</span>
                <CapabilityBadge value={supportBadge(item.supports.streaming)} />
              </div>
              <div className="mrow">
                <span>tools</span>
                <CapabilityBadge value={supportBadge(item.supports.toolCalling)} />
              </div>
              <div className="mrow">
                <span>vision</span>
                <CapabilityBadge value={supportBadge(item.supports.vision)} />
              </div>
            </button>
          );
        })}
      </div>
      {selectedModel ? (
        <p className="tv-disclaim">
          Selected: {selectedModel.id}. Checked {selectedModel.checkedAt}.{" "}
          <a href={selectedModel.sourceUrls[0]} rel="noreferrer" target="_blank">
            Official source
          </a>
        </p>
      ) : null}
    </>
  );
}

export function ProviderMatrix() {
  return (
    <>
      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Streaming</th>
                <th>Tool calls</th>
                <th>Vision</th>
                <th>JSON mode</th>
              </tr>
            </thead>
            <tbody>
              {providerMatrix.map((provider) => (
                <tr key={provider.id}>
                  <td>
                    <span className="pname">{provider.displayName}</span>
                    <div className="mono muted">{provider.apiStyle}</div>
                  </td>
                  <td>
                    <CapabilityBadge value={providerCapabilityBadge(provider.capabilities.streaming.level)} />
                  </td>
                  <td>
                    <CapabilityBadge value={providerCapabilityBadge(provider.capabilities.toolCalling.level)} />
                  </td>
                  <td>
                    <CapabilityBadge value={providerCapabilityBadge(provider.capabilities.visionInput.level)} />
                  </td>
                  <td>
                    <CapabilityBadge value={providerCapabilityBadge(provider.capabilities.structuredOutput.level)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="tv-disclaim">
        AI Hooks does not bundle provider adapters. Provider capabilities are source-backed
        planning data, not package runtime behavior.
      </p>
    </>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function NumberField({
  label,
  min,
  onChange,
  value,
}: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Field label={label}>
      <input
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </Field>
  );
}

function Metric({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={`co ${strong ? "total" : ""}`}>
      <div className="lab">{label}</div>
      <div className="val">{value}</div>
    </div>
  );
}

function CapabilityBadge({ value }: { value: CapabilityLevel }) {
  const labels: Record<CapabilityLevel, string> = {
    full: "full",
    none: "none",
    partial: "partial",
  };

  return (
    <span className={`bdg ${value === "full" ? "yes" : value === "partial" ? "part" : "no"}`}>
      <span className="ic" />
      {labels[value]}
    </span>
  );
}

function formatUsd(value: number) {
  return `$${value.toFixed(4)}`;
}

function formatUsdRate(value: number) {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
    minimumFractionDigits: value < 1 ? 2 : 0,
  })}`;
}

function formatContext(value: number | undefined) {
  if (!value) {
    return "not listed";
  }

  if (value >= 1_000_000) {
    return `${value / 1_000_000}M`;
  }

  return `${Math.round(value / 1000)}k`;
}
