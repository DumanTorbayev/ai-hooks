"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  modelCapabilities,
  modelPricing,
  providerMatrix,
  type CapabilityLevel,
} from "@/content/tools";

const modelIds = Object.keys(modelPricing) as Array<keyof typeof modelPricing>;

export function CostCalc() {
  const [model, setModel] = useState<keyof typeof modelPricing>("gpt-4o-mini");
  const [requests, setRequests] = useState(1);
  const [inputTokens, setInputTokens] = useState(1200);
  const [outputTokens, setOutputTokens] = useState(400);
  const pricing = modelPricing[model];
  const inputCost = (inputTokens / 1_000_000) * pricing.input * requests;
  const outputCost = (outputTokens / 1_000_000) * pricing.output * requests;

  return (
    <>
      <div className="calc">
        <div className="cfields">
          <Field label="Model">
            <select
              onChange={(event) => setModel(event.target.value as keyof typeof modelPricing)}
              value={model}
            >
              {modelIds.map((id) => (
                <option key={id} value={id}>
                  {id} · {modelPricing[id].provider}
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
        cost = (input/1e6 × input_rate + output/1e6 × output_rate) × requests ·
        pricing is indicative and overridable in <code>useModelCost</code>.
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
  const [selected, setSelected] = useState<keyof typeof modelPricing>("gpt-4o-mini");

  return (
    <>
      <div className="model-grid">
        {modelIds.map((id) => {
          const pricing = modelPricing[id];
          const caps = modelCapabilities[id];

          return (
            <button
              className={`mcard ${selected === id ? "sel" : ""}`}
              key={id}
              onClick={() => setSelected(id)}
              type="button"
            >
              <div className="mcard-head">
                <div>
                  <h3>{id}</h3>
                  <p>{pricing.provider}</p>
                </div>
                <span className="radio-check" />
              </div>
              <div className="mrow">
                <span>context</span>
                <b>{pricing.context}</b>
              </div>
              <div className="mrow">
                <span>input / 1M</span>
                <b>${pricing.input}</b>
              </div>
              <div className="mrow">
                <span>output / 1M</span>
                <b>${pricing.output}</b>
              </div>
              <div className="mrow">
                <span>stream</span>
                <CapabilityBadge value={caps.stream} />
              </div>
              <div className="mrow">
                <span>tools</span>
                <CapabilityBadge value={caps.tools} />
              </div>
              <div className="mrow">
                <span>vision</span>
                <CapabilityBadge value={caps.vision} />
              </div>
            </button>
          );
        })}
      </div>
      <p className="tv-disclaim">Selected: {selected}. Verify current pricing with the provider.</p>
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
                <tr key={provider.name}>
                  <td>
                    <span className="pname">{provider.name}</span>
                    <div className="mono muted">{provider.model}</div>
                  </td>
                  <td>
                    <CapabilityBadge value={provider.streaming} />
                  </td>
                  <td>
                    <CapabilityBadge value={provider.tools} />
                  </td>
                  <td>
                    <CapabilityBadge value={provider.vision} />
                  </td>
                  <td>
                    <CapabilityBadge value={provider.json} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="tv-disclaim">
        AI Hooks does not bundle provider adapters — you wire your own routes. Capability
        data is indicative and should be verified before publication.
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
