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

The project is in the early MVP stage. The first priority is to validate a
developer resource that can attract organic traffic through practical AI UI
utilities:

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

- `/cost-calculator` - local LLM cost calculator with prompt token estimation,
  output token planning, per-request cost, daily cost, and monthly cost.
- `/token-estimator` - local prompt/token planning utility with text stats,
  expected output tokens, and context-window usage.
- `/model-comparison` - local model capability and pricing registry view using
  demo data only.
- `/provider-compatibility` - source-backed provider capability matrix for
  adapter and UI planning.
- `/docs` - public docs index for current MVP hooks with focused hook reference
  pages.

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
docs/
  architecture.md      Technical direction and package boundaries
  product-spec.md      Product definition and target audience
  roadmap.md           Development phases
```

## Project Docs

- [Product spec](docs/product-spec.md)
- [Architecture](docs/architecture.md)
- [API sketch](docs/api-sketch.md)
- [Roadmap](docs/roadmap.md)

Internal business strategy and working task lists are kept outside the public
repository. Public work should be tracked through GitHub Issues and pull
requests.

## Design Principles

- Small imports through subpath exports.
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
