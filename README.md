# AI Hooks

Headless React primitives and UI patterns for building AI product interfaces.

AI Hooks is not a hosted LLM proxy. The public demo uses mock streams. Production
requests should go through your own server route and your own provider keys.

## What Is Inside

- `@ai-hooks/core` - token estimation, mock streaming, demo model/provider registries, and cost utilities.
- `@ai-hooks/react` - React hooks for chat streams, abort state, usage, storage, file upload, and tool calls.
- `apps/web` - the public site, examples gallery, cost calculator, model comparison, and mock streaming playground.
- `examples/next-basic-chat` - a minimal example scaffold.

## Current Stage

The project is in the early MVP stage. The first priority is to ship a useful
developer resource for practical AI UI work:

- React hooks for AI interfaces.
- LLM cost calculator.
- Token estimator.
- Model comparison pages.
- Provider compatibility matrix.
- Streaming playground.
- Copy-paste AI chat UI examples.

The package should stay small and headless. Public demos should use mock data
unless a user intentionally connects their own provider route.

## Current Hooks

- `useChatStream`
- `useAbortController`
- `useConversationStorage`
- `useTokenUsage`
- `useModelCost`
- `useFileUpload`
- `useToolCalls`

Planned hooks include `useVoiceInput`, citations helpers, and provider adapter
utilities.

## Current Utilities

- `/docs` - public docs index for current MVP hooks with focused hook reference
  pages.
- `/tools/cost` - local LLM cost calculator for request and token spend planning.
- `/tools/tokens` - local prompt/token planning utility with text stats.
- `/tools/models` - local model capability and pricing registry view using demo
  data only.
- `/tools/providers` - provider capability matrix for adapter and UI planning.

## Development

This is a pnpm monorepo.

```bash
pnpm install
pnpm dev
```

The local web app runs at:

```bash
http://127.0.0.1:3100
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPPORT_URL` to enable
the optional support button.

Run checks before committing:

```bash
pnpm typecheck
pnpm build
```

## Project Structure

```text
apps/
  web/                 Next.js site and playground
packages/
  core/                Framework-agnostic AI utilities
  react/               React hooks package
examples/
  next-basic-chat/     Example app notes
```

## Design Principles

- Tree-shakable root exports with subpath exports for strict bundle control.
- Provider-agnostic core APIs.
- No hidden telemetry.
- No project-owned model spend in public demos.
- Real provider adapters should stay separate from the core package.

## Roadmap

1. Improve docs for every hook.
2. Expand the LLM cost calculator and token estimator with real provider data.
3. Expand model comparison and provider compatibility pages.
4. Build a richer streaming playground.
5. Publish copy-paste AI chat UI examples.

## Status

Early MVP. APIs and examples may change while the project shape is being
validated.

## Development Workflow

Each completed work block should be committed and pushed:

```bash
pnpm typecheck
pnpm build
git add .
git commit -m "<type>: <summary>"
git push
```
