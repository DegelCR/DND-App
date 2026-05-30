import type {
  CompendiumCategory,
  CompendiumDetail,
  CompendiumSection,
} from '@/types/compendium'
import { compendiumId } from '@/types/compendium'
import type { ContentSource } from '@/types/monster'

const SOURCE: ContentSource = 'srd'

function section(title: string, lines: string[]): CompendiumSection | null {
  const filtered = lines.filter(Boolean)
  if (filtered.length === 0) return null
  return { title, lines: filtered }
}

function asLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return [value]
  return []
}

function refNames(items?: { name: string }[]): string[] {
  return items?.map((i) => i.name) ?? []
}

function parseSpell(data: Record<string, unknown>): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const level = data.level as number
  const school = (data.school as { name?: string })?.name ?? 'Unknown'
  const sections: CompendiumSection[] = []

  const stats = section('Casting', [
    `Level ${level}${level === 0 ? ' (cantrip)' : ''} · ${school}`,
    `Casting time: ${data.casting_time ?? '—'}`,
    `Range: ${data.range ?? '—'}`,
    `Components: ${Array.isArray(data.components) ? (data.components as string[]).join(', ') : '—'}`,
    data.material ? `Material: ${data.material}` : '',
    `Duration: ${data.duration ?? '—'}${data.concentration ? ' (concentration)' : ''}${data.ritual ? ' · ritual' : ''}`,
  ])

  const desc = section('Description', asLines(data.desc))
  const higher = section('At higher levels', asLines(data.higher_level))
  const classes = section('Classes', refNames(data.classes as { name: string }[]))

  if (stats) sections.push(stats)
  if (desc) sections.push(desc)
  if (higher) sections.push(higher)
  if (classes) sections.push(classes)

  return {
    category: 'spells',
    index: String(data.index),
    name: String(data.name),
    subtitle: `Level ${level} ${school}`.trim(),
    sections,
  }
}

function parseClass(data: Record<string, unknown>): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const sections: CompendiumSection[] = []

  const overview = section('Overview', [
    `Hit die: d${data.hit_die ?? '?'}`,
    `Saving throws: ${refNames(data.saving_throws as { name: string }[]).join(', ') || '—'}`,
  ])

  const profChoices = (data.proficiency_choices as { desc?: string }[] | undefined)
    ?.map((c) => c.desc)
    .filter(Boolean) as string[] | undefined

  const profs = section('Proficiencies', [
    `Armor: ${refNames(data.proficiencies as { name: string }[]).join(', ') || '—'}`,
    ...(profChoices ?? []),
  ])

  const subclasses = section(
    'Subclasses',
    refNames(data.subclasses as { name: string }[]),
  )

  if (overview) sections.push(overview)
  if (profs) sections.push(profs)
  if (subclasses) sections.push(subclasses)

  return {
    category: 'classes',
    index: String(data.index),
    name: String(data.name),
    subtitle: `Hit die d${data.hit_die ?? '?'}`,
    sections,
  }
}

function parseRace(
  data: Record<string, unknown>,
  traits: { name: string; desc: string[] }[] = [],
): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const sections: CompendiumSection[] = []

  const bonuses = (data.ability_bonuses as { ability_score?: { name: string }; bonus?: number }[] | undefined)
    ?.map((b) => `${b.ability_score?.name ?? '?'} +${b.bonus ?? 0}`)
    .join(', ')

  const overview = section('Overview', [
    `Speed: ${data.speed ?? '—'} ft.`,
    `Size: ${data.size ?? '—'}`,
    bonuses ? `Ability bonuses: ${bonuses}` : '',
    `Languages: ${refNames(data.languages as { name: string }[]).join(', ') || '—'}`,
  ])

  const age = section('Age', asLines(data.age))
  const alignment = section('Alignment', asLines(data.alignment))
  const sizeDesc = section('Size', asLines(data.size_description))

  const traitLines = traits.flatMap((t) => [
    `**${t.name}**`,
    ...t.desc.map((d) => `  ${d}`),
  ])
  const traitSection = section('Traits', traitLines)

  if (overview) sections.push(overview)
  if (age) sections.push(age)
  if (alignment) sections.push(alignment)
  if (sizeDesc) sections.push(sizeDesc)
  if (traitSection) sections.push(traitSection)

  return {
    category: 'races',
    index: String(data.index),
    name: String(data.name),
    subtitle: `${data.size ?? ''} · ${data.speed ?? '?'} ft.`.trim(),
    sections,
  }
}

function parseCondition(data: Record<string, unknown>): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const desc = section('Effects', asLines(data.desc))
  return {
    category: 'conditions',
    index: String(data.index),
    name: String(data.name),
    subtitle: 'Condition',
    sections: desc ? [desc] : [],
  }
}

function parseEquipment(data: Record<string, unknown>): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const category = (data.equipment_category as { name?: string })?.name ?? 'Equipment'
  const cost = data.cost as { quantity?: number; unit?: string } | undefined
  const costLine = cost ? `Cost: ${cost.quantity ?? 0} ${cost.unit ?? 'cp'}` : ''

  const stats = section('Stats', [
    costLine,
    data.weight != null ? `Weight: ${data.weight} lb.` : '',
    data.armor_class ? `AC: ${JSON.stringify(data.armor_class)}` : '',
    data.damage ? `Damage: ${JSON.stringify(data.damage)}` : '',
    data.range ? `Range: ${JSON.stringify(data.range)}` : '',
  ])

  const desc = section('Description', asLines(data.desc))
  const sections = [stats, desc].filter(Boolean) as CompendiumSection[]

  return {
    category: 'equipment',
    index: String(data.index),
    name: String(data.name),
    subtitle: category,
    sections,
  }
}

function parseRule(data: Record<string, unknown>): Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'> {
  const desc = section('Rule', asLines(data.desc))
  return {
    category: 'rules',
    index: String(data.index),
    name: String(data.name),
    subtitle: 'SRD rule',
    sections: desc ? [desc] : [],
  }
}

export function parseCompendiumDetail(
  category: CompendiumCategory,
  data: Record<string, unknown>,
  traits: { name: string; desc: string[] }[] = [],
): CompendiumDetail {
  const index = String(data.index)
  let parsed: Omit<CompendiumDetail, 'id' | 'cachedAt' | 'source'>

  switch (category) {
    case 'spells':
      parsed = parseSpell(data)
      break
    case 'classes':
      parsed = parseClass(data)
      break
    case 'races':
      parsed = parseRace(data, traits)
      break
    case 'conditions':
      parsed = parseCondition(data)
      break
    case 'equipment':
      parsed = parseEquipment(data)
      break
    case 'rules':
      parsed = parseRule(data)
      break
  }

  return {
    ...parsed,
    id: compendiumId(category, index),
    cachedAt: new Date(),
    source: SOURCE,
  }
}

export function spellLevelLabel(level: number | undefined): string {
  if (level == null) return ''
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}
