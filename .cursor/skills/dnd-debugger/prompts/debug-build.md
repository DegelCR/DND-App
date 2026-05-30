# Build / TypeScript debug prompt (copy below into Agent chat with @dnd-debugger)

---

Fix a **build or TypeScript error** in DND App.

Use the **dnd-debugger** skill. Minimal fix only — no refactors.

## Error output

```
[paste full output of: npm run build]
```

## Context

- **Last change I made:** [optional — e.g. "edited bestiary", "pulled from git"]
- **Command that fails:** `npm run build` / `npm run lint` / both

## Your tasks

1. Parse the error — file, line, root cause
2. Fix without breaking runtime behavior
3. Run `npm run build` until it passes
4. Run `npm run lint` on files you changed
5. Summarize what was wrong and what you changed
6. Do **not** commit unless I ask

Start now.

---
