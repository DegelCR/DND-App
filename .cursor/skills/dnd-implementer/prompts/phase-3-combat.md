# Phase 3 — Combat & Initiative (copy entire block below into a new Agent chat)

---

Implement **Phase 3 — Combat & Initiative** for DND App.

Use the **dnd-implementer** skill. Read `REGISTRO.md` (Phase 3 tasks, DB schema, bestiary integration) and mirror patterns from `src/features/dice/` and `src/features/bestiary/`.

## Goal

Replace the `/combat` placeholder with an initiative tracker: create encounters, add combatants (PC / monster from bestiary stub), roll initiative, track rounds/turns/HP, conditions, and combat log.

## Prerequisites (already done)

- Bestiary stores pending monster in `settings.pending_combat_monster` when user clicks "Add to combat"
- Monster details cached in `monsterDetails` / `monsterSummaries`

## Tasks

| # | Task | Deliverable |
|---|------|-------------|
| 3.1 | CRUD combat encounters | Dexie + UI |
| 3.2 | Add PC / monster / NPC to encounter | Forms + import from bestiary |
| 3.3 | Roll initiative | Auto-sort turn order |
| 3.4 | Turn tracker: round, active combatant, HP | Combat UI |
| 3.5 | Conditions as tags | Apply/remove on combatants |
| 3.6 | Defeated state + hide HP (DM toggle) | Controls |
| 3.7 | Combat log | Timestamped events |
| 3.8 | Read `pending_combat_monster` from bestiary | Pre-fill add-monster flow |

## Technical requirements

- Extend Dexie schema v3 for combatants, conditions, log entries
- English UI, dark theme
- Set combat module to `ready` in `navigation.ts`
- `npm run build` must pass
- Update `REGISTRO.md` when done
- Do not commit unless I ask

## Acceptance criteria

- [ ] Create and save a named encounter
- [ ] Add combatant manually (name, initiative bonus, max HP)
- [ ] Add combatant from bestiary (uses cached stat block HP/AC)
- [ ] Roll initiative and sort order
- [ ] Next/prev turn, increment round
- [ ] Adjust HP, mark defeated
- [ ] At least 3 common conditions (e.g. poisoned, prone, stunned)
- [ ] Combat log shows HP changes and turn changes
- [ ] Reload page → encounter state persists

Start by reading the codebase, then implement end-to-end.

---
