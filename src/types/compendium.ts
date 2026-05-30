import type { ContentSource } from '@/types/monster'

export type CompendiumCategory =
  | 'spells'
  | 'classes'
  | 'races'
  | 'conditions'
  | 'equipment'
  | 'rules'

export interface CompendiumCategoryMeta {
  id: CompendiumCategory
  label: string
  endpoint: string
  icon: string
}

export interface CompendiumListItem {
  index: string
  name: string
  url: string
  level?: number
}

export interface CompendiumSummary {
  id: string
  category: CompendiumCategory
  index: string
  name: string
  level?: number
  source: ContentSource
}

export interface CompendiumSection {
  title: string
  lines: string[]
}

export interface CompendiumDetail {
  id: string
  category: CompendiumCategory
  index: string
  name: string
  subtitle: string
  sections: CompendiumSection[]
  cachedAt: Date
  source: ContentSource
}

export function compendiumId(category: CompendiumCategory, index: string): string {
  return `${category}:${index}`
}

export function parseCompendiumId(id: string): { category: CompendiumCategory; index: string } {
  const [category, ...rest] = id.split(':')
  return { category: category as CompendiumCategory, index: rest.join(':') }
}
