# Phase 2 — SRD Bestiary (copy entire block below into a new Agent chat)

---

Implement **Phase 2 — SRD Bestiary** for DND App.

Use the **dnd-implementer** skill. Read `REGISTRO.md` (sections 6, 10–13, 17) and mirror patterns from `src/features/dice/`.

## Goal

Replace the `/bestiary` placeholder with a working SRD monster browser: search, CR filter, stat block detail, favorites/recents, and a stub "Add to combat" button for Phase 3.

## Tasks

| # | Task | Deliverable |
|---|------|-------------|
| 2.1 | SRD API client + IndexedDB cache | `src/lib/srd-api.ts` (or similar) + Dexie tables |
| 2.2 | Monster list with search + CR filter | List UI on BestiaryPage |
| 2.3 | Full stat block view | Detail panel or route `/bestiary/:index` |
| 2.4 | "Add to combat" button | Stub — stores intent locally or toast "Coming in Phase 3" |
| 2.5 | Favorites + recently viewed | Persist in IndexedDB |

## Technical requirements

- **API:** [dnd5eapi.co](https://www.dnd5eapi.co/api/monsters) — cache index list and monster details in IndexedDB
- **DB:** Bump Dexie schema version; add tables e.g. `monsters` (cached details), `monsterFavorites`, `monsterRecents` (or equivalent)
- **UI:** English, dark theme, reuse `PageHeader` and existing layout components
- **Loading / errors:** Loading skeletons; friendly message if API fails but show cache if available
- **Navigation:** Set bestiary module to `ready` in `src/lib/navigation.ts`
- **No backend**, **no new paid deps**, **SRD only**

## Stat block should show (minimum)

- Name, size, type, alignment, CR, XP
- AC, HP, speed
- Ability scores (STR–CHA) with modifiers
- Skills, senses, languages (if present)
- Actions (name + description)

## Acceptance criteria

- [ ] `/bestiary` loads monster list from API (cached after first fetch)
- [ ] Search filters by name (client-side on cached index is fine)
- [ ] CR filter works
- [ ] Click monster → full stat block visible
- [ ] Favorite toggle persists after reload
- [ ] Recently viewed (last ~10) persists after reload
- [ ] "Add to combat" visible but clearly stubbed for Phase 3
- [ ] `npm run build` passes
- [ ] Update `REGISTRO.md` (Phase 2 section + checklist)
- [ ] Update `README.md` module table if needed

## Do not

- Commit to git (unless I ask)
- Implement actual combat integration (Phase 3)
- Add non-SRD content or Spanish UI strings

Start by reading the codebase, then implement end-to-end.

---
