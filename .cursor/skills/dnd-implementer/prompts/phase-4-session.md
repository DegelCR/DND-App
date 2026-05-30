# Phase 4 — Campaign & Session Notes ✅ COMPLETADA (29–30 may 2026)

Ver detalle en `REGISTRO.md` §12 (Fase 4).

**Entregado:** `/session` — campañas, sesiones numeradas, notas MD, recap, prep Lazy GM, 10 secretos/campaña, quick notes, Dexie v4.

---

# Phase 5 — SRD Compendium (copy entire block below into a new Agent chat)

---

Implement **Phase 5 — SRD Compendium** for DND App.

Use the **dnd-implementer** skill. Read `REGISTRO.md` (Phase 5, DB schema v4) and mirror patterns from `src/features/bestiary/`.

## Goal

Replace the `/compendium` placeholder with an SRD reference browser: spells, conditions, rules (and optionally classes/races as stretch).

## Tasks

| # | Task | Deliverable |
|---|------|-------------|
| 5.1 | SRD API client + cache | Extend `srd-api.ts` or similar |
| 5.2 | Global search | Cross-type search UI |
| 5.3 | Detail views | Spell card, condition, rule text |
| 5.4 | Offline cache | IndexedDB like bestiary |

## Technical requirements

- Dexie v5 if new tables needed
- English UI, dark theme, `PageHeader`
- Set compendium to `ready` in `navigation.ts`
- `npm run build` must pass
- Update `REGISTRO.md`
- Do not commit unless I ask

Start by reading the codebase, then implement end-to-end.

---
