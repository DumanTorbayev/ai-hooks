# AI Hooks

Headless React hooks for building AI product interfaces.

AI Hooks helps you build streaming chat, token usage, file input, cost, and tool-call
UI without turning the library into a hosted API. You keep your server routes,
provider keys, database, and markup. The package ships UI logic and small state
primitives.

## The 10-second version

- Install the React package.
- Start with `useChatStream`.
- Point it at your own `/api/chat` route.
- Keep provider keys on your server.
- Add storage, cancellation, usage, files, or tool-call state only when the UI needs them.

## Install

Release install target:

```bash
npm i @ai-hooks/react
```

The project is still in MVP. The package is kept private until the API, docs, and
release process are ready.

For local development:

```bash
pnpm install
pnpm dev
```

The local docs site runs at:

```bash
http://127.0.0.1:3100
```

## First hook: useChatStream

`useChatStream` gives you composer state, stream state, and callbacks for appending
assistant deltas. It does not store messages for you and it does not call model
providers from the browser.

```tsx
import { useAbortController, useChatStream, useConversationStorage } from "@ai-hooks/react";

export function ChatPanel() {
  const abort = useAbortController();
  const conversation = useConversationStorage({ key: "support-chat" });

  const chat = useChatStream({
    endpoint: "/api/chat",
    signal: abort.signal,
    messages: conversation.messages,
    onUserMessage: conversation.addUserMessage,
    onAssistantStart: () => conversation.addAssistantMessage(""),
    onAssistantDelta: conversation.appendToLastAssistantMessage,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void chat.send();
      }}
    >
      <textarea value={chat.input} onChange={(event) => chat.setInput(event.target.value)} />
      {chat.isStreaming ? (
        <button type="button" onClick={abort.abort}>
          Stop
        </button>
      ) : (
        <button type="submit">Send</button>
      )}
    </form>
  );
}
```

Your server route owns the provider call:

```ts
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages, prompt } = await request.json();

  // Call OpenAI, Anthropic, Google, or another provider here.
  // Keep provider keys on the server and stream plain text deltas back to the UI.

  return new Response("Your streamed response");
}
```

## No hosted API

AI Hooks is intentionally not a model proxy.

- No project-owned model spend in public demos.
- No browser-side provider keys.
- No hidden telemetry.
- No hosted chat endpoint.
- No database or account layer.

Public demos use mock streams. Production requests should go through your own
server route and your own provider account.

## Current hooks

| Hook                     | Status | Use it for                                                   |
| ------------------------ | ------ | ------------------------------------------------------------ |
| `useChatStream`          | Ready  | Composer state, stream state, and assistant delta callbacks. |
| `useAbortController`     | Ready  | Real stop-generation behavior with `AbortSignal`.            |
| `useConversationStorage` | Ready  | Local conversation persistence for demos and prototypes.     |
| `useTokenUsage`          | Ready  | Accumulating provider usage metadata as UI state.            |
| `useModelCost`           | Ready  | Estimating spend from usage counters and model pricing.      |
| `useFileUpload`          | Beta   | Client-side file validation before an AI workflow.           |
| `useToolCalls`           | Beta   | Tool-call lifecycle state for agent UI.                      |

Every hook is documented at `/docs`. Each reference page covers API, usage, edge
cases, when to use it, when not to use it, and which hooks pair well together.

## Planning tools

The site also includes planning utilities. These are docs-side tools, not package
APIs.

| Tool             | Route              | Notes                                                |
| ---------------- | ------------------ | ---------------------------------------------------- |
| Cost calculator  | `/tools/cost`      | Estimate spend from token volume and pricing rows.   |
| Token estimator  | `/tools/tokens`    | Rough text and token planning before provider calls. |
| Model comparison | `/tools/models`    | Source-backed model capability and pricing registry. |
| Provider matrix  | `/tools/providers` | Source-backed provider capability matrix.            |

Model and provider data is source-backed and manually reviewed. It is not a live
auto-updating feed. Recheck it before release and whenever provider pricing changes.

## Support

AI Hooks is applying to Open Source Collective for transparent project funding.
Support will fund documentation, examples, tests, release work, infrastructure,
and long-term maintenance.

Support link:

```text
https://opencollective.com/ai-hooks
```

## MVP readiness

Ready for the current MVP:

- Seven React hooks with root exports and subpath exports.
- Headless API shape: no UI kit dependency and no runtime provider SDK dependency.
- Docs site with hook references and copyable code blocks.
- Mock streaming demo that does not spend project-owned model credits.
- Planning tools for costs, tokens, models, and providers.
- Typecheck, unit tests, production build, and Playwright smoke tests.

Not release-ready yet:

- The npm package is still private.
- Runnable starter apps are still minimal.
- Provider adapters are intentionally not part of the core package yet.
- Model and provider registries need a final pre-release source review.

## Repository structure

```text
apps/
  web/                 Next.js docs site, examples, and planning tools
packages/
  core/                Framework-agnostic utilities and registries
  react/               React hooks package
examples/
  next-basic-chat/     Starter notes for the first chat example
```

## Development

Run checks before committing:

```bash
pnpm format
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Optional support button:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SUPPORT_URL` in `.env.local` to enable the support link on the
docs site.

## Contributing

The project is early. Useful contributions should keep the package small,
headless, and provider-agnostic:

- Improve hook docs with real API behavior and edge cases.
- Add focused tests around hook behavior.
- Keep examples tied to shipped hooks only.
- Avoid adding provider SDKs to the core React package.
