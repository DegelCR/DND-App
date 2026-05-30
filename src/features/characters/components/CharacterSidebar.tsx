import { Link } from 'react-router-dom'
import type { CharacterRecord } from '@/types/character'

interface CharacterSidebarProps {
  characters: CharacterRecord[]
  loading?: boolean
  selectedId?: number
}

export function CharacterSidebar({ characters, loading, selectedId }: CharacterSidebarProps) {
  return (
    <div className="flex flex-col rounded-xl border border-table-700 bg-table-900/40">
      <div className="border-b border-table-700 p-4">
        <Link
          to="/characters/new"
          className="block w-full rounded-lg bg-gold-500/20 py-2 text-center text-sm font-medium text-gold-300 transition-colors hover:bg-gold-500/30"
        >
          + New character
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-table-800" />
          ))}
        </div>
      ) : characters.length === 0 ? (
        <p className="p-4 text-center text-sm text-table-500">No saved characters yet.</p>
      ) : (
        <ul className="flex-1 overflow-y-auto p-2">
          {characters.map((c) => (
            <li key={c.id}>
              <Link
                to={`/characters/${c.id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedId === c.id
                    ? 'bg-gold-500/15 text-gold-300'
                    : 'text-table-300 hover:bg-table-800 hover:text-table-100'
                }`}
              >
                <span className="font-medium">{c.name}</span>
                <span className="mt-0.5 block text-xs text-table-500">
                  {[c.className, c.raceName, c.level ? `Lv.${c.level}` : null]
                    .filter(Boolean)
                    .join(' · ') || 'In progress'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
