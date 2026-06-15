import { listModels } from "@ai-hooks/core/models";

export function ModelsSection() {
  const models = listModels();

  return (
    <section className="block" id="models">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// model layer</span>
            <h2>Model choice is a product layer, not a hard dependency.</h2>
            <p>
              The MVP ships with mock models for UI testing. Real providers should live in
              separate adapters and your own API routes.
            </p>
          </div>
          <div className="rhs">
            <a className="btn sm" href="#models">
              demo registry →
            </a>
          </div>
        </div>

        <div className="models-grid">
          <div className="selector">
            <div className="sel-head">
              Demo model registry <span className="pill">core/models</span>
            </div>
            {models.map((model, index) => (
              <div
                className={`modelopt ${index === 0 ? "selected" : ""}`}
                key={model.id}
              >
                <span className="radio" />
                <div className="mo-main">
                  <div className="mo-name">{model.id}</div>
                  <div className="mo-sub">
                    mock provider · {model.supports.toolCalling ? "tools" : "no tools"} ·{" "}
                    {model.supports.vision ? "vision" : "text"}
                  </div>
                </div>
                <div className="mo-ctx">
                  <b>{formatContextWindow(model.contextWindow)}</b>ctx
                </div>
              </div>
            ))}
            <div className="sel-foot">
              selected → <code>model="mock-fast"</code>
              <br />
              provider adapters will be added without changing hook imports
            </div>
          </div>

          <div className="matrix-wrap">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Streaming</th>
                  <th>Tools</th>
                  <th>Vision</th>
                  <th>JSON</th>
                  <th>Context</th>
                  <th>Pricing</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => {
                  const features: Array<[string, boolean]> = [
                    ["streaming", model.supports.streaming],
                    ["tools", model.supports.toolCalling],
                    ["vision", model.supports.vision],
                    ["json", model.supports.jsonMode],
                  ];
                  const pricing = model.pricing
                    ? `$${model.pricing.inputPerMillionUsd}/$${model.pricing.outputPerMillionUsd}`
                    : "custom";

                  return (
                    <tr key={model.id}>
                      <td className="prov">
                        {model.displayName} <small>{model.provider}</small>
                      </td>
                      {features.map(([name, supported]) => (
                        <td key={`${model.id}-${name}`}>
                          <span className={`bdg ${supported ? "yes" : "no"}`}>
                            <span className="ic" />
                            {supported ? "yes" : "no"}
                          </span>
                        </td>
                      ))}
                      <td className="num">{formatContextWindow(model.contextWindow)}</td>
                      <td className="num">{pricing} demo</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="matrix-legend">
              <span>● demo registry only</span>
              <span>● real provider matrix later</span>
              <span>● no requests run through AI Hooks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatContextWindow(tokens: number) {
  if (tokens >= 1_000) {
    return `${Math.round(tokens / 1_000)}k`;
  }

  return `${tokens}`;
}
