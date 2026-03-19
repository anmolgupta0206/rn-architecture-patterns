# Contributing

Thank you for your interest! Contributions are welcome.

## Adding a New Pattern

Every pattern must follow this self-contained structure:

```
patterns/XX-pattern-name/
├── README.md       ← Concept, when to use, architecture diagram
├── decisions.md    ← WHY each decision was made (ADR format)
└── src/            ← Working TypeScript code
    └── ...
```

## Pull Request Checklist

- [ ] `npm run typecheck` passes
- [ ] All code is TypeScript (no `.js` files)
- [ ] `README.md` explains the pattern clearly
- [ ] `decisions.md` has at least 2 ADRs
- [ ] No external runtime dependencies added to root `package.json`

## Code Style

- TypeScript strict mode — no `any`
- Functional components only
- Named exports (no default exports except screens/navigators)
- Comments explain *why*, not *what*

Questions? Open an issue or reach out on [LinkedIn](https://linkedin.com/in/anmolgupta0206).
