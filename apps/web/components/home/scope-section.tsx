export function ScopeSection() {
  return (
    <section className="block" id="docs">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// scope</span>
            <h2>What belongs in this project right now.</h2>
            <p>
              We are building a developer resource: tiny hooks, examples, calculators,
              and playgrounds. No courses, no hosted chat API, no hidden telemetry.
            </p>
          </div>
        </div>

        <div className="sponsor">
          <div className="sp-main">
            <span className="sp-flag">MVP boundary</span>
            <h3>Library first, demo site second, monetization later.</h3>
            <p>
              Ads or sponsors can appear on docs pages later, but the npm packages stay
              small, explicit, and dependency-light.
            </p>
            <div className="sp-actions">
              <a className="btn accent sm" href="#hooks">
                Back to hooks
              </a>
              <span className="sp-note">Public demos use mock data and local state</span>
            </div>
          </div>
          <div className="sp-side">
            <div className="lg">
              <span className="mk">0</span> Hosted requests
            </div>
            <div className="feat">✓ Mock streams only</div>
            <div className="feat">✓ Your route, your provider keys</div>
            <div className="feat">✓ Bundle budget before adapters</div>
          </div>
        </div>
      </div>
    </section>
  );
}
