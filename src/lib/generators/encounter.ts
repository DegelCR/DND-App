import { getCachedSummaries } from '@/lib/srd-api'
import type { MonsterSummary } from '@/types/monster'
import type { GeneratedEncounter } from '@/types/generators'
import { pick, rollDie } from './random'

export type EncounterDifficulty = GeneratedEncounter['difficulty']

const XP_BUDGET: Record<EncounterDifficulty, number> = {
  easy: 0.5,
  medium: 0.75,
  hard: 1.0,
}

/** Rough XP threshold per character by level (SRD-style simplified). */
function xpThreshold(partyLevel: number, difficulty: EncounterDifficulty): number {
  const base = [0, 25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1150, 1300, 1500, 1800, 2000, 2200, 2500]
  const level = Math.min(20, Math.max(1, partyLevel))
  const perPc = base[level] ?? 2500
  return Math.floor(perPc * 4 * XP_BUDGET[difficulty])
}

function monsterXp(cr: number): number {
  const table: Record<number, number> = {
    0: 10, 0.125: 25, 0.25: 50, 0.5: 100, 1: 200, 2: 450, 3: 700, 4: 1100,
    5: 1800, 6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900, 11: 7200, 12: 8400,
    13: 10000, 14: 11500, 15: 13000, 16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
  }
  return table[cr] ?? 100
}

function crRangeForLevel(partyLevel: number, difficulty: EncounterDifficulty): [number, number] {
  const maxCr = Math.min(20, partyLevel / 2 + (difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1 : 0))
  const minCr = Math.max(0, maxCr - 3)
  return [minCr, maxCr]
}

function filterMonsters(
  summaries: MonsterSummary[],
  minCr: number,
  maxCr: number,
): MonsterSummary[] {
  return summaries.filter((m) => m.challengeRating >= minCr && m.challengeRating <= maxCr)
}

export async function generateEncounter(
  partyLevel: number,
  difficulty: EncounterDifficulty,
): Promise<GeneratedEncounter | { error: string }> {
  const summaries = await getCachedSummaries()
  if (summaries.length === 0) {
    return {
      error: 'No monsters cached. Open Bestiary once while online to index SRD monsters.',
    }
  }

  const [minCr, maxCr] = crRangeForLevel(partyLevel, difficulty)
  let pool = filterMonsters(summaries, minCr, maxCr)
  if (pool.length === 0) {
    pool = summaries.filter((m) => m.challengeRating <= maxCr + 1)
  }
  if (pool.length === 0) {
    return { error: 'No suitable monsters found for this level range.' }
  }

  const budget = xpThreshold(partyLevel, difficulty)
  const monsters: GeneratedEncounter['monsters'] = []
  let spent = 0
  const maxTypes = difficulty === 'hard' ? 3 : 2

  while (monsters.length < maxTypes && spent < budget) {
    const candidate = pick(pool)
    const count =
      candidate.challengeRating >= 5 ? 1 : rollDie(difficulty === 'easy' ? 2 : 4)
    const xp = monsterXp(candidate.challengeRating) * count
    if (spent + xp > budget * 1.25 && monsters.length > 0) break

    const existing = monsters.find((m) => m.name === candidate.name)
    if (existing) {
      existing.count += count
    } else {
      monsters.push({
        name: candidate.name,
        count,
        cr: candidate.challengeRating,
      })
    }
    spent += xp
  }

  if (monsters.length === 0) {
    const fallback = pick(pool)
    monsters.push({ name: fallback.name, count: 1, cr: fallback.challengeRating })
  }

  const summary = monsters.map((m) => `${m.count}× ${m.name} (CR ${m.cr})`).join(', ')

  return {
    partyLevel,
    difficulty,
    monsters,
    summary,
  }
}
