# 🏢 Pattern 05 — Monorepo Setup with Nx

## Why Monorepo?

If your team maintains a **React Native app + a Next.js web app + a Node.js API**, a monorepo lets you:

- Share TypeScript types across all apps (zero drift)
- Share business logic: validation, formatting, API client
- Run `nx affected` in CI — only test what actually changed
- Single `git` history for all related code

---

## Structure

```
my-monorepo/
├── apps/
│   ├── mobile/              ← React Native app
│   │   └── src/
│   │       └── App.tsx
│   └── web/                 ← Next.js web app
│       └── src/
│           └── app/page.tsx
│
├── packages/                ← Shared code consumed by apps
│   ├── types/               ← TypeScript interfaces only (zero runtime deps)
│   │   └── src/index.ts
│   ├── utils/               ← Pure utility functions (no platform code)
│   │   └── src/index.ts
│   ├── api-client/          ← Type-safe HTTP client (fetch-based)
│   │   └── src/index.ts
│   └── ui/                  ← Shared component stubs
│       └── src/index.ts
│
├── nx.json                  ← Nx workspace config
├── package.json             ← Root package.json (workspaces)
└── tsconfig.base.json       ← Shared TS config + path aliases
```

---

## Import Pattern

```ts
// In mobile app or web app — same import, same types
import { User, Post, ApiResponse } from '@myapp/types';
import { formatRelativeTime, isValidEmail } from '@myapp/utils';
import { createApiClient } from '@myapp/api-client';
```

---

## Nx Key Commands

```bash
# Build only affected projects (huge CI time saver)
nx affected:build

# Test only affected projects
nx affected:test

# Visualise dependency graph
nx graph

# Generate a new shared package
nx generate @nx/js:library my-package --directory=packages/my-package
```

---

## Source Files in This Pattern

```
apps/
├── mobile/src/App.tsx          ← RN entry point using shared packages
└── web/src/app/page.tsx        ← Next.js page using same shared packages

packages/
├── types/src/index.ts          ← Shared interfaces: User, Post, ApiResponse
├── utils/src/index.ts          ← isValidEmail, formatCurrency, groupBy, etc.
├── api-client/src/index.ts     ← ApiClient class (fetch-based, token injection)
└── ui/src/index.ts             ← Shared component barrel

nx.json                         ← Nx workspace config
package.json                    ← Workspace root
tsconfig.base.json              ← Shared TS config + @myapp/* path aliases
```
