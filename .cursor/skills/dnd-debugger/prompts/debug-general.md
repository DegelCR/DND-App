# General debug prompt (copy below into Agent chat with @dnd-debugger)

---

Debug an issue in **DND App** (`c:\Users\Fran\Desktop\DND App`).

Use the **dnd-debugger** skill. Do not add features — find root cause and fix with a minimal diff.

## Symptom

**What happens:** [describe what you see — blank screen, wrong value, error toast, etc.]

**What I expected:** [describe correct behavior]

**Where:** [route, e.g. `/bestiary`, `/dice`, Home, or `npm run build`]

**When:** [always / first load / after reload / offline / only on natural 1 / etc.]

## Evidence (paste if you have it)

```
Browser console errors:
[paste here or write "none"]

Terminal output:
[paste npm run build / npm run dev errors here or write "none"]

Steps to reproduce:
1. 
2. 
3. 
```

## Your tasks

1. Reproduce or infer the bug from code + evidence
2. Trace root cause (UI → hook → lib → Dexie/API)
3. Fix with the smallest correct change
4. Run `npm run build` (and `npm run lint` if you touched TS files)
5. Tell me exactly how to verify the fix manually
6. Do **not** commit unless I ask

## Project context

- React 19 + Vite 8 + Dexie (IndexedDB) + dnd5eapi.co for SRD
- UI language: English
- Modules ready: `/dice`, `/bestiary`
- Read `REGISTRO.md` only if behavior spec is unclear

Start investigating now.

---
