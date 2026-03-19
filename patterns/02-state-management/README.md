# 🧠 Pattern 02 — State Management

## The Core Rule

> **Never mix server state and client state.**

This is the single most common mistake in large RN codebases. Once you put API data in Redux, you fight stale data, duplicate fetching logic, and cache invalidation bugs forever.

---

## The Three-Layer Model

```
┌─────────────────────────────────────────────────────────┐
│                    Your RN App                           │
│                                                          │
│   Redux Toolkit          Zustand         TanStack Query  │
│   ─────────────          ────────        ──────────────  │
│   Auth state             Cart state      Posts from API  │
│   Feature flags          Modal open?     User profiles   │
│   Theme / locale         Filter values   Notifications   │
│   Permissions            Form drafts     Search results  │
│                                                          │
│   "Global client state"  "Local UI state" "Server state" │
└─────────────────────────────────────────────────────────┘
```

---

## When To Use What

### ✅ Redux Toolkit — Complex Global State
- Shared across many features (auth, permissions, theme)
- Needs DevTools / time-travel debugging
- Complex state transitions with many reducers
- **Do NOT use for:** API data, feature-scoped state

### ✅ Zustand — Lightweight Feature/UI State
- Scoped to one feature (cart, filters, draft)
- No Redux boilerplate needed
- Persisted with AsyncStorage via `persist` middleware
- **Do NOT use for:** global auth state, API data

### ✅ TanStack Query — All Server State
- Anything fetched from an API
- Handles: caching, background refetch, pagination, optimistic updates
- **Do NOT use for:** purely local UI state

---

## Source Files in This Pattern

```
src/
├── redux/
│   ├── store/store.ts          ← configureStore + typed hooks
│   └── slices/
│       ├── authSlice.ts        ← auth state (login/logout thunks)
│       └── uiSlice.ts          ← theme, locale, onboarding
├── zustand/
│   └── useCartStore.ts         ← cart with Immer + AsyncStorage persist
└── react-query/
    ├── api/postsApi.ts         ← type-safe fetch functions
    └── hooks/usePosts.ts       ← useQuery + useMutation + optimistic updates
```
