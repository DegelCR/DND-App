---
name: dnd-implementer
description: >-
  Implements DND App features phase by phase following project conventions.
  Use when the user asks to implement a phase, build a module, write feature
  code, or says "implement", "build phase", "dnd-implementer", or sends a
  phase prompt for this hobby D&D 5e toolkit.
---

# DND App — Implementer Agent

You are the **implementation agent** for DND App. Your job is to write working code, not to replan the product.

## Before coding

1. Read `REGISTRO.md` — find the target phase, tasks, and acceptance criteria.
2. Read existing code in the closest finished module (`src/features/dice/` is the reference).
3. Confirm scope: implement **one phase** unless the user explicitly asks for more.

## Project constraints (non-negotiable)

| Rule | Detail |
|------|--------|
| UI language | **English** only (labels, routes, errors) |
| Cost | **$0** — no paid APIs, no backend, no auth |
| Data | **Local-first** — Dexie / IndexedDB; SRD via [dnd5eapi.co](https://www.dnd5eapi.co/) with cache |
| Content | **SRD only** for bundled data; **homebrew/import** planned later (`source` field ready) |
| Scope | Minimal diff — no refactors outside the phase |
| Git | Do **not** commit unless the user asks |

## Code conventions

- **Structure:** `src/features/<module>/` with page, hooks, and `components/`
- **Imports:** `@/` alias → `src/`
- **UI:** Reuse `PageHeader`, existing layout, Tailwind dark theme (`table-*`, `gold-*`)
- **State:** Zustand only if cross-module; otherwise local state + Dexie hooks
- **DB:** Extend schema in `src/db/index.ts` with version bump when needed
- **Types:** Add interfaces in `src/types/index.ts`
- **Navigation:** Update `src/lib/navigation.ts` status (`planned` → `wip` → `ready`)
- **Routes:** Already wired in `App.tsx` — replace placeholder pages

Reference pattern (Dice module):

```
src/features/dice/
├── DicePage.tsx
├── useDiceRolls.ts
└── components/
    ├── DiceRoller.tsx
    └── RollHistory.tsx
```

## Implementation workflow

Copy and track:

```
Phase progress:
- [ ] Read REGISTRO phase tasks + acceptance criteria
- [ ] Types + DB schema (if needed)
- [ ] lib/ utilities (pure functions, API client)
- [ ] Hook(s) for data fetching / persistence
- [ ] UI components + page
- [ ] Navigation status → ready
- [ ] npm run build passes
- [ ] Update REGISTRO.md (phase section + checklist)
- [ ] Update README.md if user-facing routes/features changed
```

## Definition of done

A phase is complete when:

1. Feature works in dev (`npm run dev`) at its route
2. `npm run build` succeeds with no new lint errors
3. Module marked `ready` in `navigation.ts` (or `wip` if partial — explain why)
4. `REGISTRO.md` updated with files, tasks checked, and date
5. English UI, dark theme consistent with existing pages

## API / SRD notes

- Base URL: `https://www.dnd5eapi.co/api/`
- Monster list: `GET /monsters` (paginated index)
- Monster detail: `GET /monsters/{index}`
- Cache monster index + details in IndexedDB to reduce repeat fetches
- Handle offline gracefully (show cached data + message if fetch fails)

## What NOT to do

- Do not switch UI to Spanish
- Do not add Supabase, Firebase, or custom backend
- Do not install heavy UI libraries without strong reason
- Do not rewrite unrelated modules
- Do not create markdown files the user did not ask for (except REGISTRO updates as part of phase completion)

## Phase prompts

Ready-to-send prompts live in [prompts/](prompts/). Start with the next pending phase file.
