import { useCallback, useEffect, useState } from 'react'
import { fetchCompendiumDetail } from '@/lib/compendium-api'
import type { CompendiumCategory, CompendiumDetail } from '@/types/compendium'

export function useCompendiumDetail(
  category: CompendiumCategory | undefined,
  index: string | undefined,
) {
  const [detail, setDetail] = useState<CompendiumDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!category || !index) {
      setDetail(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchCompendiumDetail(category, index)
      setDetail(data)
    } catch {
      setDetail(null)
      setError('Could not load this entry. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [category, index])

  useEffect(() => {
    load()
  }, [load])

  return { detail, loading, error, reload: load }
}
