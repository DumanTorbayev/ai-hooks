# Governance

## Quality Bar

AI Hooks is an open source library and developer resource. Core project roles
must be held at Senior level or higher. The goal is not to move faster by
stacking code, but to ship a small, understandable, testable product.

This rule exists because stale code, duplicated routes, CSS override layers, and
obvious responsive bugs are product-quality failures, not just implementation
details.

## Required Roles

### Founder

Minimum level: Owner.

The Founder has final decision rights on vision, positioning, monetization,
brand, and what gets merged into the public project.

Responsibilities:

- approve product direction;
- approve monetization experiments;
- decide when a release is good enough to publish;
- keep the project aligned with the long-term audience goal.

### Product Owner

Minimum level: Senior Product Owner.

The Product Owner works directly with the Founder to move the project from
idea to deployed product. This role is responsible for product clarity, release
scope, prioritization, and launch readiness.

Responsibilities:

- turn founder direction into a clear roadmap;
- define the current release goal and what is out of scope;
- reject features that do not support the positioning;
- verify that public pages explain the product clearly;
- approve deploy readiness together with the Founder;
- keep docs, examples, and tools aligned with the actual package state.

The Product Owner must be competent enough to challenge implementation output.
If the site describes features that do not exist, if the homepage is unclear, or
if a release has obvious UX bugs, the Product Owner blocks the release.

### Architect / Tech Lead

Minimum level: Senior / Staff.

Responsibilities:

- own package boundaries and monorepo structure;
- protect bundle-size and dependency rules;
- review public API shape before implementation;
- prevent duplicated routes, unused components, and CSS override layers;
- decide when code should be deleted instead of patched over.

### Library Engineer

Minimum level: Senior.

Responsibilities:

- implement hooks and core utilities;
- keep APIs provider-agnostic and tree-shakable;
- add focused tests for hook behavior;
- avoid runtime dependencies unless explicitly approved.

### Frontend / Docs Engineer

Minimum level: Senior.

Responsibilities:

- implement the docs site and examples;
- match approved UI direction without unapproved design changes;
- verify responsive states before handoff;
- keep navigation, search, and docs pages consistent.

### QA / Release Engineer

Minimum level: Senior.

Responsibilities:

- run typecheck, tests, build, and browser QA before release;
- verify desktop and mobile layouts;
- check command palette, copy buttons, mobile menu, and support links;
- confirm no console errors;
- verify removed routes and deleted code do not leave stale links.

### Reviewer / Maintainer

Minimum level: Senior.

Responsibilities:

- review PRs before merge;
- block merges with stale code, dead routes, unclear docs, or failing checks;
- ensure every completed work block has a focused commit;
- protect `main` from direct unreviewed changes.

## Release Gate

No task is done until these checks pass:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- browser QA for affected pages
- mobile QA for affected layouts
- grep check for stale imports, deleted components, and obsolete routes
- review of `git diff --stat` for suspicious code growth

For UI work, the release gate also requires:

- no hidden CSS override layer at the end of `globals.css`;
- no duplicated page routes for the same feature;
- no public page describing functionality that does not exist;
- no obvious overlap, clipping, or transparent overlay bugs on mobile.

## GitHub Access

- Founder: Admin.
- Senior Maintainer: Maintain.
- Senior Reviewer: Write only when trusted.
- Contributor: Pull requests only.
- Public users: Issues and discussions.

The default for new contributors is pull request review, not direct write
access.
