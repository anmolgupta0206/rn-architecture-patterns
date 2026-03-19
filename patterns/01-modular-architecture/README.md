# 📦 Pattern 01 — Modular Architecture

## The Problem

Most RN projects start like this and it **breaks at scale**:

```
src/
├── components/   ← 200+ files, no clear ownership
├── screens/      ← 50+ files mixed from all features
├── hooks/        ← everything dumped here
└── utils/        ← graveyard of random helpers
```

Symptoms: Merge conflicts daily. No one knows what belongs where.
New engineers take weeks to find anything.

---

## The Solution — Feature-Based Modules

```
src/
├── app/                        ← App-level setup only
│   ├── store/                  ← Redux store (combines all feature slices)
│   ├── navigation/             ← RootNavigator (reads auth state)
│   └── providers/              ← AppProviders (Redux, QueryClient, etc.)
│
├── features/                   ← One folder per product feature
│   ├── auth/
│   │   ├── api/                ← authApi.ts
│   │   ├── components/         ← AuthButton.tsx, etc.
│   │   ├── hooks/              ← useAuth.ts
│   │   ├── screens/            ← LoginScreen.tsx, RegisterScreen.tsx
│   │   ├── store/              ← authSlice.ts
│   │   ├── types/              ← index.ts (User, AuthState, etc.)
│   │   └── index.ts            ← PUBLIC API — only export what others need
│   │
│   └── feed/
│       ├── components/         ← FeedCard.tsx
│       ├── hooks/              ← useFeed.ts
│       ├── screens/            ← FeedScreen.tsx
│       └── index.ts            ← PUBLIC API
│
└── shared/                     ← Only code used by 2+ features
    ├── api/                    ← apiClient.ts (axios instance)
    ├── components/             ← Button.tsx, Input.tsx
    ├── hooks/                  ← useAppNavigation.ts, useDebounce.ts
    ├── types/                  ← navigation.ts (RootStackParamList)
    └── utils/                  ← formatDate.ts, validation.ts
```

---

## The Golden Rule — `index.ts` as Public API

Each feature exposes ONLY what other features need via `index.ts`:

```ts
// ✅ Correct — import from the feature's public API
import { useAuth, LoginScreen } from '@features/auth';

// ❌ Wrong — breaks encapsulation, creates hidden coupling
import { useAuth } from '@features/auth/hooks/useAuth';
```

---

## Key Learnings

- **Delete a feature = delete one folder** — no hunting scattered files
- **Assign ownership** — "Team A owns `feed/`" is a clear boundary
- **CI optimization** — run tests only for changed feature folders
- **Two features must never directly import each other** — use shared state or navigation params

---

## Source Files in This Pattern

```
src/
├── app/
│   ├── store/index.ts              ← Redux store
│   ├── navigation/RootNavigator.tsx
│   └── providers/AppProviders.tsx
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts
│   │   ├── hooks/useAuth.ts
│   │   ├── screens/LoginScreen.tsx
│   │   ├── store/authSlice.ts
│   │   ├── types/index.ts
│   │   └── index.ts
│   └── feed/
│       ├── hooks/useFeed.ts
│       ├── screens/FeedScreen.tsx
│       └── index.ts
└── shared/
    ├── api/apiClient.ts
    ├── hooks/useAppNavigation.ts
    └── types/navigation.ts
```
