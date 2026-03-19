# Decisions — Navigation

## ADR-01: Separate auth/app navigator trees

**Status:** Accepted

**Decision:** Two completely separate navigators — `AuthStack` and `AppStack` — controlled by `isAuthenticated` in Redux.

**Why not conditional screens inside one navigator?**
- Security: unauthenticated users cannot reach app screens — they physically don't exist in the tree
- Cleaner stack: no leftover auth screens in history after login
- No `navigation.reset()` hacks needed after login/logout

---

## ADR-02: Type all route params via `RootStackParamList`

**Status:** Accepted

**Decision:** Define `RootStackParamList` before building any screen. Every screen's params are typed. Never use `any`.

**Cost:** 10 minutes upfront.
**Benefit:** Eliminates an entire class of runtime crashes and makes navigation refactors safe.

---

## ADR-03: Wrap navigation hooks

**Status:** Accepted

**Decision:** `useAppNavigation()` and `useAppRoute<T>()` wrap the bare React Navigation hooks. Screens never call `useNavigation()` directly.

**Why:**
- One import per screen instead of two (`useNavigation` + the navigation type)
- One place to update if the navigation type changes
- Trivial to mock in tests

---

## ADR-04: Deep linking config from week 1

**Status:** Accepted

**Decision:** Set up the `linking` config in the first week of every project.

**Why:** Retrofitting deep links onto existing navigation often forces renaming screens and param shapes. Universal links (HTTPS) are required for iOS App Clips, push notification tap targets, and marketing campaigns. Easier to do it right at the start.

---

## ADR-05: Max 2 levels of navigator nesting

**Status:** Accepted

**Decision:** Stack → Tabs is the maximum. Deeper nesting makes `navigation.navigate()` calls unreliable across nested navigators.

**For deeper flows:** Use `presentation: 'modal'` for overlays (image viewers, confirmations, pickers) instead of nested stacks.
