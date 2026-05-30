import type { CombatCombatant } from '@/types/combat'

export const COMMON_CONDITIONS = [
  'Poisoned',
  'Prone',
  'Stunned',
  'Frightened',
  'Grappled',
  'Restrained',
] as const

export type CommonCondition = (typeof COMMON_CONDITIONS)[number]

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollInitiative(initiativeBonus: number): number {
  return rollDie(20) + initiativeBonus
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function sortCombatants<T extends Pick<CombatCombatant, 'initiative' | 'sortOrder' | 'name'>>(
  combatants: T[],
): T[] {
  return [...combatants].sort((a, b) => {
    const aInit = a.initiative ?? -Infinity
    const bInit = b.initiative ?? -Infinity
    if (bInit !== aInit) return bInit - aInit
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.name.localeCompare(b.name)
  })
}

export function advanceTurn(
  activeIndex: number,
  combatants: CombatCombatant[],
): { activeIndex: number; roundDelta: number } {
  if (combatants.length === 0) return { activeIndex: 0, roundDelta: 0 }

  let index = activeIndex
  let roundDelta = 0

  for (let step = 0; step < combatants.length; step++) {
    index = (index + 1) % combatants.length
    if (index === 0) roundDelta = 1
    if (!combatants[index].isDefeated) {
      return { activeIndex: index, roundDelta }
    }
  }

  return { activeIndex, roundDelta: 0 }
}

export function previousTurn(
  activeIndex: number,
  combatants: CombatCombatant[],
): { activeIndex: number; roundDelta: number } {
  if (combatants.length === 0) return { activeIndex: 0, roundDelta: 0 }

  let index = activeIndex
  let roundDelta = 0

  for (let step = 0; step < combatants.length; step++) {
    index = (index - 1 + combatants.length) % combatants.length
    if (index === combatants.length - 1) roundDelta = -1
    if (!combatants[index].isDefeated) {
      return { activeIndex: index, roundDelta }
    }
  }

  return { activeIndex, roundDelta: 0 }
}

export function formatHp(current: number, max: number, hide: boolean): string {
  if (hide) return '???'
  return `${current}/${max}`
}
