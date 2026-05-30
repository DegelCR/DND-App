const API_BASE = 'https://www.dnd5eapi.co/api/2014'
const cache = new Map<string, unknown>()

async function fetchJson<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  if (cache.has(url)) return cache.get(url) as T
  const res = await fetch(url)
  if (!res.ok) throw new Error(`SRD API error ${res.status}: ${url}`)
  const data = (await res.json()) as T
  cache.set(url, data)
  return data
}

export function stripApiPrefix(name: string) {
  return name.replace(/^Skill:\s*/i, '').replace(/^Saving Throw:\s*/i, '').trim()
}

export function extractSkillsFromProficiencyChoice(choice: {
  from?: { options?: { option_type?: string; item?: { index: string; name: string } }[] }
}) {
  const skills: { index: string; name: string }[] = []
  for (const opt of choice?.from?.options || []) {
    if (opt.option_type === 'reference' && opt.item?.name?.includes('Skill')) {
      skills.push({ index: opt.item.index, name: stripApiPrefix(opt.item.name) })
    }
  }
  return skills
}

export function extractSkillsFromList(proficiencies?: { index: string; name: string }[]) {
  return (proficiencies || [])
    .filter((p) => p.name?.includes('Skill'))
    .map((p) => ({ index: p.index, name: stripApiPrefix(p.name) }))
}

export async function listRaces() {
  const { results } = await fetchJson<{ results: { index: string; name: string }[] }>('/races')
  return results
}

export async function getRace(index: string) {
  return fetchJson<Record<string, unknown>>(`/races/${index}`)
}

export async function getSubrace(index: string) {
  return fetchJson<Record<string, unknown>>(`/subraces/${index}`)
}

export async function listClasses() {
  const { results } = await fetchJson<{ results: { index: string; name: string }[] }>('/classes')
  return results
}

export async function getClass(index: string) {
  return fetchJson<Record<string, unknown>>(`/classes/${index}`)
}

export async function getSubclass(index: string) {
  return fetchJson<Record<string, unknown>>(`/subclasses/${index}`)
}

export async function getBackground(index: string) {
  return fetchJson<Record<string, unknown>>(`/backgrounds/${index}`)
}

export async function getTrait(index: string) {
  return fetchJson<{ name: string; desc?: string[] }>(`/traits/${index}`)
}

export async function getClassSpells(classIndex: string) {
  const data = await fetchJson<{ results: { index: string; name: string; level: number }[] }>(
    `/classes/${classIndex}/spells`,
  )
  return data.results || []
}

export async function getClassLevel(classIndex: string, level: number) {
  return fetchJson<Record<string, unknown>>(`/classes/${classIndex}/levels/${level}`)
}
