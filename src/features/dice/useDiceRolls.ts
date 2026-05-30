import { useCallback, useEffect, useState } from 'react'
import { db } from '@/db'
import type { DiceRollRecord } from '@/types'
import type { RollResult } from '@/lib/dice'

const MAX_HISTORY = 20

export function useDiceRolls() {
  const [history, setHistory] = useState<DiceRollRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadHistory = useCallback(async () => {
    const rolls = await db.diceRolls
      .orderBy('createdAt')
      .reverse()
      .limit(MAX_HISTORY)
      .toArray()
    setHistory(rolls)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const saveRoll = useCallback(
    async (result: RollResult) => {
      const record: DiceRollRecord = {
        expression: result.expression,
        result: result.result,
        rolls: result.rolls,
        modifier: result.modifier,
        label: result.label,
        mode: result.mode,
        isCritical: result.isCritical,
        isFumble: result.isFumble,
        d20Rolls: result.d20Rolls,
        createdAt: new Date(),
      }

      await db.diceRolls.add(record)

      const count = await db.diceRolls.count()
      if (count > MAX_HISTORY) {
        const oldest = await db.diceRolls
          .orderBy('createdAt')
          .limit(count - MAX_HISTORY)
          .primaryKeys()
        await db.diceRolls.bulkDelete(oldest)
      }

      await loadHistory()
    },
    [loadHistory],
  )

  const clearHistory = useCallback(async () => {
    await db.diceRolls.clear()
    setHistory([])
  }, [])

  return { history, loading, saveRoll, clearHistory }
}
