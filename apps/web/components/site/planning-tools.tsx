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

import css from "./planning-tools.module.css";

type ModelCatalogItem = (typeof modelCatalog)[number];
type ProviderMatrixItem = (typeof providerMatrix)[number];

export function CostCalc() {
  const [model, setModel] = useState(defaultModelId);
  const [requests, setRequests] = useState(1);
  const [inputTokens, setInputTokens] = useState(1200);
  const [outputTokens, setOutputTokens] = useState(400);
  const selectedModel = modelCatalog.find((item) => item.id === model) ?? modelCatalog[0];

  if (!selectedModel) {
    return <p className={css.disclaimer}>No source-backed model pricing is available.</p>;
  }

  const { pricing } = selectedModel;
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillionUsd * requests;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillionUsd * requests;

  return (
    <>
      <div className={css.calculator}>
        <div className={css.fields}>
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
          <NumberField
            label="Output tokens"
            min={0}
            onChange={setOutputTokens}
            value={outputTokens}
          />
        </div>
        <div className={css.results}>
          <Metric label="Input cost" value={formatUsd(inputCost)} />
          <Metric label="Output cost" value={formatUsd(outputCost)} />
          <Metric label="Total" strong value={formatUsd(inputCost + outputCost)} />
        </div>
      </div>
      <p className={css.disclaimer}>
        Source-backed pricing checked {selectedModel.checkedAt}. Formula: (input/1e6 × input_rate +
        output/1e6 × output_rate) × requests.{" "}
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
      <div>
        <textarea
          className={css.textarea}
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <div className={css.estimator_output}>
          <Metric label="Characters" value={stats.chars.toLocaleString("en-US")} />
          <Metric label="Words" value={stats.words.toLocaleString("en-US")} />
          <Metric label="Est. tokens" strong value={stats.tokens.toLocaleString("en-US")} />
          <Metric label="Ratio" value="~4 chars/token" />
        </div>
      </div>
      <p className={css.disclaimer}>
        Heuristic only. Exact counts vary by tokenizer, model, and language.
      </p>
    </>
  );
}

export function ModelCompare() {
  const [selected, setSelected] = useState(defaultModelId);
  const selectedModel = modelCatalog.find((item) => item.id === selected) ?? modelCatalog[0];

  return (
    <>
      <div className={css.model_grid}>
        {modelCatalog.map((item) => (
          <ModelCard
            item={item}
            key={item.id}
            onSelect={() => setSelected(item.id)}
            selected={selected === item.id}
          />
        ))}
      </div>
      {selectedModel ? (
        <p className={css.disclaimer}>
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
      <div className={css.table_wrap}>
        <div className={css.table_scroll}>
          <table className={css.table}>
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
                <ProviderRow key={provider.id} provider={provider} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={css.disclaimer}>
        AI Hooks does not bundle provider adapters. Provider capabilities are source-backed planning
        data, not package runtime behavior.
      </p>
    </>
  );
}

function ModelCard({
  item,
  onSelect,
  selected,
}: {
  item: ModelCatalogItem;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <button
      className={`${css.model_card} ${selected ? css.selected : ""}`}
      onClick={onSelect}
      type="button"
    >
      <div className={css.model_card_head}>
        <div>
          <h3>{item.displayName}</h3>
          <p>{item.id}</p>
        </div>
        <span className={css.radio} />
      </div>
      <ModelRow label="provider" value={providerLabels[item.provider]} />
      <ModelRow label="context" value={formatContext(item.contextWindow)} />
      <ModelRow label="input / 1M" value={formatUsdRate(item.pricing.inputPerMillionUsd)} />
      <ModelRow label="output / 1M" value={formatUsdRate(item.pricing.outputPerMillionUsd)} />
      <ModelRow label="stream">
        <CapabilityBadge value={supportBadge(item.supports.streaming)} />
      </ModelRow>
      <ModelRow label="tools">
        <CapabilityBadge value={supportBadge(item.supports.toolCalling)} />
      </ModelRow>
      <ModelRow label="vision">
        <CapabilityBadge value={supportBadge(item.supports.vision)} />
      </ModelRow>
    </button>
  );
}

function ModelRow({
  children,
  label,
  value,
}: {
  children?: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className={css.model_row}>
      <span>{label}</span>
      {children ?? <b>{value}</b>}
    </div>
  );
}

function ProviderRow({ provider }: { provider: ProviderMatrixItem }) {
  return (
    <tr>
      <td>
        <span className={css.provider_name}>{provider.displayName}</span>
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
        <CapabilityBadge
          value={providerCapabilityBadge(provider.capabilities.structuredOutput.level)}
        />
      </td>
    </tr>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className={css.field}>
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
    <div className={`${css.metric} ${strong ? css.metric_total : ""}`}>
      <div className={css.metric_label}>{label}</div>
      <div className={css.metric_value}>{value}</div>
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
    <span className={`${css.badge} ${getCapabilityBadgeClass(value)}`}>
      <span className={css.badge_dot} />
      {labels[value]}
    </span>
  );
}

function getCapabilityBadgeClass(value: CapabilityLevel) {
  if (value === "full") {
    return css.badge_yes;
  }

  if (value === "partial") {
    return css.badge_partial;
  }

  return css.badge_no;
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
