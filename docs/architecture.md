# Architecture

## Рекомендуемый стек

Monorepo:

```txt
apps/
  web/
packages/
  react/
  core/
  providers/
  ui/
examples/
  next-basic-chat/
  next-tool-calling/
  vite-basic-chat/
content/
  hooks/
  tools/
  examples/
```

## Apps

### `apps/web`

Документационный сайт, инструменты и live demos.

Рекомендуемый стек:

- Next.js App Router;
- TypeScript;
- MDX;
- Tailwind CSS;
- shadcn/ui или собственные компактные компоненты;
- static-first страницы там, где возможно;
- server routes только для optional demos.

Почему Next.js:

- целевая аудитория часто строит AI apps на Next.js;
- проще показывать реальные API route examples;
- удобно делать интерактивные tools.

Альтернатива: Astro + React islands. Она быстрее для docs-first сайта, но Next.js будет проще для AI examples.

## Bundle Size Contract

Финальный npm-бандл должен быть маленьким и tree-shakable без ущерба качеству кода.

Правила:

- `@ai-hooks/core` не имеет runtime dependencies.
- `@ai-hooks/react` имеет только `@ai-hooks/core` как dependency и `react` как peer dependency.
- Provider SDKs не входят в `@ai-hooks/react`; для них позже нужны отдельные adapters/packages.
- UI blocks/templates не входят в базовый hooks package.
- Пакеты публикуются как ESM with subpath exports.
- В package manifests стоит `sideEffects: false`.
- Внутри пакетов используем точечные imports: `@ai-hooks/core/cost`, `@ai-hooks/core/types`, `@ai-hooks/core/streaming`, а не только общий barrel.
- Большой model/pricing registry не должен попадать в каждый consumer bundle. Для MVP можно держать demo registry, но реальные provider/model data позже должны быть split by provider.
- Любая новая dependency в library package требует отдельного обоснования.

Целевой принцип:

> A user importing `useAbortController` should not pay for chat streaming, file upload, model tables, provider adapters, or UI components.

## Packages

### `packages/core`

Framework-agnostic utilities:

- model registry;
- pricing registry;
- token estimation;
- cost estimation;
- streaming parsers;
- message normalization;
- provider capability types.

Пример exports:

```ts
export { estimateTokens } from "./tokens";
export { estimateModelCost } from "./cost";
export { getModelInfo, listModels } from "./models";
```

### `packages/react`

React hooks:

- `useChatStream`
- `useAbortController`
- `useConversationStorage`
- `useTokenUsage`
- `useModelCost`
- `useFileUpload`
- `useToolCalls`
- `useVoiceInput`

Принцип: hooks не должны требовать конкретного провайдера. Они работают с endpoint или adapter.

### `packages/providers`

Provider adapters:

- OpenAI;
- Anthropic;
- Gemini;
- OpenRouter;
- mock provider.

В MVP можно начать только с mock + OpenAI-style stream format.

### `packages/ui`

Не полноценная component library, а demo primitives:

- chat message;
- message input;
- model selector;
- usage meter;
- file dropzone;
- streaming indicator.

Важно: UI package можно отложить. Сначала ценнее hooks + docs.

## Testing

Минимальный набор:

- Vitest для `core`;
- React Testing Library для hooks;
- Playwright для ключевых demos;
- snapshot tests для model/pricing registry.

Критичные тесты:

- abort stream;
- duplicate send prevention;
- usage accumulation;
- cost estimate formatting;
- file validation;
- tool call state transitions;
- localStorage fallback.

## Деплой

Сайт:

- Vercel или Cloudflare Pages.

Пакеты:

- npm organization, например `@ai-hooks/react`;
- changesets для версионирования;
- GitHub Actions для test/build/publish.

## Безопасность

Правила:

- не принимать и не хранить пользовательские API keys на сервере;
- BYOK-режим хранит ключ только в memory/sessionStorage и явно предупреждает пользователя;
- публичные demos по умолчанию mock;
- реальные demos имеют rate limit, captcha и budget cap;
- в docs явно показывать, что secret keys должны жить только на server side.
