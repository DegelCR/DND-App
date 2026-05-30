import { useCallback, useEffect, useState } from 'react'
import {
  fetchAllCompendiumIndices,
  getCachedSummaries,
} from '@/lib/compendium-api'
import type { CompendiumCategory, CompendiumSummary } from '@/types/compendium'

export function useCompendium(category: CompendiumCategory) {
  const [summaries, setSummaries] = useState<CompendiumSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const refreshSummaries = useCallback(async (cat?: CompendiumCategory) => {
    const cached = await getCachedSummaries(cat)
    setSummaries(cached)
    return cached
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchAllCompendiumIndices()
      await refreshSummaries(category)
      setOffline(false)
    } catch {
      const cached = await refreshSummaries(category)
      if (cached.length > 0) {
        setOffline(true)
        setError(null)
      } else {
        setError('Could not load compendium. Check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [category, refreshSummaries])

  useEffect(() => {
    load()
  }, [load])

  return {
    summaries,
    loading,
    error,
    offline,
    reload: load,
  }
}

export function useCompendiumSearch() {
  const [allSummaries, setAllSummaries] = useState<CompendiumSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        await fetchAllCompendiumIndices()
        const cached = await getCachedSummaries()
        if (!cancelled) setAllSummaries(cached)
      } catch {
        const cached = await getCachedSummaries()
        if (!cancelled) setAllSummaries(cached)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { allSummaries, loading }
}
