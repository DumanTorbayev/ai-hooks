# Next Basic Chat

A minimal Next.js App Router chat example for AI Hooks.

It uses:

- `useChatStream` for composer and stream state;
- `useAbortController` for stop-generation behavior;
- `useConversationStorage` for local conversation persistence;
- `app/api/chat/route.ts` as a mock streaming route.

No provider SDK or API key is required.

## Run

From the repository root:

```bash
pnpm install
pnpm --filter @ai-hooks/example-next-basic-chat dev
```

Open:

```text
http://127.0.0.1:3200
```

The example script builds `@ai-hooks/core` and `@ai-hooks/react` before starting Next, so it works
from a fresh clone.

## Swap in a real provider

Replace the body of `app/api/chat/route.ts` with your provider call. Keep provider keys on the
server and stream plain text deltas back to the client.

The client component should not receive provider keys and should not call model APIs directly.

## Checks

```bash
pnpm --filter @ai-hooks/example-next-basic-chat typecheck
pnpm --filter @ai-hooks/example-next-basic-chat build
```
