export type RollMode = 'normal' | 'advantage' | 'disadvantage'

export interface RollOptions {
  sides: number
  count?: number
  modifier?: number
  mode?: RollMode
  label?: string
}

export interface RollResult {
  expression: string
  rolls: number[]
  d20Rolls?: [number, number]
  modifier: number
  result: number
  mode: RollMode
  isCritical: boolean
  isFumble: boolean
  label?: string
}

const DICE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const
export type DieSides = (typeof DICE_SIDES)[number]

export const STANDARD_DICE: DieSides[] = [...DICE_SIDES]

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

function pickD20(mode: RollMode): { rolls: number[]; d20Rolls: [number, number] } {
  const first = rollDie(20)
  const second = rollDie(20)

  if (mode === 'advantage') {
    return {
      rolls: [Math.max(first, second)],
      d20Rolls: [first, second],
    }
  }

  if (mode === 'disadvantage') {
    return {
      rolls: [Math.min(first, second)],
      d20Rolls: [first, second],
    }
  }

  return { rolls: [first], d20Rolls: [first, first] }
}

export function rollDice(options: RollOptions): RollResult {
  const count = Math.max(1, Math.min(options.count ?? 1, 20))
  const modifier = options.modifier ?? 0
  const mode = options.mode ?? 'normal'
  const sides = options.sides

  let rolls: number[] = []
  let d20Rolls: [number, number] | undefined

  if (sides === 20 && count === 1 && mode !== 'normal') {
    const picked = pickD20(mode)
    rolls = picked.rolls
    d20Rolls = picked.d20Rolls
  } else {
    rolls = Array.from({ length: count }, () => rollDie(sides))
  }

  const sum = rolls.reduce((total, value) => total + value, 0)
  const result = sum + modifier

  const modifierPart =
    modifier === 0 ? '' : modifier > 0 ? `+${modifier}` : `${modifier}`
  const expression =
    count === 1
      ? `1d${sides}${modifierPart}`
      : `${count}d${sides}${modifierPart}`

  const isCritical = sides === 20 && count === 1 && rolls[0] === 20
  const isFumble = sides === 20 && count === 1 && rolls[0] === 1

  return {
    expression,
    rolls,
    d20Rolls,
    modifier,
    result,
    mode,
    isCritical,
    isFumble,
    label: options.label,
  }
}

export function parseDiceExpression(input: string): RollOptions | null {
  const trimmed = input.trim().toLowerCase().replace(/\s/g, '')
  const match = trimmed.match(/^(\d+)d(\d+)([+-]\d+)?$/)

  if (!match) return null

  const count = Number.parseInt(match[1], 10)
  const sides = Number.parseInt(match[2], 10)
  const modifier = match[3] ? Number.parseInt(match[3], 10) : 0

  if (count < 1 || count > 20 || sides < 2) return null

  return { count, sides, modifier }
}

export function rollFromExpression(
  input: string,
  mode: RollMode = 'normal',
  label?: string,
): RollResult | null {
  const parsed = parseDiceExpression(input)
  if (!parsed) return null
  return rollDice({ ...parsed, mode, label })
}

export function formatModifier(modifier: number): string {
  if (modifier === 0) return ''
  return modifier > 0 ? ` + ${modifier}` : ` − ${Math.abs(modifier)}`
}
