# 🧭 Pattern 03 — Navigation

## Key Principles

1. **Type every route param from day one** — never `route.params.id as string`
2. **Auth guard lives at the navigator level** — not inside screens
3. **Deep linking config from week 1** — retrofitting it onto existing navigation is painful
4. **Max 2 levels of nesting** — Stack → Tabs is fine; Stack → Tabs → Stack → Modal is hell

---

## Architecture

```
NavigationContainer
└── isAuthenticated?
    ├── YES → AppStack
    │   ├── MainTabs (Bottom Tab Navigator)
    │   │   ├── Feed
    │   │   ├── Explore
    │   │   ├── Notifications
    │   │   └── Profile
    │   ├── PostDetail  ← Stack screen (full-screen)
    │   ├── UserProfile ← Stack screen
    │   └── ImageViewer ← Modal (presentation: 'modal')
    │
    └── NO → AuthStack
        ├── Login
        ├── Register
        └── ForgotPassword
```

---

## Typed Navigation Pattern

```ts
// ✅ Fully typed — IDE autocomplete + compile-time safety
const nav = useAppNavigation();
nav.navigate('PostDetail', { postId: '123', title: 'Hello' }); // params checked!

// ✅ Typed route params in a screen
const route = useAppRoute<'PostDetail'>();
const { postId, title } = route.params; // no casting needed
```

---

## Source Files in This Pattern

```
src/
├── navigation/
│   ├── types.ts           ← RootStackParamList, TabParamList
│   ├── RootNavigator.tsx  ← auth-gated top-level navigator
│   └── linking.ts         ← deep link URL config
└── hooks/
    └── useAppNavigation.ts ← typed useNavigation + useRoute wrappers
```
