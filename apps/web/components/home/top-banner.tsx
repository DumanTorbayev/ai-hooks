export function TopBanner() {
  return (
    <div className="topbanner">
      <span className="star">local mvp</span>
      <span className="hide-mobile">·</span>
      <span className="hide-mobile">
        <b>AI Hooks</b> is a library and demo site, not a hosted LLM proxy
      </span>
      <a href="/docs/use-chat-stream">read useChatStream docs</a>
    </div>
  );
}
