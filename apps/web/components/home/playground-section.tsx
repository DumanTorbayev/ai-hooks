export function PlaygroundSection() {
  return (
    <section className="block alt-block" id="playground">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// playground</span>
            <h2>Mock playground first, real providers later.</h2>
            <p>
              The public site can demonstrate streaming, latency, stop states, and usage
              without spending project-owned model credits.
            </p>
          </div>
          <div className="rhs">
            <a className="btn sm" href="#">
              Full playground later →
            </a>
          </div>
        </div>

        <div className="pg-grid">
          <div className="pg-panel">
            <div className="pg-bar">
              <div className="seg">
                <button className="on" type="button">
                  Stream
                </button>
                <button type="button">Tools</button>
                <button type="button">Files</button>
              </div>
              <span className="nospend">$0.00 spend</span>
            </div>
            <div className="pg-stream">
              <div className="role">prompt</div>
              <div className="uline">
                Draft a short product update for an AI chat interface.
              </div>
              <div className="role">completion · mock</div>
              <div>
                AI Hooks keeps streaming, abort state, and usage visible in React apps.
                Start with mock streams, then swap in your own provider route.
                <span className="acur" />
              </div>
              <div className="tok-meta">
                <b>done</b> · 38 tokens · 0.9s · mock · $0.00
              </div>
            </div>
            <div className="pg-ctrl">
              <button className="pg-run" type="button">
                Run mock
              </button>
              <button className="pg-reset" type="button">
                Reset
              </button>
            </div>
          </div>

          <div className="pg-side">
            <div className="side-card">
              <h4>Runtime controls</h4>
              <div className="opt">
                <span>Model</span>
                <span className="v">mock-fast</span>
              </div>
              <div className="opt">
                <span>Tokens / sec</span>
                <span className="v">~42</span>
              </div>
              <div className="opt">
                <span>Tool calls</span>
                <span className="toggle" />
              </div>
              <div className="opt">
                <span>Simulate latency</span>
                <span className="toggle" />
              </div>
            </div>
            <div className="side-card ratecard">
              <h4>Why mock?</h4>
              <p>
                Real provider demos create cost and abuse risk. Mock streams prove UX
                behavior without API keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
