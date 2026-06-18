import { patterns } from "@/content/home";

import { PatternPreview } from "./pattern-preview";

export function PatternsSection() {
  return (
    <section className="block alt-block" id="patterns">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// patterns</span>
            <h2>Copy the common AI interface states.</h2>
            <p>
              Small examples for the hooks that already exist in the package.
            </p>
          </div>
          <div className="rhs">
            <a className="btn sm" href="/docs">
              Hook docs →
            </a>
          </div>
        </div>

        <div className="pat-grid">
          {patterns.map((pattern) => (
            <a
              aria-label={`${pattern.title} documentation`}
              className="patcard"
              href={pattern.href}
              key={pattern.title}
            >
              <PatternPreview type={pattern.preview} />
              <div className="pat-meta">
                <div className="pt">
                  <h4>{pattern.title}</h4>
                  <span className="arrow">→</span>
                </div>
                <p>{pattern.description}</p>
                <span className="pat-tag">{pattern.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
