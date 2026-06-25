import { ChatPanel } from "./chat-panel";

export default function Page() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="eyebrow">AI Hooks example</p>
        <h1>Next basic chat</h1>
        <p>
          A minimal App Router chat that uses <code>useChatStream</code>,{" "}
          <code>useAbortController</code>, and <code>useConversationStorage</code>. The API route is
          mocked, so no provider keys are required.
        </p>
      </section>
      <ChatPanel />
    </main>
  );
}
