# Decisions — Modular Architecture

## ADR-01: Feature-based over type-based folder structure

**Status:** Accepted

**Context:** Type-based (`components/`, `screens/`) works for solo devs on small apps. It collapses when 5+ engineers ship simultaneously.

**Decision:** Organize by feature, not by file type.

**Why:**
- Merge conflicts drop dramatically — engineers rarely touch the same feature
- Onboarding is faster — "work in `features/feed/`" is a clear scope
- Deletion is clean — remove a feature without archaeology

**Tradeoff:** Initial setup takes longer. Worth it after the 3rd engineer joins.

---

## ADR-02: `index.ts` as each feature's public API contract

**Status:** Accepted

**Decision:** Every feature has an `index.ts` that explicitly exports only what external code needs. Internal hooks, utils, and components are NOT exported.

**Why:** Prevents accidental coupling. If it's not in `index.ts`, it's private. Refactoring internals never breaks other features.

**Enforcement:** Add ESLint rule `import/no-internal-modules` to automatically catch direct deep imports.

---

## ADR-03: Features must never import from each other

**Status:** Accepted

**Decision:** `features/feed` cannot import from `features/auth` directly.

**Cross-feature communication is allowed via:**
1. Shared Redux state — `useAppSelector(selectCurrentUser)`
2. Navigation params — `navigation.navigate('UserProfile', { userId })`
3. Shared hooks in `shared/hooks/`

**Why:** Prevents circular dependency hell in large codebases.

---

## ADR-04: Path aliases over relative imports

**Status:** Accepted

**Decision:** Use `@features/auth`, `@shared/hooks`, `@app/store` instead of `../../../features/auth`.

**Setup:** `tsconfig.json` paths + `babel-plugin-module-resolver` for the RN bundler.

**Why:** Relative paths break when you move files. Aliases never change.
