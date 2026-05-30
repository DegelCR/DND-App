import { db } from '@/db'
import { parseCompendiumDetail } from '@/lib/compendium-utils'
import type {
  CompendiumCategory,
  CompendiumCategoryMeta,
  CompendiumDetail,
  CompendiumListItem,
  CompendiumSummary,
} from '@/types/compendium'
import { compendiumId } from '@/types/compendium'
import type { ContentSource } from '@/types/monster'

const API_BASE = 'https://www.dnd5eapi.co/api/2014'
const SOURCE: ContentSource = 'srd'
const INDEX_CACHE_KEY = 'compendium_index_cached_at'
const INDEX_TTL_MS = 7 * 24 * 60 * 60 * 1000

export const COMPENDIUM_CATEGORIES: CompendiumCategoryMeta[] = [
  { id: 'spells', label: 'Spells', endpoint: 'spells', icon: '✨' },
  { id: 'classes', label: 'Classes', endpoint: 'classes', icon: '⚔️' },
  { id: 'races', label: 'Races', endpoint: 'races', icon: '🧝' },
  { id: 'conditions', label: 'Conditions', endpoint: 'conditions', icon: '💫' },
  { id: 'equipment', label: 'Equipment', endpoint: 'equipment', icon: '🛡️' },
  { id: 'rules', label: 'Rules', endpoint: 'rules', icon: '📖' },
]

interface ApiListResponse {
  count: number
  results: CompendiumListItem[]
}

interface ApiTraitRef {
  index: string
  name: string
  url: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`SRD API error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

async function isIndexCacheFresh(): Promise<boolean> {
  const setting = await db.settings.get({ key: INDEX_CACHE_KEY })
  if (!setting) return false
  const cachedAt = new Date(setting.value).getTime()
  return Date.now() - cachedAt < INDEX_TTL_MS
}

function toSummary(category: CompendiumCategory, item: CompendiumListItem): CompendiumSummary {
  return {
    id: compendiumId(category, item.index),
    category,
    index: item.index,
    name: item.name,
    level: item.level,
    source: SOURCE,
  }
}

export async function fetchCategoryIndex(
  category: CompendiumCategory,
): Promise<CompendiumListItem[]> {
  const meta = COMPENDIUM_CATEGORIES.find((c) => c.id === category)
  if (!meta) return []

  const data = await fetchJson<ApiListResponse>(`${API_BASE}/${meta.endpoint}`)
  return data.results.sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchAllCompendiumIndices(): Promise<CompendiumSummary[]> {
  const fresh = await isIndexCacheFresh()
  const cachedCount = await db.compendiumSummaries.count()

  if (fresh && cachedCount > 0) {
    return db.compendiumSummaries.orderBy('name').toArray()
  }

  const allSummaries: CompendiumSummary[] = []

  for (const meta of COMPENDIUM_CATEGORIES) {
    try {
      const items = await fetchCategoryIndex(meta.id)
      allSummaries.push(...items.map((item) => toSummary(meta.id, item)))
    } catch {
      // skip failed category; offline partial cache still works
    }
  }

  if (allSummaries.length > 0) {
    await db.compendiumSummaries.bulkPut(allSummaries)
    await db.settings.put({ key: INDEX_CACHE_KEY, value: new Date().toISOString() })
  }

  return allSummaries.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchRaceTraits(
  traitRefs: ApiTraitRef[],
): Promise<{ name: string; desc: string[] }[]> {
  const traits = await Promise.all(
    traitRefs.map(async (ref) => {
      try {
        const data = await fetchJson<{ name: string; desc: string[] }>(
          `${API_BASE}/traits/${ref.index}`,
        )
        return { name: data.name, desc: data.desc ?? [] }
      } catch {
        return { name: ref.name, desc: ['Could not load trait details.'] }
      }
    }),
  )
  return traits
}

export async function fetchCompendiumDetail(
  category: CompendiumCategory,
  index: string,
): Promise<CompendiumDetail> {
  const id = compendiumId(category, index)
  const cached = await db.compendiumDetails.get(id)
  if (cached) return cached

  const meta = COMPENDIUM_CATEGORIES.find((c) => c.id === category)
  if (!meta) throw new Error('Unknown compendium category')

  const data = await fetchJson<Record<string, unknown>>(`${API_BASE}/${meta.endpoint}/${index}`)

  let traits: { name: string; desc: string[] }[] = []
  if (category === 'races' && Array.isArray(data.traits)) {
    traits = await fetchRaceTraits(data.traits as ApiTraitRef[])
  }

  const detail = parseCompendiumDetail(category, data, traits)
  await db.compendiumDetails.put(detail)

  const summary = await db.compendiumSummaries.get(id)
  if (!summary) {
    await db.compendiumSummaries.put({
      id,
      category,
      index,
      name: detail.name,
      level: category === 'spells' ? (data.level as number | undefined) : undefined,
      source: SOURCE,
    })
  }

  return detail
}

export async function getCachedSummaries(
  category?: CompendiumCategory,
): Promise<CompendiumSummary[]> {
  if (category) {
    return db.compendiumSummaries.where('category').equals(category).sortBy('name')
  }
  return db.compendiumSummaries.orderBy('name').toArray()
}

export async function searchCompendium(query: string): Promise<CompendiumSummary[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const all = await getCachedSummaries()
  return all.filter((item) => item.name.toLowerCase().includes(q))
}

export function getCategoryMeta(category: CompendiumCategory): CompendiumCategoryMeta {
  return COMPENDIUM_CATEGORIES.find((c) => c.id === category) ?? COMPENDIUM_CATEGORIES[0]
}
