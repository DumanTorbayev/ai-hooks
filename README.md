# AI Hooks

Headless React hooks for building AI product interfaces.

AI Hooks helps you build streaming chat, token usage, file input, cost, and tool-call
UI without turning the library into a hosted API. You keep your server routes,
provider keys, database, and markup. The package ships UI logic and small state
primitives.

## The 10-second version

- Install `@ai-hooks/react`.
- Start with `useChatStream`.
- Point it at your own `/api/chat` route.
- Keep provider keys on your server.
- Add storage, cancellation, usage, files, or tool-call state only when the UI needs them.

## Install

```bash
npm i @ai-hooks/react
```

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
cases, when to use it, when not to use it, package boundaries, and which hooks pair
well together.

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

AI Hooks accepts transparent project support through Open Collective:
[Support project](https://opencollective.com/ai-hooks).

Support funds documentation, examples, tests, release work, infrastructure, and long-term
maintenance. The project stays MIT-licensed, with no paid docs, no hosted model API, and no
project-owned model spend in public demos.

## Release scope

Ready for the current alpha release:

- Seven React hooks with root exports and subpath exports.
- Headless API shape: no UI kit dependency and no runtime provider SDK dependency.
- Docs site with hook references and copyable code blocks.
- Mock streaming demo that does not spend project-owned model credits.
- Planning tools for costs, tokens, models, and providers.
- Typecheck, unit tests, production build, and Playwright smoke tests.
- Public npm metadata for `@ai-hooks/core` and `@ai-hooks/react`.

Still intentionally out of scope:

- Provider adapters are not part of the core package.
- Hosted API routes, account state, and provider SDKs stay in user applications.
- Model and provider registries are source-backed snapshots, not live pricing feeds.

## Repository structure

```text
apps/
  web/                 Next.js docs site, examples, and planning tools
packages/
  core/                Framework-agnostic utilities and registries
  react/               React hooks package
examples/
  next-basic-chat/     Runnable Next.js example with a mock streaming route
```

## Development

Run checks before committing:

```bash
pnpm format
pnpm check:exports
pnpm check:packages
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm typecheck` and `pnpm lint` are expected to pass from a fresh clone without a previous Next.js
build. `pnpm build` runs the full Next.js validation step, including generated route types.
`pnpm check:packages` builds `@ai-hooks/core` and `@ai-hooks/react`, then runs npm pack dry-runs to
verify package metadata, tarball size, and published file contents.

## Contributing

The project is early. Useful contributions should keep the package small,
headless, and provider-agnostic:

- Improve hook docs with real API behavior and edge cases.
- Add focused tests around hook behavior.
- Keep examples tied to shipped hooks only.
- Avoid adding provider SDKs to the core React package.
