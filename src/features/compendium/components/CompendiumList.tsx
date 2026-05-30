import { Link } from 'react-router-dom'
import { getCategoryMeta } from '@/lib/compendium-api'
import { spellLevelLabel } from '@/lib/compendium-utils'
import type { CompendiumSummary } from '@/types/compendium'

interface CompendiumListProps {
  items: CompendiumSummary[]
  selectedCategory?: string
  selectedIndex?: string
  loading?: boolean
}

export function CompendiumList({
  items,
  selectedCategory,
  selectedIndex,
  loading,
}: CompendiumListProps) {
  if (loading) {
    return (
      <div className="flex-1 space-y-2 p-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-table-800" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-table-500">No entries match your search.</p>
    )
  }

  return (
    <ul className="flex-1 overflow-y-auto p-2">
      {items.map((item) => {
        const isSelected =
          selectedCategory === item.category && selectedIndex === item.index
        const meta = getCategoryMeta(item.category)

        return (
          <li key={item.id}>
            <Link
              to={`/compendium/${item.category}/${item.index}`}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? 'bg-gold-500/15 text-gold-300'
                  : 'text-table-300 hover:bg-table-800 hover:text-table-100'
              }`}
            >
              <span className="min-w-0 truncate">{item.name}</span>
              <span className="shrink-0 text-xs text-table-500">
                {item.category === 'spells' && item.level != null
                  ? spellLevelLabel(item.level)
                  : meta.label}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
