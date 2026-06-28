# @ai-hooks/core

Framework-agnostic utilities for AI Hooks.

This package contains shared types, mock streaming helpers, token estimation, model-cost utilities,
and source-backed model/provider registries used by the docs site and React hooks package.

Most React users should install `@ai-hooks/react`; this package is the shared utility layer behind
the hooks and planning tools.

## Install

```bash
npm i @ai-hooks/core
```

Use this package directly when you need framework-agnostic token, cost, model, provider, or
streaming utilities. React applications should usually start with `@ai-hooks/react`.

## Imports

```ts
import { estimateTokens } from "@ai-hooks/core";
import { estimateModelCost } from "@ai-hooks/core/cost";
import { createMockTextStream } from "@ai-hooks/core/streaming";
```

Root imports and subpath imports are both supported.

## Boundary

`@ai-hooks/core` does not call model providers, proxy requests, store prompts, or update pricing
from a live feed. Model and provider data is source-backed and manually reviewed before release.
