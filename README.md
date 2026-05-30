# DND App

Tabletop toolkit for **D&D 5e** sessions — a hobby project. Everything is saved **locally** in your browser (IndexedDB). No server, no cost.

**Live demo:** [https://degelcr.github.io/DND-App/](https://degelcr.github.io/DND-App/)

**Repository:** [https://github.com/DegelCR/DND-App](https://github.com/DegelCR/DND-App)

## Requirements

- Node.js 18+
- npm

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. If that port is busy, Vite may use **5174** — check the terminal output.

### GitHub Pages (production)

Every push to `main` triggers [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml), which builds the app and publishes `dist/` to GitHub Pages.

**One-time setup (required):** GitHub Pages is **not enabled by default**. Open [Settings → Pages](https://github.com/DegelCR/DND-App/settings/pages) and configure:

1. **Build and deployment** → **Source:** Deploy from a branch  
2. **Branch:** `gh-pages` / **`/ (root)`**  
3. Click **Save** — the site appears in 1–2 minutes at the URL below

Every push to `main` rebuilds and updates the `gh-pages` branch automatically.

| URL | Purpose |
|-----|---------|
| [degelcr.github.io/DND-App/](https://degelcr.github.io/DND-App/) | Public app |
| `/DND-App/` base path | Set automatically in CI via `GITHUB_REPOSITORY` in `vite.config.ts` |
| `404.html` | Copy of `index.html` so client-side routes work on refresh |

To preview the production base path locally:

```bash
# PowerShell
$env:GITHUB_REPOSITORY = "DegelCR/DND-App"
npm run build
npm run preview
# → http://localhost:4173/DND-App/
```

## Current status (May 2026)

**Phases 0–8 complete:** Dice, Bestiary, Combat, Session notes, Compendium, Characters, Generators, **Battle map**.

**Roadmap MVP done.** Deployed on GitHub Pages. Next backlog: PWA, add-to-combat, etc.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styles | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand |
| Storage | Dexie (IndexedDB) |
| Animations | lottie-react (fumble, lazy-loaded) |

## Structure

```
src/
├── components/     # Shared UI (layout, cards)
├── features/       # Feature modules (dice, bestiary, combat, session, compendium, characters, generators, map)
├── lib/            # Utilities (dice, SRD, compendium, character, generators, map, navigation)
│   ├── character/  # PC builder logic (ported from Forja del Héroe)
│   ├── generators/ # Name, loot, NPC, encounter generators
│   └── map/        # Battle map helpers (grid, measure, upload)
├── db/             # Dexie / IndexedDB (schema v7)
├── stores/         # Zustand
└── types/          # TypeScript (incl. character, compendium, generators, map)

public/
└── animations/     # Lottie JSON assets (manual download)
```

## Modules

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Ready | Home dashboard |
| `/dice` | **Ready** | Dice roller with advantage/disadvantage, history |
| `/bestiary` | **Ready** | SRD monster browser with search, CR filter, stat blocks |
| `/combat` | **Ready** | Initiative tracker, HP, conditions, combat log |
| `/session` | **Ready** | Campaign notes, Lazy DM prep, recaps, quick notes |
| `/compendium` | **Ready** | Spells, classes, races, conditions, equipment & rules |
| `/compendium/:category/:index` | **Ready** | Compendium entry detail |
| `/characters` | **Ready** | 9-step PC builder + parchment sheet |
| `/characters/new` | **Ready** | Create new character |
| `/characters/:id` | **Ready** | Edit saved character |
| `/generators` | **Ready** | Names, loot, quick NPCs, random encounters |
| `/map` | **Ready** | Upload battle maps, grid, tokens, fog & measure |

Legacy Spanish routes (`/dados`, `/bestiario`, …) redirect to the English paths.

### Bestiary (Phase 2)

- 334 SRD monsters from [dnd5eapi.co](https://www.dnd5eapi.co/)
- Search by name, filter by Challenge Rating
- Full stat blocks (AC, HP, abilities, actions, etc.)
- IndexedDB cache for offline use
- Favorites and recently viewed (last 10)
- Route `/bestiary/:index` for direct links
- "Add to combat" queues monster for Combat module

### Combat tracker (Phase 3)

- CRUD combat encounters (saved locally)
- Add PC, NPC, or monster (manual or from Bestiary)
- Roll initiative (individual or all) with auto-sort
- Turn tracker: round, active combatant, next/prev
- HP adjustments, defeated state, hide HP (DM)
- Conditions: Poisoned, Prone, Stunned, Frightened, Grappled, Restrained
- Timestamped combat log

### Compendium (Phase 5)

- Six SRD categories: spells, classes, races, conditions, equipment, rules
- Global search across all categories (2+ characters)
- Spell level filter (cantrips + levels 1–9)
- Full entry details with IndexedDB cache
- Routes `/compendium/:category/:index` for direct links
- Offline mode with cached index and viewed entries

### Session notes (Phase 4)

- CRUD campaigns with numbered sessions
- Notes editor with lightweight Markdown preview
- Post-session recap field
- Lazy GM prep: strong start, 8-item checklist
- Campaign-wide secrets & clues pool (10 slots, revealed toggle)
- Live quick notes with timestamps (append-only)
- Auto-save with debounce

### Character builder (Phase 6)

Ported and adapted from **Forja del Héroe** (standalone Next.js project).

- **9-step wizard:** Basics → Race → Class → Background → Stats → Skills → Spells → Gear → Sheet
- **Official-style parchment sheet** inside the dark app layout (Option A)
- SRD data via [dnd5eapi.co](https://www.dnd5eapi.co/api/2014/) + PHB subclass/background names (reference only)
- Standard array or manual ability scores (3–20)
- Class skill choices, SRD spell picker with slot/cantrip limits
- **Multiple characters** saved in IndexedDB (Dexie v6)
- Routes: `/characters/new`, `/characters/:id`
- Print / copy JSON on final step
- No custom sword cursor or slash animations (normal system cursor)

### Generators (Phase 7)

- **Names** — character, NPC, place, tavern (1–10 at a time)
- **Loot** — treasure hoard by tier (CR 0–4 through 17+)
- **Quick NPC** — name, role, trait, hook, sample line
- **Random encounter** — SRD monsters from Bestiary cache (party level + difficulty)
- Copy to clipboard on all panels
- Route: `/generators`
- Primary actions use theme color `gold-500` (visible on dark background)

### Battle map (Phase 8)

Owlbear-style **upload** workflow (no map editor yet).

- **Upload** PNG/JPG/WebP battle maps (max 15 MB, saved in IndexedDB)
- **Grid** overlay — cell size, offset (arrow keys in Pan mode), feet per square
- **Tokens** — click to place, drag to move, editable labels
- **Fog of war** — paint to hide, Reveal tool to uncover (DM view)
- **Measure** — two-click distance in squares and feet
- Pan, scroll-to-zoom, multiple saved maps
- Route: `/map`

### Dice roller (Phase 1)

- Standard dice: d4, d6, d8, d10, d12, d20, d100
- Advantage / disadvantage (1d20)
- Custom expressions (`2d6+3`, `1d20+5`)
- Last 20 rolls persisted in IndexedDB
- Natural 1: Lottie fumble animation (or 😈 fallback)
- Natural 20: highlighted critical

## Roadmap

- [x] **Phase 0** — Foundation (layout, routes, DB)
- [x] **Phase 1** — Dice roller (+ Lottie fumble, English UI)
- [x] **Phase 2** — SRD Bestiary
- [x] **Phase 3** — Combat & initiative
- [x] **Phase 4** — Campaign & session notes
- [x] **Phase 5** — SRD Compendium
- [x] **Phase 6** — Character builder (from Forja del Héroe) ← done
- [x] **Phase 7** — Generators (names, loot, NPCs, encounters) ← done
- [x] **Phase 8** — Battle map (upload, grid, tokens, fog) ← done

**MVP roadmap complete.** See backlog in `REGISTRO.md`.

Detailed project log (Spanish): [`REGISTRO.md`](./REGISTRO.md)

## Content license

Rule data comes from the [System Reference Document (SRD)](https://www.dndbeyond.com/srd) under Creative Commons. This app is not affiliated with Wizards of the Coast.

## Fumble animation (optional)

Download **Optimized Lottie JSON** from [LottieFiles](https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20) and save as:

```
public/animations/devil-d20-fumble.json
```

See [`public/animations/README.md`](./public/animations/README.md) for step-by-step instructions. The dice roller works without it (emoji fallback).

## Future: homebrew & external imports

Planned for a later phase: import custom monsters (JSON) alongside SRD content. Types already use `source: 'srd' | 'homebrew'`. See `REGISTRO.md` §24.1.

## UI language

The app UI is **English**. Project notes live in `REGISTRO.md` (Spanish).
