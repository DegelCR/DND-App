import type { AbilityKey, Character } from './types'
import { ABILITIES } from './constants'

export function defaultCharacter(): Character {
  return {
    name: '',
    playerName: '',
    level: 1,
    alignment: '',
    concept: '',
    race: null,
    subrace: null,
    raceBonuses: {},
    class: null,
    subclass: null,
    background: null,
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    equipment: '',
    personality: '',
    skillChoices: {},
    skillProficiencies: [],
    proficiencyNotes: '',
    selectedSpells: { cantrips: [], known: [], prepared: [] },
    spellNotes: '',
    classSpellList: null,
    _levelCache: null,
  }
}

export function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(mod: number) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function computeFinalScores(character: Character) {
  const base = { ...character.abilityScores }
  const bonuses = character.raceBonuses || {}
  const final: Record<AbilityKey, number> = { ...base }
  for (const { key } of ABILITIES) {
    final[key] = (base[key] ?? 8) + (bonuses[key] ?? 0)
  }
  return final
}

export function mergeRaceBonuses(
  raceData?: { ability_bonuses?: { ability_score: { index: string }; bonus: number }[] },
  subraceData?: { ability_bonuses?: { ability_score: { index: string }; bonus: number }[] },
) {
  const bonuses: Partial<Record<AbilityKey, number>> = {}
  for (const src of [raceData, subraceData].filter(Boolean)) {
    for (const { ability_score, bonus } of src?.ability_bonuses || []) {
      const key = ability_score.index as AbilityKey
      bonuses[key] = (bonuses[key] || 0) + bonus
    }
  }
  return bonuses
}

/** +1 ability picks chosen by the player (half-elf, variant human). */
export function getFlexibleAbilityPicks(
  bonuses: Partial<Record<AbilityKey, number>>,
  fixed: Partial<Record<AbilityKey, number>> = {},
): AbilityKey[] {
  const picks: AbilityKey[] = []
  for (const { key } of ABILITIES) {
    const total = bonuses[key] ?? 0
    const base = fixed[key] ?? 0
    if (total > base) picks.push(key)
  }
  return picks
}

export function applyFlexibleAbilityPicks(
  raceIndex: string | undefined,
  subraceIndex: string | undefined,
  raceData: Record<string, unknown> | undefined,
  subraceData: Record<string, unknown> | undefined,
  picks: AbilityKey[],
): Partial<Record<AbilityKey, number>> {
  if (raceIndex === 'half-elf') {
    const next: Partial<Record<AbilityKey, number>> = { cha: 2 }
    for (const key of picks.slice(0, 2)) next[key] = (next[key] || 0) + 1
    return next
  }
  if (raceIndex === 'human' && subraceIndex === 'variant-human') {
    const next: Partial<Record<AbilityKey, number>> = {}
    for (const key of picks.slice(0, 2)) next[key] = 1
    return next
  }
  return mergeRaceBonuses(
    raceData as Parameters<typeof mergeRaceBonuses>[0],
    subraceData as Parameters<typeof mergeRaceBonuses>[1],
  )
}

export function initialRaceBonuses(raceIndex: string, raceData: Record<string, unknown>) {
  if (raceIndex === 'half-elf') return { cha: 2 } as Partial<Record<AbilityKey, number>>
  return mergeRaceBonuses(raceData as Parameters<typeof mergeRaceBonuses>[0])
}

export function getProficiencyBonus(level: number) {
  return Math.min(6, Math.max(2, Math.ceil((level || 1) / 4) + 1))
}

export function clampLevel(value: unknown) {
  return Math.min(20, Math.max(1, parseInt(String(value), 10) || 1))
}

export function clampScore(n: number) {
  return Math.min(20, Math.max(3, Number(n) || 8))
}

export function characterSummaryLine(character: Character): string {
  const parts = [
    character.class?.name,
    character.race?.name,
    character.level ? `Lv.${character.level}` : null,
  ].filter(Boolean)
  return parts.join(' · ') || 'New character'
}
