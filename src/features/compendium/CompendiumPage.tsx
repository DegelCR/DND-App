import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { COMPENDIUM_CATEGORIES } from '@/lib/compendium-api'
import type { CompendiumCategory } from '@/types/compendium'
import { CompendiumDetailView } from './components/CompendiumDetailView'
import { CompendiumFilters } from './components/CompendiumFilters'
import { CompendiumList } from './components/CompendiumList'
import { GlobalSearchResults } from './components/GlobalSearchResults'
import { useCompendium, useCompendiumSearch } from './useCompendium'
import { useCompendiumDetail } from './useCompendiumDetail'

const DEFAULT_CATEGORY: CompendiumCategory = 'spells'

function isValidCategory(value: string | undefined): value is CompendiumCategory {
  return COMPENDIUM_CATEGORIES.some((c) => c.id === value)
}

export function CompendiumPage() {
  const { category: routeCategory, index: selectedIndex } = useParams<{
    category: string
    index: string
  }>()
  const navigate = useNavigate()

  const activeCategory = isValidCategory(routeCategory) ? routeCategory : DEFAULT_CATEGORY
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  const globalSearch = search.trim().length >= 2
  const { summaries, loading, error, offline, reload } = useCompendium(activeCategory)
  const { allSummaries, loading: searchLoading } = useCompendiumSearch()
  const detailCategory =
    selectedIndex && isValidCategory(routeCategory) ? routeCategory : undefined
  const { detail, loading: detailLoading, error: detailError } = useCompendiumDetail(
    detailCategory,
    selectedIndex,
  )

  const filtered = useMemo(() => {
    if (globalSearch) return []
    const q = search.trim().toLowerCase()
    return summaries.filter((item) => {
      const matchesSearch = !q || item.name.toLowerCase().includes(q)
      const matchesLevel =
        activeCategory !== 'spells' ||
        levelFilter === 'all' ||
        String(item.level) === levelFilter
      return matchesSearch && matchesLevel
    })
  }, [summaries, search, levelFilter, activeCategory, globalSearch])

  function handleCategoryChange(category: CompendiumCategory) {
    navigate(`/compendium/${category}`)
  }

  return (
    <>
      <PageHeader
        title="Compendium"
        description="Spells, classes, races, conditions, equipment, and SRD rules. Cached offline after first load."
        icon="📚"
        actions={
          offline ? (
            <span className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs text-amber-300">
              Offline · showing cache
            </span>
          ) : undefined
        }
      />

      {error && (
        <div className="mx-6 mt-4 flex items-center justify-between gap-4 rounded-lg border border-blood-500/30 bg-blood-500/10 px-4 py-3 text-sm text-blood-400">
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="shrink-0 rounded-lg bg-table-800 px-3 py-1.5 text-table-200 hover:bg-table-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[300px_1fr]">
        <div className="flex max-h-[calc(100vh-12rem)] flex-col rounded-xl border border-table-700 bg-table-900/40">
          <div className="border-b border-table-700 p-4">
            <CompendiumFilters
              search={search}
              category={activeCategory}
              levelFilter={levelFilter}
              onSearchChange={setSearch}
              onCategoryChange={handleCategoryChange}
              onLevelFilterChange={setLevelFilter}
            />
          </div>

          {globalSearch ? (
            <GlobalSearchResults
              query={search}
              allSummaries={allSummaries}
              selectedCategory={routeCategory}
              selectedIndex={selectedIndex}
            />
          ) : (
            <CompendiumList
              items={filtered}
              selectedCategory={routeCategory}
              selectedIndex={selectedIndex}
              loading={loading || searchLoading}
            />
          )}

          {!globalSearch && summaries.length > 0 && (
            <p className="border-t border-table-700 px-4 py-2 text-xs text-table-500">
              {filtered.length} of {summaries.length} in {activeCategory}
            </p>
          )}
        </div>

        <div className="min-w-0">
          {!selectedIndex ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/20 p-8 text-center">
              <span className="text-4xl" aria-hidden="true">
                📚
              </span>
              <p className="mt-4 text-table-300">Select an entry from the list</p>
              <p className="mt-1 text-sm text-table-500">
                {globalSearch
                  ? 'Global search across all SRD categories'
                  : `${summaries.length} entries in ${activeCategory}`}
              </p>
            </div>
          ) : detailLoading ? (
            <div className="animate-pulse rounded-xl border border-table-700 bg-table-900/40 p-8">
              <div className="h-8 w-48 rounded bg-table-800" />
              <div className="mt-4 h-4 w-full rounded bg-table-800" />
              <div className="mt-2 h-4 w-3/4 rounded bg-table-800" />
            </div>
          ) : detailError ? (
            <div className="rounded-xl border border-blood-500/30 bg-blood-500/10 p-6 text-sm text-blood-400">
              {detailError}{' '}
              <Link to={`/compendium/${activeCategory}`} className="text-gold-400 underline">
                Back to list
              </Link>
            </div>
          ) : detail ? (
            <CompendiumDetailView detail={detail} />
          ) : null}
        </div>
      </div>
    </>
  )
}
