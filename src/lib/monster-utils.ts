const ABILITY_LABELS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function formatCr(cr: number): string {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return String(cr)
}

export function crLabel(cr: number): string {
  return `CR ${formatCr(cr)}`
}

export const CR_OPTIONS: { value: string; label: string; min: number; max: number }[] = [
  { value: 'all', label: 'All CR', min: 0, max: 999 },
  { value: '0-1', label: 'CR 0–1', min: 0, max: 1 },
  { value: '2-4', label: 'CR 2–4', min: 2, max: 4 },
  { value: '5-10', label: 'CR 5–10', min: 5, max: 10 },
  { value: '11-16', label: 'CR 11–16', min: 11, max: 16 },
  { value: '17+', label: 'CR 17+', min: 17, max: 999 },
]

export function matchesCrFilter(cr: number, filter: string): boolean {
  const option = CR_OPTIONS.find((o) => o.value === filter)
  if (!option || option.value === 'all') return true
  return cr >= option.min && cr <= option.max
}

export function abilityRows(monster: {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}) {
  const scores = [
    monster.strength,
    monster.dexterity,
    monster.constitution,
    monster.intelligence,
    monster.wisdom,
    monster.charisma,
  ]
  return ABILITY_LABELS.map((label, i) => ({
    label,
    score: scores[i],
    mod: abilityModifier(scores[i]),
  }))
}
