import type { GeneratedName, NameCategory } from '@/types/generators'
import { pick } from './random'

const PREFIXES = [
  'Al', 'Bar', 'Cor', 'Dor', 'El', 'Fen', 'Gar', 'Hal', 'Ir', 'Jar',
  'Kal', 'Lor', 'Mor', 'Nor', 'Or', 'Per', 'Quin', 'Ror', 'Sil', 'Tor',
  'Ul', 'Var', 'Wil', 'Xan', 'Yor', 'Zar',
]

const MIDDLES = [
  'a', 'ae', 'an', 'ar', 'el', 'en', 'ia', 'in', 'or', 'us',
  'wen', 'ric', 'lan', 'mir', 'dor', 'thas', 'ven', 'ros',
]

const SUFFIXES = [
  'a', 'an', 'as', 'en', 'er', 'ia', 'in', 'is', 'on', 'or',
  'us', 'iel', 'wyn', 'ard', 'eth', 'ion', 'ius', 'os',
]

const PLACE_PREFIX = [
  'Black', 'Silver', 'Stone', 'Mist', 'Iron', 'Golden', 'Shadow', 'Green',
  'Red', 'White', 'Old', 'North', 'South', 'East', 'West', 'Deep',
]

const PLACE_CORE = [
  'haven', 'ford', 'bridge', 'wood', 'hill', 'vale', 'marsh', 'peak',
  'gate', 'watch', 'rest', 'cross', 'moor', 'dale', 'reach', 'fall',
]

const TAVERN_ADJ = [
  'Prancing', 'Drunken', 'Gilded', 'Rusty', 'Lucky', 'Weary', 'Howling',
  'Sleepy', 'Wandering', 'Broken', 'Silver', 'Copper', 'Golden', 'Hidden',
]

const TAVERN_NOUN = [
  'Pony', 'Dragon', 'Goblin', 'Stag', 'Mug', 'Anchor', 'Crown', 'Shield',
  'Wolf', 'Owl', 'Tankard', 'Flagon', 'Hammer', 'Rose', 'Star', 'Giant',
]

function fantasySyllableName(): string {
  const parts = [pick(PREFIXES), pick(MIDDLES), pick(SUFFIXES)]
  const raw = parts.join('')
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

function placeName(): string {
  return `${pick(PLACE_PREFIX)}${pick(PLACE_CORE)}`
}

function tavernName(): string {
  return `The ${pick(TAVERN_ADJ)} ${pick(TAVERN_NOUN)}`
}

export function generateName(category: NameCategory): GeneratedName {
  switch (category) {
    case 'place':
      return { category, name: placeName() }
    case 'tavern':
      return { category, name: tavernName() }
    case 'npc':
    case 'character':
    default:
      return { category, name: fantasySyllableName() }
  }
}

export function generateNames(category: NameCategory, count: number): GeneratedName[] {
  return Array.from({ length: count }, () => generateName(category))
}

export const NAME_CATEGORY_LABELS: Record<NameCategory, string> = {
  character: 'Character',
  npc: 'NPC',
  place: 'Place',
  tavern: 'Tavern',
}
