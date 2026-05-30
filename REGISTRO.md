# Registro del proyecto — DND App

Documento de seguimiento detallado del desarrollo de la aplicación de mesa para sesiones de **D&D 5e**.

| Campo | Valor |
|-------|-------|
| **Proyecto** | DND App |
| **Ubicación** | `c:\Users\Fran\Desktop\DND App` |
| **Inicio** | 29 de mayo de 2026 |
| **Enfoque** | Hobby, coste $0, local-first |
| **Estado actual** | Fases 0–8 ✅ · MVP roadmap completo · GitHub Pages |
| **Última actualización** | 30 de mayo de 2026 |
| **Repo** | [github.com/DegelCR/DND-App](https://github.com/DegelCR/DND-App) |
| **Demo online** | [degelcr.github.io/DND-App](https://degelcr.github.io/DND-App/) |

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Cronología de decisiones](#2-cronología-de-decisiones)
3. [Investigación inicial](#3-investigación-inicial)
4. [Análisis de viabilidad](#4-análisis-de-viabilidad)
5. [Estrategia sin coste ($0)](#5-estrategia-sin-coste-0)
6. [Plan de trabajo completo](#6-plan-de-trabajo-completo)
7. [Fase 0 — Fundación (completada)](#7-fase-0--fundación-completada)
8. [Fase 1 — Dados (completada)](#8-fase-1--dados-completada)
9. [Mejoras post-Fase 1](#9-mejoras-post-fase-1)
10. [Fase 2 — Bestiario SRD (completada)](#10-fase-2--bestiario-srd-completada)
11. [Fase 3 — Combate e iniciativa (completada)](#11-fase-3--combate-e-iniciativa-completada)
12. [Fase 4 — Campaña y notas (completada)](#12-fase-4--campaña-y-notas-completada)
13. [Fase 5 — Compendio SRD (completada)](#13-fase-5--compendio-srd-completada)
14. [Fase 6 — Ficha de personaje (completada)](#14-fase-6--ficha-de-personaje-completada)
15. [Fase 7 — Generadores (completada)](#15-fase-7--generadores-completada)
16. [Fase 8 — Mapa ligero (completada)](#16-fase-8--mapa-ligero-completada)
17. [Stack técnico](#17-stack-técnico)
18. [Estructura de archivos](#18-estructura-de-archivos)
19. [Base de datos (IndexedDB)](#19-base-de-datos-indexeddb)
20. [Rutas y módulos](#20-rutas-y-módulos)
21. [Tema visual](#21-tema-visual)
22. [Comandos útiles](#22-comandos-útiles)
23. [Checklist de progreso](#23-checklist-de-progreso)
24. [Próximos pasos](#24-próximos-pasos)
25. [Notas legales (SRD + assets)](#25-notas-legales-srd--assets)
26. [Referencias externas](#26-referencias-externas)

---

## 1. Resumen del proyecto

**Objetivo:** Crear una aplicación web que integre las herramientas más útiles para dirigir y jugar sesiones de Dungeons & Dragons 5ª edición, sin depender de servicios de pago ni servidores en la nube.

**Principios acordados:**

- **Local-first** — Los datos se guardan en el navegador (IndexedDB), no en un servidor remoto.
- **SRD only** — Contenido de reglas basado en el System Reference Document (legal y gratuito).
- **Hobby** — Proyecto personal; sin presión de monetización inicial.
- **Iterativo** — Cada fase entrega algo usable en mesa real.
- **UI en inglés** — Interfaz, rutas y copy en English (preferencia del autor).
- **Coste $0** — Sin hosting, dominio ni suscripciones al inicio.

**Inspiración / referencias del mercado:**

| App | Qué hace bien | Qué evitamos copiar (por scope) |
|-----|---------------|----------------------------------|
| Foundry VTT | Mapas, combate, automatización | Complejidad y self-hosting |
| Owlbear Rodeo | Mapa + tokens minimalista | — (referencia para Fase 8) |
| Kanka | Wiki de campaña enlazada | — (referencia para Fase 4) |
| D&D Beyond | Fichas oficiales | Ecosistema cerrado y de pago |
| 5etools / dnd5eapi | Compendio SRD | — (fuente de datos) |

---

## 2. Cronología de decisiones

### Sesión 1 — Investigación (29 may 2026)

**Pregunta:** ¿Qué se puede integrar en una app completa de sesión D&D?

**Resultado:** Investigación exhaustiva de funcionalidades agrupadas en:

- Campaña y mundo (NPCs, ubicaciones, facciones, quests, timeline)
- Prep de sesión (8 pasos Lazy DM, encounter builder, generadores)
- En vivo (dados, combate, mapas, audio, notas)
- Compendio SRD (bestiario, hechizos, clases, razas, reglas)
- Fichas de personaje
- Portal del jugador
- Post-sesión (recaps, XP, loot)
- Safety tools (Lines & Veils, X-Card)

**Decisión:** Roadmap en 8 fases, empezando por lo esencial (dados + combate).

---

### Sesión 2 — Viabilidad (29 may 2026)

**Pregunta:** ¿Viable como hobby o tiene posibilidades comerciales?

**Conclusiones:**

| Enfoque | Viabilidad |
|---------|------------|
| Hobby / portfolio | ✅ Alta |
| Side income | 🟡 Media (con nicho claro) |
| Startup / vivir de ello | 🟠 Baja–media |
| "App definitiva de D&D" | 🔴 Baja (scope y competencia) |

**Decisión:** Construir como **hobby**, validar con la propia mesa, monetizar solo si hay tracción real.

---

### Sesión 3 — Coste cero (29 may 2026)

**Pregunta:** ¿Se puede hacer sin invertir dinero?

**Decisión:** Sí. Estrategia **local-first**:

- React + Vite en localhost
- IndexedDB (Dexie) para persistencia
- API SRD gratuita o JSON offline
- Sin backend en la nube al inicio
- Deploy futuro opcional en GitHub Pages (gratis)

---

### Sesión — Git + GitHub Pages (30 may 2026)

**Resultado:**

- Repo público: [DegelCR/DND-App](https://github.com/DegelCR/DND-App) (rama `main`)
- Primer commit: MVP fases 0–8 + React Bits
- **GitHub Pages** configurado con GitHub Actions:
  - Workflow `.github/workflows/deploy-pages.yml` — build en cada push a `main`
  - Deploy a rama **`gh-pages`** vía `peaceiris/actions-gh-pages`
  - `vite.config.ts` — `base: '/DND-App/'` en CI (vía `GITHUB_REPOSITORY`)
  - `App.tsx` — `BrowserRouter basename={import.meta.env.BASE_URL}`
  - `404.html` — copia de `index.html` para rutas SPA al refrescar
- URL pública: [https://degelcr.github.io/DND-App/](https://degelcr.github.io/DND-App/)

**Estado:** ✅ Repo + deploy activos. Activar Pages una vez en Settings → Branch `gh-pages` / root.

---

### Sesión 4 — Plan de trabajo (29 may 2026)

**Resultado:** Plan detallado en 8 fases (0–8) con tareas, entregables y criterios de "hecho".

**Decisión:** Empezar por **Fase 0 — Fundación**.

---

### Sesión 5 — Implementación Fase 0 (29 may 2026)

**Resultado:** Proyecto scaffold completo, build verificado, dev server funcional en `http://localhost:5173`.

**Estado:** ✅ Fase 0 completada.

---

### Sesión 6 — Implementación Fase 1: Dados (30 may 2026)

**Resultado:** Módulo de dados completo con motor de tiradas, historial IndexedDB, UI y animación shake.

**Estado:** ✅ Fase 1 completada.

---

### Sesión 7 — UI en inglés (30 may 2026)

**Pregunta:** Preferencia de idioma para la interfaz.

**Decisión:** Toda la UI pasa a **inglés** (labels, rutas, mensajes, README).

**Cambios:**
- Rutas: `/dice`, `/bestiary`, `/combat`, `/session`, `/compendium`
- Redirects legacy desde rutas en español (`/dados` → `/dice`, etc.)
- `index.html` → `lang="en"`
- `REGISTRO.md` se mantiene en español (documentación interna del proyecto)

---

### Sesión 8 — Animación Lottie fumble (30 may 2026)

**Recurso:** [Devil D20 Fumble — Holli Lozinguez](https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20) (Lottie Simple License).

**Decisión:** Integrar animación en **natural 1** del d20.

**Implementado:**
- Dependencia `lottie-react`
- Componente `FumbleAnimation.tsx` (lazy-loaded, code-split ~317 KB)
- Fallback 😈 si falta el archivo JSON
- Créditos en Home
- Instrucciones en `public/animations/README.md`

**Pendiente manual:** Descargar **Optimized Lottie JSON** y guardar como `public/animations/devil-d20-fumble.json` (LottieFiles bloquea descarga automática vía script).

---

### Sesión 9 — Fase 5: Compendio SRD (29 may 2026)

**Resultado:** Módulo compendio con 6 categorías SRD, buscador global, cache IndexedDB (Dexie v5).

**Estado:** ✅ Fase 5 completada.

---

### Sesión 10 — Fase 6: Ficha de personaje (30 may 2026)

**Origen:** Port del proyecto **Forja del Héroe** (`C:\Users\Fran\Desktop\pagina web`) — wizard Next.js ya existente con ficha estilo pergamino.

**Decisiones de diseño:**

| Tema | Decisión |
|------|----------|
| Integración | Port a DND App (Vite + React Router), no app separada |
| Estilo visual | **Opción A** — ficha pergamino dentro del layout oscuro de la app |
| Cursor / FX | ❌ Sin cursor espada, sin animación slash, sin partículas (Embers) |
| Idioma UI | **English** (Forja estaba en español) |
| Persistencia | IndexedDB (`characters`), múltiples PCs (Forja usaba `localStorage` v3) |
| Audio | Descartado para esta fase (Spotify/Pocket Bard → backlog) |

**Implementado:**

- Wizard 9 pasos: basics → race → class → background → stats → skills → spells → gear → sheet
- Ficha oficial PDF-style (`OfficialCharacterSheet.tsx`)
- Reglas SRD vía API `/api/2014/` + subclases/backgrounds PHB en `extra-data.ts`
- Rutas `/characters/new`, `/characters/:id`
- Dexie schema v6
- Fix boot: `initDatabase()` con promesa singleton (StrictMode dev)

**Estado:** ✅ Fase 6 completada.

---

### Sesión 11 — Fase 7: Generadores (30 may 2026)

**Implementado:**

- Tabs: Names, Loot, Quick NPC, Encounter
- Nombres por categoría (personaje, NPC, lugar, taberna)
- Loot por tier 1–4 (monedas, gemas, arte, mágico)
- NPC rápido con rol, rasgo, gancho y línea de diálogo
- Encounter random usando cache SRD del Bestiario
- Copy al portapapeles en todos los paneles
- Ruta `/generators`, módulo `ready` en nav

**Estado:** ✅ Fase 7 completada.

---

### Sesión 12 — Fase 8: Mapa ligero (30 may 2026)

**Implementado:**

- Upload de imagen de mapa (PNG/JPG/WebP, max 15 MB)
- Grid configurable (tamaño, offset con flechas, ft/casilla)
- Tokens arrastrables con etiquetas editables
- Niebla manual (Fog / Reveal) persistida en canvas PNG
- Herramienta Measure (distancia en squares y feet)
- Pan, zoom con scroll, varios mapas guardados en IndexedDB
- Ruta `/map`, Dexie v7 (`battleMaps`)

**Estado:** ✅ Fase 8 completada. Roadmap MVP 0–8 cerrado.

---

### Sesión 13 — Sync docs + fix UI Generators (29 may 2026)

- Fix botones negros en `/generators`: `gold-600` → `gold-500` (color no definido en tema)
- Tabs y botones Copy con mejor contraste
- REGISTRO/README sincronizados: fases 7–8, Dexie v7, rutas, árbol, índice

---

### Sesión 14 — React Bits UI (30 may 2026)

**Origen:** [React Bits](https://reactbits.dev) — componentes animados (MIT + Commons Clause).

**Integrado:**

| Componente | Ubicación | Función |
|------------|-----------|---------|
| Letter Glitch | `Sidebar.tsx` | Fondo animado del menú lateral |
| GlowCard (Magic Bento) | `ModuleCard.tsx` | Borde dorado que sigue el cursor |
| Folder | `MonsterSidebar.tsx` | Carpeta favoritos/recientes en Bestiary |
| Evil Eye | `CriticalAnimation.tsx` | Animación **natural 20** (WebGL, lazy) |

**Dependencia nueva:** `ogl` (solo Evil Eye).

**Código:** `src/components/reactbits/` — adaptado al tema oscuro, sin React Bits Pro.

**Estado:** ✅ Integración inicial completada. Letter Glitch ajustable sin afectar otros módulos.

---

## 3. Investigación inicial

### 3.1 Ciclo de una sesión D&D

```
PRE-SESIÓN          EN VIVO              POST-SESIÓN
──────────          ───────              ───────────
Revisar campaña  →  Recap + strong start → Recap
Planificar escenas  Exploración/social     Actualizar mundo
Preparar combate    Combate                Planificar siguiente
Mapas/audio         Notas + improvisación
```

### 3.2 Catálogo de funcionalidades identificadas

#### Imprescindibles (MVP)
- [x] Tirador de dados (ventaja/desventaja, historial)
- [x] Tracker de iniciativa + HP + condiciones
- [x] Bestiario SRD
- [x] Notas de sesión
- [x] Compendio básico (hechizos, condiciones, reglas)

#### Muy deseadas
- [x] Ficha de personaje
- [ ] Encounter builder (parcial: generador random en Fase 7)
- [x] Generadores (nombres, loot, NPC, encounter)
- [x] Mapa + tokens + fog of war (upload — Fase 8)
- [ ] Audio ambiente
- [ ] Portal del jugador
- [x] Recap post-sesión

#### Completitud "pro"
- [ ] Wiki enlazada (NPCs ↔ lugares ↔ quests)
- [ ] Timeline + calendario in-game
- [ ] Facciones y relaciones
- [ ] Handouts PDF
- [ ] Sync multijugador realtime
- [ ] Homebrew editor
- [ ] Safety tools
- [ ] Scheduling de sesiones

### 3.3 Metodología Lazy DM (8 pasos de prep)

Referencia: [Sly Flourish — Lazy GM Resource Document](https://slyflourish.com/lazy_gm_resource_document.html)

1. Revisar personajes
2. Crear un strong start
3. Esquema de escenas posibles
4. Definir 10 secretos/pistas
5. Desarrollar locaciones fantásticas
6. Esquematizar NPCs importantes
7. Elegir monstruos relevantes
8. Seleccionar recompensas mágicas

> Esto guiará el diseño del módulo **Sesión** (Fase 4).

### 3.4 Fuente de datos SRD

- **API REST:** https://www.dnd5eapi.co/api
- **GraphQL:** https://www.dnd5eapi.co/graphql
- **Repos:** [5e-srd-api](https://github.com/5e-bits/5e-srd-api) + [5e-database](https://github.com/5e-bits/5e-database)
- **Endpoints:** classes, races, spells, monsters, equipment, conditions, skills, feats, magic-items, rules, backgrounds, etc.
- **Licencia API:** MIT | **Datos:** SRD CC-BY-4.0

---

## 4. Análisis de viabilidad

### Mercado TTRPG (~2024–2025)
- Mercado global TTRPG: ~**$1.9–2.4 mil millones USD**
- Uso de VTT/herramientas digitales: ~**44–55%** de campañas
- Crecimiento sostenido; digital complementa (no reemplaza) lo físico

### Competidores principales
- **Wizards / D&D Beyond** — Contenido oficial, suscripción
- **Foundry VTT** — $50 one-time, módulos, automatización profunda
- **Roll20** — Browser, freemium, marketplace
- **Owlbear Rodeo** — Mapa ligero, freemium por storage
- **Kanka / Quill / DungeonManager** — Gestión de campaña

### Ángulos de oportunidad identificados
- Todo-en-uno **ligero** (menos pestañas abiertas)
- **Session Runner** integrado para DM
- **Offline-first** / mesa física con tablet
- Mercado **hispanohablante** poco cubierto
- **Homebrew-first** para mesas con contenido propio

### Modelos de ingreso (si algún día se monetiza)
- Freemium (1 campaña gratis)
- Suscripción $3–10/mes por DM
- One-time $15–50
- Patreon / tip jar (cubrir hosting)

> **Nota:** Vercel Hobby prohíbe uso comercial; si se monetiza, habría que migrar a plan de pago u otro hosting.

---

## 5. Estrategia sin coste ($0)

### Stack elegido (todo gratuito)

| Componente | Tecnología | Coste |
|------------|------------|-------|
| Editor | Cursor / VS Code | $0 |
| Código | GitHub (repos públicos) | $0 |
| Frontend | React + Vite + Tailwind | $0 |
| Estado | Zustand | $0 |
| Persistencia | Dexie (IndexedDB) | $0 |
| Datos SRD | dnd5eapi.co o JSON local | $0 |
| Animaciones | lottie-react (fumble, lazy) | $0 |
| Hosting local | localhost (`npm run dev`) | $0 |
| Hosting público | GitHub Pages | $0 |

### Cuándo SÍ costaría dinero (evitable al inicio)
- Dominio propio → usar `usuario.github.io`
- Supabase/Vercel Pro → solo si monetizas o escalas
- Contenido oficial D&D → usar SRD + homebrew
- App Store / Play Store → usar PWA

### Multijugador gratis (fases futuras)
- Mesa física: una sola tablet, sin sync
- Online: Discord + compartir pantalla
- LAN: WebSocket en PC local (misma WiFi)
- Nube: Supabase free tier (solo si hace falta)

---

## 6. Plan de trabajo completo

### Resumen de fases

| Fase | Nombre | Duración est. | Estado |
|------|--------|---------------|--------|
| **0** | Fundación | 2–3 días | ✅ Completada |
| **1** | Dados | 3–4 días | ✅ Completada |
| **2** | Bestiario SRD | 5–7 días | ✅ Completada |
| **3** | Combate e iniciativa | 7–10 días | ✅ Completada |
| **4** | Campaña y notas | 5–7 días | ✅ Completada |
| **5** | Compendio SRD | 5–7 días | ✅ Completada |
| **6** | Ficha de personaje | 7–10 días | ✅ Completada |
| **7** | Generadores | 4–5 días | ✅ Completada |
| **8** | Mapa ligero (opcional) | 7–10 días | ✅ Completada |

**Meta MVP usable:** Fases 0–4 — ✅ **alcanzada** (may 2026). **Fases 5–8** completadas — **roadmap MVP completo**.

---

### Fase 1 — Dados (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 1.1 | Motor de dados (`2d6+3`, ventaja/desventaja) | `src/lib/dice.ts` |
| 1.2 | UI selector + modificador | Panel de dados |
| 1.3 | Historial (últimas 20 tiradas) | Log en IndexedDB |
| 1.4 | Tiradas rápidas preset | Botones d20, d100, etc. |
| 1.5 | Animación shake al tirar | Feedback visual |
| 1.6 | UI en inglés + rutas `/dice`… | Migración i18n |
| 1.7 | Animación Lottie en pifia (nat 1) | `FumbleAnimation.tsx` |

**Criterio de hecho:** Tirar `1d20+5` con ventaja, ver historial tras recargar, natural 1 muestra animación (o fallback). ✅

---

### Fase 2 — Bestiario SRD (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 2.1 | Cachear monstruos SRD localmente | `src/lib/srd-api.ts` + Dexie v2 |
| 2.2 | Lista con búsqueda y filtro CR | UI listado |
| 2.3 | Vista stat block completa | Detalle monstruo |
| 2.4 | Botón "Add to combat" | Cola → Combat (Fase 3) |
| 2.5 | Favoritos / recientes | Atajos DM |

**Criterio de hecho:** Buscar monstruo, filtrar por CR, ver stat block, favoritos/recientes persisten, build OK. ✅

---

### Fase 3 — Combate e iniciativa (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 3.1 | CRUD encuentros | Dexie + UI sidebar |
| 3.2 | Añadir PC / monstruo / NPC | Formulario + bestiario |
| 3.3 | Tirar iniciativa | Auto-orden |
| 3.4 | Tracker turno, ronda, HP | UI combate |
| 3.5 | Condiciones | Tags de estado |
| 3.6 | Marcar derrotado / ocultar HP | Controles DM |
| 3.7 | Log de combate | Historial |
| 3.8 | Importar desde bestiario | `pending_combat_monster` |

**Criterio de hecho:** Crear encuentro, añadir combatientes, tirar iniciativa, trackear turnos/HP, log persiste tras recargar. ✅

---

### Fase 4 — Campaña y notas (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 4.1 | CRUD campañas | Selector |
| 4.2 | Sesiones numeradas | Lista |
| 4.3 | Editor de notas | Markdown simple |
| 4.4 | Quick notes con timestamp | Botón + nota |
| 4.5 | Recap post-sesión | Campo recap |
| 4.6 | Pool secretos/pistas (10) | Lazy DM — **por campaña** |
| 4.7 | Strong start + checklist prep | Template |

**Criterio de hecho:** Campaña + sesiones persisten; notas, recap, prep y quick notes tras recargar. ✅

---

### Fase 5 — Compendio SRD (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 5.1 | Cache índices SRD (6 categorías) | `src/lib/compendium-api.ts` + Dexie v5 |
| 5.2 | Hechizos, clases, razas, condiciones | Pestañas por categoría |
| 5.3 | Equipamiento y reglas SRD | Listado + detalle |
| 5.4 | Buscador global | Search ≥2 chars cross-category |
| 5.5 | Filtro nivel de hechizos | Cantrips + levels 1–9 |
| 5.6 | Vista detalle normalizada | `CompendiumDetailView.tsx` |

**Criterio de hecho:** Buscar hechizo globalmente, filtrar por nivel, ver detalle de condición/clase, cache persiste tras recargar. ✅

---

### Fase 6 — Ficha de personaje (completada)

| # | Tarea | Entregable |
|---|-------|------------|
| 6.1 | Port wizard Forja del Héroe | `CharacterWizard.tsx` |
| 6.2 | Reglas + validación + API SRD | `src/lib/character/` |
| 6.3 | Stats, skills, hechizos SRD | Pasos 5–7 del wizard |
| 6.4 | Ficha pergamino oficial | `OfficialCharacterSheet.tsx` + CSS |
| 6.5 | CRUD múltiples personajes | Dexie v6 + sidebar |
| 6.6 | UI English, sin cursor/slash | `character-module.css` scoped |

**Criterio de hecho:** Crear PC completo, guardar, recargar, editar, ver ficha pergamino, build OK. ✅

---

### Fase 7 — Generadores (completada)

Nombres, NPC rápido, loot por tier, encounter random SRD.

**Ruta:** `/generators`  
**Estado:** ✅ Completada (30 may 2026)

| # | Tarea | Estado |
|---|-------|--------|
| 7.1 | Nombres (personaje, NPC, lugar, taberna) | ✅ |
| 7.2 | Loot por tier (1–4, estilo DMG simplificado) | ✅ |
| 7.3 | NPC rápido (rol, rasgo, gancho, línea) | ✅ |
| 7.4 | Encounter random (monstruos cache Bestiary) | ✅ |
| 7.5 | UI tabs + copy al portapapeles | ✅ |
| 7.6 | Nav + ruta + build | ✅ |

**Archivos clave:**
- `src/lib/generators/` — names, loot, npc, encounter, random
- `src/types/generators.ts`
- `src/features/generators/GeneratorsPage.tsx` + components

**Nota:** Sin Dexie v7 — generación 100% client-side; encounter usa cache SRD de Bestiary.

---

### Fase 8 — Mapa ligero (completada)

Upload mapa, grid, tokens drag & drop, fog of war manual, regla de medición.

**Ruta:** `/map`  
**Estado:** ✅ Completada (30 may 2026)

| # | Tarea | Estado |
|---|-------|--------|
| 8.1 | Upload PNG/JPG/WebP (max 15 MB) | ✅ |
| 8.2 | Grid overlay (tamaño, offset, toggle) | ✅ |
| 8.3 | Tokens drag & drop + etiquetas | ✅ |
| 8.4 | Fog manual (pintar / revelar) | ✅ |
| 8.5 | Regla de medición (sq + ft) | ✅ |
| 8.6 | Persistencia IndexedDB Dexie v7 | ✅ |
| 8.7 | Pan/zoom, nav, build | ✅ |

**Archivos clave:**
- `src/types/map.ts`
- `src/lib/map/utils.ts`
- `src/features/map/` — MapPage, useBattleMaps, MapCanvas, MapToolbar, MapSidebar
- Dexie v7: tabla `battleMaps`

**Nota:** Solo upload (core Owlbear-style). Lienzo/dibujo → backlog futuro.

---

## 7. Fase 0 — Fundación (completada)

**Fecha:** 29 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 0.1 | Scaffold Vite + React + TypeScript | ✅ |
| 0.2 | Tailwind v4 + tema oscuro D&D | ✅ |
| 0.3 | Layout sidebar + área principal | ✅ |
| 0.4 | Dexie — esquema DB v1 | ✅ |
| 0.5 | Estructura de carpetas | ✅ |
| 0.6 | Home dashboard + páginas placeholder | ✅ |
| 0.7 | React Router — 6 rutas | ✅ |
| 0.8 | Zustand — store global | ✅ |
| 0.9 | Alias `@/` en imports | ✅ |
| 0.10 | README.md | ✅ |
| 0.11 | Boot con init DB + manejo de errores | ✅ |

### Dependencias instaladas

**Producción (actualizado):**
- `react` ^19.2.6
- `react-dom` ^19.2.6
- `react-router-dom` ^7.16.0
- `zustand` ^5.0.14
- `dexie` ^4.4.3
- `lottie-react` ^2.4.1
- `ogl` ^1.0.11 (Evil Eye / React Bits)

**Desarrollo:**
- `vite` ^8.0.12
- `typescript` ~6.0.2
- `tailwindcss` ^4.3.0
- `@tailwindcss/vite` ^4.3.0
- `@vitejs/plugin-react` ^6.0.1
- ESLint + plugins

### Archivos creados en Fase 0

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── ModuleCard.tsx
│       ├── PageHeader.tsx
│       └── PlaceholderPage.tsx
├── features/
│   ├── home/HomePage.tsx
│   ├── dice/DicePage.tsx
│   ├── bestiary/BestiaryPage.tsx
│   ├── combat/CombatPage.tsx
│   ├── session/SessionPage.tsx
│   └── compendium/CompendiumPage.tsx
├── db/index.ts
├── lib/navigation.ts
├── stores/appStore.ts
└── types/index.ts

vite.config.ts
tsconfig.app.json
index.html
README.md
REGISTRO.md          ← este archivo
```

### Archivos eliminados
- `src/App.css` (reemplazado por Tailwind)

---

## 8. Fase 1 — Dados (completada)

**Fecha:** 30 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 1.1 | Motor `rollDice()` con ventaja/desventaja | ✅ |
| 1.2 | Parser expresiones (`2d6+3`) | ✅ |
| 1.3 | UI: selector dado, cantidad, modificador | ✅ |
| 1.4 | Tiradas rápidas (d20, ventaja, desventaja, d100, 2d6) | ✅ |
| 1.5 | Historial persistente (20 tiradas max) | ✅ |
| 1.6 | Detección crítico/pifia en d20 | ✅ |
| 1.7 | Animación shake al tirar | ✅ |
| 1.8 | Módulo marcado `ready` en navegación | ✅ |
| 1.9 | UI traducida a inglés | ✅ |
| 1.10 | Animación Lottie en pifia (nat 1) | ✅ (requiere JSON manual) |
| 1.11 | Animación nat 20 (Evil Eye, React Bits) | ✅ |

### Archivos creados/modificados

```
src/lib/dice.ts
src/features/dice/DicePage.tsx
src/features/dice/useDiceRolls.ts
src/features/dice/components/DiceRoller.tsx
src/features/dice/components/RollHistory.tsx
src/features/dice/components/FumbleAnimation.tsx   ← Lottie fumble
src/features/dice/components/CriticalAnimation.tsx ← Evil Eye nat 20
src/types/index.ts
src/lib/navigation.ts
src/features/home/HomePage.tsx
src/index.css
public/animations/README.md                      ← instrucciones asset
```

### Funcionalidades

- Standard dice: d4, d6, d8, d10, d12, d20, d100
- Count: 1–20 dice
- Modifier: ± via stepper
- Advantage / disadvantage (1d20 only)
- Custom expression: `1d20+5`, `2d6+3`, etc.
- History: last 20 rolls, timestamps, critical/fumble highlights
- Clear history button
- **Natural 1:** Lottie devil-d20 animation (or 😈 fallback)
- **Natural 20:** Evil Eye animation (React Bits, lazy) + green highlight
- Shake animation on every roll
- UI language: **English**

### Dependencia añadida en Fase 1

- `lottie-react` ^2.4.1

---

## 9. Mejoras post-Fase 1

### 9.1 Internacionalización (UI → English)

| Antes (ES) | Ahora (EN) |
|------------|------------|
| `/dados` | `/dice` |
| `/bestiario` | `/bestiary` |
| `/combate` | `/combat` |
| `/sesion` | `/session` |
| `/compendio` | `/compendium` |
| Mesa de Campaña | Campaign Table |
| Próximamente | Coming soon |

Las rutas en español redirigen automáticamente (`App.tsx`).

### 9.2 Animación fumble (Lottie)

**Flujo:**

```
Roll d20 → shake 🎲 (450 ms)
  → nat 1  → Lottie fumble (o 😈 fallback) + total
  → nat 20 → Evil Eye (React Bits, lazy) + total en verde
```

**Asset requerido (descarga manual):**

1. [Devil D20 Fumble](https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20)
2. Download → **Optimized Lottie JSON** (~32 KB)
3. Guardar en: `public/animations/devil-d20-fumble.json`

**Optimización:** `FumbleAnimation` se carga con `React.lazy()` — chunk separado ~317 KB, solo al primer fumble.

**Licencia:** [Lottie Simple License](https://lottiefiles.com/page/license) — uso comercial permitido, atribución opcional (enlace en Home).

**Natural 20 (post-MVP):**
- ✅ **Evil Eye** (React Bits) en `CriticalAnimation.tsx` — lazy-loaded, fallback ✨
- Ver §9.3

**Pendiente manual:**
- [ ] Confirmar que el JSON fumble está en el repo o `.gitignore` según preferencia

---

### 9.3 React Bits (UI animada)

**Licencia:** [MIT + Commons Clause](https://github.com/DavidHDev/react-bits) — uso hobby OK; Commons Clause limita SaaS comercial sobre el componente.

| Componente | Archivo | Pantalla |
|------------|---------|----------|
| Letter Glitch | `LetterGlitch.tsx` | Sidebar (fondo) |
| GlowCard | `GlowCard.tsx` | Tarjetas módulos (Home) |
| Folder | `Folder.tsx` | Bestiary sidebar |
| Evil Eye | `EvilEye.tsx` | Dice nat 20 |

Atribución en Home → sección SRD content.

---

## 10. Fase 2 — Bestiario SRD (completada)

**Fecha:** 29 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 2.1 | Cliente API SRD + cache IndexedDB | ✅ |
| 2.2 | Lista con búsqueda y filtro CR | ✅ |
| 2.3 | Vista stat block completa | ✅ |
| 2.4 | Botón "Add to combat" (stub toast) | ✅ |
| 2.5 | Favoritos y recientes (IndexedDB) | ✅ |
| 2.6 | Ruta `/bestiary/:index` | ✅ |
| 2.7 | Dexie schema v2 | ✅ |
| 2.8 | Módulo marcado `ready` en navegación | ✅ |

### Archivos creados/modificados

```
src/lib/srd-api.ts
src/lib/monster-utils.ts
src/types/monster.ts
src/features/bestiary/BestiaryPage.tsx
src/features/bestiary/useBestiary.ts
src/features/bestiary/useMonsterDetail.ts
src/features/bestiary/components/MonsterList.tsx
src/features/bestiary/components/StatBlock.tsx
src/features/bestiary/components/MonsterFilters.tsx
src/features/bestiary/components/MonsterSidebar.tsx
src/db/index.ts
src/lib/navigation.ts
src/App.tsx
src/features/home/HomePage.tsx
```

### Funcionalidades

- Lista de 334 monstruos SRD desde [dnd5eapi.co](https://www.dnd5eapi.co/api/monsters)
- Cache local en IndexedDB (índice + detalles por monstruo)
- Búsqueda por nombre (client-side)
- Filtro por Challenge Rating (sync CR en background)
- Stat block completo: AC, HP, speed, abilities, skills, senses, actions
- Favoritos ★ persistentes
- Recientes (últimos 10) persistentes
- Modo offline: muestra cache + aviso si la API falla
- "Add to combat" → cola `pending_combat_monster` (Fase 3)
- UI language: **English**

---

## 11. Fase 3 — Combate e iniciativa (completada)

**Fecha:** 29 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 3.1 | CRUD encuentros (IndexedDB) | ✅ |
| 3.2 | Añadir PC / NPC / monstruo manual | ✅ |
| 3.3 | Tirar iniciativa (individual + todos) | ✅ |
| 3.4 | Tracker turno, ronda, HP | ✅ |
| 3.5 | Condiciones (6 comunes) | ✅ |
| 3.6 | Derrotado + ocultar HP | ✅ |
| 3.7 | Log de combate | ✅ |
| 3.8 | Import desde bestiario | ✅ |
| 3.9 | Dexie schema v3 | ✅ |
| 3.10 | Módulo marcado `ready` | ✅ |

### Archivos creados/modificados

```
src/types/combat.ts
src/lib/combat.ts
src/features/combat/CombatPage.tsx
src/features/combat/useCombat.ts
src/features/combat/components/EncounterSidebar.tsx
src/features/combat/components/CombatTracker.tsx
src/features/combat/components/CombatantRow.tsx
src/features/combat/components/AddCombatantForm.tsx
src/features/combat/components/CombatLog.tsx
src/features/combat/components/PendingMonsterBanner.tsx
src/db/index.ts
src/types/index.ts
src/lib/navigation.ts
src/features/bestiary/BestiaryPage.tsx
```

### Funcionalidades

- CRUD encuentros con sidebar (crear, renombrar, eliminar, seleccionar)
- Combatientes: PC, NPC, monstruo (nombre, HP, bonus iniciativa, AC)
- Import monstruo SRD desde bestiario vía `settings.pending_combat_monster`
- HP/AC del monstruo desde cache SRD; iniciativa = modificador DEX
- Tirar iniciativa (individual o todos) → orden automático
- Next/Prev turn, incremento de ronda, salta derrotados
- Ajuste HP (+1, −1, +5, −5); auto-derrotado a 0 HP
- Condiciones: Poisoned, Prone, Stunned, Frightened, Grappled, Restrained
- Toggle derrotado y ocultar HP (DM)
- Log con timestamps (turnos, HP, condiciones)
- Persistencia completa en IndexedDB (Dexie v3)
- UI language: **English**

---

## 12. Fase 4 — Campaña y notas (completada)

**Fecha:** 29 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | CRUD campañas | ✅ |
| 4.2 | Sesiones numeradas por campaña | ✅ |
| 4.3 | Editor de notas + preview Markdown ligero | ✅ |
| 4.4 | Quick notes con timestamp | ✅ |
| 4.5 | Recap post-sesión | ✅ |
| 4.6 | Pool 10 secretos/pistas (Lazy DM) | ✅ |
| 4.7 | Strong start + checklist prep | ✅ |
| 4.8 | Dexie schema v4 | ✅ |
| 4.9 | Módulo marcado `ready` | ✅ |

### Decisión de diseño

- **Secretos/pistas:** por **campaña** (10 slots compartidos entre sesiones), alineado con Lazy DM
- **Auto-guardado:** debounce 500 ms en campos de sesión; indicador Saving/Saved
- **Quick notes:** tabla `sessionQuickNotes`, append-only con hora `[HH:MM]`

### Archivos creados/modificados

```
src/types/session.ts
src/lib/markdown-preview.ts
src/features/session/SessionPage.tsx
src/features/session/useSessions.ts
src/features/session/components/CampaignSidebar.tsx
src/features/session/components/SessionListPanel.tsx
src/features/session/components/SessionWorkspace.tsx
src/db/index.ts
src/types/index.ts
src/lib/navigation.ts
src/features/home/HomePage.tsx
```

### Funcionalidades

- Sidebar campañas: crear, renombrar, eliminar, seleccionar
- Lista sesiones numeradas (#1, #2…) por campaña
- Pestañas: Notes (preview MD), Recap, Prep, Quick notes
- Strong start + checklist Lazy GM (8 ítems)
- 10 secretos con checkbox "Revealed"
- Quick notes en vivo con timestamp
- Persistencia IndexedDB (Dexie v4)
- UI language: **English**

---

## 13. Fase 5 — Compendio SRD (completada)

**Fecha:** 29 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 5.1 | Cliente API SRD `/api/2014/` + cache IndexedDB | ✅ |
| 5.2 | 6 categorías: spells, classes, races, conditions, equipment, rules | ✅ |
| 5.3 | Listado con búsqueda por categoría | ✅ |
| 5.4 | Buscador global (≥2 caracteres, todas las categorías) | ✅ |
| 5.5 | Filtro nivel de hechizos (cantrips + 1–9) | ✅ |
| 5.6 | Vista detalle (hechizos, razas con traits, etc.) | ✅ |
| 5.7 | Rutas `/compendium/:category/:index` | ✅ |
| 5.8 | Dexie schema v5 | ✅ |
| 5.9 | Módulo marcado `ready` | ✅ |

### Archivos creados/modificados

```
src/types/compendium.ts
src/lib/compendium-api.ts
src/lib/compendium-utils.ts
src/features/compendium/CompendiumPage.tsx
src/features/compendium/useCompendium.ts
src/features/compendium/useCompendiumDetail.ts
src/features/compendium/components/CompendiumFilters.tsx
src/features/compendium/components/CompendiumList.tsx
src/features/compendium/components/CompendiumDetailView.tsx
src/features/compendium/components/GlobalSearchResults.tsx
src/db/index.ts
src/App.tsx
src/lib/navigation.ts
src/features/home/HomePage.tsx
```

### Funcionalidades

- Índice SRD unificado: hechizos (~319), clases, razas, condiciones, equipamiento, reglas
- Cache local en IndexedDB (índice + detalle bajo demanda)
- Pestañas por categoría + búsqueda en categoría activa
- Búsqueda global cross-category (2+ caracteres)
- Filtro por nivel de hechizo (cantrips incluidos)
- Detalle: hechizos (casting, desc, higher levels), clases, razas (+ traits), condiciones, equipo, reglas
- Modo offline: muestra cache + aviso si la API falla
- UI language: **English**

---

## 14. Fase 6 — Ficha de personaje (completada)

**Fecha:** 30 de mayo de 2026  
**Estado:** ✅ Completada  
**Build:** Verificado (`npm run build` exitoso)  
**Origen:** Port adaptado de **Forja del Héroe** (`pagina web/`)

### Tareas realizadas

| # | Tarea | Estado |
|---|-------|--------|
| 6.1 | Port `lib/` (types, api, validation, class-rules, extra-data) | ✅ |
| 6.2 | Wizard 9 pasos + sidebar resumen | ✅ |
| 6.3 | Skills (`ProficienciesPanel`) + hechizos SRD (`SpellsPanel`) | ✅ |
| 6.4 | Ficha estilo pergamino / PDF (`OfficialCharacterSheet`) | ✅ |
| 6.5 | CRUD personajes IndexedDB (múltiples PCs) | ✅ |
| 6.6 | Rutas `/characters/new`, `/characters/:id` | ✅ |
| 6.7 | Estilo opción A (pergamino en layout oscuro) | ✅ |
| 6.8 | Sin cursor espada / slash / embers | ✅ |
| 6.9 | UI traducida a inglés | ✅ |
| 6.10 | Dexie schema v6 | ✅ |
| 6.11 | Fix `initDatabase()` StrictMode (promesa singleton) | ✅ |
| 6.12 | Módulo marcado `ready` | ✅ |

### Archivos creados/modificados

```
src/lib/character/
├── types.ts
├── constants.ts
├── character.ts
├── api.ts
├── validation.ts
├── class-rules.ts
├── extra-data.ts
├── sheet-helpers.ts
└── index.ts
src/types/character.ts
src/features/characters/
├── CharactersPage.tsx
├── CharacterWizard.tsx
├── useCharacters.ts
├── character-module.css      ← importa base + sheet + official PDF
├── character-base.css
├── character-sheet.css
├── official-character-sheet.css
└── components/
    ├── CharacterSidebar.tsx
    ├── ProficienciesPanel.tsx
    ├── SpellsPanel.tsx
    └── OfficialCharacterSheet.tsx
src/db/index.ts               ← v6 + init fix
src/main.tsx                  ← retry boot + StrictMode cleanup
src/App.tsx
src/lib/navigation.ts
src/features/home/HomePage.tsx
```

### Funcionalidades

- **Wizard 9 pasos:** Basics, Race, Class, Background, Stats, Skills, Spells, Gear, Sheet
- **Razas/clases/backgrounds:** API SRD `/api/2014/` + subclases/backgrounds PHB locales
- **Stats:** array estándar o input manual (3–20), bonificadores de raza
- **Skills:** elección desde `proficiency_choices` + fijos de clase/background
- **Hechizos:** lista SRD por clase, cantrips/conocidos/preparados según reglas
- **Ficha final:** layout tipo ficha oficial 5e (HP, saves, skills, death saves, spells)
- **Varios personajes:** sidebar con lista, crear/editar/eliminar
- **Auto-guardado:** debounce vía `onSave` → IndexedDB al editar
- **Estilo:** pergamino (Cinzel + Crimson Pro) dentro del shell oscuro de la app
- **UI language:** **English**

### Pendiente post-Fase 6 (backlog del port)

- [ ] "Add to combat" desde ficha → módulo Combat (HP/AC/iniciativa)
- [ ] Equipo automático desde API (`starting_equipment_options`)
- [ ] Export PDF mejorado
- [ ] Vincular personaje a campaña (`campaignId` en `CharacterRecord`)

### Proyecto origen (referencia)

El código base vive en `C:\Users\Fran\Desktop\pagina web` (Next.js, `HANDOFF-AGENTE.md`). No se mantiene sincronizado automáticamente; DND App es la versión integrada.

---

## 15. Fase 7 — Generadores (completada)

**Fecha:** 30 de mayo de 2026  
**Ruta:** `/generators`  
**Estado:** ✅ Completada

### Entregables

| Componente | Descripción |
|------------|-------------|
| **Names** | Personaje, NPC, lugar, taberna (1–10) |
| **Loot** | Tesoro por tier 1–4 (monedas, gemas, arte, mágico) |
| **Quick NPC** | Rol, rasgo, gancho, línea de diálogo |
| **Encounter** | Random SRD desde cache del Bestiario |
| **UI** | Tabs + copy al portapapeles |

### Archivos

- `src/lib/generators/` — names, loot, npc, encounter, random
- `src/types/generators.ts`
- `src/features/generators/` — page + 4 componentes

### Notas

- Sin Dexie — generación 100 % client-side
- Botones primarios: `bg-gold-500` (no usar `gold-600`; no está en `@theme`)

---

## 16. Fase 8 — Mapa ligero (completada)

**Fecha:** 30 de mayo de 2026  
**Ruta:** `/map`  
**Estado:** ✅ Completada · **Roadmap MVP 0–8 cerrado**

### Entregables (core upload — estilo Owlbear)

| Herramienta | Función |
|-------------|---------|
| **Upload** | PNG/JPG/WebP, max 15 MB, varios mapas |
| **Grid** | Tamaño, offset (flechas en Pan), ft/casilla, toggle |
| **Tokens** | Colocar, arrastrar, etiquetas editables |
| **Fog / Reveal** | Niebla manual persistida (canvas PNG) |
| **Measure** | Distancia en squares + feet |
| **Viewport** | Pan, scroll zoom, reset view |

### Archivos

- `src/types/map.ts`
- `src/lib/map/utils.ts`
- `src/features/map/` — MapPage, useBattleMaps, MapCanvas, MapToolbar, MapSidebar
- Dexie **v7** — tabla `battleMaps` (imagen + fog como Blob)

### Backlog mapa (no incluido)

- Lienzo en blanco / dibujo de mapas
- Sync con módulo Combat (tokens = combatientes)

---

## 17. Stack técnico

```
┌─────────────────────────────────────────┐
│  Frontend: React 19 + TypeScript        │
│  Build:    Vite 8                       │
│  Estilos:  Tailwind CSS v4              │
│  Routing:  React Router v7              │
│  Estado:   Zustand                      │
│  DB local: Dexie 4 → IndexedDB (schema v7) │
│  Animación: lottie-react + React Bits (ogl) │
│  UI lang:  English                      │
│  Datos:    SRD API (bestiario, compendio, personajes) │
│  Ficha PC: CSS pergamino scoped (.character-module) │
│  Deploy:   GitHub Pages (push main → gh-pages) │
└─────────────────────────────────────────┘
```

### Alias de imports
- `@/` → `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`)

---

## 18. Estructura de archivos

Convención acordada:

| Carpeta | Propósito |
|---------|-----------|
| `src/components/` | UI reutilizable (layout, cards, headers) |
| `src/features/` | Módulos por funcionalidad (dice, combat, etc.) |
| `src/lib/` | Utilidades puras (dice engine, SRD cache, nav) |
| `src/db/` | Esquemas y funciones Dexie |
| `src/stores/` | Stores Zustand |
| `src/types/` | Interfaces TypeScript compartidas |
| `public/animations/` | Assets Lottie (JSON descargado manualmente) |
| `src/components/reactbits/` | Efectos UI adaptados de React Bits |

### Árbol actual (resumido)

```
src/
├── components/layout/          AppLayout, Sidebar (+ Letter Glitch)
├── components/ui/              PageHeader, ModuleCard (+ GlowCard)
├── components/reactbits/       LetterGlitch, GlowCard, Folder, EvilEye
├── features/
│   ├── home/HomePage.tsx
│   ├── dice/
│   │   ├── DicePage.tsx
│   │   ├── useDiceRolls.ts
│   │   └── components/
│   │       ├── DiceRoller.tsx
│   │       ├── RollHistory.tsx
│   │       ├── FumbleAnimation.tsx
│   │       └── CriticalAnimation.tsx
│   ├── bestiary/
│   │   ├── BestiaryPage.tsx
│   │   ├── useBestiary.ts
│   │   ├── useMonsterDetail.ts
│   │   └── components/
│   │       ├── MonsterList.tsx
│   │       ├── MonsterFilters.tsx
│   │       ├── MonsterSidebar.tsx
│   │       └── StatBlock.tsx
│   ├── combat/
│   │   ├── CombatPage.tsx
│   │   ├── useCombat.ts
│   │   └── components/
│   │       ├── EncounterSidebar.tsx
│   │       ├── CombatTracker.tsx
│   │       ├── CombatantRow.tsx
│   │       ├── AddCombatantForm.tsx
│   │       ├── CombatLog.tsx
│   │       └── PendingMonsterBanner.tsx
│   ├── session/
│   │   ├── SessionPage.tsx
│   │   ├── useSessions.ts
│   │   └── components/
│   │       ├── CampaignSidebar.tsx
│   │       ├── SessionListPanel.tsx
│   │       └── SessionWorkspace.tsx
│   └── compendium/
│       ├── CompendiumPage.tsx
│       ├── useCompendium.ts
│       ├── useCompendiumDetail.ts
│       └── components/
│           ├── CompendiumFilters.tsx
│           ├── CompendiumList.tsx
│           ├── CompendiumDetailView.tsx
│           └── GlobalSearchResults.tsx
│   └── characters/
│       ├── CharactersPage.tsx
│       ├── CharacterWizard.tsx
│       ├── useCharacters.ts
│       ├── character-module.css
│       └── components/ …
│   ├── generators/
│       ├── GeneratorsPage.tsx
│       └── components/
│           ├── NameGenerator.tsx
│           ├── LootGenerator.tsx
│           ├── NpcGenerator.tsx
│           └── EncounterGenerator.tsx
│   └── map/
│       ├── MapPage.tsx
│       ├── useBattleMaps.ts
│       └── components/
│           ├── MapCanvas.tsx
│           ├── MapToolbar.tsx
│           └── MapSidebar.tsx
├── lib/character/              ← reglas PC (port Forja del Héroe)
├── lib/generators/             ← names, loot, npc, encounter
├── lib/map/                    ← grid, measure, upload helpers
├── lib/dice.ts
├── lib/combat.ts
├── lib/srd-api.ts
├── lib/compendium-api.ts
├── lib/compendium-utils.ts
├── lib/monster-utils.ts
├── lib/markdown-preview.ts
├── lib/navigation.ts
├── db/index.ts
├── stores/appStore.ts
├── types/index.ts
├── types/combat.ts
├── types/monster.ts
├── types/session.ts
├── types/compendium.ts
├── types/character.ts
├── types/generators.ts
└── types/map.ts

public/
└── animations/
    ├── README.md               ← cómo descargar el JSON
    └── devil-d20-fumble.json   ← ⚠️ pendiente (manual)
```

---

## 19. Base de datos (IndexedDB)

**Nombre de la DB:** `DndAppDatabase`  
**Versión del esquema:** `7`  
**Librería:** Dexie 4

### Tablas

| Tabla | Índices | Uso |
|-------|---------|-----|
| `campaigns` | `++id, name, updatedAt` | Campañas (Fase 4) |
| `sessions` | `++id, campaignId, number, updatedAt` | Sesiones (Fase 4) |
| `diceRolls` | `++id, createdAt` | Historial de dados (Fase 1) |
| `combatEncounters` | `++id, campaignId, isActive, updatedAt` | Encuentros (Fase 3) |
| `combatCombatants` | `++id, encounterId, initiative` | Combatientes (Fase 3) |
| `combatLog` | `++id, encounterId, createdAt` | Log combate (Fase 3) |
| `settings` | `++id, &key` | Config + `pending_combat_monster` |
| `monsterSummaries` | `&index, name, challengeRating, type, source` | Índice SRD (Fase 2) |
| `monsterDetails` | `&index, cachedAt, source` | Detalle monstruo (Fase 2) |
| `monsterFavorites` | `++id, &monsterIndex, source, addedAt` | Favoritos (Fase 2) |
| `monsterRecents` | `++id, monsterIndex, viewedAt` | Recientes (Fase 2) |
| `campaignSecrets` | `++id, campaignId, slot` | Pool Lazy DM (Fase 4) |
| `sessionQuickNotes` | `++id, sessionId, createdAt` | Quick notes (Fase 4) |
| `compendiumSummaries` | `&id, category, index, name, level, source` | Índice compendio (Fase 5) |
| `compendiumDetails` | `&id, category, index, cachedAt, source` | Detalle compendio (Fase 5) |
| `characters` | `++id, name, level, className, raceName, updatedAt` | Personajes PC (Fase 6) |
| `battleMaps` | `++id, name, updatedAt` | Mapas de combate (Fase 8) |

### Interfaces TypeScript

- `Campaign`, `Session` — campaña y sesiones (`src/types/index.ts`; Session extiende prep/recap)
- `CampaignSecret`, `SessionQuickNote`, `PrepChecklist` — Lazy DM (`src/types/session.ts`)
- `CombatEncounter`, `CombatCombatant`, `CombatLogEntry` — combate (`src/types/combat.ts`)
- `MonsterSummary`, `MonsterDetail`, … — bestiario (`src/types/monster.ts`)
- `CompendiumSummary`, `CompendiumDetail` — compendio (`src/types/compendium.ts`)
- `CharacterRecord` + `Character` (data JSON) — personajes (`src/types/character.ts`, `src/lib/character/types.ts`)
- `BattleMapRecord`, `MapToken` — mapas (`src/types/map.ts`)
- `GeneratedName`, `GeneratedLoot`, … — generadores (`src/types/generators.ts`)
- `DiceRollRecord`, `AppSettings`, `NavModule` — compartidos (`src/types/index.ts`)

### Inicialización

- Función `initDatabase()` en `src/db/index.ts` — **promesa singleton** (evita race en React StrictMode dev)
- Se ejecuta al arrancar la app en `src/main.tsx`
- Marca `app_initialized` en settings la primera vez
- Estado expuesto en UI via `useAppStore().dbReady`

---

## 20. Rutas y módulos

| Ruta | Componente | Fase | Estado UI |
|------|------------|------|-----------|
| `/` | `HomePage` | 0 | ✅ Dashboard |
| `/dice` | `DicePage` | 1 | ✅ Full dice roller + Lottie fumble |
| `/bestiary` | `BestiaryPage` | 2 | ✅ SRD monster browser |
| `/bestiary/:index` | `BestiaryPage` | 2 | ✅ Stat block detail |
| `/combat` | `CombatPage` | 3 | ✅ Initiative tracker |
| `/session` | `SessionPage` | 4 | ✅ Campaign + session notes |
| `/compendium` | Redirect → `/compendium/spells` | 5 | ✅ |
| `/compendium/:category` | `CompendiumPage` | 5 | ✅ SRD compendium browser |
| `/compendium/:category/:index` | `CompendiumPage` | 5 | ✅ Entry detail |
| `/characters` | Redirect → `/characters/new` | 6 | ✅ |
| `/characters/new` | `CharactersPage` | 6 | ✅ PC builder wizard |
| `/characters/:id` | `CharactersPage` | 6 | ✅ Edit saved character |
| `/generators` | `GeneratorsPage` | 7 | ✅ Names, loot, NPC, encounter |
| `/map` | `MapPage` | 8 | ✅ Battle map (upload, grid, tokens, fog) |
| `*` | Redirect → `/` | — | ✅ |

**Redirects legacy (español → inglés):**

| Ruta antigua | Redirige a |
|--------------|------------|
| `/dados` | `/dice` |
| `/bestiario` | `/bestiary` |
| `/combate` | `/combat` |
| `/sesion` | `/session` |
| `/compendio` | `/compendium` |

Configuración centralizada en `src/lib/navigation.ts` (`NAV_MODULES`).

---

## 21. Tema visual

**Estilo:** Oscuro, inspirado en mesa de campaña / pergamino envejecido.

### Paleta (Tailwind `@theme`)

| Token | Color | Uso |
|-------|-------|-----|
| `table-950` → `table-100` | Escala marrón/gris cálido | Fondos, texto, bordes |
| `gold-500/400/300` | Dorado | Acentos, **botones primarios**, links activos |
| `blood-500/400` | Rojo oscuro | Errores |

> **Convención botones:** usar solo tokens definidos en `@theme` (`src/index.css`). `gold-600` **no existe** — provoca botones negros/invisibles. Primario: `bg-gold-500 text-table-950 hover:bg-gold-400`. Secundario: `border-table-500 bg-table-800 text-table-100`.

### Tipografía
- **Display:** Georgia, Times New Roman (títulos)
- **Body:** system-ui, Segoe UI (texto general)

### Módulo Characters (pergamino scoped)

- Contenedor `.character-module` — no afecta el resto de la app
- Fuentes Google: **Cinzel** (títulos), **Crimson Pro** (cuerpo)
- Paneles pergamino `#f3e4c8`, bordes rojo oscuro `#922610`
- Ficha final: layout PDF oficial en `official-character-sheet.css`
- **Sin** cursor personalizado ni animaciones slash (decisión explícita)

### Componentes UI base
- `PageHeader` — Cabecera de cada módulo
- `ModuleCard` — Tarjeta en dashboard
- `PlaceholderPage` — "Coming soon" + phase number
- `Sidebar` — Collapsible navigation
- `FumbleAnimation` — Lottie player for nat 1
- `CriticalAnimation` — Evil Eye (React Bits) for nat 20
- `LetterGlitch` / `GlowCard` / `Folder` — React Bits effects (sidebar, cards, bestiary)

---

## 22. Comandos útiles

```bash
# Instalar dependencias (primera vez)
npm install

# Servidor de desarrollo → http://localhost:5173
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview

# Linter
npm run lint
```

### GitHub Pages

```bash
# Clonar y desarrollar
git clone https://github.com/DegelCR/DND-App.git
cd DND-App
npm install
npm run dev

# Simular build de producción (misma base que Pages)
# PowerShell:
$env:GITHUB_REPOSITORY = "DegelCR/DND-App"
npm run build
npm run preview
```

- **Deploy automático:** push a `main` → workflow `deploy-pages.yml` publica `dist/` en rama `gh-pages` (peaceiris/actions-gh-pages)
- **URL:** https://degelcr.github.io/DND-App/
- **Activar Pages (una vez, obligatorio):** [Settings → Pages](https://github.com/DegelCR/DND-App/settings/pages) → Source: **Deploy from a branch** → Branch: **`gh-pages`** → **`/ (root)`** → Save. Sin este paso la URL da 404 aunque el código esté subido.

### Asset Lottie (fumble) — paso manual

1. Abrir https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20
2. Download → **Optimized Lottie JSON**
3. Guardar como `public/animations/devil-d20-fumble.json`
4. Probar: `/dice` → tirar hasta un natural 1

---

## 23. Checklist de progreso

### Fases

- [x] **Fase 0** — Fundación
- [x] **Fase 1** — Dados (+ Lottie fumble, UI English)
- [x] **Fase 2** — Bestiario SRD
- [x] **Fase 3** — Combate e iniciativa
- [x] **Fase 4** — Campaña y notas de sesión
- [x] **Fase 5** — Compendio SRD
- [x] **Fase 6** — Ficha de personaje (port Forja del Héroe)
- [x] **Fase 7** — Generadores
- [x] **Fase 8** — Mapa ligero (upload + grid + tokens + fog)

### Infraestructura

- [x] Proyecto Vite + React + TS
- [x] Tailwind configurado
- [x] React Router
- [x] Dexie / IndexedDB
- [x] Zustand
- [x] Layout + sidebar
- [x] README
- [x] REGISTRO (este documento)
- [x] UI en inglés
- [x] Integración Lottie (código)
- [ ] Asset `devil-d20-fumble.json` descargado
- [x] Git inicializado + push a GitHub
- [x] Deploy GitHub Pages (workflow + Vite base)
- [x] Cache SRD offline
- [ ] PWA (instalable en móvil)

---

## 24. Próximos pasos

### Siguiente — Post-MVP / backlog

Roadmap de fases completado. Prioridades sugeridas:
- **Add to combat** desde ficha de personaje → tracker (Fase 3)
- **Audio ambiente** — archivos locales MP3/OGG (Spotify/Pocket Bard descartados por ahora)
- Modo PWA para tablet en mesa física
- **Homebrew & import externo** (ver §24.1)

### Nota: Spotify / música ambiente

**¿Se puede integrar Spotify?** Parcialmente, con limitaciones:

| Opción | Viabilidad | Notas |
|--------|------------|-------|
| Reproductor Spotify embebido “gratis” | ❌ No | Spotify no permite redistribuir su catálogo; cada oyente necesita cuenta |
| Spotify Web Playback SDK | 🟡 Sí (Premium) | Cada usuario debe iniciar sesión con **su propio** Premium; el DM puede controlar playback en sesión |
| Archivos locales (MP3/OGG) | ✅ Ideal para $0 | Encaja con local-first; el DM sube sus pistas ambiente |
| Enlace externo a Spotify | ✅ Trivial | Abrir playlist en otra pestaña — cero integración |

Para hobby + coste $0, la opción más limpia es **archivos locales** o **link externo**. Spotify SDK requiere app en [Spotify Developer Dashboard](https://developer.spotify.com/), OAuth, y solo funciona con Premium por usuario.

---

### 24.1 Homebrew e import externo (fase futura)

**Objetivo:** Permitir monstruos/contenido creados fuera de la app (homebrew de mesa, JSON de terceros, export de otras herramientas) junto al SRD.

**Diseño previsto (sin implementar aún):**

| Aspecto | Enfoque |
|---------|---------|
| **Fuente de datos** | Campo `source: 'srd' \| 'homebrew'` en tipos (`src/types/monster.ts` ya preparado) |
| **Almacenamiento** | Tabla Dexie `homebrewMonsters` o reutilizar `monsterDetails` con `source: 'homebrew'` |
| **Import** | JSON manual (drag & drop o file picker) compatible con formato API SRD o schema simplificado |
| **UI** | Pestaña "Homebrew" en bestiario; badge en lista; filtro por fuente |
| **Editor** | Formulario básico o JSON editor (fase posterior) |
| **Combate** | Misma interfaz que SRD al añadir al tracker (Fase 3) |

**Casos de uso:**
- Monstruos de aventuras caseras
- NPCs re-skinned con stat block propio
- Import desde archivos exportados (5etools JSON subset, etc.)

**Restricciones legales:** El usuario es responsable del contenido homebrew; la app no distribuye material con copyright de WotC fuera del SRD.

---

## 25. Notas legales (SRD + assets)

Esta aplicación **no está afiliada ni respaldada por Wizards of the Coast**.

### SRD (reglas D&D)
- Reglas base de D&D 5e (SRD 5.1 / 5.2)
- Monstruos, hechizos y clases incluidos en el SRD
- Licencia: **Creative Commons BY 4.0** (atribución requerida)

### Animaciones Lottie

| Asset | Autor | Licencia | Uso en app |
|-------|-------|----------|------------|
| [Devil D20 Fumble](https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20) | Holli Lozinguez | [Lottie Simple License](https://lottiefiles.com/page/license) | Natural 1 en d20 |

- Uso comercial: permitido
- Atribución: no obligatoria (enlace en Home como cortesía)

### React Bits (UI animada)

| Fuente | Licencia | Uso en app |
|--------|----------|------------|
| [React Bits](https://reactbits.dev) / [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | MIT + Commons Clause | Letter Glitch, GlowCard, Folder, Evil Eye |

- Hobby / portfolio: OK
- Commons Clause: no revender el componente como servicio competidor
- Atribución: enlace en Home

### Qué NO se puede usar sin licencia aparte (SRD)
- Marca registrada "Dungeons & Dragons" en branding comercial
- Contenido fuera del SRD (Beholder, Mind Flayer, Artificer, aventuras oficiales, Forgotten Realms)
- Logos oficiales de Wizards of the Coast

### Atribución requerida en la app
> This work includes material from the System Reference Document 5.1/5.2 ("SRD 5.1/5.2") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.1/5.2 is licensed under the Creative Commons Attribution 4.0 International License.

---

## 26. Referencias externas

### Proyecto origen (Fase 6)
- **Forja del Héroe** — `C:\Users\Fran\Desktop\pagina web` (Next.js, wizard D&D 5e)
- Documentación interna: `HANDOFF-AGENTE.md` en ese repo

### APIs y datos
- [D&D 5e SRD API](https://www.dnd5eapi.co/)
- [Documentación API](https://5e-bits.github.io/docs/introduction)
- [SRD en D&D Beyond](https://www.dndbeyond.com/srd)
- [Repo 5e-database](https://github.com/5e-bits/5e-database)

### Herramientas de referencia
- [Foundry VTT](https://foundryvtt.com/)
- [Owlbear Rodeo](https://www.owlbear.rodeo/)
- [Kanka](https://kanka.io/)
- [Quill GM](https://quillgm.com/)
- [Sly Flourish — Lazy GM](https://slyflourish.com/lazy_gm_resource_document.html)
- [donjon — Generadores 5e](https://donjon.bin.sh/5e/random/)

### Animaciones
- [Devil D20 Fumble — LottieFiles](https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20)
- [Lottie Simple License](https://lottiefiles.com/page/license)
- [lottie-react](https://www.npmjs.com/package/lottie-react)
- [React Bits](https://reactbits.dev) — Letter Glitch, Magic Bento, Folder, Evil Eye
- [react-bits repo](https://github.com/DavidHDev/react-bits) — MIT + Commons Clause

### Documentación técnica
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Dexie.js](https://dexie.org/)
- [Zustand](https://zustand.docs.pmnd.rs/)

---

## Plantilla para registrar futuras fases

Copia y rellena al completar cada fase:

```markdown
### Fase X — [Nombre] (completada)

**Fecha inicio:** YYYY-MM-DD
**Fecha fin:** YYYY-MM-DD
**Estado:** ✅ Completada

#### Tareas realizadas
| # | Tarea | Estado |
|---|-------|--------|
| X.1 | ... | ✅ |

#### Archivos nuevos/modificados
- `src/...`

#### Notas / decisiones
- ...

#### Criterio de hecho verificado
- [ ] ...
```

---

## Historial de actualizaciones del documento

| Fecha | Cambios |
|-------|---------|
| 29 may 2026 | Creación inicial — investigación, plan, Fase 0 |
| 30 may 2026 | Fase 1 (dados), UI inglés, Lottie fumble, secciones 8–19 |
| 30 may 2026 | Revisión: plan Fase 1 ampliado, README sincronizado, checklist infra |
| 29 may 2026 | Fase 2 — Bestiario SRD, Dexie v2 |
| 29 may 2026 | Fase 3 — Combate e iniciativa, Dexie v3 |
| 29–30 may 2026 | Fase 4 — Campaña y notas, Dexie v4, MVP 0–4 alcanzado |
| 30 may 2026 | Sync REGISTRO/README, pausa desarrollo, índice y árbol corregidos |
| 29 may 2026 | Fase 5 — Compendio SRD, Dexie v5, buscador global |
| 30 may 2026 | Fase 6 — Character builder (port Forja del Héroe), Dexie v6, fix init StrictMode |
| 30 may 2026 | REGISTRO/README sync Fase 6, tema pergamino scoped, sin cursor/slash |
| 30 may 2026 | Fase 7 — Generadores (names, loot, NPC, encounter), ruta `/generators` |
| 30 may 2026 | Fase 8 — Battle map (upload, grid, tokens, fog, measure), Dexie v7, `/map` |
| 29 may 2026 | Sync REGISTRO/README MVP completo; fix botones Generators (`gold-500`) |
| 30 may 2026 | React Bits (Letter Glitch, GlowCard, Folder, Evil Eye nat 20), dep `ogl` |
| 30 may 2026 | Git push [DegelCR/DND-App](https://github.com/DegelCR/DND-App) + GitHub Pages |
| 30 may 2026 | Sync REGISTRO/README: React Bits, Dexie v7 en stack, nat 20, deploy gh-pages |

---

*Documento vivo — actualizar al finalizar cada fase de desarrollo.*
