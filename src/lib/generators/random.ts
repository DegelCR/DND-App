export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function pickN<T>(items: readonly T[], count: number): T[] {
  const pool = [...items]
  const result: T[] = []
  const n = Math.min(count, pool.length)
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool[idx])
    pool.splice(idx, 1)
  }
  return result
}

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollDice(count: number, sides: number): number {
  let total = 0
  for (let i = 0; i < count; i++) total += rollDie(sides)
  return total
}

export function chance(percent: number): boolean {
  return Math.random() * 100 < percent
}
