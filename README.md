# 🏗️ React Native Architecture Patterns

> **7+ years** of production React Native patterns — documented with working TypeScript code, architectural decisions, and real tradeoffs. Built by [Anmol Gupta](https://github.com/anmolgupta0206).

![React Native](https://img.shields.io/badge/React_Native-0.84+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 What Is This?

This is **not a tutorial**. This is a reference repository of architecture patterns I've used across production React Native apps in Fintech, Healthcare, E-commerce, and Enterprise.

Every pattern folder is **self-contained** and includes:

| File | Purpose |
|------|---------|
| `README.md` | Concept, when to use it, architecture diagram |
| `decisions.md` | *Why* each decision was made (ADR format) |
| `src/` | 100% working TypeScript code |

---

## 🗂️ Patterns

| # | Pattern | What It Solves |
|---|---------|---------------|
| [01](./patterns/01-modular-architecture/) | **Modular Architecture** | Feature-based folder structure that scales with team size |
| [02](./patterns/02-state-management/) | **State Management** | Redux vs Zustand vs TanStack Query — the right tool for each job |
| [03](./patterns/03-navigation/) | **Navigation** | Typed routes, auth guards, deep linking |
| [04](./patterns/04-offline-first/) | **Offline-First Sync** | Local-first data with background sync & conflict resolution |
| [05](./patterns/05-monorepo-setup/) | **Monorepo Setup** | Share code across RN + Web + API using Nx |

---

## 🚀 How To Use

```bash
git clone https://github.com/anmolgupta0206/rn-architecture-patterns.git
cd rn-architecture-patterns

# Install deps for type checking
npm install

# Typecheck everything
npm run typecheck
```

> 💡 **Recommended reading order:**
> 01 Modular → 02 State Management → 03 Navigation → 04 Offline-First → 05 Monorepo

Each pattern is fully independent — jump to whichever is most relevant to you.

---

## 🛠️ Tech Stack

```
React Native 0.84+    TypeScript (strict)    React Navigation v7
Redux Toolkit 2.x     Zustand 4.x            TanStack Query 5.x
WatermelonDB          MMKV                   Nx (monorepo)
Axios                 NetInfo                AsyncStorage
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). PRs are welcome!

---

## 📄 License

MIT © [Anmol Gupta](https://github.com/anmolgupta0206)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-anmolgupta0206-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/anmolgupta0206)
[![GitHub](https://img.shields.io/badge/GitHub-anmolgupta0206-181717?style=flat-square&logo=github)](https://github.com/anmolgupta0206)
