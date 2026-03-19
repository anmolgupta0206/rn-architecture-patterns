# Decisions — Offline-First Sync

## ADR-01: WatermelonDB over raw SQLite

**Status:** Accepted

**Context:** Needed a local DB that is reactive, lazy-loading, and integrates cleanly with React Native's rendering model.

**Decision:** WatermelonDB.

**Why:**
- Lazy loading: only loads records you observe — unlike Realm which eagerly loads collections
- Fully reactive: components re-render only when their specific observed data changes
- Built for React Native — not a JS wrapper around a desktop database
- Excellent TypeScript support

**Tradeoff:** More complex schema setup than AsyncStorage or MMKV. Not worth it for simple key-value needs — use MMKV for those.

---

## ADR-02: Persistent MutationQueue over in-memory queue

**Status:** Accepted

**Context:** We need to preserve pending user actions when the app is killed while offline.

**Decision:** Store the mutation queue in `AsyncStorage` (JSON-serialized array).

**Why:**
- Survives app restarts, background kills, and OS-level termination
- Simple to implement and reason about
- Ordered delivery — mutations applied in creation order

**Rejected:** In-memory queue — lost on any app kill.

---

## ADR-03: Exponential backoff for failed sync retries

**Status:** Accepted

**Decision:** Retry failed mutations up to 3 times with delays of 2s, 4s, 8s.

**Why:**
- Prevents hammering the server during an outage
- Gives transient failures time to resolve
- Failures after 3 attempts stay in the queue for next online event

---

## ADR-04: Last-Write-Wins (LWW) conflict resolution

**Status:** Accepted (with upgrade path)

**Context:** When a mutation is sent to the server, the server may have newer data.

**Decision:** Compare `updatedAt` timestamps. Newer timestamp wins.

**Why:** Handles 95% of real-world cases. Simple to implement and test.

**When to upgrade:** If your app has collaborative editing (shared docs, shared tasks), replace `ConflictResolver` with a CRDT implementation (Automerge or Yjs).

---

## ADR-05: NetInfo event listener over polling

**Status:** Accepted

**Decision:** Use `@react-native-community/netinfo` event listener to detect online/offline transitions.

**Why:** Event-driven is more battery-efficient than polling. NetInfo provides both `isConnected` and `isInternetReachable`.

**Note:** `isConnected: true` doesn't guarantee server reachability (captive portals). For critical mutations, call `pingServer()` before syncing.
