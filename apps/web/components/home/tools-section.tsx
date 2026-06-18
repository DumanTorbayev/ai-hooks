const tools = [
  {
    title: "Cost calculator",
    href: "/cost-calculator",
    label: "demo pricing",
    description:
      "Estimate request and monthly spend from model pricing fields. Use it as planning UI, not a billing source.",
  },
  {
    title: "Token estimator",
    href: "/token-estimator",
    label: "rough estimate",
    description:
      "Approximate prompt size locally before wiring a real provider tokenizer or usage response.",
  },
  {
    title: "Model registry",
    href: "/model-comparison",
    label: "mock models",
    description:
      "Show how UI can read model capabilities without making hooks depend on one vendor.",
  },
  {
    title: "Provider matrix",
    href: "/provider-compatibility",
    label: "checked snapshot",
    description:
      "Track provider capabilities as dated reference data that can be rechecked against official docs.",
  },
] as const;

export function ToolsSection() {
  return (
    <section className="block" id="tools">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// tools</span>
            <h2>Planning tools, separate from the hook package.</h2>
            <p>
              These pages help developers reason about AI UI costs, tokens, models, and
              providers. They do not run hosted LLM requests.
            </p>
          </div>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <a className="tool-card" href={tool.href} key={tool.title}>
              <div>
                <span className="tool-label">{tool.label}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
              <span className="tool-arrow">Open →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
