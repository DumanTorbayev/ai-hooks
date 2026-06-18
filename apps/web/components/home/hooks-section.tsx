import { hooks } from "@/content/home";
import { CopyButton } from "@/components/copy-button";

const chatSnippet = `import { useChatStream } from "@ai-hooks/react";

export function Chat() {
  const chat = useChatStream({
    endpoint: "/api/chat",
    body: { model: "your-model" },
  });

  return <Composer onSend={chat.send} busy={chat.isStreaming} />;
}`;

export function HooksSection() {
  return (
    <section className="block" id="hooks">
      <div className="wrap">
        <div className="block-head">
          <div className="lhs">
            <span className="sec-label">// hooks</span>
            <h2>Small primitives for the hard parts of AI UI.</h2>
            <p>
              Import only what you need. The package stays headless, provider-agnostic,
              and tree-shakable.
            </p>
          </div>
          <div className="rhs">
            <a className="btn sm" href="/docs">
              API reference →
            </a>
          </div>
        </div>

        <div className="hooks-grid">
          {hooks.map((hook) => (
            <article className="hookcard" key={hook.name}>
              <div className="hc-top">
                <span className="hname">
                  <span className="h">use</span>
                  {hook.name.replace("use", "")}
                </span>
                <span className={`stable ${hook.status === "beta" ? "beta" : ""}`}>
                  {hook.status}
                </span>
              </div>
              <p>{hook.description}</p>
              <div className="ret">
                {hook.returns.map((item) => (
                  <span className="t" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="snippet-wrap">
          <div className="codepanel">
            <div className="cp-head">
              <span className="cp-tab active">useChatStream</span>
              <span className="cp-tab">useToolCalls</span>
              <span className="cp-file">app/chat.tsx</span>
              <CopyButton className="cp-copy" value={chatSnippet} />
            </div>
            <pre className="code">
              <span className="ln">1</span>
              <span className="k">import</span> {"{ useChatStream }"}{" "}
              <span className="k">from</span>{" "}
              <span className="s">"@ai-hooks/react"</span>
              {"\n"}
              <span className="ln">2</span>
              {"\n"}
              <span className="ln">3</span>
              <span className="k">export function</span> <span className="f">Chat</span>() {"{"}
              {"\n"}
              <span className="ln">4</span>  <span className="k">const</span> chat ={" "}
              <span className="f">useChatStream</span>({"{"}
              {"\n"}
              <span className="ln">5</span>    endpoint: <span className="s">"/api/chat"</span>,
              <span className="c"> // your route, your key</span>
              {"\n"}
              <span className="ln">6</span>    body: {"{"} model:{" "}
              <span className="s">"your-model"</span> {"}"},
              {"\n"}
              <span className="ln">7</span>  {"}"}){"\n"}
              <span className="ln">8</span>
              {"\n"}
              <span className="ln">9</span>  <span className="k">return</span> &lt;
              <span className="f">Composer</span> onSend=&#123;chat.send&#125;
              busy=&#123;chat.isStreaming&#125; /&gt;
              {"\n"}
              <span className="ln">10</span>
              {"}"}
            </pre>
          </div>

          <div className="snip-note">
            <div className="row">
              <span className="n">1</span>
              <div>
                <h4>Headless by default</h4>
                <p>Hooks return state and actions. You own every pixel.</p>
              </div>
            </div>
            <div className="row">
              <span className="n">2</span>
              <div>
                <h4>Your route, your keys</h4>
                <p>Endpoint points at your server route. Keys never touch AI Hooks.</p>
              </div>
            </div>
            <div className="row">
              <span className="n">3</span>
              <div>
                <h4>Small imports</h4>
                <p>Root exports are tree-shakable; subpath exports stay available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
