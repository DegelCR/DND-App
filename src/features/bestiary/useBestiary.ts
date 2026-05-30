import { useCallback, useEffect, useState } from 'react'
import {
  fetchMonsterIndex,
  getCachedSummaries,
  syncMonsterSummaries,
} from '@/lib/srd-api'
import type { MonsterListItem, MonsterSummary } from '@/types/monster'

export function useBestiary() {
  const [index, setIndex] = useState<MonsterListItem[]>([])
  const [summaries, setSummaries] = useState<MonsterSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState({ done: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const refreshSummaries = useCallback(async () => {
    const cached = await getCachedSummaries()
    setSummaries(cached)
    return cached
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchMonsterIndex()
      setIndex(list)
      const cached = await refreshSummaries()

      if (cached.length < list.length) {
        setSyncing(true)
        await syncMonsterSummaries(list, (done, total) => {
          setSyncProgress({ done, total })
        })
        await refreshSummaries()
        setSyncing(false)
      }
      setOffline(false)
    } catch {
      const cached = await refreshSummaries()
      if (cached.length > 0) {
        setIndex(
          cached.map((s) => ({
            index: s.index,
            name: s.name,
            url: `/api/monsters/${s.index}`,
          })),
        )
        setOffline(true)
        setError(null)
      } else {
        setError('Could not load monsters. Check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [refreshSummaries])

  useEffect(() => {
    load()
  }, [load])

  return {
    index,
    summaries,
    loading,
    syncing,
    syncProgress,
    error,
    offline,
    reload: load,
  }
}
