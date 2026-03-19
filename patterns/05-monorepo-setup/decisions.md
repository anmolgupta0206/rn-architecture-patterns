# Decisions — Monorepo Setup

## ADR-01: Nx over Turborepo

**Status:** Accepted

**Context:** Both Nx and Turborepo manage JavaScript monorepos. Turborepo is simpler to set up; Nx is more powerful.

**Decision:** Nx.

**Why:**
- `nx affected` — only runs build/test/lint for projects impacted by changed files. Saves hours on CI for large repos.
- Dependency graph visualization — `nx graph` makes architectural dependencies visible
- First-class `@nx/react-native` and `@nx/next` generators
- Code generation — `nx generate` creates consistent package scaffolding

**When to use Turborepo instead:** Solo project or 2-person team. Simpler setup, good enough caching.

---

## ADR-02: Package-per-concern over one large `shared` package

**Status:** Accepted

**Decision:** Small focused packages: `types`, `utils`, `api-client`, `ui`.

**Why:**
- `nx affected` detection is more granular — changing `utils` doesn't rebuild `types` consumers
- Clearer ownership — `types` has one job, one maintainer
- Avoids a `shared` mega-package that becomes a dumping ground

**Rule:** Only extract to a package when 2+ apps consume the code.

---

## ADR-03: `types` package has zero runtime dependencies

**Status:** Accepted

**Decision:** `packages/types` exports only TypeScript interfaces and type aliases. No imports, no runtime code.

**Why:** Every app depends on `types`. If `types` had dependencies, every app would inherit them — bloating mobile and web bundles with unwanted code.

---

## ADR-04: Path aliases for all cross-package imports

**Status:** Accepted

**Decision:** Use `@myapp/*` aliases configured in `tsconfig.base.json`.

```ts
// ✅ Clean — location-independent
import { User } from '@myapp/types';

// ❌ Brittle — breaks when files move
import { User } from '../../packages/types/src/index';
```

**Setup:** Configure in `tsconfig.base.json` paths + each app extends the base config.
