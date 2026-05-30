import { useCallback, useEffect, useState } from 'react'
import { db } from '@/db'
import { fetchMonsterDetail } from '@/lib/srd-api'
import type { ContentSource, MonsterDetail } from '@/types/monster'

const MAX_RECENTS = 10
const SOURCE: ContentSource = 'srd'

export function useMonsterDetail(index: string | undefined) {
  const [monster, setMonster] = useState<MonsterDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!index) {
      setMonster(null)
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const detail = await fetchMonsterDetail(index!)
        if (!cancelled) setMonster(detail)
      } catch {
        const cached = await db.monsterDetails.get(index!)
        if (!cancelled) {
          if (cached) {
            setMonster(cached)
          } else {
            setError('Could not load this monster.')
            setMonster(null)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [index])

  const recordView = useCallback(async (monsterIndex: string) => {
    await db.monsterRecents.add({
      monsterIndex,
      source: SOURCE,
      viewedAt: new Date(),
    })

    const count = await db.monsterRecents.count()
    if (count > MAX_RECENTS) {
      const oldest = await db.monsterRecents
        .orderBy('viewedAt')
        .limit(count - MAX_RECENTS)
        .primaryKeys()
      await db.monsterRecents.bulkDelete(oldest)
    }
  }, [])

  useEffect(() => {
    if (monster) recordView(monster.index)
  }, [monster, recordView])

  return { monster, loading, error }
}

export function useMonsterFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    const rows = await db.monsterFavorites.toArray()
    setFavorites(new Set(rows.map((r) => r.monsterIndex)))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleFavorite = useCallback(
    async (monsterIndex: string) => {
      const existing = await db.monsterFavorites.get({ monsterIndex })
      if (existing) {
        await db.monsterFavorites.delete(existing.id!)
      } else {
        await db.monsterFavorites.add({
          monsterIndex,
          source: SOURCE,
          addedAt: new Date(),
        })
      }
      await load()
    },
    [load],
  )

  return { favorites, toggleFavorite }
}

export function useMonsterRecents() {
  const [recents, setRecents] = useState<{ index: string; name: string }[]>([])

  const load = useCallback(async () => {
    const rows = await db.monsterRecents.orderBy('viewedAt').reverse().limit(10).toArray()
    const items = await Promise.all(
      rows.map(async (row) => {
        const summary = await db.monsterSummaries.get(row.monsterIndex)
        const detail = summary ? null : await db.monsterDetails.get(row.monsterIndex)
        return {
          index: row.monsterIndex,
          name: summary?.name ?? detail?.name ?? row.monsterIndex,
        }
      }),
    )
    setRecents(items)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { recents, reload: load }
}

export async function stubAddToCombat(monsterIndex: string, name: string) {
  await db.settings.put({
    key: 'pending_combat_monster',
    value: JSON.stringify({ monsterIndex, name, at: new Date().toISOString() }),
  })
}
