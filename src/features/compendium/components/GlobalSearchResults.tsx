import { useMemo } from 'react'
import { CompendiumList } from './CompendiumList'
import type { CompendiumSummary } from '@/types/compendium'
import { COMPENDIUM_CATEGORIES } from '@/lib/compendium-api'

interface GlobalSearchResultsProps {
  query: string
  allSummaries: CompendiumSummary[]
  selectedCategory?: string
  selectedIndex?: string
}

export function GlobalSearchResults({
  query,
  allSummaries,
  selectedCategory,
  selectedIndex,
}: GlobalSearchResultsProps) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allSummaries.filter((item) => item.name.toLowerCase().includes(q))
  }, [allSummaries, query])

  const grouped = useMemo(() => {
    const map = new Map<string, CompendiumSummary[]>()
    for (const item of results) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    return map
  }, [results])

  if (results.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-table-500">
        No results for &ldquo;{query}&rdquo;
      </p>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <p className="px-3 py-2 text-xs text-table-500">
        {results.length} result{results.length === 1 ? '' : 's'} across all categories
      </p>
      {COMPENDIUM_CATEGORIES.map((cat) => {
        const items = grouped.get(cat.id)
        if (!items?.length) return null
        return (
          <div key={cat.id} className="mb-4">
            <h3 className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-400">
              {cat.icon} {cat.label} ({items.length})
            </h3>
            <CompendiumList
              items={items}
              selectedCategory={selectedCategory}
              selectedIndex={selectedIndex}
            />
          </div>
        )
      })}
    </div>
  )
}
