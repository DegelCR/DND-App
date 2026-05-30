import { Link } from 'react-router-dom'
import { crLabel } from '@/lib/monster-utils'
import type { MonsterSummary } from '@/types/monster'

interface MonsterListProps {
  monsters: MonsterSummary[]
  selectedIndex?: string
  favorites: Set<string>
  loading: boolean
}

export function MonsterList({
  monsters,
  selectedIndex,
  favorites,
  loading,
}: MonsterListProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-table-800"
          />
        ))}
      </div>
    )
  }

  if (monsters.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-table-400">
        No monsters match your filters.
      </p>
    )
  }

  return (
    <ul className="max-h-[calc(100vh-280px)] overflow-y-auto p-2">
      {monsters.map((monster) => {
        const active = monster.index === selectedIndex
        return (
          <li key={monster.index}>
            <Link
              to={`/bestiary/${monster.index}`}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-gold-500/15 text-gold-300'
                  : 'text-table-200 hover:bg-table-800'
              }`}
            >
              <span className="min-w-0 truncate font-medium">
                {favorites.has(monster.index) && (
                  <span className="mr-1.5" aria-label="Favorite">
                    ★
                  </span>
                )}
                {monster.name}
              </span>
              <span className="shrink-0 text-xs text-table-400">
                {crLabel(monster.challengeRating)}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
