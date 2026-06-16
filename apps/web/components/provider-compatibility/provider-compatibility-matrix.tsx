import {
  listProviderCompatibility,
  type ProviderCapability,
  type ProviderCapabilityKey,
  type ProviderCapabilityLevel,
} from "@ai-hooks/core/providers";

const capabilityColumns: Array<{ key: ProviderCapabilityKey; label: string }> = [
  { key: "streaming", label: "Streaming" },
  { key: "toolCalling", label: "Tools" },
  { key: "structuredOutput", label: "Structured output" },
  { key: "visionInput", label: "Vision" },
  { key: "fileInput", label: "Files" },
  { key: "openAiCompatible", label: "OpenAI shape" },
];

const statusLabels: Record<ProviderCapabilityLevel, string> = {
  supported: "yes",
  "model-dependent": "model",
  "route-specific": "route",
  limited: "limited",
  unsupported: "no",
};

const statusClasses: Record<ProviderCapabilityLevel, "yes" | "part" | "no"> = {
  supported: "yes",
  "model-dependent": "part",
  "route-specific": "part",
  limited: "part",
  unsupported: "no",
};

export function ProviderCompatibilityMatrix() {
  const providers = listProviderCompatibility();

  return (
    <div className="comparison-layout provider-layout">
      <div className="matrix-wrap comparison-table">
        <table className="matrix provider-matrix">
          <thead>
            <tr>
              <th>Provider</th>
              <th>API style</th>
              {capabilityColumns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Checked</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="prov">
                  {provider.displayName}
                  <small>{provider.bestFor}</small>
                </td>
                <td className="num">{provider.apiStyle}</td>
                {capabilityColumns.map((column) => (
                  <td key={`${provider.id}-${column.key}`}>
                    <CapabilityStatus capability={provider.capabilities[column.key]} />
                  </td>
                ))}
                <td className="num">{provider.checkedAt}</td>
                <td>
                  <a className="matrix-link" href={provider.sourceUrls[0]}>
                    Docs
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="matrix-legend">
          <span>yes = first-class support</span>
          <span>model = depends on selected model</span>
          <span>route = separate endpoint or API path</span>
          <span>limited = usable with caveats</span>
        </div>
      </div>

      <aside className="comparison-side">
        <span className="sec-label">// provider matrix</span>
        <h2>Use this before choosing an adapter.</h2>
        <p>
          Provider compatibility changes faster than hooks. Keep provider facts in data
          so the UI can stay headless, source-backed, and easy to revise.
        </p>
        <div className="summary-list">
          <span>Gate UI controls by provider capability</span>
          <span>Keep adapters outside the core React hooks</span>
          <span>Check docs before publishing provider claims</span>
          <span>Prefer user-owned provider keys in production</span>
        </div>
      </aside>
    </div>
  );
}

function CapabilityStatus({ capability }: { capability: ProviderCapability }) {
  return (
    <span
      className={`bdg ${statusClasses[capability.level]}`}
      title={capability.note}
      aria-label={capability.note}
    >
      <span className="ic" />
      {statusLabels[capability.level]}
    </span>
  );
}
