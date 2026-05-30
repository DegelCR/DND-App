import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { matchesCrFilter } from '@/lib/monster-utils'
import { MonsterFilters } from './components/MonsterFilters'
import { MonsterList } from './components/MonsterList'
import { MonsterSidebar } from './components/MonsterSidebar'
import { StatBlock } from './components/StatBlock'
import { useBestiary } from './useBestiary'
import {
  stubAddToCombat,
  useMonsterDetail,
  useMonsterFavorites,
  useMonsterRecents,
} from './useMonsterDetail'
import { db } from '@/db'

export function BestiaryPage() {
  const { index: selectedIndex } = useParams<{ index: string }>()
  const [search, setSearch] = useState('')
  const [crFilter, setCrFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)

  const { summaries, loading, syncing, syncProgress, error, offline, reload } =
    useBestiary()
  const { monster, loading: detailLoading, error: detailError } =
    useMonsterDetail(selectedIndex)
  const { favorites, toggleFavorite } = useMonsterFavorites()
  const { recents, reload: reloadRecents } = useMonsterRecents()

  const [favoriteNames, setFavoriteNames] = useState<{ index: string; name: string }[]>([])

  useEffect(() => {
    async function loadFavoriteNames() {
      const indices = [...favorites]
      const items = await Promise.all(
        indices.map(async (idx) => {
          const summary = await db.monsterSummaries.get(idx)
          const detail = summary ? null : await db.monsterDetails.get(idx)
          return { index: idx, name: summary?.name ?? detail?.name ?? idx }
        }),
      )
      setFavoriteNames(items)
    }
    loadFavoriteNames()
  }, [favorites])

  useEffect(() => {
    if (monster) reloadRecents()
  }, [monster, reloadRecents])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return summaries.filter((m) => {
      const matchesSearch = !q || m.name.toLowerCase().includes(q)
      const matchesCr = matchesCrFilter(m.challengeRating, crFilter)
      return matchesSearch && matchesCr
    })
  }, [summaries, search, crFilter])

  const showCrFilterHint = crFilter !== 'all' && summaries.length === 0 && syncing

  async function handleAddToCombat() {
    if (!monster) return
    await stubAddToCombat(monster.index, monster.name)
    setToast(`"${monster.name}" queued for combat. Open Combat to add them.`)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <>
      <PageHeader
        title="Bestiary"
        description="Browse SRD monsters with full stat blocks. Cached offline after first load."
        icon="🐉"
        actions={
          offline ? (
            <span className="rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs text-amber-300">
              Offline · showing cache
            </span>
          ) : undefined
        }
      />

      {toast && (
        <div className="mx-6 mt-4 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-300">
          {toast}
        </div>
      )}

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

      {syncing && (
        <div className="mx-6 mt-4 rounded-lg border border-table-700 bg-table-900/60 px-4 py-3">
          <p className="text-sm text-table-300">
            Indexing monsters for search & CR filter…{' '}
            {syncProgress.done}/{syncProgress.total}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-table-800">
            <div
              className="h-full bg-gold-500 transition-all duration-300"
              style={{
                width: `${syncProgress.total ? (syncProgress.done / syncProgress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[280px_1fr_240px]">
        <div className="flex flex-col rounded-xl border border-table-700 bg-table-900/40">
          <div className="border-b border-table-700 p-4">
            <MonsterFilters
              search={search}
              crFilter={crFilter}
              onSearchChange={setSearch}
              onCrFilterChange={setCrFilter}
            />
            {showCrFilterHint && (
              <p className="mt-2 text-xs text-table-500">
                CR filter available once indexing finishes…
              </p>
            )}
          </div>
          <MonsterList
            monsters={filtered}
            selectedIndex={selectedIndex}
            favorites={favorites}
            loading={loading || (summaries.length === 0 && syncing)}
          />
        </div>

        <div className="min-w-0">
          {!selectedIndex ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/20 p-8 text-center">
              <span className="text-4xl" aria-hidden="true">
                🐉
              </span>
              <p className="mt-4 text-table-300">Select a monster from the list</p>
              <p className="mt-1 text-sm text-table-500">
                {summaries.length > 0
                  ? `${summaries.length} SRD monsters cached locally`
                  : 'Loading SRD index…'}
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
              <Link to="/bestiary" className="text-gold-400 underline">
                Back to list
              </Link>
            </div>
          ) : monster ? (
            <StatBlock
              monster={monster}
              isFavorite={favorites.has(monster.index)}
              onToggleFavorite={() => toggleFavorite(monster.index)}
              onAddToCombat={handleAddToCombat}
            />
          ) : null}
        </div>

        <MonsterSidebar favorites={favoriteNames} recents={recents} />
      </div>
    </>
  )
}
