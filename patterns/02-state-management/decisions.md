# Decisions — State Management

## ADR-01: Three tools for three types of state

**Status:** Accepted

**Decision:** Redux Toolkit for global client state, Zustand for local/feature UI state, TanStack Query for all server state. Never mix.

**Why:**
- Redux handles complex global state with DevTools + time-travel debugging
- Zustand has zero boilerplate for simple feature-scoped state
- TanStack Query handles every server-state concern (cache, stale, retry, pagination) out-of-the-box — replicating this in Redux is thousands of lines

**The rule:** If it came from an API, it does NOT go in Redux.

---

## ADR-02: TanStack Query over SWR for server state

**Status:** Accepted

**Why TanStack Query:**
- Infinite queries (paginated lists) are first-class — SWR requires workarounds
- `onMutate` / `onError` / `onSettled` lifecycle makes optimistic updates clean
- Centralized query key management prevents cache invalidation bugs
- Better TypeScript generics

---

## ADR-03: Zustand with Immer middleware

**Status:** Accepted

**Decision:** Use `immer` middleware so Zustand state can be mutated imperatively.

```ts
// Without Immer — verbose and error-prone for nested state
set(state => ({
  items: state.items.map(i => i.id === id ? { ...i, qty: qty } : i)
}))

// With Immer — clean, safe, readable
set(state => {
  const item = state.items.find(i => i.id === id);
  if (item) item.qty = qty;
})
```

---

## ADR-04: Centralized query keys factory

**Status:** Accepted

**Decision:** Define all query keys in a `queryKeys` object per domain, never as inline strings.

**Why:**
```ts
// ❌ Inline strings break cache invalidation
useQuery({ queryKey: ['posts'] })
queryClient.invalidateQueries({ queryKey: ['post'] }) // typo — won't invalidate!

// ✅ Centralized keys prevent this
export const postKeys = { all: ['posts'], detail: (id: string) => ['posts', id] }
```

---

## ADR-05: Optimistic updates for mutations

**Status:** Accepted

**Decision:** Always implement optimistic updates for create/delete mutations using `onMutate` → `onError` rollback → `onSettled` refetch.

**Why:** Users expect instant feedback on mobile. Waiting for API response before updating the UI feels broken on slow connections.
