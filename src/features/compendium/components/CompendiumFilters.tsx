import { COMPENDIUM_CATEGORIES } from '@/lib/compendium-api'
import type { CompendiumCategory } from '@/types/compendium'

interface CompendiumFiltersProps {
  search: string
  category: CompendiumCategory
  levelFilter: string
  onSearchChange: (value: string) => void
  onCategoryChange: (category: CompendiumCategory) => void
  onLevelFilterChange: (value: string) => void
}

const SPELL_LEVELS = ['all', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function CompendiumFilters({
  search,
  category,
  levelFilter,
  onSearchChange,
  onCategoryChange,
  onLevelFilterChange,
}: CompendiumFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="compendium-search" className="sr-only">
          Search compendium
        </label>
        <input
          id="compendium-search"
          type="search"
          placeholder="Search all SRD entries…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-table-600 bg-table-950 px-3 py-2 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {COMPENDIUM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              category === cat.id
                ? 'bg-gold-500/20 text-gold-300'
                : 'bg-table-800 text-table-400 hover:bg-table-700 hover:text-table-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {category === 'spells' && !search.trim() && (
        <div>
          <label htmlFor="spell-level" className="mb-1 block text-xs text-table-500">
            Spell level
          </label>
          <select
            id="spell-level"
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value)}
            className="w-full rounded-lg border border-table-600 bg-table-950 px-3 py-2 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none"
          >
            {SPELL_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level === 'all' ? 'All levels' : level === '0' ? 'Cantrips' : `Level ${level}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
