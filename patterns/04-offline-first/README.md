# 🔌 Pattern 04 — Offline-First Sync

## The Mindset Shift

> Offline-first is **not** a feature. It's a design philosophy.
> Design your data layer assuming no internet — then add sync on top.

Most apps do this:
```
User action → API call → update UI
```

Offline-first apps do this:
```
User action → write to local DB → update UI immediately
             ↓ (background, when online)
             sync local changes → remote API
```

The user never waits. The app always works.

---

## Architecture

```
UI (React Native screens)
        │
        │ reads/writes
        ▼
Local Database (WatermelonDB)   ← Single source of truth
        │
        │ background sync
        ▼
   SyncEngine
        │
        ├── MutationQueue     ← Persists pending writes across app restarts
        │       │
        │       └── AsyncStorage
        │
        ├── ConflictResolver  ← Last-write-wins (LWW) by default
        │
        └── Remote API        ← Only touched when online
```

---

## Key Concepts

### MutationQueue
Every user action (create/update/delete) is stored as a mutation in `AsyncStorage` before touching the API. This means:
- Works offline — mutations queue up
- Survives app kills — `AsyncStorage` persists across sessions
- Retries with exponential backoff — failed syncs retry automatically

### ConflictResolver
When local and server data conflict, we compare `updatedAt` timestamps. Newest wins (LWW). For collaborative apps, upgrade to CRDT (Automerge/Yjs).

### SyncEngine
Listens to `NetInfo` for connectivity changes. When online:
1. Drains the `MutationQueue` (push local changes)
2. Pulls latest server state
3. Resolves conflicts

---

## Source Files in This Pattern

```
src/
├── sync/
│   ├── SyncEngine.ts         ← Orchestrator: connectivity + queue drain + pull
│   ├── MutationQueue.ts      ← Persistent AsyncStorage queue
│   └── ConflictResolver.ts   ← Last-write-wins conflict resolution
├── hooks/
│   └── useOfflineSync.ts     ← React hook wrapping SyncEngine
├── utils/
│   └── connectivity.ts       ← NetInfo helpers
└── database/
    ├── schema.ts              ← WatermelonDB schema
    └── models/
        └── Post.ts            ← Example WatermelonDB model
```
