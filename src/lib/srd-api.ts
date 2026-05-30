import { db } from '@/db'
import type {
  ContentSource,
  MonsterDetail,
  MonsterListItem,
  MonsterSummary,
} from '@/types/monster'

const API_BASE = 'https://www.dnd5eapi.co/api'
const SOURCE: ContentSource = 'srd'
const INDEX_CACHE_KEY = 'monster_index_cached_at'
const INDEX_TTL_MS = 7 * 24 * 60 * 60 * 1000
const SYNC_BATCH_SIZE = 8

interface ApiListResponse {
  count: number
  results: MonsterListItem[]
}

interface ApiArmorClass {
  value: number
}

interface ApiProficiency {
  proficiency: { name: string }
}

interface ApiTrait {
  name: string
  desc: string
}

interface ApiMonster {
  index: string
  name: string
  size: string
  type: string
  alignment: string
  armor_class: ApiArmorClass[]
  hit_points: number
  hit_dice: string
  speed: Record<string, string>
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  proficiencies?: ApiProficiency[]
  senses?: { passive_perception?: number; darkvision?: string; blindsight?: string; tremorsense?: string; truesight?: string }
  languages?: string
  challenge_rating: number
  xp: number
  special_abilities?: ApiTrait[]
  actions?: ApiTrait[]
  legendary_actions?: ApiTrait[]
}

function formatSpeed(speed: Record<string, string>): string {
  return Object.entries(speed)
    .map(([mode, value]) => (mode === 'walk' ? value : `${mode} ${value}`))
    .join(', ')
}

function formatSenses(senses?: ApiMonster['senses']): string {
  if (!senses) return '—'
  const parts: string[] = []
  if (senses.darkvision) parts.push(`darkvision ${senses.darkvision}`)
  if (senses.blindsight) parts.push(`blindsight ${senses.blindsight}`)
  if (senses.tremorsense) parts.push(`tremorsense ${senses.tremorsense}`)
  if (senses.truesight) parts.push(`truesight ${senses.truesight}`)
  if (senses.passive_perception != null) {
    parts.push(`passive Perception ${senses.passive_perception}`)
  }
  return parts.length > 0 ? parts.join(', ') : '—'
}

function parseMonster(data: ApiMonster): MonsterDetail {
  return {
    index: data.index,
    name: data.name,
    size: data.size,
    type: data.type,
    alignment: data.alignment,
    challengeRating: data.challenge_rating,
    armorClass: data.armor_class[0]?.value ?? 10,
    hitPoints: data.hit_points,
    hitDice: data.hit_dice,
    speed: formatSpeed(data.speed),
    strength: data.strength,
    dexterity: data.dexterity,
    constitution: data.constitution,
    intelligence: data.intelligence,
    wisdom: data.wisdom,
    charisma: data.charisma,
    proficiencies:
      data.proficiencies?.map((p) => p.proficiency.name.replace('Skill: ', '')) ?? [],
    senses: formatSenses(data.senses),
    languages: data.languages || '—',
    xp: data.xp,
    specialAbilities: data.special_abilities ?? [],
    actions: data.actions ?? [],
    legendaryActions: data.legendary_actions ?? [],
    cachedAt: new Date(),
    source: SOURCE,
  }
}

function toSummary(detail: MonsterDetail): MonsterSummary {
  return {
    index: detail.index,
    name: detail.name,
    challengeRating: detail.challengeRating,
    type: detail.type,
    size: detail.size,
    source: detail.source,
  }
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

export async function fetchMonsterIndex(): Promise<MonsterListItem[]> {
  const fresh = await isIndexCacheFresh()
  const cached = await db.monsterSummaries.count()
  if (fresh && cached > 0) {
    const summaries = await db.monsterSummaries.toArray()
    return summaries
      .map((s) => ({ index: s.index, name: s.name, url: `${API_BASE}/monsters/${s.index}` }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const data = await fetchJson<ApiListResponse>(`${API_BASE}/monsters`)
  await db.settings.put({ key: INDEX_CACHE_KEY, value: new Date().toISOString() })
  return data.results.sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchMonsterDetail(index: string): Promise<MonsterDetail> {
  const cached = await db.monsterDetails.get(index)
  if (cached) return cached

  const data = await fetchJson<ApiMonster>(`${API_BASE}/monsters/${index}`)
  const detail = parseMonster(data)
  const summary = toSummary(detail)

  await db.monsterDetails.put(detail)
  await db.monsterSummaries.put(summary)

  return detail
}

export async function getCachedSummaries(): Promise<MonsterSummary[]> {
  return db.monsterSummaries.orderBy('name').toArray()
}

export async function syncMonsterSummaries(
  items: MonsterListItem[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const existing = new Set((await db.monsterSummaries.toArray()).map((s) => s.index))
  const pending = items.filter((item) => !existing.has(item.index))
  const total = items.length
  let done = existing.size

  onProgress?.(done, total)
  if (pending.length === 0) return

  for (let i = 0; i < pending.length; i += SYNC_BATCH_SIZE) {
    const batch = pending.slice(i, i + SYNC_BATCH_SIZE)
    await Promise.all(
      batch.map(async (item) => {
        try {
          await fetchMonsterDetail(item.index)
        } catch {
          // skip failed fetches; list still works by name
        }
      }),
    )
    done = Math.min(done + batch.length, total)
    onProgress?.(done, total)
  }
}

export function isUsingCache(count: number): boolean {
  return count > 0
}
