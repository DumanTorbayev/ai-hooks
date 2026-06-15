import { listModels, type ModelInfo } from "@ai-hooks/core/models";

const capabilityColumns: Array<[string, keyof ModelInfo["supports"]]> = [
  ["Streaming", "streaming"],
  ["Tools", "toolCalling"],
  ["Vision", "vision"],
  ["Audio input", "audioInput"],
  ["JSON mode", "jsonMode"],
];

export function ModelComparisonTable() {
  const models = listModels();

  return (
    <div className="comparison-layout">
      <div className="matrix-wrap comparison-table">
        <table className="matrix">
          <thead>
            <tr>
              <th>Model</th>
              {capabilityColumns.map(([label]) => (
                <th key={label}>{label}</th>
              ))}
              <th>Context</th>
              <th>Max output</th>
              <th>Input / 1M</th>
              <th>Output / 1M</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td className="prov">
                  {model.displayName}
                  <small>{model.id}</small>
                </td>
                {capabilityColumns.map(([, key]) => (
                  <td key={`${model.id}-${key}`}>
                    <CapabilityBadge supported={model.supports[key]} />
                  </td>
                ))}
                <td className="num">{formatTokens(model.contextWindow)}</td>
                <td className="num">
                  {model.maxOutputTokens ? formatTokens(model.maxOutputTokens) : "custom"}
                </td>
                <td className="num">{formatPricing(model, "input")}</td>
                <td className="num">{formatPricing(model, "output")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="matrix-legend">
          <span>● demo registry only</span>
          <span>● real provider pricing needs dated sources before publish</span>
          <span>● AI Hooks does not proxy model requests</span>
        </div>
      </div>

      <aside className="comparison-side">
        <span className="sec-label">// model registry</span>
        <h2>Keep model data separate from hooks.</h2>
        <p>
          Hooks should not ship provider SDKs or force one model vendor. Capability and
          pricing data can live in a registry, then UI components can enable controls
          only when a selected model supports them.
        </p>
        <div className="summary-list">
          <span>Streaming controls depend on model support</span>
          <span>Vision/file inputs should be capability-gated</span>
          <span>Cost UI reads pricing from registry data</span>
          <span>Provider adapters stay outside core hooks</span>
        </div>
      </aside>
    </div>
  );
}

function CapabilityBadge({ supported }: { supported: boolean }) {
  return (
    <span className={`bdg ${supported ? "yes" : "no"}`}>
      <span className="ic" />
      {supported ? "yes" : "no"}
    </span>
  );
}

function formatPricing(model: ModelInfo, side: "input" | "output") {
  const value =
    side === "input"
      ? model.pricing?.inputPerMillionUsd
      : model.pricing?.outputPerMillionUsd;

  if (value === undefined) {
    return "custom";
  }

  return `$${value}`;
}

function formatTokens(tokens: number) {
  if (tokens >= 1_000) {
    return `${Math.round(tokens / 1_000)}k`;
  }

  return `${tokens}`;
}
